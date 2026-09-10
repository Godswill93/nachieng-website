// Standalone test harness for the Vercel serverless enquiry function.
// Kept OUTSIDE frontend/api so Vercel never treats it as a deployable function.
// Mocks global.fetch — never contacts the real Resend API.
const path = require("path");
const handler = require(path.join(__dirname, "..", "frontend", "api", "enquiry.js"));

let passed = 0, failed = 0;
const results = [];
function check(name, cond) {
  if (cond) { passed++; results.push(`PASS  ${name}`); }
  else { failed++; results.push(`FAIL  ${name}`); }
}

function makeRes() {
  const res = { _status: null, _json: null, _headers: {} };
  res.setHeader = (k, v) => { res._headers[k] = v; };
  res.status = (c) => { res._status = c; return res; };
  res.json = (o) => { res._json = o; return res; };
  return res;
}

function makeReq(overrides = {}) {
  return {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: {},
    ...overrides,
  };
}

const goodEnv = {
  RESEND_API_KEY: "test_key",
  EMAIL_FROM: "onboarding@resend.dev",
  EMAIL_FROM_NAME: "Nachi Eng Ltd",
  ENQUIRY_LIVE: "false",
  ENQUIRY_TEST_DESTINATION: "delivered@resend.dev",
  ENQUIRY_DESTINATION: "info@nachieng.co.uk",
};
function setEnv(env) {
  for (const k of Object.keys(goodEnv)) delete process.env[k];
  delete process.env.EMAIL_REPLY_TO;
  Object.assign(process.env, env);
}
const validBody = {
  name: "Jane Engineer",
  email: "jane@example.com",
  message: "We need a preventive maintenance schedule for two production lines.",
  elapsed_ms: 5000,
};

let lastFetch = null;
function mockFetch(response) {
  global.fetch = async (url, opts) => { lastFetch = { url, opts }; return response; };
}

(async () => {
  // 1. Non-POST
  setEnv(goodEnv); mockFetch({ ok: true, status: 200 });
  let res = makeRes();
  await handler(makeReq({ method: "GET" }), res);
  check("GET -> 405", res._status === 405);

  // 2. Wrong content-type
  res = makeRes();
  await handler(makeReq({ headers: { "content-type": "text/plain" } }), res);
  check("non-JSON content-type -> 415", res._status === 415);

  // 3. Honeypot filled -> 200 ok, no send
  lastFetch = null; res = makeRes();
  await handler(makeReq({ body: { ...validBody, company_website: "spam" } }), res);
  check("honeypot -> 200 ok", res._status === 200 && res._json.status === "ok");
  check("honeypot -> no fetch/send", lastFetch === null);

  // 4. Too-fast submit
  lastFetch = null; res = makeRes();
  await handler(makeReq({ body: { ...validBody, elapsed_ms: 500 } }), res);
  check("too-fast -> 200 ok", res._status === 200 && res._json.status === "ok");
  check("too-fast -> no fetch/send", lastFetch === null);

  // 5. Missing required (no name)
  res = makeRes();
  await handler(makeReq({ body: { ...validBody, name: "" } }), res);
  check("missing name -> 422", res._status === 422);

  // 6. Short message
  res = makeRes();
  await handler(makeReq({ body: { ...validBody, message: "too short" } }), res);
  check("short message -> 422", res._status === 422);

  // 7. Invalid email
  res = makeRes();
  await handler(makeReq({ body: { ...validBody, email: "not-an-email" } }), res);
  check("invalid email -> 422", res._status === 422);

  // 8. Field too long
  res = makeRes();
  await handler(makeReq({ body: { ...validBody, name: "x".repeat(101) } }), res);
  check("over-length name -> 422", res._status === 422);

  // 9. Header injection / control chars
  res = makeRes();
  await handler(makeReq({ body: { ...validBody, name: "Jane\r\nBcc: x@y.com" } }), res);
  check("control chars in name -> 422", res._status === 422);

  // 10. Missing config (no RESEND_API_KEY)
  setEnv({ ...goodEnv, RESEND_API_KEY: undefined }); delete process.env.RESEND_API_KEY;
  res = makeRes();
  await handler(makeReq({ body: { ...validBody } }), res);
  check("missing RESEND_API_KEY -> 500", res._status === 500);

  // 11. Valid send (ENQUIRY_LIVE=false -> test destination)
  setEnv(goodEnv); mockFetch({ ok: true, status: 200 }); lastFetch = null;
  res = makeRes();
  await handler(makeReq({ body: { ...validBody } }), res);
  check("valid enquiry -> 200 ok", res._status === 200 && res._json.status === "ok");
  check("valid enquiry -> fetch called", lastFetch !== null && lastFetch.url === "https://api.resend.com/emails");
  const sent = lastFetch ? JSON.parse(lastFetch.opts.body) : {};
  check("routes to TEST destination when not live", Array.isArray(sent.to) && sent.to[0] === "delivered@resend.dev");
  check("does NOT route to live destination when not live", sent.to && sent.to[0] !== "info@nachieng.co.uk");
  check("reply_to is enquirer email", sent.reply_to === "jane@example.com");
  check("Authorization bearer header set", lastFetch.opts.headers.Authorization === "Bearer test_key");

  // 12. Live routing check
  setEnv({ ...goodEnv, ENQUIRY_LIVE: "true" }); mockFetch({ ok: true, status: 200 }); lastFetch = null;
  res = makeRes();
  await handler(makeReq({ body: { ...validBody } }), res);
  const liveSent = JSON.parse(lastFetch.opts.body);
  check("routes to LIVE destination when live", liveSent.to[0] === "info@nachieng.co.uk");

  // 13. Resend 429 -> 503
  setEnv(goodEnv); mockFetch({ ok: false, status: 429 });
  res = makeRes();
  await handler(makeReq({ body: { ...validBody } }), res);
  check("provider 429 -> 503", res._status === 503);

  // 14. Resend non-ok -> 502
  mockFetch({ ok: false, status: 400 });
  res = makeRes();
  await handler(makeReq({ body: { ...validBody } }), res);
  check("provider error -> 502", res._status === 502);

  // 15. Network throw -> 502
  global.fetch = async () => { throw new Error("network"); };
  res = makeRes();
  await handler(makeReq({ body: { ...validBody } }), res);
  check("network failure -> 502", res._status === 502);

  console.log(results.join("\n"));
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
})();
