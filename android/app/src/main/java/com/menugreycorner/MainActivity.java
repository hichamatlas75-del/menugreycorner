package com.menugreycorner;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.messaging.FirebaseMessaging;

public class MainActivity extends AppCompatActivity {

    private static final String TAG              = "GC-MainActivity";
    static  final String        ALERT_CHANNEL_ID = "waiter_alerts";
    public static volatile String latestFcmToken = null;

    private WebView myWebView;

    // ─────────────────────────────────────────────────────────────────────────
    // onCreate
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        } else {
            getWindow().addFlags(
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED
                    | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
                    | WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD);
        }
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        createAlertNotificationChannel();
        requestNotificationPermission();
        requestBatteryOptimizationExclusion();

        // ── FCM : abonnement topic + récupération token ───────────────────
        initFcm();

        startWaiterService();

        if (WaiterForegroundService.sharedWebView == null) {
            WaiterForegroundService.sharedWebView =
                    buildWebView(getApplicationContext());
            WaiterForegroundService.sharedWebView.loadUrl(
                    "https://menugreycorner.pages.dev/waiter.html");
        }

        myWebView = WaiterForegroundService.sharedWebView;
        attachWebViewToLayout();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        wakeScreen(this);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true);
            setTurnScreenOn(true);
        }
        if (myWebView != null) {
            myWebView.onResume();
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // FCM — Abonnement topic + log token
    // ─────────────────────────────────────────────────────────────────────────

    private void initFcm() {
        // Abonnement au topic "waiters" : tous les appareils inscrits à ce
        // topic reçoivent les messages envoyés par la Cloud Function.
        FirebaseMessaging.getInstance()
                .subscribeToTopic("waiters")
                .addOnSuccessListener(aVoid ->
                        Log.d(TAG, "FCM topic 'waiters' : abonnement OK"))
                .addOnFailureListener(e ->
                        Log.e(TAG, "FCM topic 'waiters' : échec abonnement", e));

        // Récupérer et logger le token FCM de cet appareil.
        FirebaseMessaging.getInstance()
                .getToken()
                .addOnSuccessListener(token -> {
                    Log.d(TAG, "FCM Token : " + token);
                    latestFcmToken = token;
                    saveFcmToken(this, token);
                    if (myWebView != null) {
                        myWebView.post(() -> myWebView.evaluateJavascript(
                                "window.__nativeFcmToken = '" + token + "';", null));
                    }
                })
                .addOnFailureListener(e ->
                        Log.e(TAG, "Erreur récupération token FCM", e));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // onResume
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    protected void onResume() {
        super.onResume();

        startWaiterService();

        if (WaiterForegroundService.sharedWebView != null
                && WaiterForegroundService.sharedWebView != myWebView) {
            myWebView = WaiterForegroundService.sharedWebView;
        }

        attachWebViewToLayout();

        if (myWebView != null) {
            myWebView.onResume();
            // Sécurité : résume les timers si Android les avait suspendus.
            // NOTE : NE PAS appeler pauseTimers() dans onPause() — voir
            // commentaire ci-dessous. Ce resumeTimers() est conservé comme
            // filet de sécurité uniquement.
            myWebView.resumeTimers();
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // onPause
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    protected void onPause() {
        // ╔══════════════════════════════════════════════════════════════════╗
        // ║  BUG CORRIGÉ — NE PAS appeler myWebView.pauseTimers()          ║
        // ║                                                                  ║
        // ║  pauseTimers() est un appel GLOBAL qui suspend le JS de TOUTES  ║
        // ║  les WebViews du processus, y compris celle du service.          ║
        // ║  Résultat : plus aucune notification en arrière-plan.            ║
        // ║                                                                  ║
        // ║  Le système FCM HIGH PRIORITY est maintenant le système          ║
        // ║  principal — il est complètement indépendant de la WebView.      ║
        // Ne pas appeler myWebView.onPause() ni pauseTimers() sur la WebView
        // partagée avec le ForegroundService, afin de préserver les websockets Firestore
        // et la réception des alertes en temps réel.
        super.onPause();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // onDestroy
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    protected void onDestroy() {
        if (myWebView != null && myWebView.getParent() != null) {
            ((ViewGroup) myWebView.getParent()).removeView(myWebView);
        }
        super.onDestroy();
    }

    @Override
    public void onBackPressed() {
        if (myWebView != null && myWebView.canGoBack()) {
            myWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────

    static WebView buildWebView(Context context) {
        WebView webView = new WebView(context);
        WebSettings ws = webView.getSettings();

        ws.setJavaScriptEnabled(true);
        ws.setDomStorageEnabled(true);
        ws.setDatabaseEnabled(true);
        ws.setMediaPlaybackRequiresUserGesture(false);
        ws.setCacheMode(WebSettings.LOAD_DEFAULT);
        ws.setUserAgentString(ws.getUserAgentString() + " GreyCornerWaiterApp/3.0");

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
            ws.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, int errorCode,
                    String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                view.postDelayed(() -> {
                    if (WaiterForegroundService.sharedWebView != null)
                        WaiterForegroundService.sharedWebView.reload();
                }, 5000);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                view.evaluateJavascript(
                        "window.__isNativeAndroid = true;"
                        + (latestFcmToken != null ? "window.__nativeFcmToken = '" + latestFcmToken + "';" : ""),
                        null);
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(android.webkit.ConsoleMessage consoleMessage) {
                Log.d("GC-WebConsole", consoleMessage.message() + " ["
                        + consoleMessage.sourceId() + ":" + consoleMessage.lineNumber() + "]");
                return true;
            }
        });
        webView.addJavascriptInterface(new WebAppInterface(context), "AndroidInterface");

        return webView;
    }

    private void attachWebViewToLayout() {
        if (myWebView == null) return;
        WebView placeholder = findViewById(R.id.waiterWebView);
        if (placeholder == null) return;
        if (myWebView.getParent() == placeholder.getParent() && myWebView != placeholder) return;

        ViewGroup parent = (ViewGroup) placeholder.getParent();
        if (parent == null) return;

        int index = parent.indexOfChild(placeholder);
        ViewGroup.LayoutParams params = placeholder.getLayoutParams();
        parent.removeView(placeholder);

        if (myWebView.getParent() != null)
            ((ViewGroup) myWebView.getParent()).removeView(myWebView);

        myWebView.setLayoutParams(params);
        parent.addView(myWebView, index);
    }

    private void startWaiterService() {
        try {
            Intent serviceIntent = new Intent(this, WaiterForegroundService.class);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(serviceIntent);
            } else {
                startService(serviceIntent);
            }
        } catch (Exception e) { e.printStackTrace(); }
    }

    private void requestBatteryOptimizationExclusion() {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                android.os.PowerManager pm =
                        (android.os.PowerManager) getSystemService(POWER_SERVICE);
                if (pm != null && !pm.isIgnoringBatteryOptimizations(getPackageName())) {
                    Intent intent = new Intent(
                            android.provider.Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                    intent.setData(Uri.parse("package:" + getPackageName()));
                    startActivity(intent);
                }
            }
        } catch (Exception e) { e.printStackTrace(); }
    }

    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS)
                    != android.content.pm.PackageManager.PERMISSION_GRANTED) {
                requestPermissions(
                        new String[]{android.Manifest.permission.POST_NOTIFICATIONS}, 101);
            }
        }
    }

    private void createAlertNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            android.app.NotificationChannel channel = new android.app.NotificationChannel(
                    ALERT_CHANNEL_ID,
                    "Alertes Serveurs Grey Corner",
                    android.app.NotificationManager.IMPORTANCE_HIGH);
            channel.setDescription("Appels clients et précommandes — temps réel");
            channel.enableVibration(true);
            channel.setVibrationPattern(new long[]{0, 600, 200, 600, 200, 600});
            channel.setLockscreenVisibility(android.app.Notification.VISIBILITY_PUBLIC);
            channel.enableLights(true);
            channel.setLightColor(0xFFFFAA00);
            channel.setBypassDnd(true);

            Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
            if (soundUri == null) {
                soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            }
            AudioAttributes aa = new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_ALARM)
                    .build();
            channel.setSound(soundUri, aa);

            android.app.NotificationManager manager =
                    getSystemService(android.app.NotificationManager.class);
            if (manager != null) manager.createNotificationChannel(channel);
        }
    }

    public static void wakeScreen(Context context) {
        try {
            android.os.PowerManager pm =
                    (android.os.PowerManager) context.getSystemService(Context.POWER_SERVICE);
            if (pm != null) {
                @SuppressWarnings("deprecation")
                android.os.PowerManager.WakeLock wl = pm.newWakeLock(
                        android.os.PowerManager.SCREEN_BRIGHT_WAKE_LOCK
                        | android.os.PowerManager.ACQUIRE_CAUSES_WAKEUP
                        | android.os.PowerManager.ON_AFTER_RELEASE,
                        "GreyCorner::AlertWakeLock");
                wl.acquire(10_000L);
            }
        } catch (Exception e) {
            Log.w(TAG, "Failed to wake screen: " + e.getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Notification fallback (utilisée par le poller REST de secours)
    // ─────────────────────────────────────────────────────────────────────────

    public static void showNotificationWithActions(
            Context context, String id, String type, String title, String message) {

        android.app.NotificationManager nm =
                (android.app.NotificationManager) context.getSystemService(
                        Context.NOTIFICATION_SERVICE);
        if (nm == null) return;

        int notifId = Math.abs(id.hashCode());
        if (notifId == 0) notifId = 1;
        nm.cancel(1);
        nm.cancel(notifId);

        // 1. Réveil de l'écran physique
        wakeScreen(context);

        Intent launchIntent = context.getPackageManager()
                .getLaunchIntentForPackage(context.getPackageName());
        if (launchIntent == null) launchIntent = new Intent(context, MainActivity.class);
        launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK
                | Intent.FLAG_ACTIVITY_CLEAR_TOP
                | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        PendingIntent contentPi = PendingIntent.getActivity(
                context, 0, launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT
                        | PendingIntent.FLAG_IMMUTABLE);

        // 2. FullScreenIntent — réveil plein écran même écran verrouillé
        PendingIntent fullScreenPi = PendingIntent.getActivity(
                context, 1, launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT
                        | PendingIntent.FLAG_IMMUTABLE);

        Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
        if (soundUri == null) {
            soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        }

        androidx.core.app.NotificationCompat.Builder builder =
                new androidx.core.app.NotificationCompat.Builder(context, ALERT_CHANNEL_ID)
                        .setSmallIcon(R.drawable.ic_launcher)
                        .setContentTitle(title)
                        .setContentText(message)
                        .setStyle(new androidx.core.app.NotificationCompat.BigTextStyle().bigText(message))
                        .setPriority(androidx.core.app.NotificationCompat.PRIORITY_MAX)
                        .setCategory(androidx.core.app.NotificationCompat.CATEGORY_CALL)
                        .setVisibility(androidx.core.app.NotificationCompat.VISIBILITY_PUBLIC)
                        .setContentIntent(contentPi)
                        .setFullScreenIntent(fullScreenPi, true)
                        .setAutoCancel(true)
                        .setSound(soundUri)
                        .setVibrate(new long[]{0, 600, 200, 600, 200, 600})
                        .setLights(0xFFFFAA00, 500, 500)
                        .setOnlyAlertOnce(false);

        int reqCode = Math.abs(id.hashCode());

        if ("order".equals(type)) {
            Intent ai = new Intent(context, WaiterForegroundService.class);
            ai.setAction("com.menugreycorner.ACTION_ACCEPT_ORDER");
            ai.putExtra("ORDER_ID", id);
            android.app.PendingIntent api;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                api = android.app.PendingIntent.getForegroundService(
                        context, reqCode, ai,
                        android.app.PendingIntent.FLAG_UPDATE_CURRENT
                                | android.app.PendingIntent.FLAG_IMMUTABLE);
            } else {
                api = android.app.PendingIntent.getService(
                        context, reqCode, ai,
                        android.app.PendingIntent.FLAG_UPDATE_CURRENT
                                | android.app.PendingIntent.FLAG_IMMUTABLE);
            }
            builder.addAction(R.drawable.ic_launcher, "✓  Valider", api);
        } else {
            Intent ai = new Intent(context, WaiterForegroundService.class);
            ai.setAction("com.menugreycorner.ACTION_ACCEPT_CALL");
            ai.putExtra("CALL_ID", id);
            android.app.PendingIntent api;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                api = android.app.PendingIntent.getForegroundService(
                        context, reqCode, ai,
                        android.app.PendingIntent.FLAG_UPDATE_CURRENT
                                | android.app.PendingIntent.FLAG_IMMUTABLE);
            } else {
                api = android.app.PendingIntent.getService(
                        context, reqCode, ai,
                        android.app.PendingIntent.FLAG_UPDATE_CURRENT
                                | android.app.PendingIntent.FLAG_IMMUTABLE);
            }
            builder.addAction(R.drawable.ic_launcher, "✓  S'y Rendre", api);
        }

        nm.notify(notifId, builder.build());
        nm.notify(1, builder.build());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // JavaScript Bridge
    // ─────────────────────────────────────────────────────────────────────────

    public static class WebAppInterface {

        private final Context mContext;

        WebAppInterface(Context context) { mContext = context; }

        @android.webkit.JavascriptInterface
        public void triggerNativeAlert(String title, String message) {
            triggerActionAlert("simple", "simple", title, message);
        }

        @android.webkit.JavascriptInterface
        public void triggerActionAlert(String id, String type, String title, String message) {
            try {
                android.os.Vibrator v =
                        (android.os.Vibrator) mContext.getSystemService(Context.VIBRATOR_SERVICE);
                if (v != null && v.hasVibrator()) {
                    long[] pattern = {0, 600, 200, 600, 200, 600};
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                        v.vibrate(android.os.VibrationEffect.createWaveform(pattern, -1));
                    else
                        v.vibrate(pattern, -1);
                }
            } catch (Exception e) { e.printStackTrace(); }

            showNotificationWithActions(mContext, id, type, title, message);
        }

        @android.webkit.JavascriptInterface
        public boolean isNativeApp() {
            return true;
        }

        @android.webkit.JavascriptInterface
        public String getFcmToken() {
            return latestFcmToken != null ? latestFcmToken : "";
        }

        @android.webkit.JavascriptInterface
        public void cancelAlert(String id) {
            if (id == null) return;
            try {
                android.app.NotificationManager nm =
                        (android.app.NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
                if (nm != null) {
                    nm.cancel(Math.abs(id.hashCode()));
                    nm.cancel(1);
                }
            } catch (Exception ignored) {}
        }

        @android.webkit.JavascriptInterface
        public void cancelAllAlerts() {
            try {
                android.app.NotificationManager nm =
                        (android.app.NotificationManager) mContext.getSystemService(Context.NOTIFICATION_SERVICE);
                if (nm != null) {
                    nm.cancelAll();
                }
            } catch (Exception ignored) {}
        }

        @android.webkit.JavascriptInterface
        public void reloadWebView() {
            if (WaiterForegroundService.sharedWebView != null) {
                WaiterForegroundService.sharedWebView.post(() -> WaiterForegroundService.sharedWebView.reload());
            }
        }

        @android.webkit.JavascriptInterface
        public void keepAlive() {
            try {
                Intent si = new Intent(mContext, WaiterForegroundService.class);
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O)
                    mContext.startForegroundService(si);
                else
                    mContext.startService(si);
            } catch (Exception e) { e.printStackTrace(); }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Enregistrement token FCM
    // ─────────────────────────────────────────────────────────────────────────

    public static void saveFcmToken(Context context, String token) {
        if (token == null || token.isEmpty()) return;
        latestFcmToken = token;
        new Thread(() -> {
            try {
                String androidId = android.provider.Settings.Secure.getString(
                        context.getContentResolver(),
                        android.provider.Settings.Secure.ANDROID_ID);
                if (androidId == null || androidId.isEmpty()) {
                    androidId = "device_" + Build.MODEL.replaceAll("[^a-zA-Z0-9]", "_");
                }
                String docId = "android_" + androidId;

                android.content.SharedPreferences prefs =
                        context.getSharedPreferences("gc_waiter_prefs", Context.MODE_PRIVATE);
                prefs.edit().putString("fcm_token", token).putString("device_id", docId).apply();

                if (WaiterForegroundService.sharedWebView != null) {
                    WaiterForegroundService.sharedWebView.post(() -> {
                        WaiterForegroundService.sharedWebView.evaluateJavascript(
                                "window.__nativeFcmToken = '" + token + "';", null);
                    });
                }

                java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat(
                        "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US);
                sdf.setTimeZone(java.util.TimeZone.getTimeZone("UTC"));
                String nowIso = sdf.format(new java.util.Date());

                // Auth anonyme REST
                String authUrl = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
                        + WaiterForegroundService.API_KEY;
                java.net.URL aUrl = new java.net.URL(authUrl);
                java.net.HttpURLConnection aConn = (java.net.HttpURLConnection) aUrl.openConnection();
                aConn.setRequestMethod("POST");
                aConn.setRequestProperty("Content-Type", "application/json");
                aConn.setDoOutput(true);
                aConn.setConnectTimeout(8000);
                aConn.setReadTimeout(8000);
                try (java.io.OutputStream os = aConn.getOutputStream()) {
                    os.write("{\"returnSecureToken\":true}".getBytes("UTF-8"));
                }
                String idToken = null;
                if (aConn.getResponseCode() == 200) {
                    try (java.io.BufferedReader br = new java.io.BufferedReader(
                            new java.io.InputStreamReader(aConn.getInputStream(), "UTF-8"))) {
                        StringBuilder sb = new StringBuilder();
                        String line;
                        while ((line = br.readLine()) != null) sb.append(line);
                        org.json.JSONObject j = new org.json.JSONObject(sb.toString());
                        idToken = j.getString("idToken");
                    }
                }
                aConn.disconnect();

                if (idToken != null) {
                    String urlStr = WaiterForegroundService.FIRESTORE_BASE + "/waiter_fcm_tokens/" + docId
                            + "?updateMask.fieldPaths=token"
                            + "&updateMask.fieldPaths=deviceId"
                            + "&updateMask.fieldPaths=active"
                            + "&updateMask.fieldPaths=platform"
                            + "&updateMask.fieldPaths=model"
                            + "&updateMask.fieldPaths=updatedAt"
                            + "&key=" + WaiterForegroundService.API_KEY;

                    String jsonBody = "{"
                            + "\"fields\":{"
                            + "  \"token\":{\"stringValue\":\"" + token + "\"},"
                            + "  \"deviceId\":{\"stringValue\":\"" + docId + "\"},"
                            + "  \"active\":{\"booleanValue\":true},"
                            + "  \"platform\":{\"stringValue\":\"android_native\"},"
                            + "  \"model\":{\"stringValue\":\"" + Build.MANUFACTURER + " " + Build.MODEL + "\"},"
                            + "  \"updatedAt\":{\"stringValue\":\"" + nowIso + "\"}"
                            + "}"
                            + "}";

                    java.net.URL url = new java.net.URL(urlStr);
                    java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
                    conn.setRequestMethod("POST");
                    conn.setRequestProperty("Content-Type", "application/json");
                    conn.setRequestProperty("Authorization", "Bearer " + idToken);
                    conn.setRequestProperty("X-HTTP-Method-Override", "PATCH");
                    conn.setDoOutput(true);
                    conn.setConnectTimeout(8000);
                    conn.setReadTimeout(8000);
                    try (java.io.OutputStream os = conn.getOutputStream()) {
                        os.write(jsonBody.getBytes("UTF-8"));
                    }
                    int code = conn.getResponseCode();
                    Log.d(TAG, "Enregistrement token FCM Firestore: HTTP " + code);
                    conn.disconnect();
                }
            } catch (Exception e) {
                Log.w(TAG, "Enregistrement token FCM REST: " + e.getMessage());
            }
        }).start();
    }
}
