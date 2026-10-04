"""Generate public/og-default.png (1200x630) for social sharing.
Usage (from the repository root):
 pip install pillow
 python tools/make-og.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
W, H = 1200, 630
BG = (15, 23, 42) # slate-950
WHITE = (255, 255, 255)
MUTED = (203, 213, 225) # slate-300
ACCENT = (56, 189, 248) # sky-400
FONT_CANDIDATES = [
 "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
 "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
 "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
 "C:/Windows/Fonts/arialbd.ttf",
]
def font(size):
 for path in FONT_CANDIDATES:
 if Path(path).exists():
 return ImageFont.truetype(path, size)
 return ImageFont.load_default(size=size)
img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)
d.rectangle([80, 120, 92, 330], fill=ACCENT)
d.text((120, 110), "Relocation Cost", font=font(96), fill=WHITE)
d.text((120, 240), "US moving cost calculator", font=font(52), fill=ACCENT)
d.text((120, 340), "Planning estimates with a transparent method", font=font(34), fill=MUTED)
d.text((120, 390), "and sourced truck-rental benchmarks.", font=font(34), fill=MUTED)
d.text((120, 520), "relocation-cost-psi.vercel.app", font=font(30), fill=MUTED)
out = Path(__file__).resolve().parent.parent / "public" / "og-default.png"
out.parent.mkdir(exist_ok=True)
img.save(out, optimize=True)
print("wrote", out)