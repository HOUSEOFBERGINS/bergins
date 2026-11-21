"""Trace the official Bergins logo PNGs (from houseofbergins.com) into crisp SVGs.
Each SVG uses fill="currentColor" so it can be recoloured (green / ink / ivory)."""
import sys, numpy as np, potrace
from PIL import Image
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "brand"

def cols_with_ink(a):
    return np.where(a.max(axis=0) > 40)[0]

def trace(alpha, scale, name):
    im = Image.fromarray(alpha)
    im = im.resize((im.width * scale, im.height * scale), Image.LANCZOS)
    a = np.array(im)
    bm = potrace.Bitmap(a <= 127)  # potracer fills the dark pixels; our ink is high alpha, so pass the inverse
    plist = bm.trace(turdsize=4, alphamax=1.0, opticurve=True, opttolerance=0.2)
    d = []
    for curve in plist:
        s = curve.start_point
        d.append(f"M{s.x:.2f},{s.y:.2f}")
        for seg in curve.segments:
            if seg.is_corner:
                d.append(f"L{seg.c.x:.2f},{seg.c.y:.2f}L{seg.end_point.x:.2f},{seg.end_point.y:.2f}")
            else:
                d.append(f"C{seg.c1.x:.2f},{seg.c1.y:.2f} {seg.c2.x:.2f},{seg.c2.y:.2f} {seg.end_point.x:.2f},{seg.end_point.y:.2f}")
        d.append("Z")
    w, h = a.shape[1], a.shape[0]
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
           f'<path fill="currentColor" fill-rule="evenodd" d="{"".join(d)}"/></svg>')
    (ROOT / "vector" / f"{name}.svg").write_text(svg)
    print(name, w, h, len(svg))

def alpha_of(f):
    return np.array(Image.open(ROOT / "logo" / f).convert("RGBA").split()[3])

def crop(a, pad=2):
    ys, xs = np.where(a > 40)
    return a[max(ys.min()-pad,0):ys.max()+pad+1, max(xs.min()-pad,0):xs.max()+pad+1]

# 1. Main lockup: BERGINS + CRAFTING HARMONY (1200x500 source)
a = crop(alpha_of("Bergins-Logo-1.png"))
trace(a, 3, "bergins-lockup")
# split wordmark / tagline at the empty band between them
rows = np.where(a.max(axis=1) > 40)[0]
gaps = [r for r in range(rows.min(), rows.max()) if a[r].max() <= 40]
cut = gaps[len(gaps)//2]
trace(crop(a[:cut]), 3, "bergins-wordmark")
trace(crop(a[cut:]), 3, "crafting-harmony")
# 2. BRG monogram
trace(crop(alpha_of("brg-monogram-2x.png")), 6, "brg-monogram")
# 3. THE elsewhere COLLECTION (right half of elsewhere lockup)
e = alpha_of("elsewhere-lockup.png")
xs = cols_with_ink(e)
# find the widest empty column run -> separates BERGINS lockup from collection line
runs, start = [], None
for x in range(xs.min(), xs.max()):
    empty = e[:, x].max() <= 40
    if empty and start is None: start = x
    if not empty and start is not None: runs.append((x-start, start, x)); start = None
w, s0, s1 = max(runs)
trace(crop(e[:, s1-2:]), 6, "elsewhere-collection")
