"""Make a seamlessly repeating paper tile from the site's panel texture.
Offset-and-blend: the half-rolled copy is continuous at the borders, the original is
continuous in the middle; a cosine window blends them, then grain contrast is restored."""
import numpy as np
from PIL import Image
from pathlib import Path
B = Path(__file__).resolve().parent.parent / "brand" / "elements"
a = np.array(Image.open(B / "panel-texture.webp").convert("RGB")).astype(float)
h, w = a.shape[:2]
r = np.roll(a, (h // 2, w // 2), axis=(0, 1))
wy = np.sin(np.linspace(0, np.pi, h))[:, None]
wx = np.sin(np.linspace(0, np.pi, w))[None, :]
m = (wy * wx)[..., None] ** 0.5          # 1 in the centre, 0 at the borders
mix = a * m + r * (1 - m)
mean = a.mean(axis=(0, 1))
gain = 1 / np.sqrt(m ** 2 + (1 - m) ** 2)  # undo the contrast loss of averaging
out = np.clip(mean + (mix - mean) * gain, 0, 255).astype(np.uint8)
Image.fromarray(out).save(B / "paper-tile.jpg", quality=92)
o = out.astype(float).mean(axis=2)
print("tile", out.shape, "edge diff L/R", abs(o[:, 0] - o[:, -1]).mean().round(2), "T/B", abs(o[0] - o[-1]).mean().round(2), "std", o.std().round(2))
