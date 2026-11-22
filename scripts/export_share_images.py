"""Export the default 1200x630 share image, article share images, and favicon.ico.

Brand geometry comes from the existing mark and wordmark SVGs. The tagline is set in
Archivo (the same family outlined into the wordmark) so the card does not depend on a
system font. Article cards are re-exported at 1200x630: line art is kept, the empty
grid is rebuilt, and JPEG chroma is left unsampled so thin blue lines stay sharp.
"""

import io
import os
from pathlib import Path

import cairosvg
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "frontend" / "public" / "brand"
FONTS = ROOT / "frontend" / "src" / "fonts"
PUBLIC = ROOT / "frontend" / "public"

PAPER = (243, 242, 237)
GRID = (214, 213, 208)
INK = "#101216"
W, H = 1200, 630


def glyph_paths(font, text, size, tracking_em=0.0):
    upem = font["head"].unitsPerEm
    scale = size / upem
    cmap = font.getBestCmap()
    gs = font.getGlyphSet()
    hmtx = font["hmtx"]
    x = 0.0
    paths = []
    for ch in text:
        gname = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[gname].draw(TransformPen(pen, (scale, 0, 0, -scale, x, 0)))
        d = pen.getCommands()
        if d:
            paths.append(d)
        x += hmtx[gname][0] * scale + tracking_em * size
    if text:
        x -= tracking_em * size
    return paths, x


def tagline_group(font, text, size, x, baseline, fill):
    paths, width = glyph_paths(font, text, size, tracking_em=-0.01)
    body = "".join(f'<path d="{d}"/>' for d in paths)
    return f'<g transform="translate({x:.2f} {baseline:.2f})" fill="{fill}">{body}</g>', width


def build_default_svg():
    wordmark = (BRAND / "nachi-eng-wordmark-ink.svg").read_text()
    start = wordmark.index("<g ")
    end = wordmark.rindex("</g>") + len("</g>")
    wordmark_inner = wordmark[start:end]

    archivo = instancer.instantiateVariableFont(
        TTFont(str(FONTS / "archivo-var.woff2")),
        {"wght": 520, "wdth": 100},
    )
    cap = archivo["OS/2"].sCapHeight / archivo["head"].unitsPerEm

    # The mark's bars occupy y 14–50 and x 13–51 inside the 64 tile.
    mark_box = 520
    visual_h = 36 / 64 * mark_box
    visual_top = (H - visual_h) / 2
    mark_y = visual_top - (14 / 64 * mark_box)
    mark_x = 72 - (13 / 64 * mark_box)
    text_x = mark_x + (51 / 64 * mark_box) + 56
    text_right = W - 72
    wordmark_w = text_right - text_x
    wordmark_h = wordmark_w * (80.6 / 816.3)

    tagline = "Engineering reliability into every operation."
    tagline_size = 26
    _, tagline_w = glyph_paths(archivo, tagline, tagline_size, tracking_em=-0.01)
    while tagline_w > wordmark_w and tagline_size > 18:
        tagline_size -= 0.5
        _, tagline_w = glyph_paths(archivo, tagline, tagline_size, tracking_em=-0.01)

    lockup_h = wordmark_h + 28 + tagline_size * cap
    lockup_y = (H - lockup_h) / 2
    baseline = lockup_y + wordmark_h + 28 + tagline_size * cap
    tagline_svg, _ = tagline_group(archivo, tagline, tagline_size, text_x, baseline, INK)

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
  <rect width="{W}" height="{H}" fill="#F4F3F0"/>
  <svg x="{mark_x:.2f}" y="{mark_y:.2f}" width="{mark_box}" height="{mark_box}" viewBox="0 0 64 64">
    <polygon points="13,14 26,14 51,50 38,50" fill="#1D44C8"/>
    <rect x="13" y="14" width="10" height="36" fill="#101216"/>
    <rect x="41" y="14" width="10" height="36" fill="#101216"/>
  </svg>
  <svg x="{text_x:.2f}" y="{lockup_y:.2f}" width="{wordmark_w:.2f}" height="{wordmark_h:.2f}" viewBox="0 0 816.3 80.6">
    {wordmark_inner}
  </svg>
  {tagline_svg}
</svg>'''


def save_jpeg(image, dest, target_bytes=None, quality=92):
    rgb = image.convert("RGB")
    q = quality
    best = None
    while q >= 60:
        buf = io.BytesIO()
        rgb.save(buf, format="JPEG", quality=q, optimize=True, subsampling=0)
        data = buf.getvalue()
        best = data
        if target_bytes is None or len(data) <= target_bytes:
            break
        q -= 3
    dest.write_bytes(best)
    return len(best), q


def is_background(r, g, b):
    mx, mn = max(r, g, b), min(r, g, b)
    return mx > 188 and (mx - mn) < 28


def is_ink(r, g, b):
    """Drawing marks only. The pale grid and the hairline frame stay out of the crop."""
    mx, mn = max(r, g, b), min(r, g, b)
    if mx < 165:
        return True
    return (mx - mn) > 36 and b > r + 24


def ink_bbox(image):
    px = image.load()
    w, h = image.size
    minx, miny, maxx, maxy = w, h, 0, 0
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y][:3]
            if is_ink(r, g, b):
                minx = min(minx, x)
                miny = min(miny, y)
                maxx = max(maxx, x)
                maxy = max(maxy, y)
    return minx, miny, maxx, maxy


def paper_grid(width, height):
    canvas = Image.new("RGB", (width, height), PAPER)
    draw = ImageDraw.Draw(canvas)
    step = 30
    for x in range(0, width, step):
        draw.line([(x, 0), (x, height)], fill=GRID)
    for y in range(0, height, step):
        draw.line([(0, y), (width, y)], fill=GRID)
    return canvas


def reexport_article(src, dest):
    image = Image.open(src).convert("RGBA")
    image.load()
    if image.size == (W, H) and Path(src).resolve() == Path(dest).resolve():
        print(f"{dest.name}: already {W}x{H}, left unchanged")
        return
    box = ink_bbox(image)
    pad = 36
    crop = image.crop(
        (
            max(0, box[0] - pad),
            max(0, box[1] - pad),
            min(image.width, box[2] + pad + 1),
            min(image.height, box[3] + pad + 1),
        )
    )
    # Drop the original grid so the rebuilt 1200x630 grid stays aligned.
    px = crop.load()
    for y in range(crop.height):
        for x in range(crop.width):
            r, g, b, a = px[x, y]
            if is_background(r, g, b):
                px[x, y] = (r, g, b, 0)
    margin = 48
    max_w, max_h = W - margin * 2, H - margin * 2
    scale = min(max_w / crop.width, max_h / crop.height)
    resized = crop.resize((round(crop.width * scale), round(crop.height * scale)), Image.Resampling.LANCZOS)
    canvas = paper_grid(W, H).convert("RGBA")
    x = (W - resized.width) // 2
    y = (H - resized.height) // 2
    canvas.alpha_composite(resized, (x, y))
    nbytes, quality = save_jpeg(canvas, dest, target_bytes=200_000, quality=90)
    print(f"{dest.name}: {nbytes} bytes quality={quality} scale={scale:.3f} crop={crop.size}")


def export_favicon():
    mark = Image.open(BRAND / "nachi-eng-mark-paper@1024.png").convert("RGBA")
    dest = PUBLIC / "favicon.ico"
    mark.save(dest, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])
    saved = Image.open(dest)
    print(f"favicon.ico {dest.stat().st_size} bytes size={saved.size}")


def main():
    svg = build_default_svg()
    png = cairosvg.svg2png(bytestring=svg.encode(), output_width=W, output_height=H)
    default = Image.open(io.BytesIO(png))
    nbytes, quality = save_jpeg(default, BRAND / "og-default.jpg", quality=92)
    print(f"og-default.jpg: {nbytes} bytes quality={quality} size={default.size}")
    reexport_article(BRAND / "og-what-is-a-cmms.jpg", BRAND / "og-what-is-a-cmms.jpg")
    reexport_article(BRAND / "og-reactive-vs-preventive.jpg", BRAND / "og-reactive-vs-preventive.jpg")
    export_favicon()


if __name__ == "__main__":
    main()
