"""Generate NACHI ENG LTD vector wordmark, N mark, favicon and PNG exports from the site fonts."""
import os
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import cairosvg

FONTS = "/app/frontend/src/fonts"
OUT = "/app/frontend/public/brand"
os.makedirs(OUT, exist_ok=True)

INK, PAPER, SIGNAL = "#101216", "#F4F3F0", "#1D44C8"


def glyph_paths(font, text, size, tracking_em=0.0, x0=0.0):
    upem = font["head"].unitsPerEm
    scale = size / upem
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    hmtx = font["hmtx"]
    x = x0
    paths = []
    for ch in text:
        gname = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[gname].draw(TransformPen(pen, (scale, 0, 0, -scale, x, 0)))
        d = pen.getCommands()
        if d:
            paths.append(d)
        x += hmtx[gname][0] * scale + tracking_em * size
    return paths, x - tracking_em * size


archivo = instancer.instantiateVariableFont(TTFont(f"{FONTS}/archivo-var.woff2"), {"wght": 700, "wdth": 118})
plex = TTFont(f"{FONTS}/plex-mono-500.woff2")

# Primary single-line lockup: NACHI ENG (Archivo 700 / wdth 118) + LTD (Plex Mono 500, 55%, tracked 0.18em)
BIG, SMALL, GAP = 100.0, 55.0, 14.0
main_paths, main_w = glyph_paths(archivo, "NACHI ENG", BIG, tracking_em=-0.02)
ltd_paths, ltd_end = glyph_paths(plex, "LTD", SMALL, tracking_em=0.18, x0=main_w + GAP)
cap = archivo["OS/2"].sCapHeight / 1000 * BIG  # 68.6
PAD = 6.0
W, H = ltd_end + PAD * 2, cap + PAD * 2


def wordmark_svg(ink, ltd_col, bg=None):
    body = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.1f} {H:.1f}" width="{W:.1f}" height="{H:.1f}" role="img" aria-labelledby="t">',
            "<title id=\"t\">Nachi Eng Ltd</title>"]
    if bg:
        body.append(f'<rect width="{W:.1f}" height="{H:.1f}" fill="{bg}"/>')
    body.append(f'<g transform="translate({PAD:.1f} {PAD + cap:.1f})">')
    body.append(f'<g fill="{ink}">' + "".join(f'<path d="{d}"/>' for d in main_paths) + "</g>")
    body.append(f'<g fill="{ltd_col}">' + "".join(f'<path d="{d}"/>' for d in ltd_paths) + "</g>")
    body.append("</g></svg>")
    return "\n".join(body)


# Stacked variant: NACHI ENG over LTD (left aligned, for tight spaces only)
def stacked_svg(ink, ltd_col):
    sw = main_w + PAD * 2
    sh = cap + 10 + SMALL * 0.7 + PAD * 2
    ltd2, _ = glyph_paths(plex, "LTD", SMALL, tracking_em=0.18, x0=0)
    return "\n".join([
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {sw:.1f} {sh:.1f}" width="{sw:.1f}" height="{sh:.1f}" role="img" aria-labelledby="t">',
        '<title id="t">Nachi Eng Ltd</title>',
        f'<g transform="translate({PAD:.1f} {PAD + cap:.1f})" fill="{ink}">' + "".join(f'<path d="{d}"/>' for d in main_paths) + "</g>",
        f'<g transform="translate({PAD:.1f} {PAD + cap + 10 + SMALL * 0.7:.1f})" fill="{ltd_col}">' + "".join(f'<path d="{d}"/>' for d in ltd2) + "</g>",
        "</svg>"])


# N mark: two uprights + one signal-blue diagonal stroke, on a flat tile
def mark_svg(tile, bars, diag, radius=0, size=64, media=False):
    css = ""
    if media:
        css = ("<style>@media (prefers-color-scheme: dark){.tile{fill:%s}.bar{fill:%s}}</style>" % (INK, PAPER))
    return "\n".join([
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="{size}" height="{size}" role="img" aria-label="Nachi Eng Ltd">',
        css,
        f'<rect class="tile" width="64" height="64" rx="{radius}" fill="{tile}"/>',
        f'<polygon points="13,14 26,14 51,50 38,50" fill="{diag}"/>',
        f'<rect class="bar" x="13" y="14" width="10" height="36" fill="{bars}"/>',
        f'<rect class="bar" x="41" y="14" width="10" height="36" fill="{bars}"/>',
        "</svg>"])


files = {
    "nachi-eng-wordmark-ink.svg": wordmark_svg(INK, "#6B6F76"),
    "nachi-eng-wordmark-paper.svg": wordmark_svg(PAPER, "#A7AAB0"),
    "nachi-eng-wordmark-stacked-ink.svg": stacked_svg(INK, "#6B6F76"),
    "nachi-eng-wordmark-stacked-paper.svg": stacked_svg(PAPER, "#A7AAB0"),
    "nachi-eng-mark-paper.svg": mark_svg(PAPER, INK, SIGNAL),
    "nachi-eng-mark-ink.svg": mark_svg(INK, PAPER, SIGNAL),
    "favicon.svg": mark_svg(PAPER, INK, SIGNAL, media=True),
    "apple-touch-icon.svg": mark_svg(PAPER, INK, SIGNAL, radius=0),
}
for name, svg in files.items():
    with open(f"{OUT}/{name}", "w") as fh:
        fh.write(svg)

# PNG exports (transparent wordmarks at 2400px wide, marks at 1024, favicon sizes)
cairosvg.svg2png(bytestring=files["nachi-eng-wordmark-ink.svg"].encode(), write_to=f"{OUT}/nachi-eng-wordmark-ink@2400.png", output_width=2400)
cairosvg.svg2png(bytestring=files["nachi-eng-wordmark-paper.svg"].encode(), write_to=f"{OUT}/nachi-eng-wordmark-paper@2400.png", output_width=2400)
cairosvg.svg2png(bytestring=files["nachi-eng-wordmark-stacked-ink.svg"].encode(), write_to=f"{OUT}/nachi-eng-wordmark-stacked-ink@1600.png", output_width=1600)
cairosvg.svg2png(bytestring=files["nachi-eng-wordmark-stacked-paper.svg"].encode(), write_to=f"{OUT}/nachi-eng-wordmark-stacked-paper@1600.png", output_width=1600)
cairosvg.svg2png(bytestring=files["nachi-eng-mark-paper.svg"].encode(), write_to=f"{OUT}/nachi-eng-mark-paper@1024.png", output_width=1024)
cairosvg.svg2png(bytestring=files["nachi-eng-mark-ink.svg"].encode(), write_to=f"{OUT}/nachi-eng-mark-ink@1024.png", output_width=1024)
cairosvg.svg2png(bytestring=files["apple-touch-icon.svg"].encode(), write_to=f"{OUT}/apple-touch-icon.png", output_width=180)
cairosvg.svg2png(bytestring=files["nachi-eng-mark-paper.svg"].encode(), write_to=f"{OUT}/icon-192.png", output_width=192)
cairosvg.svg2png(bytestring=files["nachi-eng-mark-paper.svg"].encode(), write_to=f"{OUT}/icon-512.png", output_width=512)
cairosvg.svg2png(bytestring=files["nachi-eng-mark-paper.svg"].encode(), write_to=f"{OUT}/favicon-32.png", output_width=32)
print(f"wordmark {W:.0f}x{H:.0f}; written {len(os.listdir(OUT))} files to {OUT}")
