// House of Bergins — Android theme renderer.
// Renders wallpapers, icon pack PNGs, widget images and a preview from HTML,
// using only the official assets pulled from houseofbergins.com (brand/).
//   node scripts/render.cjs
const fs = require('fs');
const path = require('path');
const { chromium } = require(require.resolve('playwright', { paths: ['/opt/node-tools/node_modules', process.cwd()] }));

const ROOT = path.resolve(__dirname, '..');
const BRAND = path.join(ROOT, 'brand');
const DIST = path.join(ROOT, 'dist', 'android');
const BUILD = path.join(ROOT, 'dist', '.build');
const NM = path.join(ROOT, 'node_modules');
const url = (p) => 'file://' + p;

// ---------- brand tokens (sampled from the site + logo files) ----------
const C = { ink: '#231F20', green: '#557352', ivory: '#F5F1E8', white: '#FFFFFF', muted: '#7A756F', line: '#DDD8CC' };

const FONTS = `
@font-face{font-family:"NEXT ART";src:url(${url(BRAND + '/fonts/next-art-regular.woff2')});font-weight:400}
@font-face{font-family:"NEXT ART";src:url(${url(BRAND + '/fonts/next-art-semibold.woff2')});font-weight:600}
@font-face{font-family:"NEXT ART";src:url(${url(BRAND + '/fonts/next-art-bold.woff2')});font-weight:700}
@font-face{font-family:"Typewriter Condensed";src:url(${url(BRAND + '/fonts/typewcond-regular.woff2')})}
@font-face{font-family:"Mantreya";src:url(${url(BRAND + '/fonts/mantreya.woff2')})}`;

const BASE_CSS = `${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{background:transparent}
:root{--ink:${C.ink};--green:${C.green};--ivory:${C.ivory};--muted:${C.muted};--line:${C.line}}
.paper{background-color:#fff;background-image:url(${url(BRAND + '/elements/paper-tile.jpg')});background-size:900px 300px}
.paper-ivory{background-color:${C.ivory};background-image:url(${url(BRAND + '/elements/paper-tile.jpg')});background-size:900px 300px;background-blend-mode:multiply}
.paper-green{background-color:${C.green};background-image:url(${url(BRAND + '/elements/paper-tile.jpg')});background-size:900px 300px;background-blend-mode:multiply}
.paper-ink{background-color:${C.ink};background-image:url(${url(BRAND + '/elements/paper-tile.jpg')});background-size:900px 300px;background-blend-mode:multiply}
.svg svg{display:block;width:100%;height:auto}
.kicker{font-family:"NEXT ART";font-weight:600;text-transform:uppercase}
.tw{font-family:"Typewriter Condensed"}
.script{font-family:"Mantreya"}
`;

// ---------- vector logos (traced from the official PNGs) ----------
const vec = (name) => fs.readFileSync(path.join(BRAND, 'vector', name + '.svg'), 'utf8').replace(/ width="\d+" height="\d+"/, '');
const LOGO = {
  lockup: vec('bergins-lockup'),
  wordmark: vec('bergins-wordmark'),
  tagline: vec('crafting-harmony'),
  monogram: vec('brg-monogram'),
  elsewhere: vec('elsewhere-collection'),
};
const logo = (name, css) => `<div class="svg" style="${css}">${LOGO[name]}</div>`;

// ---------- wallpapers: 720x1600 CSS canvas (9:20) ----------
const W = 720, H = 1600;
// Oversized mirrored wordmark running down the right edge (the website banner's ghost element, turned upright)
const ghost = (color, opacity) => `
  <div class="svg" style="position:absolute;left:0;top:0;width:2500px;color:${color};opacity:${opacity};
       transform-origin:0 0;transform:translate(870px,2150px) rotate(90deg) scaleX(-1)">${LOGO.wordmark}</div>`;

const POSTCARDS = [
  { id: 'corsica', place: 'Corsica', coords: '42.04° N — 9.01° E', photo: 'corsica-location.jpg', n: '01' },
  { id: 'kyoto', place: 'Kyoto', coords: '35.01° N — 135.77° E', photo: 'kyoto-location.jpg', n: '02' },
  { id: 'muscat', place: 'Muscat', coords: '23.59° N — 58.38° E', photo: 'muscat-location.jpg', n: '03' },
];

const WALLPAPERS = {
  'bergins-paper-lock': `<div class="paper" style="position:absolute;inset:0">
      <div style="position:absolute;left:48px;bottom:132px;width:330px">
        <div class="tw" style="font-size:19px;color:var(--muted);margin-bottom:26px;letter-spacing:.3px">Unisex extrait de parfum — San Diego</div>
        ${logo('lockup', 'width:330px;color:var(--green)')}
      </div></div>`,
  'bergins-paper-home': `<div class="paper" style="position:absolute;inset:0">
      ${logo('lockup', 'position:absolute;left:180px;top:300px;width:360px;color:var(--green)')}
      <div class="tw" style="position:absolute;left:0;right:0;top:420px;text-align:center;font-size:18px;color:var(--muted)">Unisex extrait de parfum — San Diego</div>
    </div>`,
  'bergins-green-lock': `<div class="paper-green" style="position:absolute;inset:0">
      ${ghost(C.ivory, 0.08)}
      <div style="position:absolute;left:48px;bottom:132px;width:330px">
        <div class="tw" style="font-size:19px;color:var(--ivory);opacity:.75;margin-bottom:26px">The elsewhere collection</div>
        ${logo('lockup', 'width:330px;color:var(--ivory)')}
      </div></div>`,
  'bergins-green-home': `<div class="paper-green" style="position:absolute;inset:0">
      ${ghost(C.ivory, 0.08)}
      ${logo('lockup', 'position:absolute;left:180px;top:300px;width:360px;color:var(--ivory)')}
    </div>`,
  'bergins-elsewhere': `<div class="paper-ivory" style="position:absolute;inset:0">
      ${logo('monogram', 'position:absolute;left:323px;top:150px;width:74px;color:var(--green);opacity:.9')}
      ${logo('elsewhere', 'position:absolute;left:90px;top:560px;width:540px;color:var(--green)')}
      <div class="kicker" style="position:absolute;left:0;right:0;top:652px;text-align:center;font-size:13px;letter-spacing:7px;color:var(--green)">Extrait de parfum</div>
      <div style="position:absolute;left:300px;right:300px;top:700px;height:1px;background:var(--line)"></div>
    </div>`,
  'bergins-ink': `<div class="paper-ink" style="position:absolute;inset:0">
      ${logo('monogram', 'position:absolute;left:250px;top:520px;width:220px;color:var(--ivory)')}
      ${logo('tagline', 'position:absolute;left:265px;top:648px;width:190px;color:var(--green)')}
    </div>`,
};
for (const p of POSTCARDS) {
  WALLPAPERS['bergins-postcard-' + p.id] = `<div class="paper" style="position:absolute;inset:0">
      <div style="position:absolute;left:132px;top:300px;width:456px;background:#fff;padding:10px 10px 0;box-shadow:0 18px 50px rgba(35,31,32,.14)">
        <img src="${url(BRAND + '/photos/' + p.photo)}" style="display:block;width:436px;aspect-ratio:436/600;object-fit:cover">
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:16px 4px 18px">
          <div class="kicker" style="font-size:12px;letter-spacing:5px;color:var(--green)">N° ${p.n} — ${p.place}</div>
          <div class="tw" style="font-size:16px;color:var(--muted)">${p.coords}</div>
        </div>
      </div>
      ${logo('elsewhere', 'position:absolute;left:180px;top:1046px;width:360px;color:var(--green)')}
    </div>`;
}

// ---------- icon pack ----------
const lucide = (n) => fs.readFileSync(path.join(NM, 'lucide-static/icons', n + '.svg'), 'utf8').replace(/<!--.*?-->/s, '');
const simple = (n) => fs.readFileSync(path.join(NM, 'simple-icons/icons', n + '.svg'), 'utf8');
// [file id, label, glyph source, android component packages]
const ICONS = [
  ['phone', 'Phone', 'L:phone', ['com.google.android.dialer', 'com.samsung.android.dialer', 'com.android.dialer']],
  ['messages', 'Messages', 'L:message-circle', ['com.google.android.apps.messaging', 'com.samsung.android.messaging']],
  ['contacts', 'Contacts', 'L:contact', ['com.google.android.contacts', 'com.samsung.android.app.contacts']],
  ['camera', 'Camera', 'L:camera', ['com.google.android.GoogleCamera', 'com.sec.android.app.camera', 'com.android.camera2']],
  ['gallery', 'Photos', 'L:image', ['com.google.android.apps.photos', 'com.sec.android.gallery3d']],
  ['browser', 'Browser', 'L:globe', ['com.sec.android.app.sbrowser', 'org.mozilla.firefox']],
  ['chrome', 'Chrome', 'S:googlechrome', ['com.android.chrome']],
  ['playstore', 'Play Store', 'S:googleplay', ['com.android.vending']],
  ['settings', 'Settings', 'L:settings', ['com.android.settings']],
  ['clock', 'Clock', 'L:clock', ['com.google.android.deskclock', 'com.sec.android.app.clockpackage']],
  ['calendar', 'Calendar', 'L:calendar', ['com.google.android.calendar', 'com.samsung.android.calendar']],
  ['calculator', 'Calculator', 'L:calculator', ['com.google.android.calculator', 'com.sec.android.app.popupcalculator']],
  ['files', 'Files', 'L:folder', ['com.google.android.apps.nbu.files', 'com.sec.android.app.myfiles']],
  ['notes', 'Notes', 'L:notebook-pen', ['com.google.android.keep', 'com.samsung.android.app.notes']],
  ['weather', 'Weather', 'L:cloud-sun', ['com.sec.android.daemonapp', 'com.google.android.apps.weather']],
  ['maps', 'Maps', 'S:googlemaps', ['com.google.android.apps.maps']],
  ['gmail', 'Gmail', 'S:gmail', ['com.google.android.gm']],
  ['email', 'Email', 'L:mail', ['com.samsung.android.email.provider', 'com.microsoft.office.outlook']],
  ['google', 'Google', 'S:google', ['com.google.android.googlequicksearchbox']],
  ['drive', 'Drive', 'S:googledrive', ['com.google.android.apps.docs']],
  ['wallet', 'Wallet', 'L:wallet', ['com.google.android.apps.walletnfcrel', 'com.samsung.android.spay']],
  ['youtube', 'YouTube', 'S:youtube', ['com.google.android.youtube']],
  ['ytmusic', 'YT Music', 'S:youtubemusic', ['com.google.android.apps.youtube.music']],
  ['spotify', 'Spotify', 'S:spotify', ['com.spotify.music']],
  ['whatsapp', 'WhatsApp', 'S:whatsapp', ['com.whatsapp', 'com.whatsapp.w4b']],
  ['instagram', 'Instagram', 'S:instagram', ['com.instagram.android']],
  ['threads', 'Threads', 'S:threads', ['com.instagram.barcelona']],
  ['facebook', 'Facebook', 'S:facebook', ['com.facebook.katana']],
  ['messenger', 'Messenger', 'S:messenger', ['com.facebook.orca']],
  ['tiktok', 'TikTok', 'S:tiktok', ['com.zhiliaoapp.musically', 'com.ss.android.ugc.trill']],
  ['snapchat', 'Snapchat', 'S:snapchat', ['com.snapchat.android']],
  ['x', 'X', 'S:x', ['com.twitter.android']],
  ['telegram', 'Telegram', 'S:telegram', ['org.telegram.messenger']],
  ['pinterest', 'Pinterest', 'S:pinterest', ['com.pinterest']],
  ['netflix', 'Netflix', 'S:netflix', ['com.netflix.mediaclient']],
  ['shopify', 'Shopify', 'S:shopify', ['com.shopify.mobile']],
  ['amazon', 'Amazon', 'L:package', ['com.amazon.mShop.android.shopping']],
  ['uber', 'Uber', 'S:uber', ['com.ubercab']],
  ['paypal', 'PayPal', 'S:paypal', ['com.paypal.android.p2pmobile']],
  ['zoom', 'Zoom', 'S:zoom', ['us.zoom.videomeetings']],
  ['claude', 'Claude', 'S:claude', ['com.anthropic.claude']],
  ['music', 'Music', 'L:music', ['com.sec.android.app.music']],
  ['bergins', 'Bergins', 'M:monogram', []],
];

function glyph(src, color) {
  const [kind, name] = src.split(':');
  if (kind === 'M') return `<div class="svg" style="width:300px;color:${color}">${LOGO.monogram}</div>`;
  if (kind === 'L') {
    const s = lucide(name).replace(/stroke="currentColor"/, `stroke="${color}"`).replace(/stroke-width="2"/, 'stroke-width="1.5"')
      .replace(/width="24"/, 'width="236"').replace(/height="24"/, 'height="236"');
    return s;
  }
  return simple(name).replace('<svg ', `<svg width="200" height="200" fill="${color}" `);
}

const ICON_STYLES = {
  green: { bg: 'paper-green', fg: C.ivory, ring: 'none' },
  ivory: { bg: 'paper-ivory', fg: C.green, ring: `inset 0 0 0 4px ${C.line}` },
};
const iconHTML = (style, src) => {
  const s = ICON_STYLES[style];
  return `<div class="${s.bg}" style="width:512px;height:512px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:${s.ring};background-size:900px 300px">${glyph(src, s.fg)}</div>`;
};
const iconBackHTML = (style) => {
  const s = ICON_STYLES[style];
  return `<div class="${s.bg}" style="width:512px;height:512px;border-radius:50%;box-shadow:${s.ring};background-size:900px 300px"></div>`;
};

// ---------- widgets (for photo-widget apps / KWGT image layers) ----------
const WIDGETS = {
  'widget-lockup-4x2': [600, 280, `<div class="paper" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${logo('lockup', 'width:330px;color:var(--green)')}</div>`],
  'widget-elsewhere-4x2': [600, 280, `<div class="paper-green" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px">
      ${logo('elsewhere', 'width:470px;color:var(--ivory)')}
      <div class="kicker" style="font-size:12px;letter-spacing:7px;color:var(--ivory);opacity:.8">Extrait de parfum</div></div>`],
  'widget-monogram-2x2': [280, 280, `<div class="paper-green" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">${logo('monogram', 'width:150px;color:var(--ivory)')}</div>`],
  'widget-script-2x2': [280, 280, `<div class="paper-ivory" style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center">
      <div class="script" style="font-size:58px;line-height:1.05;color:var(--green);text-align:center">crafting<br>harmony</div></div>`],
};

// ---------- helpers ----------
async function shot(page, body, w, h, out, { dpr = 1, type = 'png', quality, omitBackground = false } = {}) {
  await page.setViewportSize({ width: w, height: h });
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}</style></head>
    <body style="width:${w}px;height:${h}px;position:relative;overflow:hidden">${body}</body></html>`;
  const f = path.join(BUILD, 'page.html');
  fs.writeFileSync(f, html);
  await page.goto(url(f));
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(60);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await page.screenshot({ path: out, type, quality, omitBackground, clip: { x: 0, y: 0, width: w, height: h } });
}

(async () => {
  fs.mkdirSync(BUILD, { recursive: true });
  const browser = await chromium.launch();
  const ctx = {};
  const pageFor = async (dpr) => (ctx[dpr] ||= await (await browser.newContext({ deviceScaleFactor: dpr })).newPage());

  // Wallpapers: QHD+ (1440x3200) and FHD+ (1080x2400)
  for (const [res, dpr] of [['1440x3200', 2], ['1080x2400', 1.5]]) {
    const page = await pageFor(dpr);
    for (const [id, body] of Object.entries(WALLPAPERS)) {
      await shot(page, body, W, H, path.join(DIST, 'wallpapers', res, id + '.jpg'), { type: 'jpeg', quality: 94 });
    }
    console.log('wallpapers', res, Object.keys(WALLPAPERS).length);
  }

  // Icons: 512px PNG, transparent corners
  const ipage = await pageFor(1);
  for (const style of Object.keys(ICON_STYLES)) {
    for (const [id, , src] of ICONS) {
      await shot(ipage, iconHTML(style, src), 512, 512, path.join(DIST, 'icons', style, id + '.png'), { omitBackground: true });
    }
    await shot(ipage, iconBackHTML(style), 512, 512, path.join(DIST, 'icons', style, '_iconback.png'), { omitBackground: true });
    console.log('icons', style, ICONS.length);
  }

  // Widgets
  const wpage = await pageFor(2);
  for (const [id, [w, h, body]] of Object.entries(WIDGETS)) {
    await shot(wpage, body, w, h, path.join(DIST, 'widgets', id + '.png'));
  }
  console.log('widgets', Object.keys(WIDGETS).length);

  await browser.close();
  fs.writeFileSync(path.join(BUILD, 'icons.json'), JSON.stringify(ICONS.map(([id, label, , pkgs]) => ({ id, label, pkgs }))));
})().catch((e) => { console.error(e); process.exit(1); });
