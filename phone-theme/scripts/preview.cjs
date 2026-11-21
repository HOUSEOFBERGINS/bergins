// Renders dist/android/preview.png: the theme shown on three Android screens.
const fs = require('fs');
const path = require('path');
const { chromium } = require(require.resolve('playwright', { paths: ['/opt/node-tools/node_modules', process.cwd()] }));

const ROOT = path.resolve(__dirname, '..');
const BRAND = path.join(ROOT, 'brand');
const DIST = path.join(ROOT, 'dist', 'android');
const url = (p) => 'file://' + p;
const wp = (id) => url(path.join(DIST, 'wallpapers', '1080x2400', id + '.jpg'));
const icon = (style, id) => url(path.join(DIST, 'icons', style, id + '.png'));
const widget = (id) => url(path.join(DIST, 'widgets', id + '.png'));

const FONTS = `
@font-face{font-family:"NEXT ART";src:url(${url(BRAND + '/fonts/next-art-regular.woff2')});font-weight:400}
@font-face{font-family:"NEXT ART";src:url(${url(BRAND + '/fonts/next-art-semibold.woff2')});font-weight:600}
@font-face{font-family:"Typewriter Condensed";src:url(${url(BRAND + '/fonts/typewcond-regular.woff2')})}`;

const status = (color) => `<div style="position:absolute;top:14px;left:26px;right:26px;display:flex;justify-content:space-between;
  font:600 13px 'NEXT ART';color:${color};letter-spacing:.5px"><span>9:41</span><span style="display:flex;gap:6px;align-items:center">
  <i style="width:14px;height:9px;border:1.5px solid ${color};border-radius:2px;display:block;position:relative"><i style="position:absolute;inset:1px 3px 1px 1px;background:${color};display:block"></i></i></span></div>`;

const grid = (style, ids, labelColor) => ids.map((id) => `<div style="display:flex;flex-direction:column;align-items:center;gap:6px">
  <img src="${icon(style, id)}" style="width:52px;height:52px">
  <span style="font:400 10px 'NEXT ART';color:${labelColor};letter-spacing:.3px">${LABEL[id]}</span></div>`).join('');

const LABEL = { phone: 'Phone', messages: 'Messages', camera: 'Camera', chrome: 'Chrome', gallery: 'Photos', calendar: 'Calendar', maps: 'Maps', settings: 'Settings',
  instagram: 'Instagram', whatsapp: 'WhatsApp', spotify: 'Spotify', gmail: 'Gmail', tiktok: 'TikTok', shopify: 'Shopify', youtube: 'YouTube', bergins: 'Bergins',
  notes: 'Notes', weather: 'Weather', clock: 'Clock', playstore: 'Play Store' };

const phone = (bg, inner) => `<div style="width:360px;height:800px;border-radius:46px;background:#231F20;padding:9px;box-shadow:0 30px 70px rgba(35,31,32,.22)">
  <div style="position:relative;width:342px;height:782px;border-radius:38px;overflow:hidden;background:url(${bg}) center/cover">
    <div style="position:absolute;top:12px;left:50%;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:#111"></div>
    ${inner}
    <div style="position:absolute;bottom:10px;left:50%;width:110px;margin-left:-55px;height:4px;border-radius:2px;background:rgba(35,31,32,.35)"></div>
  </div></div>`;

const lock = phone(wp('bergins-green-lock'), `${status('#F5F1E8')}
  <div style="position:absolute;top:96px;left:0;right:0;text-align:center;color:#F5F1E8">
    <div style="font:400 92px/1 'NEXT ART';letter-spacing:-2px">09:41</div>
    <div style="font:400 18px 'Typewriter Condensed';margin-top:12px;opacity:.85">Saturday, 21 November</div></div>`);

const home1 = phone(wp('bergins-paper-home'), `${status('#231F20')}
  <img src="${widget('widget-elsewhere-4x2')}" style="position:absolute;top:300px;left:22px;width:298px;border-radius:22px">
  <div style="position:absolute;top:470px;left:16px;right:16px;display:grid;grid-template-columns:repeat(4,1fr);row-gap:16px">
    ${grid('green', ['instagram', 'whatsapp', 'spotify', 'shopify', 'gmail', 'tiktok', 'youtube', 'bergins'], '#231F20')}</div>
  <div style="position:absolute;bottom:40px;left:16px;right:16px;display:grid;grid-template-columns:repeat(4,1fr)">
    ${grid('green', ['phone', 'messages', 'chrome', 'camera'], 'transparent')}</div>`);

const home2 = phone(wp('bergins-green-home'), `${status('#F5F1E8')}
  <div style="position:absolute;top:250px;left:16px;right:16px;display:grid;grid-template-columns:repeat(4,1fr);row-gap:16px">
    ${grid('ivory', ['calendar', 'clock', 'weather', 'notes', 'maps', 'gallery', 'playstore', 'settings'], '#F5F1E8')}</div>
  <img src="${widget('widget-monogram-2x2')}" style="position:absolute;top:452px;left:28px;width:134px;border-radius:22px;box-shadow:0 0 0 1px rgba(245,241,232,.25)">
  <img src="${widget('widget-script-2x2')}" style="position:absolute;top:452px;left:180px;width:134px;border-radius:22px">
  <div style="position:absolute;bottom:40px;left:16px;right:16px;display:grid;grid-template-columns:repeat(4,1fr)">
    ${grid('ivory', ['phone', 'messages', 'chrome', 'camera'], 'transparent')}</div>`);

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}*{margin:0;box-sizing:border-box}
  body{width:1280px;height:1000px;background:#fff url(${url(BRAND + '/elements/paper-tile.jpg')});background-size:900px 300px;font-family:'NEXT ART'}</style></head>
  <body><div style="position:absolute;top:44px;left:0;right:0;text-align:center">
    <div style="font:600 13px 'NEXT ART';letter-spacing:7px;color:#557352">HOUSE OF BERGINS — ANDROID THEME</div></div>
  <div style="position:absolute;top:110px;left:0;right:0;display:flex;justify-content:center;gap:48px">${lock}${home1}${home2}</div></body></html>`;

(async () => {
  const f = path.join(ROOT, 'dist', '.build', 'preview.html');
  fs.writeFileSync(f, html);
  const b = await chromium.launch();
  const p = await (await b.newContext({ deviceScaleFactor: 2, viewport: { width: 1280, height: 1000 } })).newPage();
  await p.goto(url(f));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(200);
  await p.screenshot({ path: path.join(DIST, 'preview.png') });
  await b.close();
  console.log('preview ok');
})().catch((e) => { console.error(e); process.exit(1); });
