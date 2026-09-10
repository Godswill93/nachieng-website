# NACHI ENG LTD — Deployment / Migration Checklist (PREPARATION ONLY)

Status: DRAFT — for owner review. **Do not deploy, publish, connect the production domain, or change DNS** until the owner authorises. This document is a plan only; no action has been taken.

Preview environment (source of truth for content): the Emergent preview URL in `frontend/.env` (`REACT_APP_BACKEND_URL`).
Production domain (NOT to be touched yet): `https://nachieng.co.uk`.

---

## 0. Pre-flight (must be true before any deploy)
- [ ] Owner has approved final copy, logo, and legal wording (Privacy + Cookie currently DRAFT).
- [ ] Owner has completed a real enquiry delivery test to `info@nachieng.co.uk` and authorised go-live.
- [ ] WCAG 2.2 AA audit clean (done on preview — axe-core 4.10.2, 0 violations across 11 routes).
- [ ] Zero fabricated claims / no Taiko references confirmed (done on preview).

## 1. Enquiry form configuration (backend/.env)
- [ ] Set `ENQUIRY_LIVE=true` ONLY after owner authorises (currently `false` → routes to `delivered@resend.dev`).
- [ ] Confirm `ENQUIRY_DESTINATION=info@nachieng.co.uk`.
- [ ] Confirm `EMERGENT_EMAIL_KEY` present and valid; verify sending domain in Resend is verified for production.
- [ ] Re-test: submit one real enquiry, confirm receipt in `info@nachieng.co.uk`, confirm on-screen success state, confirm NO auto-reply is sent, confirm no database write (in-memory rate-limit only).
- [ ] Confirm honeypot + min-fill-time + per-IP rate-limit (via X-Forwarded-For) still active behind production ingress.

## 2. Redirects (301) — legacy → new
Map any legacy URLs from the previous site to the new routes (confirm exact old paths before publishing):
- [ ] `/blog.html` → `/insights`
- [ ] `/what-is-a-cmms.html` → `/insights/what-is-a-cmms`
- [ ] `/reactive-vs-preventive-maintenance.html` → `/insights/reactive-vs-preventive-maintenance`
- [ ] Any old `/index.html`, `/about.html`, `/services.html`, `/contact.html` → `/`, `/about`, `/services`, `/contact`
- [ ] All 301 (permanent). Verify no redirect chains/loops. Preserve query strings where relevant.
- [ ] SPA routing: ensure host serves `index.html` for all unknown client routes (history API fallback) so deep links (e.g. `/insights/what-is-a-cmms`) resolve.

## 3. robots.txt
- [ ] Allow crawling of public routes.
- [ ] Disallow the internal brand route: `Disallow: /brand-preview` (route is already `noindex`, unlinked — consider removing entirely at launch).
- [ ] Reference the sitemap: `Sitemap: https://nachieng.co.uk/sitemap.xml`.
- [ ] Confirm the demo routes (`/tmms/demos/*`) are `noindex` (already set in-page) and decide whether to also disallow in robots.

## 4. sitemap.xml
- [ ] Include public routes: `/`, `/services`, `/tmms`, `/demonstrations`, `/about`, `/insights`, `/insights/what-is-a-cmms`, `/insights/reactive-vs-preventive-maintenance`, `/contact`, `/privacy`, `/cookies`.
- [ ] EXCLUDE: `/brand-preview`, `/tmms/demos/*` (noindex).
- [ ] Use absolute `https://nachieng.co.uk/...` URLs. Set `lastmod`. Submit in Google Search Console after go-live.

## 5. Canonical URLs
- [ ] Each page already emits `<link rel="canonical">` via the Seo component using `canonicalOrigin = https://nachieng.co.uk`.
- [ ] After domain connect, confirm canonicals resolve (no trailing-slash mismatch, no duplicate http/https or www/non-www — pick one host and 301 the other).

## 6. Open Graph / social previews
- [ ] Article OG images point to `https://nachieng.co.uk/brand/og-what-is-a-cmms.jpg` and `.../og-reactive-vs-preventive.jpg` — these only resolve once the domain is live.
- [ ] After go-live, re-scrape both article URLs in the LinkedIn Post Inspector and (optional) Facebook Sharing Debugger to refresh caches and confirm image + title + description render.
- [ ] Confirm `og:type`, `og:title`, `og:description`, `og:url`, `twitter:card=summary_large_image` present on articles.
- [ ] Consider adding a default site-wide OG image for non-article pages (optional, owner decision).

## 7. Favicon / icons
- [ ] `/brand/favicon.svg`, `/brand/favicon-32.png`, `/brand/apple-touch-icon.png` linked in `index.html` — verify they return 200 on the production host.
- [ ] Add `/favicon.ico` fallback for legacy crawlers if desired.
- [ ] Confirm `theme-color` meta (`#101216`) renders acceptably.

## 8. Performance / build
- [ ] Production build (`yarn build`) succeeds with no errors.
- [ ] Re-add font `preload` links for Archivo / IBM Plex Mono in `index.html` (removed during earlier font relocation) — Phase 14 item.
- [ ] Spot-check LCP < 2.0s and INP < 200ms on key pages after deploy.
- [ ] Ensure demo iframes lazy-load and do not block first paint.

## 9. Analytics / cookies
- [ ] Confirm NO analytics/advertising cookies are set (Cookie Policy states this). If analytics is added later, add consent + update Cookie Policy first.

## 10. Rollback plan
- [ ] Keep the current production site/artifact as the rollback target; note its version/commit.
- [ ] Deploy to a staging/preview slot first; smoke-test all routes + one enquiry before promoting.
- [ ] If issues arise, roll back to the previous artifact (single step) — do NOT hotfix DNS.
- [ ] DNS/domain connect is a separate, explicit owner-approved step; keep TTL low during cutover to allow fast reversal.
- [ ] Post-rollback: re-verify enquiry form and article pages.

## 11. Emergent platform note
- Deployment, GitHub push, and domain connection are owner actions via the Emergent platform ("Save to GitHub" / Deploy). This checklist does not perform any of them.
