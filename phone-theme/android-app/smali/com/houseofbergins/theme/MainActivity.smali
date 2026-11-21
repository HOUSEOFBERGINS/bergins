.class public Lcom/houseofbergins/theme/MainActivity;
.super Landroid/app/Activity;
.source "MainActivity.smali"

# Bergins Theme: one screen with an INSTALL button.
# Tap = set home + lock wallpapers, then ask Nova Launcher to apply the Bergins icon pack
# (or open Nova on the Play Store if it is not installed yet).

.implements Landroid/view/View$OnClickListener;

.field private status:Landroid/widget/TextView;


.method public constructor <init>()V
    .locals 0
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V
    return-void
.end method


# dp -> px
.method private dp(I)I
    .locals 2
    invoke-virtual {p0}, Lcom/houseofbergins/theme/MainActivity;->getResources()Landroid/content/res/Resources;
    move-result-object v0
    invoke-virtual {v0}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;
    move-result-object v0
    iget v0, v0, Landroid/util/DisplayMetrics;->density:F
    int-to-float v1, p1
    mul-float/2addr v1, v0
    const/high16 v0, 0x3f000000    # 0.5f
    add-float/2addr v1, v0
    float-to-int v1, v1
    return v1
.end method


.method protected onCreate(Landroid/os/Bundle;)V
    .locals 8

    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    # root column, ivory, centred
    new-instance v0, Landroid/widget/LinearLayout;
    invoke-direct {v0, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V
    const/4 v1, 0x1
    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setOrientation(I)V
    const/16 v1, 0x11
    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setGravity(I)V
    const v1, -0xa0e18    # #F5F1E8 ivory
    invoke-virtual {v0, v1}, Landroid/view/View;->setBackgroundColor(I)V
    const/16 v1, 0x20
    invoke-direct {p0, v1}, Lcom/houseofbergins/theme/MainActivity;->dp(I)I
    move-result v1
    invoke-virtual {v0, v1, v1, v1, v1}, Landroid/view/View;->setPadding(IIII)V

    # brand typefaces from assets
    invoke-virtual {p0}, Lcom/houseofbergins/theme/MainActivity;->getAssets()Landroid/content/res/AssetManager;
    move-result-object v1
    const-string v2, "nextart.ttf"
    invoke-static {v1, v2}, Landroid/graphics/Typeface;->createFromAsset(Landroid/content/res/AssetManager;Ljava/lang/String;)Landroid/graphics/Typeface;
    move-result-object v2
    const-string v3, "typewriter.ttf"
    invoke-static {v1, v3}, Landroid/graphics/Typeface;->createFromAsset(Landroid/content/res/AssetManager;Ljava/lang/String;)Landroid/graphics/Typeface;
    move-result-object v3

    # BERGINS lockup image
    new-instance v4, Landroid/widget/ImageView;
    invoke-direct {v4, p0}, Landroid/widget/ImageView;-><init>(Landroid/content/Context;)V
    :try_start_0
    const-string v5, "lockup.png"
    invoke-virtual {v1, v5}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;)Ljava/io/InputStream;
    move-result-object v5
    invoke-static {v5}, Landroid/graphics/BitmapFactory;->decodeStream(Ljava/io/InputStream;)Landroid/graphics/Bitmap;
    move-result-object v5
    invoke-virtual {v4, v5}, Landroid/widget/ImageView;->setImageBitmap(Landroid/graphics/Bitmap;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0
    :catch_0
    const/4 v5, 0x1
    invoke-virtual {v4, v5}, Landroid/widget/ImageView;->setAdjustViewBounds(Z)V
    new-instance v5, Landroid/widget/LinearLayout$LayoutParams;
    const/16 v6, 0xf0    # 240dp
    invoke-direct {p0, v6}, Lcom/houseofbergins/theme/MainActivity;->dp(I)I
    move-result v6
    const/4 v7, -0x2    # WRAP_CONTENT
    invoke-direct {v5, v6, v7}, Landroid/widget/LinearLayout$LayoutParams;-><init>(II)V
    invoke-virtual {v0, v4, v5}, Landroid/view/ViewGroup;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    # kicker: ANDROID THEME
    new-instance v4, Landroid/widget/TextView;
    invoke-direct {v4, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V
    const-string v5, "ANDROID THEME"
    invoke-virtual {v4, v5}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V
    invoke-virtual {v4, v2}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;)V
    const v5, -0xaa8cae    # #557352 green
    invoke-virtual {v4, v5}, Landroid/widget/TextView;->setTextColor(I)V
    const/high16 v5, 0x41400000    # 12f
    invoke-virtual {v4, v5}, Landroid/widget/TextView;->setTextSize(F)V
    const v5, 0x3ecccccd    # 0.4f
    invoke-virtual {v4, v5}, Landroid/widget/TextView;->setLetterSpacing(F)V
    const/16 v5, 0x11
    invoke-virtual {v4, v5}, Landroid/widget/TextView;->setGravity(I)V
    const/16 v5, 0x10
    invoke-direct {p0, v5}, Lcom/houseofbergins/theme/MainActivity;->dp(I)I
    move-result v5
    const/16 v6, 0x28
    invoke-direct {p0, v6}, Lcom/houseofbergins/theme/MainActivity;->dp(I)I
    move-result v6
    const/4 v7, 0x0
    invoke-virtual {v4, v7, v5, v7, v6}, Landroid/view/View;->setPadding(IIII)V
    invoke-virtual {v0, v4}, Landroid/view/ViewGroup;->addView(Landroid/view/View;)V

    # INSTALL button: green pill, ivory NEXT ART text
    new-instance v4, Landroid/widget/Button;
    invoke-direct {v4, p0}, Landroid/widget/Button;-><init>(Landroid/content/Context;)V
    const-string v5, "INSTALL"
    invoke-virtual {v4, v5}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V
    invoke-virtual {v4, v2}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;)V
    const v5, -0xa0e18
    invoke-virtual {v4, v5}, Landroid/widget/TextView;->setTextColor(I)V
    const/high16 v5, 0x41800000    # 16f
    invoke-virtual {v4, v5}, Landroid/widget/TextView;->setTextSize(F)V
    const v5, 0x3e99999a    # 0.3f
    invoke-virtual {v4, v5}, Landroid/widget/TextView;->setLetterSpacing(F)V
    new-instance v5, Landroid/graphics/drawable/GradientDrawable;
    invoke-direct {v5}, Landroid/graphics/drawable/GradientDrawable;-><init>()V
    const v6, -0xaa8cae
    invoke-virtual {v5, v6}, Landroid/graphics/drawable/GradientDrawable;->setColor(I)V
    const/16 v6, 0x20
    invoke-direct {p0, v6}, Lcom/houseofbergins/theme/MainActivity;->dp(I)I
    move-result v6
    int-to-float v6, v6
    invoke-virtual {v5, v6}, Landroid/graphics/drawable/GradientDrawable;->setCornerRadius(F)V
    invoke-virtual {v4, v5}, Landroid/view/View;->setBackground(Landroid/graphics/drawable/Drawable;)V
    invoke-virtual {v4, p0}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V
    new-instance v5, Landroid/widget/LinearLayout$LayoutParams;
    const/16 v6, 0x104    # 260dp
    invoke-direct {p0, v6}, Lcom/houseofbergins/theme/MainActivity;->dp(I)I
    move-result v6
    const/16 v7, 0x40    # 64dp
    invoke-direct {p0, v7}, Lcom/houseofbergins/theme/MainActivity;->dp(I)I
    move-result v7
    invoke-direct {v5, v6, v7}, Landroid/widget/LinearLayout$LayoutParams;-><init>(II)V
    invoke-virtual {v0, v4, v5}, Landroid/view/ViewGroup;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    # status line (Typewriter Condensed, muted)
    new-instance v4, Landroid/widget/TextView;
    invoke-direct {v4, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V
    const-string v5, "One tap sets the Bergins wallpapers and app icons."
    invoke-virtual {v4, v5}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V
    invoke-virtual {v4, v3}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;)V
    const v5, -0x91969d    # #6E6963 muted
    invoke-virtual {v4, v5}, Landroid/widget/TextView;->setTextColor(I)V
    const/high16 v5, 0x41800000    # 16f
    invoke-virtual {v4, v5}, Landroid/widget/TextView;->setTextSize(F)V
    const/16 v5, 0x11
    invoke-virtual {v4, v5}, Landroid/widget/TextView;->setGravity(I)V
    const/16 v5, 0x1c
    invoke-direct {p0, v5}, Lcom/houseofbergins/theme/MainActivity;->dp(I)I
    move-result v5
    const/4 v6, 0x0
    invoke-virtual {v4, v6, v5, v6, v6}, Landroid/view/View;->setPadding(IIII)V
    iput-object v4, p0, Lcom/houseofbergins/theme/MainActivity;->status:Landroid/widget/TextView;
    new-instance v5, Landroid/widget/LinearLayout$LayoutParams;
    const/4 v6, -0x1    # MATCH_PARENT
    const/4 v7, -0x2    # WRAP_CONTENT
    invoke-direct {v5, v6, v7}, Landroid/widget/LinearLayout$LayoutParams;-><init>(II)V
    invoke-virtual {v0, v4, v5}, Landroid/view/ViewGroup;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    invoke-virtual {p0, v0}, Lcom/houseofbergins/theme/MainActivity;->setContentView(Landroid/view/View;)V

    # ivory system bars with dark icons
    invoke-virtual {p0}, Lcom/houseofbergins/theme/MainActivity;->getWindow()Landroid/view/Window;
    move-result-object v1
    const v2, -0xa0e18
    invoke-virtual {v1, v2}, Landroid/view/Window;->setStatusBarColor(I)V
    invoke-virtual {v1, v2}, Landroid/view/Window;->setNavigationBarColor(I)V
    invoke-virtual {v1}, Landroid/view/Window;->getDecorView()Landroid/view/View;
    move-result-object v1
    const/16 v2, 0x2010    # LIGHT_STATUS_BAR | LIGHT_NAVIGATION_BAR
    invoke-virtual {v1, v2}, Landroid/view/View;->setSystemUiVisibility(I)V

    return-void
.end method


.method public onClick(Landroid/view/View;)V
    .locals 8

    # 1. wallpapers: home first, then lock
    :try_start_0
    invoke-static {p0}, Landroid/app/WallpaperManager;->getInstance(Landroid/content/Context;)Landroid/app/WallpaperManager;
    move-result-object v1
    invoke-virtual {p0}, Lcom/houseofbergins/theme/MainActivity;->getAssets()Landroid/content/res/AssetManager;
    move-result-object v2
    const-string v3, "wall_home.jpg"
    invoke-virtual {v2, v3}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;)Ljava/io/InputStream;
    move-result-object v3
    const/4 v4, 0x0
    const/4 v5, 0x1
    const/4 v6, 0x1    # FLAG_SYSTEM
    invoke-virtual {v1, v3, v4, v5, v6}, Landroid/app/WallpaperManager;->setStream(Ljava/io/InputStream;Landroid/graphics/Rect;ZI)I
    invoke-virtual {v3}, Ljava/io/InputStream;->close()V
    const-string v3, "wall_lock.jpg"
    invoke-virtual {v2, v3}, Landroid/content/res/AssetManager;->open(Ljava/lang/String;)Ljava/io/InputStream;
    move-result-object v3
    const/4 v6, 0x2    # FLAG_LOCK
    invoke-virtual {v1, v3, v4, v5, v6}, Landroid/app/WallpaperManager;->setStream(Ljava/io/InputStream;Landroid/graphics/Rect;ZI)I
    invoke-virtual {v3}, Ljava/io/InputStream;->close()V
    const-string v0, "Wallpapers set. "
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0
    goto :icons

    :catch_0
    const-string v0, "The wallpaper couldn't be set. "

    # 2. icons through Nova Launcher
    :icons
    invoke-virtual {p0}, Lcom/houseofbergins/theme/MainActivity;->getPackageManager()Landroid/content/pm/PackageManager;
    move-result-object v1
    const-string v2, "com.teslacoilsw.launcher"
    invoke-virtual {v1, v2}, Landroid/content/pm/PackageManager;->getLaunchIntentForPackage(Ljava/lang/String;)Landroid/content/Intent;
    move-result-object v1
    if-eqz v1, :no_nova

    new-instance v1, Landroid/content/Intent;
    const-string v3, "com.teslacoilsw.launcher.APPLY_ICON_THEME"
    invoke-direct {v1, v3}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V
    invoke-virtual {v1, v2}, Landroid/content/Intent;->setPackage(Ljava/lang/String;)Landroid/content/Intent;
    const-string v3, "com.teslacoilsw.launcher.extra.ICON_THEME_TYPE"
    const-string v4, "GO"
    invoke-virtual {v1, v3, v4}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;
    const-string v3, "com.teslacoilsw.launcher.extra.ICON_THEME_PACKAGE"
    invoke-virtual {p0}, Lcom/houseofbergins/theme/MainActivity;->getPackageName()Ljava/lang/String;
    move-result-object v4
    invoke-virtual {v1, v3, v4}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;
    const/high16 v3, 0x10000000    # FLAG_ACTIVITY_NEW_TASK
    invoke-virtual {v1, v3}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;
    :try_start_1
    invoke-virtual {p0, v1}, Lcom/houseofbergins/theme/MainActivity;->startActivity(Landroid/content/Intent;)V
    const-string v3, "Nova will ask to use the Bergins icons. Tap OK."
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_1
    goto :show

    :catch_1
    const-string v3, "To finish, open Nova Settings, then Look & feel, Icon style, Icon pack, and pick Bergins Theme."
    goto :show

    :no_nova
    const-string v3, "For the icons, install Nova Launcher (opening now), make it your home screen, then open Bergins Theme and tap Install again."
    const-string v4, "android.intent.action.VIEW"
    new-instance v1, Landroid/content/Intent;
    const-string v5, "market://details?id=com.teslacoilsw.launcher"
    invoke-static {v5}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;
    move-result-object v5
    invoke-direct {v1, v4, v5}, Landroid/content/Intent;-><init>(Ljava/lang/String;Landroid/net/Uri;)V
    :try_start_2
    invoke-virtual {p0, v1}, Lcom/houseofbergins/theme/MainActivity;->startActivity(Landroid/content/Intent;)V
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_2
    goto :show

    :catch_2
    new-instance v1, Landroid/content/Intent;
    const-string v5, "https://play.google.com/store/apps/details?id=com.teslacoilsw.launcher"
    invoke-static {v5}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;
    move-result-object v5
    invoke-direct {v1, v4, v5}, Landroid/content/Intent;-><init>(Ljava/lang/String;Landroid/net/Uri;)V
    :try_start_3
    invoke-virtual {p0, v1}, Lcom/houseofbergins/theme/MainActivity;->startActivity(Landroid/content/Intent;)V
    :try_end_3
    .catch Ljava/lang/Exception; {:try_start_3 .. :try_end_3} :catch_3
    goto :show

    :catch_3
    const-string v3, "For the icons, install Nova Launcher from the Play Store, make it your home screen, then tap Install again."

    # 3. show the result
    :show
    new-instance v1, Ljava/lang/StringBuilder;
    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V
    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;
    move-result-object v1
    iget-object v2, p0, Lcom/houseofbergins/theme/MainActivity;->status:Landroid/widget/TextView;
    invoke-virtual {v2, v1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V
    return-void
.end method
