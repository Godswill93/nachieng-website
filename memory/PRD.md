# PRD — NACHI ENG LTD Website Rebuild

## Original problem statement
Full rebuild of the NACHI ENG LTD marketing website (industrial engineering & technology, Southend-on-Sea, Essex; Company No. 16567818). Phased, approval-gated build per the client's master prompt: strict claims discipline (no invented stats, clients, testimonials, accreditations), WCAG 2.2 AA, SEO + performance budgets, Resend-delivered enquiry form (disabled until delivery test passes), no analytics at launch, existing live site at nachieng.co.uk untouched, Emergent preview only. Client's own logo to be uploaded and assessed — no replacement without approval.

## Approved decisions (client sign-off)
- Stack: React SPA + minimal FastAPI backend (single POST /api/enquiry endpoint, no enquiry database)
- Email: Resend (platform-managed), ENQUIRY_DESTINATION=info@nachieng.co.uk env var, form ships DISABLED until end-to-end delivery test; on-screen confirmation only, no auto-reply
- Analytics: none at launch (no GA, no consent banner)
- Calendly: styled external link, not embedded widget
- Design: "The Engineer's Drawing" — paper #F4F3F0 / ink #101216, Signal Blue #1D44C8, steel accent, Archivo (variable, expanded display) + IBM Plex Mono (labels/metadata only), subtle kinetic masked hero, numbered chapters, NO marquee, NO parallax, reduced-motion safe, performance budget wins over decoration
- Logo: client uploads existing logo for assessment; plain-text wordmark placeholder until then
- Canonical host: nachieng.co.uk (non-www)

## User personas
- Maintenance/engineering managers in manufacturing (primary)
- Operations directors, plant managers
- Warehouse/logistics/distribution managers
- Facilities managers (commercial/industrial, hospitality)
- Reliability/CI engineers; organisations interested in maintenance digitisation

## Architecture
- frontend/: React + React Router + Tailwind + framer-motion (LazyMotion) + lenis; content as structured data (src/content/site.js); Seo component (per-page title/meta/canonical/OG/JSON-LD); self-hosted fonts (src/fonts/)
- backend/: FastAPI, enquiry endpoint deferred to Phase 8
- Git: dev branch → preview; main = production, merge only on explicit client approval; documented rollback

## Implemented
- 2026-09-09 Phase 3+4 (preview): Global shell (sticky header, 5-item nav with distinct Contact CTA, accessible mobile overlay menu w/ focus trap + Escape, skip link, footer with reg no/contact/LinkedIn/legal/auto-year), 404 page, homepage with 8 numbered chapters (hero w/ kinetic masked reveal, Tier 1 services, Tier 2 improvement, TMMS teaser "IN DEVELOPMENT", credibility facts, six target environments w/ healthcare flagged "Future target sector", founder + 3 credentials + separate experience statement, insights index, enquiry CTA), home JSON-LD (Organization/LocalBusiness/Person), stub pages for all remaining routes with phase labels. PostHog template tracking removed.
- 2026-09-10 Phase 5 (preview, awaiting client review): Full Services page — intro, five service blocks (Maintenance, Controls & rotating equipment, Improvement, Advisory, Installation support) each with numbered scope items + "Scope boundary" statement (phrased as competence/scope limits WITHOUT naming prohibited services like EICR/domestic/F-Gas, per strict reading of the do-not-mention rule), target environments grid, 3-step "What happens when you enquire", 6-question FAQ (Radix accordion), JSON-LD Service + FAQPage + BreadcrumbList. Shared components extracted: Chapter, IndustryGrid, PrimaryButton, EnquiryCta (homepage refactored to use them).

## Backlog (phased per client)
- P0: Logo upload + assessment (STILL NOT UPLOADED — placeholder wordmark in use); Phase 6 TMMS + 4 demos (client supplies demo files); Phase 7 About; Phase 8 Contact + enquiry pipeline (Resend DNS records needed from client for sending domain; form stays disabled until delivery test)
- P1: Phase 9 Insights (client supplies article texts; every statistic needs named source + date + link); Phase 10 legal drafts; Phase 11 responsive pass; Phase 12 accessibility pass
- P2: Phase 13 SEO pass (redirects incl. 410 for /nachi-invoice-generator.html, sitemap, robots.txt); Phase 14 performance pass (font preload, bundle audit); Phase 15 testing; Phase 16 deployment-prep checklist (NO deploy without explicit instruction)
- Deferred decisions: OG 1200×630 image + favicon set (after logo approval); font preload in production build

## Known constraints / notes
- Never modify DNS, Vercel, email records, existing GitHub repo, or the live site
- Resend sending domain verification requires client-side DNS changes at Phase 8
- Kinetic hero must stay subtle/mobile-safe; drop motion before budget
