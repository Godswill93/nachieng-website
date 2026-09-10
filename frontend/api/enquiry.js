// Vercel Node.js Serverless Function — same-origin enquiry endpoint (POST /api/enquiry).
// No database. Resend is called server-side only. Enquiry content is never logged.
// Rate limiting is intentionally omitted here: reliable rate limiting is not possible with
// serverless in-memory state, so protection is best-effort via honeypot + timing checks.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const LIMITS = { name: 100, email: 254, organisation: 150, phone: 40, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 100 * 1024; // 100 KB

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// Reject header/HTML-injection attempts in single-line fields.
function hasControlChars(s) {
    return /[\r\n\t\0]/.test(s);
}

async function readJsonBody(req) {
    if (req.body && typeof req.body === "object") return req.body;
    if (typeof req.body === "string" && req.body.length) {
        if (req.body.length > MAX_BODY_BYTES) throw new Error("payload_too_large");
        return JSON.parse(req.body);
    }
    return await new Promise((resolve, reject) => {
        let data = "";
        let size = 0;
        req.on("data", (chunk) => {
            size += chunk.length;
            if (size > MAX_BODY_BYTES) {
                reject(new Error("payload_too_large"));
                req.destroy();
                return;
            }
            data += chunk;
        });
        req.on("end", () => {
            if (!data) return resolve({});
            try {
                resolve(JSON.parse(data));
            } catch (e) {
                reject(new Error("invalid_json"));
            }
        });
        req.on("error", () => reject(new Error("stream_error")));
    });
}

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Method not allowed." });
    }
    const ctype = (req.headers["content-type"] || "").toLowerCase();
    if (!ctype.includes("application/json")) {
        return res.status(415).json({ error: "Unsupported media type." });
    }

    let body;
    try {
        body = await readJsonBody(req);
    } catch (e) {
        const code = e.message === "payload_too_large" ? 413 : 400;
        return res.status(code).json({ error: "Invalid request." });
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return res.status(400).json({ error: "Invalid request." });
    }

    const str = (v) => (typeof v === "string" ? v : "");
    const name = str(body.name).trim();
    const email = str(body.email).trim();
    const message = str(body.message).trim();
    const organisation = str(body.organisation).trim();
    const phone = str(body.phone).trim();
    const honeypot = str(body.company_website).trim();
    const elapsedMs = Number(body.elapsed_ms) || 0;

    // Spam: honeypot filled -> pretend success, drop silently (no send).
    if (honeypot) return res.status(200).json({ status: "ok" });
    // Spam: submitted implausibly fast -> silent drop (no send).
    if (elapsedMs && elapsedMs < 1500) return res.status(200).json({ status: "ok" });

    // Field-length limits.
    if (
        name.length > LIMITS.name ||
        email.length > LIMITS.email ||
        organisation.length > LIMITS.organisation ||
        phone.length > LIMITS.phone ||
        message.length > LIMITS.message
    ) {
        return res.status(422).json({ error: "One or more fields are too long." });
    }

    // Required fields, email format, and header-injection protection on single-line fields.
    if (
        !name ||
        !email ||
        !EMAIL_RE.test(email) ||
        message.length < 20 ||
        hasControlChars(name) ||
        hasControlChars(email) ||
        hasControlChars(organisation) ||
        hasControlChars(phone)
    ) {
        return res.status(422).json({ error: "Please provide your name, a valid email address and a short message." });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const EMAIL_FROM = process.env.EMAIL_FROM;
    const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || "Nachi Eng Ltd";
    const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO; // optional fallback reply-to
    const ENQUIRY_LIVE = String(process.env.ENQUIRY_LIVE || "false").toLowerCase() === "true";
    const ENQUIRY_DESTINATION = process.env.ENQUIRY_DESTINATION;
    const ENQUIRY_TEST_DESTINATION = process.env.ENQUIRY_TEST_DESTINATION || "delivered@resend.dev";
    const recipient = ENQUIRY_LIVE ? ENQUIRY_DESTINATION : ENQUIRY_TEST_DESTINATION;

    if (!RESEND_API_KEY || !EMAIL_FROM || !recipient) {
        // Misconfiguration — generic message, never leak which variable is missing.
        return res.status(500).json({ error: "The enquiry service is temporarily unavailable. Please email us directly." });
    }

    const subject = `Website enquiry — ${name}`.replace(/[\r\n]/g, " ");
    const fromHeader = `${EMAIL_FROM_NAME} <${EMAIL_FROM}>`;

    const textLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        organisation ? `Organisation: ${organisation}` : null,
        phone ? `Phone: ${phone}` : null,
        "",
        "Enquiry:",
        message,
        "",
        "— Sent from the Nachi Eng Ltd website enquiry form.",
    ].filter((l) => l !== null);
    const text = textLines.join("\n");

    const safeMsg = escapeHtml(message).replace(/\n/g, "<br>");
    const html =
        '<table role="presentation" width="100%" style="font-family:Arial,sans-serif;color:#101216">' +
        '<tr><td style="padding:24px">' +
        '<h2 style="margin:0 0 16px;font-size:18px">New website enquiry</h2>' +
        `<p style="margin:0 0 6px"><strong>Name:</strong> ${escapeHtml(name)}</p>` +
        `<p style="margin:0 0 6px"><strong>Email:</strong> ${escapeHtml(email)}</p>` +
        (organisation ? `<p style="margin:0 0 6px"><strong>Organisation:</strong> ${escapeHtml(organisation)}</p>` : "") +
        (phone ? `<p style="margin:0 0 6px"><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : "") +
        '<p style="margin:16px 0 6px"><strong>Enquiry:</strong></p>' +
        `<p style="margin:0 0 16px;line-height:1.6">${safeMsg}</p>` +
        '<p style="font-size:12px;color:#888;border-top:1px solid #eee;padding-top:12px">Sent from the Nachi Eng Ltd website enquiry form.</p>' +
        "</td></tr></table>";

    const payload = {
        from: fromHeader,
        to: [recipient],
        reply_to: EMAIL_REPLY_TO ? [email, EMAIL_REPLY_TO] : email, // validated enquirer email
        subject,
        text,
        html,
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
        const r = await fetch(RESEND_ENDPOINT, {
            method: "POST",
            headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: controller.signal,
        });
        if (r.status === 429) {
            return res.status(503).json({ error: "The enquiry service is busy. Please try again shortly, or email us directly." });
        }
        if (!r.ok) {
            // Log status only — never the request/response body or personal data.
            console.error(`enquiry: email provider responded ${r.status}`);
            return res.status(502).json({ error: "We couldn't send your enquiry just now. Please try again, or email us directly." });
        }
        return res.status(200).json({ status: "ok" });
    } catch (e) {
        console.error("enquiry: send failed (network/timeout)");
        return res.status(502).json({ error: "We couldn't send your enquiry just now. Please try again, or email us directly." });
    } finally {
        clearTimeout(timer);
    }
};
