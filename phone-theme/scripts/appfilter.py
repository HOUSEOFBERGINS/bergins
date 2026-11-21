"""Write the icon-pack map (appfilter.xml + drawable.xml) for the Bergins theme app.
Components are the launcher activities of each app (Samsung One UI and Google versions)."""
from pathlib import Path
A = Path(__file__).resolve().parent.parent / "android-app"
MAP = {
 "phone": ["com.samsung.android.dialer/com.samsung.android.dialer.DialtactsActivity",
           "com.google.android.dialer/com.google.android.dialer.extensions.GoogleDialtactsActivity",
           "com.android.dialer/com.android.dialer.main.impl.MainActivity"],
 "messages": ["com.samsung.android.messaging/com.android.mms.ui.ConversationComposer",
              "com.google.android.apps.messaging/com.google.android.apps.messaging.ui.ConversationListActivity"],
 "contacts": ["com.samsung.android.app.contacts/com.samsung.android.contacts.contactslist.PeopleActivity",
              "com.google.android.contacts/com.android.contacts.activities.PeopleActivity"],
 "camera": ["com.sec.android.app.camera/com.sec.android.app.camera.Camera",
            "com.google.android.GoogleCamera/com.android.camera.CameraLauncher"],
 "gallery": ["com.sec.android.gallery3d/com.samsung.android.gallery.app.activity.GalleryActivity",
             "com.sec.android.gallery3d/com.sec.android.gallery3d.app.GalleryActivity",
             "com.google.android.apps.photos/com.google.android.apps.photos.home.HomeActivity"],
 "browser": ["com.sec.android.app.sbrowser/com.sec.android.app.sbrowser.SBrowserMainActivity",
             "org.mozilla.firefox/org.mozilla.firefox.App"],
 "chrome": ["com.android.chrome/com.google.android.apps.chrome.Main"],
 "playstore": ["com.android.vending/com.android.vending.AssetBrowserActivity"],
 "settings": ["com.android.settings/com.android.settings.Settings"],
 "clock": ["com.sec.android.app.clockpackage/com.sec.android.app.clockpackage.ClockPackage",
           "com.google.android.deskclock/com.android.deskclock.DeskClock"],
 "calendar": ["com.samsung.android.calendar/com.samsung.android.app.calendar.activity.MainActivity",
              "com.google.android.calendar/com.android.calendar.AllInOneActivity"],
 "calculator": ["com.sec.android.app.popupcalculator/com.sec.android.app.popupcalculator.Calculator",
                "com.google.android.calculator/com.android.calculator2.Calculator"],
 "files": ["com.sec.android.app.myfiles/com.sec.android.app.myfiles.external.ui.MainActivity",
           "com.google.android.apps.nbu.files/com.google.android.apps.nbu.files.home.HomeActivity"],
 "notes": ["com.samsung.android.app.notes/com.samsung.android.app.notes.memolist.MemoListActivity",
           "com.google.android.keep/com.google.android.keep.activities.BrowseActivity"],
 "weather": ["com.sec.android.daemonapp/com.sec.android.daemonapp.app.MainActivity"],
 "maps": ["com.google.android.apps.maps/com.google.android.maps.MapsActivity"],
 "gmail": ["com.google.android.gm/com.google.android.gm.ConversationListActivityGmail"],
 "email": ["com.samsung.android.email.provider/com.samsung.android.email.ui.messageslist.MessageListXL",
           "com.microsoft.office.outlook/com.microsoft.office.outlook.MainActivity"],
 "google": ["com.google.android.googlequicksearchbox/com.google.android.googlequicksearchbox.SearchActivity"],
 "drive": ["com.google.android.apps.docs/com.google.android.apps.docs.app.NewMainProxyActivity"],
 "wallet": ["com.google.android.apps.walletnfcrel/com.google.commerce.tapandpay.android.wallet.WalletActivity",
            "com.samsung.android.spay/com.samsung.android.spay.common.ui.SpayMainActivity"],
 "youtube": ["com.google.android.youtube/com.google.android.youtube.app.honeycomb.Shell$HomeActivity"],
 "ytmusic": ["com.google.android.apps.youtube.music/com.google.android.apps.youtube.music.activities.MusicActivity"],
 "spotify": ["com.spotify.music/com.spotify.music.MainActivity"],
 "whatsapp": ["com.whatsapp/com.whatsapp.Main", "com.whatsapp.w4b/com.whatsapp.Main"],
 "instagram": ["com.instagram.android/com.instagram.mainactivity.LauncherActivity",
               "com.instagram.android/com.instagram.android.activity.MainTabActivity"],
 "threads": ["com.instagram.barcelona/com.instagram.barcelona.mainactivity.BarcelonaActivity"],
 "facebook": ["com.facebook.katana/com.facebook.katana.LoginActivity"],
 "messenger": ["com.facebook.orca/com.facebook.orca.auth.StartScreenActivity"],
 "tiktok": ["com.zhiliaoapp.musically/com.ss.android.ugc.aweme.splash.SplashActivity",
            "com.ss.android.ugc.trill/com.ss.android.ugc.aweme.splash.SplashActivity"],
 "snapchat": ["com.snapchat.android/com.snapchat.android.LandingPageActivity"],
 "x": ["com.twitter.android/com.twitter.android.StartActivity"],
 "telegram": ["org.telegram.messenger/org.telegram.ui.LaunchActivity"],
 "pinterest": ["com.pinterest/com.pinterest.activity.PinterestActivity"],
 "netflix": ["com.netflix.mediaclient/com.netflix.mediaclient.ui.launch.UIWebViewActivity"],
 "shopify": ["com.shopify.mobile/com.shopify.mobile.lib.app.MainActivity"],
 "amazon": ["com.amazon.mShop.android.shopping/com.amazon.mShop.home.HomeActivity"],
 "uber": ["com.ubercab/com.ubercab.presidio.app.core.root.RootActivity"],
 "paypal": ["com.paypal.android.p2pmobile/com.paypal.android.p2pmobile.startup.activities.StartupActivity"],
 "zoom": ["us.zoom.videomeetings/com.zipow.videobox.LauncherActivity"],
 "claude": ["com.anthropic.claude/com.anthropic.claude.mainactivity.MainActivity"],
 "music": ["com.sec.android.app.music/com.sec.android.app.music.list.activity.MpMainTabActivity"],
 "bergins": [],
}
lines = ['<?xml version="1.0" encoding="utf-8"?>', "<resources>",
         '    <iconback img1="iconback" />', '    <scale factor="0.62" />']
for d, comps in MAP.items():
    for c in comps:
        lines.append(f'    <item component="ComponentInfo{{{c}}}" drawable="{d}" />')
lines.append("</resources>")
xml = "\n".join(lines) + "\n"
(A / "res/xml/appfilter.xml").write_text(xml); (A / "assets/appfilter.xml").write_text(xml)
dr = ['<?xml version="1.0" encoding="utf-8"?>', "<resources>", "    <version>1</version>", '    <category title="Bergins" />']
dr += [f'    <item drawable="{d}" />' for d in MAP] + ["</resources>"]
(A / "res/xml/drawable.xml").write_text("\n".join(dr) + "\n"); (A / "assets/drawable.xml").write_text("\n".join(dr) + "\n")
missing = [d for d in MAP if not (A / f"res/drawable-nodpi/{d}.png").exists()]
print("components", sum(len(v) for v in MAP.values()), "drawables", len(MAP), "missing", missing)
