#!/usr/bin/env bash
# Download the official House of Bergins brand assets from houseofbergins.com into brand/.
# Fonts are fetched but not committed (they are licensed files).
set -euo pipefail
cd "$(dirname "$0")/../brand"
T=https://www.houseofbergins.com/wp-content/themes/house-of-bergins
UA="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36"
get() { mkdir -p "$(dirname "$2")"; curl -fsSL -m 60 -A "$UA" -o "$2" "$1" && echo "ok $2"; }

for f in next-art-regular next-art-semibold next-art-bold typewcond-regular mantreya; do
  get "$T/fonts/elsewhere/$f.woff2" "fonts/$f.woff2"
done
get "https://www.houseofbergins.com/wp-content/uploads/2026/05/Bergins-Logo-1.png" logo/Bergins-Logo-1.png
get "$T/assets/images/elsewhere/elsewhere-lockup.png" logo/elsewhere-lockup.png
get "$T/assets/images/elsewhere/hero1/brg-monogram-2x.png" logo/brg-monogram-2x.png
get "$T/assets/images/elsewhere/hero1/panel-texture.webp" elements/panel-texture.webp
for p in corsica kyoto muscat; do
  get "$T/assets/images/elsewhere/location/$p-location.jpg" "photos/$p-location.jpg"
done
