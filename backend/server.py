from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import time
import ipaddress
import logging
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# ---------------------------------------------------------------------------
# Enquiry pipeline (Resend via Emergent managed email)
# ---------------------------------------------------------------------------
EMAIL_BASE_URL = "https://integrations.emergentagent.com"  # constant — survives deployment
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
ENQUIRY_DESTINATION = os.environ["ENQUIRY_DESTINATION"]
ENQUIRY_TEST_DESTINATION = os.environ["ENQUIRY_TEST_DESTINATION"]
ENQUIRY_LIVE = os.environ.get("ENQUIRY_LIVE", "false").strip().lower() == "true"
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")

_EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        if e.response.status_code == 429:
            raise HTTPException(status_code=503, detail="Email service is busy. Please try again shortly.")
        raise HTTPException(status_code=502, detail="Failed to send email")
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")


class EnquiryIn(BaseModel):
    name: str = ""
    email: str = ""
    message: str = ""
    organisation: str = ""
    phone: str = ""
    company_website: str = ""  # honeypot — must stay empty
    elapsed_ms: int = 0


_enquiry_hits: dict = {}


@api_router.post("/enquiry")
async def submit_enquiry(payload: EnquiryIn, request: Request):
    # Spam: honeypot filled -> pretend success, drop silently
    if payload.company_website.strip():
        return {"status": "ok"}
    # Spam: submitted implausibly fast
    if payload.elapsed_ms and payload.elapsed_ms < 1500:
        return {"status": "ok"}

    # Per-IP rate limit (max 5 / hour). Behind the ingress, the real client IP is
    # the leftmost X-Forwarded-For entry; fall back to the socket peer.
    xff = request.headers.get("x-forwarded-for")
    ip = xff.split(",")[0].strip() if xff else (request.client.host if request.client else "unknown")
    now = time.time()
    hits = [t for t in _enquiry_hits.get(ip, []) if now - t < 3600]
    if len(hits) >= 5:
        raise HTTPException(status_code=429, detail="Too many enquiries from this connection. Please email us directly.")

    name = payload.name.strip()
    email = payload.email.strip()
    message = payload.message.strip()
    org = payload.organisation.strip()
    phone = payload.phone.strip()

    if not name or not _EMAIL_RE.match(email) or len(message) < 20:
        raise HTTPException(status_code=422, detail="Please provide your name, a valid email address and a short description.")

    hits.append(now)
    _enquiry_hits[ip] = hits

    recipient = ENQUIRY_DESTINATION if ENQUIRY_LIVE else ENQUIRY_TEST_DESTINATION
    subject = f"Website enquiry — {name}"
    safe_msg = escape(message).replace("\n", "<br>")
    html = (
        '<table role="presentation" width="100%" style="font-family:Arial,sans-serif;color:#101216">'
        '<tr><td style="padding:24px">'
        '<h2 style="margin:0 0 16px;font-size:18px">New website enquiry</h2>'
        f'<p style="margin:0 0 6px"><strong>Name:</strong> {escape(name)}</p>'
        f'<p style="margin:0 0 6px"><strong>Email:</strong> {escape(email)}</p>'
        + (f'<p style="margin:0 0 6px"><strong>Organisation:</strong> {escape(org)}</p>' if org else '')
        + (f'<p style="margin:0 0 6px"><strong>Phone:</strong> {escape(phone)}</p>' if phone else '')
        + '<p style="margin:16px 0 6px"><strong>Enquiry:</strong></p>'
        f'<p style="margin:0 0 16px;line-height:1.6">{safe_msg}</p>'
        '<p style="font-size:12px;color:#888;border-top:1px solid #eee;padding-top:12px">'
        f'Sent from the Nachi Eng Ltd website enquiry form. Reply directly to the enquirer at {escape(email)}. '
        'We never ask for passwords or payment details by email.</p>'
        '</td></tr></table>'
    )

    try:
        await send_email(to=recipient, subject=subject, html=html)
    except ValueError:
        # Guardrail gate rejected the generated content (e.g. message tripped a filter)
        raise HTTPException(status_code=422, detail="Your enquiry could not be processed. Please email us directly.")

    return {"status": "ok"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()