"""Assemble the phone download page (dist/page/) from the rendered theme."""
import base64, json, shutil, zipfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
D = ROOT / "dist" / "android"
OUT = ROOT / "dist" / "page"
if OUT.exists(): shutil.rmtree(OUT)
(OUT / "wallpapers").mkdir(parents=True); (OUT / "thumbs").mkdir()

b64 = lambda p: base64.b64encode(p.read_bytes()).decode()
svg = lambda n: (ROOT / "brand/vector" / f"{n}.svg").read_text().replace(' width="', ' data-w="').replace(' height="', ' data-h="')

WALL = [("bergins-green-lock", "Green · lock screen"), ("bergins-green-home", "Green · home screen"),
        ("bergins-paper-lock", "Paper · lock screen"), ("bergins-paper-home", "Paper · home screen"),
        ("bergins-elsewhere", "Elsewhere"), ("bergins-ink", "Ink · dark mode"),
        ("bergins-postcard-corsica", "Corsica postcard"), ("bergins-postcard-kyoto", "Kyoto postcard"),
        ("bergins-postcard-muscat", "Muscat postcard")]
walls = []
ZIPS = {"wallpapers": []}
for wid, lab in WALL:
    src = D / "wallpapers/1440x3200" / f"{wid}.jpg"
    shutil.copy(src, OUT / "wallpapers" / src.name)
    Image.open(src).resize((300, 667), Image.LANCZOS).save(OUT / "thumbs" / src.name, quality=82)
    fname = "Bergins-" + wid.removeprefix("bergins-") + ".jpg"
    ZIPS["wallpapers"].append([f"wallpapers/{src.name}", fname])
    walls.append(f'<div class="item"><img src="thumbs/{src.name}" alt="{lab} wallpaper" loading="lazy" width="300" height="667">'
                 f'<div class="label">{lab}</div><button class="save" type="button" data-file="{fname}" data-src="wallpapers/{src.name}">Save</button></div>')

icons = json.loads((ROOT / "dist/.build/icons.json").read_text()) + [{"id": "_iconback", "label": "Other apps"}]
icon_html = {}
for style in ("green", "ivory"):
    (OUT / "icons" / style).mkdir(parents=True)
    ZIPS[style] = []
    cells = []
    for ic in icons:
        src = D / "icons" / style / f"{ic['id']}.png"
        shutil.copy(src, OUT / "icons" / style / src.name)
        fname = ("bergins-blank" if ic["id"] == "_iconback" else ic["id"]) + ".png"
        ZIPS[style].append([f"icons/{style}/{src.name}", fname])
        cells.append(f'<button class="ic" type="button" data-file="{fname}" data-src="icons/{style}/{src.name}">'
                     f'<img src="icons/{style}/{src.name}" alt="" loading="lazy" width="72" height="72"><span>{ic["label"]}</span></button>')
    icon_html[style] = "".join(cells)

(OUT / "widgets").mkdir()
WID = [("widget-elsewhere-4x2", "Elsewhere · 4×2", True), ("widget-monogram-2x2", "Monogram · 2×2", False),
       ("widget-lockup-4x2", "Bergins · 4×2", True), ("widget-script-2x2", "Crafting harmony · 2×2", False)]
wcells = []
for wid, lab, wide in WID:
    src = D / "widgets" / f"{wid}.png"; shutil.copy(src, OUT / "widgets" / src.name)
    w, h = Image.open(src).size
    wcells.append(f'<div class="item{" wide" if wide else ""}"><img src="widgets/{src.name}" alt="{lab} widget" loading="lazy" width="{w}" height="{h}">'
                  f'<div class="label">{lab}</div><button class="save" type="button" data-file="Bergins-{wid}.png" data-src="widgets/{src.name}">Save</button></div>')

shutil.copy(ROOT / "brand/elements/paper-tile.jpg", OUT / "paper-tile.jpg")
Image.open(D / "preview.png").convert("RGB").resize((1280, 1000), Image.LANCZOS).save(OUT / "preview.jpg", quality=84)

html = (ROOT / "scripts/page-template.html").read_text()
F = ROOT / "brand/fonts"
rep = {"{{FONT_NA_REG}}": b64(F / "next-art-regular.woff2"), "{{FONT_NA_SEMI}}": b64(F / "next-art-semibold.woff2"),
       "{{FONT_TW}}": b64(F / "typewcond-regular.woff2"), "{{SVG_LOCKUP}}": svg("bergins-lockup"),
       "{{SVG_ELSEWHERE}}": svg("elsewhere-collection"), "{{WALLPAPERS}}": "".join(walls),
       "{{ICONS_GREEN}}": icon_html["green"], "{{ICONS_IVORY}}": icon_html["ivory"], "{{WIDGETS}}": "".join(wcells), "{{ZIPS}}": json.dumps(ZIPS),
       "Save all 43 green icons": "Save all green icons", "Save all 43 ivory icons": "Save all ivory icons",
       '<div class="grid">{{WIDGETS}}': '<div class="grid" style="grid-auto-flow:dense">{{WIDGETS}}'}
for k in ['<div class="grid">{{WIDGETS}}']:  # apply structural replacement before filling
    html = html.replace(k, rep.pop(k))
for k, v in rep.items(): html = html.replace(k, v)
assert "{{" not in html
(OUT / "index.html").write_text(html)

files = sorted(str(p.relative_to(OUT)) for p in OUT.rglob("*") if p.is_file() and p.name != "index.html")
(ROOT / "dist/.build/page-files.json").write_text(json.dumps(files))
tot = sum((OUT / f).stat().st_size for f in files)
print("files", len(files), "total MB", round(tot / 1e6, 1), "html KB", round((OUT / "index.html").stat().st_size / 1e3))
print({k: len(v) for k, v in ZIPS.items()})
