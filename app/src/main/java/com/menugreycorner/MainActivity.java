package com.menugreycorner;

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

    private WebView myWebView;

    // ─────────────────────────────────────────────────────────────────────────
    // onCreate
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

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
                    "https://espace-serveurs.pages.dev/");
        }

        myWebView = WaiterForegroundService.sharedWebView;
        attachWebViewToLayout();
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
        // En production, ce token peut être sauvegardé dans Firestore pour
        // envoyer des messages unicast (ciblés par serveur).
        FirebaseMessaging.getInstance()
                .getToken()
                .addOnSuccessListener(token -> {
                    Log.d(TAG, "FCM Token : " + token);
                    // Pour activer les messages unicast par serveur,
                    // décommenter et implémenter saveFcmToken(token) :
                    // saveFcmToken(token);
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
        // ╚══════════════════════════════════════════════════════════════════╝
        if (myWebView != null) {
            myWebView.onPause();
            // NE PAS appeler myWebView.pauseTimers() ici
        }
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
        });

        webView.setWebChromeClient(new WebChromeClient());
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

            Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
            AudioAttributes aa = new AudioAttributes.Builder()
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                    .build();
            channel.setSound(soundUri, aa);

            android.app.NotificationManager manager =
                    getSystemService(android.app.NotificationManager.class);
            if (manager != null) manager.createNotificationChannel(channel);
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

        nm.cancel(1);

        Intent launchIntent = context.getPackageManager()
                .getLaunchIntentForPackage(context.getPackageName());
        android.app.PendingIntent contentPi = android.app.PendingIntent.getActivity(
                context, 0, launchIntent,
                android.app.PendingIntent.FLAG_UPDATE_CURRENT
                        | android.app.PendingIntent.FLAG_IMMUTABLE);

        Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

        androidx.core.app.NotificationCompat.Builder builder =
                new androidx.core.app.NotificationCompat.Builder(context, ALERT_CHANNEL_ID)
                        .setSmallIcon(R.drawable.ic_launcher)
                        .setContentTitle(title)
                        .setContentText(message)
                        .setPriority(androidx.core.app.NotificationCompat.PRIORITY_HIGH)
                        .setCategory(androidx.core.app.NotificationCompat.CATEGORY_ALARM)
                        .setVisibility(androidx.core.app.NotificationCompat.VISIBILITY_PUBLIC)
                        .setContentIntent(contentPi)
                        .setAutoCancel(true)
                        .setSound(soundUri)
                        .setVibrate(new long[]{0, 600, 200, 600, 200, 600});

        if ("call".equals(type)) {
            Intent ai = new Intent(context, WaiterForegroundService.class);
            ai.setAction("com.menugreycorner.ACTION_ACCEPT_CALL");
            ai.putExtra("CALL_ID", id);
            android.app.PendingIntent api;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                api = android.app.PendingIntent.getForegroundService(
                        context, id.hashCode(), ai,
                        android.app.PendingIntent.FLAG_UPDATE_CURRENT
                                | android.app.PendingIntent.FLAG_IMMUTABLE);
            } else {
                api = android.app.PendingIntent.getService(
                        context, id.hashCode(), ai,
                        android.app.PendingIntent.FLAG_UPDATE_CURRENT
                                | android.app.PendingIntent.FLAG_IMMUTABLE);
            }
            builder.addAction(R.drawable.ic_launcher, "✓  S'y Rendre", api);
        } else if ("order".equals(type)) {
            Intent ai = new Intent(context, WaiterForegroundService.class);
            ai.setAction("com.menugreycorner.ACTION_ACCEPT_ORDER");
            ai.putExtra("ORDER_ID", id);
            android.app.PendingIntent api;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                api = android.app.PendingIntent.getForegroundService(
                        context, id.hashCode(), ai,
                        android.app.PendingIntent.FLAG_UPDATE_CURRENT
                                | android.app.PendingIntent.FLAG_IMMUTABLE);
            } else {
                api = android.app.PendingIntent.getService(
                        context, id.hashCode(), ai,
                        android.app.PendingIntent.FLAG_UPDATE_CURRENT
                                | android.app.PendingIntent.FLAG_IMMUTABLE);
            }
            builder.addAction(R.drawable.ic_launcher, "✓  Valider", api);
        }

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
}
