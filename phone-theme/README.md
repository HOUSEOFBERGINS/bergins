# House of Bergins phone theme

Android wallpapers, an icon pack (green and ivory), widget images and a preview, generated
from the official brand assets on houseofbergins.com.

- Finished files: [`dist/android/`](dist/android/) — start with [`HOW-TO-INSTALL.md`](dist/android/HOW-TO-INSTALL.md) and `preview.png`.
- Brand source: `brand/` (logos, paper texture, photos from the site; `brand/vector/` holds SVG traces of the logos).

## Rebuild

```bash
bash scripts/fetch-brand.sh      # official fonts + logos + texture + photos from the site
npm install                      # icon glyphs (lucide-static, simple-icons)
python3 scripts/vectorize.py     # logo PNGs -> crisp recolourable SVGs (needs: pip install potracer)
python3 scripts/paper_tile.py    # seamless paper tile from the site's panel texture
node scripts/render.cjs          # wallpapers, icons, widgets  -> dist/android/
node scripts/preview.cjs         # dist/android/preview.png
```

Rendering uses Playwright's Chromium. Wallpapers are drawn on a 720×1600 canvas and exported at
2× (1440×3200) and 1.5× (1080×2400). Icons are 512×512 PNGs, compressed with `pngquant`.

Brand tokens: green `#557352` (sampled from the logo), ink `#231F20`, ivory `#F5F1E8`,
muted `#7A756F`, line `#DDD8CC`. Fonts: NEXT ART (headlines/labels), Typewriter Condensed
(sub-lines), Mantreya (one short script line).

## Android app (one-tap Install)

`android-app/` is the Bergins Theme app (Apktool project, hand-written smali). Before building, convert the
brand fonts into `android-app/assets/` (they are licensed files and are not committed):

```bash
python3 -c "from fontTools.ttLib import TTFont as F
for s,d in [('brand/fonts/next-art-semibold.woff2','nextart.ttf'),('brand/fonts/typewcond-regular.woff2','typewriter.ttf')]:
    f=F(s); f.flavor=None; f.save('android-app/assets/'+d)"
python3 scripts/appfilter.py
java -jar apktool.jar b android-app -o bergins-theme-unsigned.apk
java -jar uber-apk-signer.jar -a bergins-theme-unsigned.apk -o signed
```
