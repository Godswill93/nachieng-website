"""Final LinkedIn company-page banner (DARK) for NACHI ENG LTD — single PNG deliverable.
Built from the approved dark identity + project fonts (text -> outlines). No N-mark object,
no design-reference labels, no unsupported claims. Exact 1128x191 PNG."""
import io
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import cairosvg
from PIL import Image

FONTS = "/app/frontend/src/fonts"
OUT = "/app/assets/linkedin/nachi-eng-linkedin-banner-1128x191.png"

INK, PAPER, SIGNAL = "#101216", "#F4F3F0", "#1D44C8"
LINE2, LINE3, WEB = "#C7C9CD", "#9BA0A6", "#7F838A"

archivo700 = instancer.instantiateVariableFont(TTFont(f"{FONTS}/archivo-var.woff2"), {"wght": 700, "wdth": 118})
archivo_reg = instancer.instantiateVariableFont(TTFont(f"{FONTS}/archivo-var.woff2"), {"wght": 460, "wdth": 100})
plex500 = TTFont(f"{FONTS}/plex-mono-500.woff2")
plex400 = TTFont(f"{FONTS}/plex-mono-400.woff2")


def measure(font, text, size, tr=0.0):
    upem = font["head"].unitsPerEm; scale = size / upem
    cmap = font.getBestCmap(); hmtx = font["hmtx"]; w = 0.0
    for ch in text:
        w += hmtx[cmap[ord(ch)]][0] * scale + tr * size
    return w - tr * size


def text_group(font, text, size, x, baseline, fill, tr=0.0, opacity=None):
    upem = font["head"].unitsPerEm; scale = size / upem
    cmap = font.getBestCmap(); gs = font.getGlyphSet(); hmtx = font["hmtx"]
    cur = x; paths = []
    for ch in text:
        gname = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[gname].draw(TransformPen(pen, (scale, 0, 0, -scale, cur, baseline)))
        d = pen.getCommands()
        if d:
            paths.append(f'<path d="{d}"/>')
        cur += hmtx[gname][0] * scale + tr * size
    op = f' opacity="{opacity}"' if opacity is not None else ""
    return f'<g fill="{fill}"{op}>' + "".join(paths) + "</g>", cur - x


W, H = 1128, 191
s = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">']
s.append(f'<rect width="{W}" height="{H}" fill="{INK}"/>')

# subtle technical linework on the right (kept out of the left profile-overlap zone)
s.append('<clipPath id="fr"><rect x="17" y="17" width="%d" height="%d"/></clipPath>' % (W - 34, H - 34))
grid = ['<g clip-path="url(#fr)" stroke="%s" stroke-width="1" opacity="0.05">' % PAPER]
for gx in range(720, 1112, 34):
    grid.append(f'<line x1="{gx}" y1="17" x2="{gx}" y2="174"/>')
for gy in range(17, 175, 34):
    grid.append(f'<line x1="720" y1="{gy}" x2="1111" y2="{gy}"/>')
grid.append("</g>")
s.append("".join(grid))
# restrained signal diagonal accents (abstract linework, not the N glyph)
s.append('<g clip-path="url(#fr)" stroke="%s" stroke-width="1.4" opacity="0.55">' % SIGNAL)
s.append('<line x1="946" y1="176" x2="1086" y2="40"/>')
s.append('</g>')
s.append('<g clip-path="url(#fr)" stroke="%s" stroke-width="1" opacity="0.28">' % SIGNAL)
s.append('<line x1="906" y1="176" x2="1046" y2="40"/>')
s.append('<line x1="986" y1="176" x2="1126" y2="40"/>')
s.append('</g>')

# drawing frame + corner crop marks
s.append(f'<rect x="17" y="17" width="{W-34}" height="{H-34}" fill="none" stroke="{PAPER}" stroke-width="1" opacity="0.12"/>')
cm = ['<g stroke="%s" stroke-width="1.4" opacity="0.30">' % PAPER]
for (cx, cy, dx, dy) in [(17, 17, 1, 1), (W-17, 17, -1, 1), (17, H-17, 1, -1), (W-17, H-17, -1, -1)]:
    cm.append(f'<line x1="{cx}" y1="{cy}" x2="{cx+dx*13}" y2="{cy}"/>')
    cm.append(f'<line x1="{cx}" y1="{cy}" x2="{cx}" y2="{cy+dy*13}"/>')
cm.append("</g>")
s.append("".join(cm))

# --- central text block (left edge 316 keeps the lower-left logo-overlap zone clear) ---
LX = 316
BIG = 40
g1, w1 = text_group(archivo700, "NACHI ENG", BIG, LX, 72, PAPER, tr=-0.02)
s.append(g1)
g1b, _ = text_group(plex500, "LTD", BIG * 0.55, LX + w1 + 13, 72, PAPER, tr=0.18, opacity=0.72)
s.append(g1b)
s.append(f'<rect x="{LX}" y="86" width="52" height="3" fill="{SIGNAL}"/>')
g2, _ = text_group(plex500, "INDUSTRIAL ENGINEERING & MAINTENANCE", 13, LX, 116, LINE2, tr=0.10)
s.append(g2)
g3, _ = text_group(archivo_reg, "Engineering technology built around real operational needs.", 17, LX, 144, LINE3)
s.append(g3)
g4, _ = text_group(plex400, "www.nachieng.co.uk", 11, LX, 168, WEB, tr=0.06)
s.append(g4)

s.append("</svg>")
svg = "\n".join(s)
png = cairosvg.svg2png(bytestring=svg.encode(), output_width=W * 3, output_height=H * 3)
img = Image.open(io.BytesIO(png)).convert("RGB").resize((W, H), Image.LANCZOS)
img.save(OUT)
print("written", OUT, img.size)
