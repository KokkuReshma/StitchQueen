"""
convert_images.py

Usage:
    python tools/convert_images.py

What it does:
- Converts the 4 collection images in `images/` to transparent PNGs sized 320x420.
- Removes backgrounds using `rembg` when available (best-quality automatic removal).
- Falls back to a simple background-color-based removal if `rembg` is not installed.
- Handles SVG placeholders via `cairosvg` render -> remove -> resize pipeline.
- Output files are saved to `images/transparent/` with names matching the inputs.

Notes:
- For production-quality background removal on real photos, install `rembg` (U-2-Net based) or use a commercial API (remove.bg) and provide high-res images.
- This script is designed to be run locally on your machine.

"""
import os
import io
from pathlib import Path

INPUT_DIR = Path(__file__).resolve().parents[1] / 'images'
OUTPUT_DIR = INPUT_DIR / 'transparent'
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

TARGET_SIZE = (320, 420)  # width, height

# files to process (base names)
FILES = [
    ('classic-saree.svg', 'classic-saree.png'),
    ('embroidered-dress.svg', 'embroidered-dress.png'),
    ('pink-fusion.svg', 'pink-fusion.png'),
    ('wedding-white.svg', 'wedding-white.png'),
]

print('Image conversion tool starting...')

try:
    from rembg import remove
    REMBG_AVAILABLE = True
    print('rembg available: using U-2-Net background removal')
except Exception:
    REMBG_AVAILABLE = False
    print('rembg not available: falling back to simple background mask (less accurate)')

try:
    import cairosvg
    CAIROSVG_AVAILABLE = True
except Exception:
    CAIROSVG_AVAILABLE = False
    print('cairosvg not available: SVG input will be skipped unless converted manually')

from PIL import Image


def remove_background_with_rembg(png_bytes):
    try:
        out = remove(png_bytes)
        return out
    except Exception as e:
        print('rembg removal failed:', e)
        return None


def simple_bg_remove(img):
    # Convert near-white/near-cream backgrounds to transparent.
    img = img.convert('RGBA')
    datas = img.getdata()

    newData = []
    for item in datas:
        r, g, b, a = item
        # Simple threshold for light backgrounds (tune if needed)
        if r > 240 and g > 240 and b > 240:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    return img


def process_svg(src_path, tmp_size=(1280, 1680)):
    """Render SVG to PNG bytes using cairosvg at larger size for quality."""
    if not CAIROSVG_AVAILABLE:
        print('Cannot render SVG (cairosvg missing):', src_path)
        return None
    try:
        png_bytes = cairosvg.svg2png(url=str(src_path), output_width=tmp_size[0], output_height=tmp_size[1])
        return png_bytes
    except Exception as e:
        print('SVG render failed for', src_path, e)
        return None


def save_transparent_png(img, out_path, size=TARGET_SIZE):
    # Ensure RGBA
    img = img.convert('RGBA')
    img = img.resize(size, Image.LANCZOS)
    img.save(out_path, format='PNG', optimize=True)
    print('Saved:', out_path)


for src_name, out_name in FILES:
    src_path = INPUT_DIR / src_name
    out_path = OUTPUT_DIR / out_name

    if not src_path.exists():
        print('Source not found, skipping:', src_path)
        continue

    print('\nProcessing:', src_path.name)

    # If SVG: render to PNG first
    if src_path.suffix.lower() == '.svg':
        png_bytes = process_svg(src_path)
        if png_bytes is None:
            print('Skipping', src_path)
            continue

        if REMBG_AVAILABLE:
            removed = remove_background_with_rembg(png_bytes)
            if removed:
                img = Image.open(io.BytesIO(removed))
                save_transparent_png(img, out_path)
                continue

        # fallback: open rendered png and do simple removal
        img = Image.open(io.BytesIO(png_bytes))
        img2 = simple_bg_remove(img)
        save_transparent_png(img2, out_path)
        continue

    # Raster input (png/jpg)
    try:
        with open(src_path, 'rb') as f:
            data = f.read()
    except Exception as e:
        print('Failed reading', src_path, e)
        continue

    if REMBG_AVAILABLE:
        removed = remove_background_with_rembg(data)
        if removed:
            img = Image.open(io.BytesIO(removed))
            save_transparent_png(img, out_path)
            continue

    # Fallback raster simple removal
    img = Image.open(io.BytesIO(data))
    img2 = simple_bg_remove(img)
    save_transparent_png(img2, out_path)

print('\nConversion finished. Outputs saved to:', OUTPUT_DIR)
