"""Generate the NACHI ENG LTD LinkedIn branding pack from the APPROVED existing
vector logo system + project fonts. No logo redesign, no raster/AI imagery.
All text is converted to vector outlines so exports are crisp and font-independent.

Outputs (editable SVG source + exact-size PNG) -> /app/assets/linkedin/
"""
import os, base64
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import cairosvg
from PIL import Image
import io

FONTS = "/app/frontend/src/fonts"
OUT = "/app/assets/linkedin"
os.makedirs(OUT, exist_ok=True)

# Approved palette (from scripts/build_brand.py / brand SVGs)
INK, PAPER, SIGNAL, GREY = "#101216", "#F4F3F0", "#1D44C8", "#6B6F76"
INK_70 = "#3B3E44"

archivo700 = instancer.instantiateVariableFont(TTFont(f"{FONTS}/archivo-var.woff2"), {"wght": 700, "wdth": 118})
archivo_reg = instancer.instantiateVariableFont(TTFont(f"{FONTS}/archivo-var.woff2"), {"wght": 460, "wdth": 100})
plex500 = TTFont(f"{FONTS}/plex-mono-500.woff2")
plex400 = TTFont(f"{FONTS}/plex-mono-400.woff2")


def measure(font, text, size, tracking_em=0.0):
    upem = font["head"].unitsPerEm
    scale = size / upem
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    w = 0.0
    for ch in text:
        w += hmtx[cmap[ord(ch)]][0] * scale + tracking_em * size
    return w - tracking_em * size


def text_group(font, text, size, x, baseline, fill, tracking_em=0.0, anchor="start", opacity=None):
    """Return an SVG <g> of glyph outlines placed with the given baseline."""
    upem = font["head"].unitsPerEm
    scale = size / upem
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    hmtx = font["hmtx"]
    total = measure(font, text, size, tracking_em)
    if anchor == "middle":
        x = x - total / 2
    elif anchor == "end":
        x = x - total
    cur = x
    paths = []
    for ch in text:
        gname = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[gname].draw(TransformPen(pen, (scale, 0, 0, -scale, cur, baseline)))
        d = pen.getCommands()
        if d:
            paths.append(f'<path d="{d}"/>')
        cur += hmtx[gname][0] * scale + tracking_em * size
    op = f' opacity="{opacity}"' if opacity is not None else ""
    return f'<g fill="{fill}"{op}>' + "".join(paths) + "</g>", total


def n_mark(tx, ty, s, tile=None, bars=PAPER, diag=SIGNAL, opacity=None):
    """The approved N mark glyph (two uprights + signal diagonal), scaled/positioned.
    Geometry identical to public/brand/nachi-eng-mark-*.svg (64-unit space)."""
    op = f' opacity="{opacity}"' if opacity is not None else ""
    body = [f'<g transform="translate({tx:.2f} {ty:.2f}) scale({s:.4f})"{op}>']
    if tile:
        body.append(f'<rect x="0" y="0" width="64" height="64" fill="{tile}"/>')
    body.append(f'<polygon points="13,14 26,14 51,50 38,50" fill="{diag}"/>')
    body.append(f'<rect x="13" y="14" width="10" height="36" fill="{bars}"/>')
    body.append(f'<rect x="41" y="14" width="10" height="36" fill="{bars}"/>')
    body.append("</g>")
    return "".join(body)


def render_png(svg_str, w, h, path, ss=3):
    png = cairosvg.svg2png(bytestring=svg_str.encode(), output_width=w * ss, output_height=h * ss)
    img = Image.open(io.BytesIO(png)).convert("RGBA")
    img = img.resize((w, h), Image.LANCZOS)
    img.save(path)
    return path


# --------------------------------------------------------------------------- #
# 1. COMPANY COVER BANNER  1128 x 191
# --------------------------------------------------------------------------- #
BW, BH = 1128, 191
b = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {BW} {BH}" width="{BW}" height="{BH}">']
b.append(f'<rect width="{BW}" height="{BH}" fill="{PAPER}"/>')

# faint technical grid on the right third only (keeps central/left clean)
grid = ['<g stroke="%s" stroke-width="1" opacity="0.05">' % INK]
for gx in range(720, 1112, 34):
    grid.append(f'<line x1="{gx}" y1="16" x2="{gx}" y2="175"/>')
for gy in range(16, 176, 34):
    grid.append(f'<line x1="720" y1="{gy}" x2="1112" y2="{gy}"/>')
grid.append("</g>")
b.append("".join(grid))

# subtle brand N echo bleeding off the right edge
b.append(n_mark(885.4, -38.8, 4.2, tile=None, bars=INK, diag=SIGNAL, opacity=0.10))

# drawing frame + corner crop marks (engineering aesthetic)
b.append(f'<rect x="16" y="16" width="{BW-32}" height="{BH-32}" fill="none" stroke="{INK}" stroke-width="1" opacity="0.14"/>')
cm = ['<g stroke="%s" stroke-width="1.4" opacity="0.35">' % GREY]
for (cx, cy, dx, dy) in [(16, 16, 1, 1), (BW-16, 16, -1, 1), (16, BH-16, 1, -1), (BW-16, BH-16, -1, -1)]:
    cm.append(f'<line x1="{cx}" y1="{cy}" x2="{cx+dx*13}" y2="{cy}"/>')
    cm.append(f'<line x1="{cx}" y1="{cy}" x2="{cx}" y2="{cy+dy*13}"/>')
cm.append("</g>")
b.append("".join(cm))

# --- central text block (left edge x=316 keeps the profile-logo overlap zone clear) ---
LX = 316
# line 1: approved wordmark lockup  "NACHI ENG" (Archivo 700) + "LTD" (Plex Mono)
BIG = 40
g1, w1 = text_group(archivo700, "NACHI ENG", BIG, LX, 72, INK, tracking_em=-0.02)
b.append(g1)
g1b, _ = text_group(plex500, "LTD", BIG * 0.55, LX + w1 + 13, 72, GREY, tracking_em=0.18)
b.append(g1b)
# signal divider
b.append(f'<rect x="{LX}" y="86" width="52" height="3" fill="{SIGNAL}"/>')
# line 2: descriptor (mono, tracked)
g2, _ = text_group(plex500, "INDUSTRIAL ENGINEERING & MAINTENANCE", 13, LX, 116, INK, tracking_em=0.10)
b.append(g2)
# line 3: positioning statement
g3, _ = text_group(archivo_reg, "Engineering technology built around real operational needs.", 17, LX, 144, INK_70)
b.append(g3)
# optional small website reference
g4, _ = text_group(plex400, "www.nachieng.co.uk", 11, LX, 168, GREY, tracking_em=0.06)
b.append(g4)

b.append("</svg>")
banner_svg = "\n".join(b)
with open(f"{OUT}/nachi-eng-linkedin-banner.svg", "w") as fh:
    fh.write(banner_svg)
render_png(banner_svg, BW, BH, f"{OUT}/nachi-eng-linkedin-banner-1128x191.png")

# --------------------------------------------------------------------------- #
# 2. PROFILE IMAGE  300 x 300  (N mark only, generous safe spacing)
# --------------------------------------------------------------------------- #
PW = 300
p = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {PW} {PW}" width="{PW}" height="{PW}">']
p.append(f'<rect width="{PW}" height="{PW}" fill="{INK}"/>')
# glyph bbox in 64-space: x13..51 (38w), y14..50 (36h). Scale to ~150px tall, centred.
s = 150 / 36
tx = (PW - 38 * s) / 2 - 13 * s
ty = (PW - 36 * s) / 2 - 14 * s
p.append(n_mark(tx, ty, s, tile=None, bars=PAPER, diag=SIGNAL))
p.append("</svg>")
profile_svg = "\n".join(p)
with open(f"{OUT}/nachi-eng-linkedin-profile.svg", "w") as fh:
    fh.write(profile_svg)
render_png(profile_svg, PW, PW, f"{OUT}/nachi-eng-linkedin-profile-300x300.png")

# --------------------------------------------------------------------------- #
# 3. PLACEMENT PREVIEW  (illustrative mock — NOT a real LinkedIn screenshot)
# --------------------------------------------------------------------------- #
with open(f"{OUT}/nachi-eng-linkedin-banner-1128x191.png", "rb") as fh:
    banner_b64 = base64.b64encode(fh.read()).decode()
with open(f"{OUT}/nachi-eng-linkedin-profile-300x300.png", "rb") as fh:
    profile_b64 = base64.b64encode(fh.read()).decode()

VW, VH = 1200, 820
v = [f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 {VW} {VH}" width="{VW}" height="{VH}">']
v.append(f'<rect width="{VW}" height="{VH}" fill="#E8E7E3"/>')
# disclaimer label
lbl, _ = text_group(plex400, "PLACEMENT PREVIEW — ILLUSTRATIVE MOCK, NOT AN ACTUAL LINKEDIN PAGE OR SCREENSHOT", 13, 100, 52, GREY, tracking_em=0.06)
v.append(lbl)

CX, CY, CWD, CHT = 100, 78, 1000, 620
v.append(f'<rect x="{CX}" y="{CY}" width="{CWD}" height="{CHT}" rx="12" fill="#FFFFFF" stroke="{INK}" stroke-width="1" opacity="1"/>')
v.append(f'<rect x="{CX}" y="{CY}" width="{CWD}" height="{CHT}" rx="12" fill="none" stroke="{INK}" stroke-width="1" opacity="0.10"/>')

# banner inside card (rounded top corners via clip)
bh = round(CWD * BH / BW)
v.append(f'<clipPath id="bntop"><path d="M{CX},{CY+12} a12,12 0 0 1 12,-12 h{CWD-24} a12,12 0 0 1 12,12 v{bh-12} h-{CWD} z"/></clipPath>')
v.append(f'<image x="{CX}" y="{CY}" width="{CWD}" height="{bh}" clip-path="url(#bntop)" preserveAspectRatio="xMidYMid slice" xlink:href="data:image/png;base64,{banner_b64}"/>')

# profile square overlapping banner bottom-left (white ring, rounded)
PS = 140
px = CX + 40
py = CY + bh - 70
v.append(f'<rect x="{px-6}" y="{py-6}" width="{PS+12}" height="{PS+12}" rx="20" fill="#FFFFFF"/>')
v.append(f'<clipPath id="pf"><rect x="{px}" y="{py}" width="{PS}" height="{PS}" rx="16"/></clipPath>')
v.append(f'<image x="{px}" y="{py}" width="{PS}" height="{PS}" clip-path="url(#pf)" xlink:href="data:image/png;base64,{profile_b64}"/>')

# company identity text
ty0 = py + PS + 52
nm, _ = text_group(archivo700, "NACHI ENG LTD", 30, px, ty0, INK, tracking_em=-0.01)
v.append(nm)
sub, _ = text_group(plex500, "Industrial Engineering & Maintenance  ·  www.nachieng.co.uk", 14, px, ty0 + 30, GREY, tracking_em=0.02)
v.append(sub)
desc, _ = text_group(archivo_reg, "Engineering technology built around real operational needs.", 17, px, ty0 + 62, INK_70)
v.append(desc)

# mock action buttons
by = ty0 + 90
v.append(f'<rect x="{px}" y="{by}" width="164" height="46" rx="23" fill="{SIGNAL}"/>')
btn1, _ = text_group(archivo700, "Visit website", 15, px + 82, by + 29, PAPER, anchor="middle")
v.append(btn1)
v.append(f'<rect x="{px+180}" y="{by}" width="120" height="46" rx="23" fill="none" stroke="{SIGNAL}" stroke-width="1.5"/>')
btn2, _ = text_group(archivo700, "+ Follow", 15, px + 180 + 60, by + 29, SIGNAL, anchor="middle")
v.append(btn2)

# footnote inside card
foot, _ = text_group(plex400, "Warm off-white #F4F3F0 · near-black #101216 · signal blue #1D44C8 — exported from the approved NACHI ENG LTD vector logo system.", 11, CX + 24, CY + CHT - 22, GREY, tracking_em=0.02)
v.append(foot)

v.append("</svg>")
preview_svg = "\n".join(v)
with open(f"{OUT}/nachi-eng-linkedin-preview.svg", "w") as fh:
    fh.write(preview_svg)
render_png(preview_svg, VW, VH, f"{OUT}/nachi-eng-linkedin-preview.png", ss=2)

# report
for f in sorted(os.listdir(OUT)):
    fp = os.path.join(OUT, f)
    if f.endswith(".png"):
        im = Image.open(fp)
        print(f"{f:45s} {im.size[0]}x{im.size[1]}  {os.path.getsize(fp)//1024}KB")
    else:
        print(f"{f:45s} (source svg)  {os.path.getsize(fp)}B")
