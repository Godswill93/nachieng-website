"""Backend tests for /api/enquiry endpoint."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://jovial-goodall-9.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api/enquiry"

VALID_MSG = "This is a valid enquiry message that is definitely long enough for validation."


def _payload(**over):
    base = {
        "name": "TEST_Alice",
        "email": "test@example.com",
        "message": VALID_MSG,
        "organisation": "TEST Org",
        "phone": "+441234567890",
        "company_website": "",
        "elapsed_ms": 5000,
    }
    base.update(over)
    return base


# Honeypot silent drop
def test_honeypot_returns_ok_silently():
    r = requests.post(API, json=_payload(company_website="http://spammer.example"))
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


# Too-fast submit silent drop
def test_too_fast_submit_returns_ok_silently():
    r = requests.post(API, json=_payload(elapsed_ms=500))
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


# Validation errors — invalid email
def test_invalid_email_returns_422():
    r = requests.post(API, json=_payload(email="not-an-email"))
    assert r.status_code == 422


# Validation errors — short message
def test_short_message_returns_422():
    r = requests.post(API, json=_payload(message="too short"))
    assert r.status_code == 422


# Validation errors — empty name
def test_empty_name_returns_422():
    r = requests.post(API, json=_payload(name=""))
    assert r.status_code == 422


# Happy path + rate limit — do valid submissions and probe for 429
def test_valid_submit_and_rate_limit():
    saw_200 = 0
    saw_429 = False
    for i in range(8):
        r = requests.post(API, json=_payload(email=f"test{i}@example.com"))
        if r.status_code == 200:
            saw_200 += 1
        elif r.status_code == 429:
            saw_429 = True
            break
        else:
            pytest.fail(f"Unexpected status {r.status_code}: {r.text}")
    # We should have observed a 429 within 8 attempts (limit is 5/hour/IP)
    assert saw_429, f"Expected 429 rate limit; got {saw_200} successes without limit"
