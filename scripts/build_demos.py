"""Re-skin the four legacy CMMS demos (read-only source in /app/memory/legacy) as TMMS simulated demonstrations."""
import base64
import os
import re

SRC = "/app/memory/legacy"
OUT = "/app/frontend/public/demos"
FONTS = "/app/frontend/src/fonts"
os.makedirs(OUT, exist_ok=True)

SECTORS = {
    "factory": ("cmms-factory-demo.html", "Factory & manufacturing", "Select a production line to view its sample data."),
    "warehouse": ("cmms-warehouse-demo.html", "Warehouse & logistics", "Select a zone to view its sample data."),
    "hotel": ("cmms-hotel-demo.html", "Hotel & hospitality", "Select a zone to view its sample data."),
    "hospital": ("cmms-hospital-demo.html", "Hospital & healthcare (future target sector)", "Select a department to view its sample data."),
}

# Emoji / pictograph ranges — keep ✓ ✕ (U+2713–2716) as plain glyphs
EMOJI = re.compile(
    "[\U0001F000-\U0001FFFF\u2600-\u26FF\u2700-\u2712\u2717-\u27BF\u2B00-\u2BFF\u2190-\u21FF\u2300-\u23FF\uFE0F\u200D\u20E3]"
)

KEEP_SLASH_ARROW = {"→": "→"}


def font_b64(name):
    with open(f"{FONTS}/{name}", "rb") as fh:
        return base64.b64encode(fh.read()).decode()


def build_css():
    return f"""
@font-face{{font-family:"Archivo";src:url(data:font/woff2;base64,{font_b64('archivo-var.woff2')}) format("woff2");font-weight:100 900;font-stretch:62% 125%;font-display:swap}}
@font-face{{font-family:"IBM Plex Mono";src:url(data:font/woff2;base64,{font_b64('plex-mono-400.woff2')}) format("woff2");font-weight:400;font-display:swap}}
@font-face{{font-family:"IBM Plex Mono";src:url(data:font/woff2;base64,{font_b64('plex-mono-500.woff2')}) format("woff2");font-weight:500;font-display:swap}}
[data-theme="dark"]{{--bg:#101216;--bg2:#0C0E12;--surface:#171A20;--surface2:#1E2229;--surface3:#262B33;--white:#F4F3F0;--grey:#6B7280;--grey2:#A3A7AE;--text:#F4F3F0;--border:rgba(244,243,240,0.10);--border2:rgba(244,243,240,0.22);--header-bg:rgba(16,18,22,0.97);--card-bg:#171A20;--sidebar-bg:#0C0E12;--input-bg:#1E2229;--shadow:rgba(0,0,0,0.5)}}
[data-theme="light"]{{--bg:#F4F3F0;--bg2:#ECEBE7;--surface:#FFFFFF;--surface2:#F4F3F0;--surface3:#E6E5E1;--white:#101216;--grey:#8A8F98;--grey2:#5B606A;--text:#101216;--border:rgba(16,18,22,0.12);--border2:rgba(16,18,22,0.24);--header-bg:rgba(244,243,240,0.97);--card-bg:#FFFFFF;--sidebar-bg:#ECEBE7;--input-bg:#F4F3F0;--shadow:rgba(16,18,22,0.10)}}
:root{{--blue:#1D44C8;--blue2:#3A5FE0;--blue3:#7A93F0;--glow:rgba(29,68,200,0.22);--teal:#1D44C8;--teal2:#7A93F0;--gold:#1D44C8;--gold2:#7A93F0;--gold3:#B7C4F6;--orange:#1D44C8;--orange2:#7A93F0;--orange3:#B7C4F6;--purple:#3A5FE0;--purple2:#7A93F0;--purple3:#B7C4F6;--cyan:#3A5FE0;--pink:#7A93F0;--yellow:#F59E0B}}
[data-theme="light"]{{--blue3:#1D44C8;--teal2:#1D44C8;--gold2:#1D44C8;--orange2:#1D44C8;--purple2:#1D44C8;--pink:#1D44C8;--border:rgba(16,18,22,0.12);--border2:rgba(16,18,22,0.24)}}
[data-theme="dark"]{{--border:rgba(244,243,240,0.10);--border2:rgba(244,243,240,0.22)}}
.btn-demo,.logo-badge,.industry-tag,.theme-btn{{white-space:nowrap}}
body{{font-family:"Archivo",ui-sans-serif,system-ui,sans-serif}}
h1,h2,h3,h4{{font-family:"Archivo",ui-sans-serif,system-ui,sans-serif;font-stretch:110%;letter-spacing:-0.01em}}
.header-logo{{font-family:"Archivo",sans-serif;font-stretch:118%;font-weight:700;letter-spacing:-0.02em;gap:12px}}
.logo-badge,.industry-tag,.wo-status,.sidebar-label,.sim-badge{{font-family:"IBM Plex Mono",ui-monospace,monospace;font-weight:500;letter-spacing:0.12em;text-transform:uppercase}}
.logo-badge{{background:transparent;color:var(--grey2);border:1px solid var(--border2);border-radius:1px;font-size:9px;padding:3px 7px}}
.industry-tag{{background:transparent;border-color:var(--border2);color:var(--grey2);border-radius:1px;font-size:10px}}
.sim-badge{{font-size:10px;color:var(--text);background:var(--surface2);border:1px solid var(--border2);padding:5px 10px;border-radius:1px;white-space:nowrap}}
.sim-badge::before{{content:"";display:inline-block;width:7px;height:7px;background:var(--blue);margin-right:8px;vertical-align:1px}}
.btn-demo,.btn-primary,.theme-btn,.nav-tab,.msg-new-btn,.msg-action-btn{{font-family:"Archivo",sans-serif;font-weight:600}}
.btn-demo,.btn-primary,.msg-send-btn{{border-radius:999px}}
.msg-send-btn{{width:auto;padding:0 14px;font-size:12px;font-weight:600}}
.nav-tab.active{{color:var(--text);border-bottom-color:var(--blue)}}
.sidebar-icon:empty{{display:none}}
.cta-banner{{background:var(--surface);border:1px solid var(--border2);border-left:3px solid var(--blue)}}
.cta-banner h3{{font-size:15px}}
.cta-banner p{{color:var(--grey2)}}
.live-dot{{display:none}}
@media (prefers-reduced-motion: reduce){{*,*::before,*::after{{animation-duration:0.01ms!important;transition-duration:0.01ms!important}}}}
@media (max-width:700px){{.header{{height:auto;min-height:56px;flex-wrap:wrap;padding:8px 14px;gap:8px}}.header-right{{flex-wrap:wrap}}.industry-tag{{display:none}}.nav-tabs{{padding:0 8px}}.kpi-grid{{grid-template-columns:1fr 1fr}}.main{{min-height:auto}}}}
"""


def flatten_radius(css):
    def rep(m):
        vals = m.group(1)
        if "100px" in vals or "50%" in vals or "999px" in vals:
            return m.group(0)
        return "border-radius:2px"
    return re.sub(r"border-radius:([^;}]+)", rep, css)


def transform(html, label, hint):
    # 1. External network: drop jsPDF CDN + Google Fonts, load local shared stylesheet
    html = re.sub(r'<script src="https://cdnjs\.cloudflare\.com[^"]*"></script>\s*', "", html)
    html = re.sub(r'<link href="https://fonts\.googleapis\.com[^"]*" rel="stylesheet">\s*',
                  '<link rel="stylesheet" href="/demos/tmms-demo.css">\n<meta name="robots" content="noindex, nofollow">\n', html)
    # 2. Fonts and radii inside the inline stylesheet
    html = html.replace("'Syne'", "'Archivo'").replace("'DM Sans'", "'Archivo'").replace("'DM Mono'", "'IBM Plex Mono'")
    head, sep, rest = html.partition("</style>")
    head = flatten_radius(head)
    html = head + sep + rest
    # Shared stylesheet is inlined so the opaque-origin sandbox needs no network request at all
    html = html.replace('<link rel="stylesheet" href="/demos/tmms-demo.css">\n', "")
    # 3. Branding and truth labels
    html = re.sub(r"<title>.*?</title>", f"<title>TMMS simulated demonstration — {label}</title>", html, count=1)
    html = re.sub(r'<div class="header-logo">.*?</div>',
                  '<div class="header-logo">TMMS <span class="logo-badge">Simulated demo</span></div>', html, count=1)
    html = re.sub(r'<div class="live-badge"><div class="live-dot"></div>\s*Live</div>',
                  '<div class="sim-badge" role="status">Simulated demonstration — sample data</div>', html, count=1)
    html = re.sub(
        r'<div class="cta-text">.*?</div>\s*<div class="cta-buttons">.*?</div>',
        f'<div class="cta-text"><h3>TMMS — {label}. {hint}</h3>'
        '<p>Simulated demonstration by Nachi Eng Ltd. Every asset, person, figure, message and event shown is fictional sample data. '
        'No live system, customer or organisation is represented.</p></div>',
        html, count=1, flags=re.S)
    html = html.replace("NachiCMMS", "TMMS")
    html = html.replace(" Live Lift Status", " Lift status (sample)")
    html = html.replace("Live water quality and equipment monitoring", "Sample water quality and equipment readings")
    html = html.replace("Live temperature monitoring — all zones", "Sample temperature readings — all zones")
    html = re.sub(r'<div class="card-title">\s+', '<div class="card-title">', html)
    # 4. Remove real personal / company data from sample settings
    html = html.replace("Godswill Iweajunwa", "Sample Manager")
    html = html.replace('value="info@nachieng.co.uk"', 'value="maintenance@example.com"')
    html = re.sub(r'value="Nachi ([^"]*)"', r'value="Sample \1"', html)
    html = html.replace("Sample Healthcare Trust", "Sample Hospital")
    html = html.replace("info@nachieng.co.uk", "maintenance@example.com").replace("nachieng.co.uk", "example.com")
    html = html.replace("+44 (0) 7480286830", "+44 (0) 0000 000000")
    assert "nachieng" not in html, "stray domain reference"
    assert "NHS" not in html, "NHS reference remains"
    # 5. Emoji removal (labels, JS strings, toasts)
    html = EMOJI.sub("", html)
    html = html.replace(">➤<", ">Send<")
    html = re.sub(r'(<button class="nav-tab[^>]*>)\s+', r"\1", html)
    html = re.sub(r'(<button class="theme-btn[^>]*>)\s+', r"\1", html)
    html = re.sub(r'(<span class="sidebar-icon"></span>)\s+', r"\1", html)
    html = re.sub(r"showToast\('\s+", "showToast('", html)
    html = re.sub(r"<h3>\s+", "<h3>", html)
    # 6. PDF export needs an external library and downloads (both disallowed in the sandbox)
    html = html.replace("</body>", "<script>function exportReport(){showToast('PDF export is not available in this simulated demonstration.')}</script>\n</body>")
    assert "https://" not in html.replace('xmlns="http://www.w3.org/2000/svg"', ""), "external URL remains"
    assert 'target="_blank"' not in html, "_blank remains"
    # 7. Inline the shared stylesheet last (base64 font data must not be scanned by the checks above)
    return html.replace("</style>", "</style>\n<style>" + SHARED_CSS + "</style>", 1)


SHARED_CSS = build_css()

for slug, (src, label, hint) in SECTORS.items():
    with open(f"{SRC}/{src}", encoding="utf-8") as fh:
        out = transform(fh.read(), label, hint)
    with open(f"{OUT}/{slug}.html", "w", encoding="utf-8") as fh:
        fh.write(out)
    print(slug, len(out), "bytes")
