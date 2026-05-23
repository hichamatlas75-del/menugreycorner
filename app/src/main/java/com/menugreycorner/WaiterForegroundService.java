package com.menugreycorner;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.os.PowerManager;
import android.webkit.WebSettings;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.core.app.NotificationCompat;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashSet;
import java.util.Set;

/**
 * ════════════════════════════════════════════════════════════════
 *  WaiterForegroundService — Système de SECOURS (fallback)
 * ════════════════════════════════════════════════════════════════
 *
 *  Architecture hybride :
 *
 *  ┌─────────────────────────────────────────────┐
 *  │  FCM HIGH PRIORITY  ←  Principal (instantané)│
 *  │  ↓ si aucun FCM depuis 2 min                │
 *  │  Firestore REST poll (60s)  ←  Secours       │
 *  └─────────────────────────────────────────────┘
 *
 *  Le polling se suspend automatiquement tant que FCM fonctionne.
 *  Il reprend si FCM silencieux depuis FCM_FALLBACK_THRESHOLD_MS.
 *
 *  Appeler WaiterForegroundService.notifyFcmReceived() depuis
 *  WaiterFirebaseMessagingService à chaque message FCM reçu.
 */
public class WaiterForegroundService extends Service {

    private static final String SERVICE_CHANNEL_ID  = "waiter_service_channel";
    private static final long   RESTART_DELAY_MS    = 2_000L;
    private static final long   WAKELOCK_TIMEOUT_MS = 30 * 60 * 1_000L;

    // ── FCM Fallback ──────────────────────────────────────────────────────────
    // Si FCM n'a rien reçu depuis ce délai, le poller REST reprend
    private static final long FCM_FALLBACK_THRESHOLD_MS = 2 * 60 * 1_000L; // 2 minutes

    /**
     * Timestamp du dernier message FCM reçu.
     * Mis à jour par WaiterFirebaseMessagingService.notifyFcmReceived().
     * volatile garantit la visibilité entre threads.
     */
    public static volatile long lastFcmReceivedMs = 0L;

    /**
     * Appelé par WaiterFirebaseMessagingService à chaque DATA message FCM.
     * Suspend le poller REST pendant FCM_FALLBACK_THRESHOLD_MS.
     */
    public static void notifyFcmReceived() {
        lastFcmReceivedMs = System.currentTimeMillis();
    }

    // ── Firestore REST polling (secours) ──────────────────────────────────────
    // RÉDUIT à 60 secondes (était 6s) — uniquement si FCM silencieux
    private static final long   POLL_INTERVAL_MS = 60_000L;  // 60 secondes
    private static final int    CONNECT_TIMEOUT  = 8_000;
    private static final int    READ_TIMEOUT     = 8_000;
    private static final String API_KEY          = "AIzaSyAoINLpUCCic9Xz9_PnM3al9Iu69q1FQpY";
    private static final String PROJECT_ID       = "grey-corner-restaurant";
    private static final String FIRESTORE_BASE   =
            "https://firestore.googleapis.com/v1/projects/"
            + PROJECT_ID + "/databases/(default)/documents";

    // Auth anonyme Firebase (REST — synchrone, compatible HandlerThread)
    private static final String AUTH_SIGNUP_URL  =
            "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + API_KEY;
    private static final String AUTH_REFRESH_URL =
            "https://securetoken.googleapis.com/v1/token?key=" + API_KEY;

    private String authIdToken    = null;
    private String authRefreshTok = null;
    private long   tokenExpiryMs  = 0;

    private final Set<String> knownPendingCallIds  = new HashSet<>();
    private final Set<String> knownPendingOrderIds = new HashSet<>();
    private boolean isFirstCallPoll  = true;
    private boolean isFirstOrderPoll = true;

    private HandlerThread pollerThread;
    private Handler       pollerHandler;
    private Runnable      pollerRunnable;

    // ── Shared state ──────────────────────────────────────────────────────────
    public static WebView                 sharedWebView = null;
    public static WaiterForegroundService instance      = null;

    private PowerManager.WakeLock wakeLock       = null;

    // ─────────────────────────────────────────────────────────────────────────
    // Cycle de vie
    // ─────────────────────────────────────────────────────────────────────────

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;

        createServiceNotificationChannel();
        startForegroundNotification();
        acquireWakeLock();
        initBackgroundWebView();
        startFallbackFirestorePolling();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (wakeLock == null || !wakeLock.isHeld()) acquireWakeLock();
        if (sharedWebView == null) initBackgroundWebView();
        if (pollerHandler == null || pollerThread == null || !pollerThread.isAlive())
            startFallbackFirestorePolling();

        if (intent != null) {
            String action = intent.getAction();
            if ("com.menugreycorner.ACTION_ACCEPT_CALL".equals(action)) {
                String callId = intent.getStringExtra("CALL_ID");
                if (callId != null) {
                    handleAcceptAction("waiter_calls", callId);
                }
            } else if ("com.menugreycorner.ACTION_ACCEPT_ORDER".equals(action)) {
                String orderId = intent.getStringExtra("ORDER_ID");
                if (orderId != null) {
                    handleAcceptAction("pre_orders", orderId);
                }
            }
        }

        return START_STICKY;
    }

    @Override
    public void onTaskRemoved(Intent rootIntent) {
        scheduleRestart();
        super.onTaskRemoved(rootIntent);
    }

    @Override
    public void onDestroy() {
        scheduleRestart();
        stopFallbackFirestorePolling();
        releaseWakeLock();
        instance = null;
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) { return null; }

    // ─────────────────────────────────────────────────────────────────────────
    // Notification persistante du service
    // ─────────────────────────────────────────────────────────────────────────

    private void startForegroundNotification() {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this, 0, notificationIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        Notification notification = new NotificationCompat.Builder(this, SERVICE_CHANNEL_ID)
                .setContentTitle("Grey Corner – Service Actif")
                .setContentText("En attente des appels clients...")
                .setSmallIcon(R.drawable.ic_launcher)
                .setPriority(NotificationCompat.PRIORITY_LOW)
                .setOngoing(true)
                .setContentIntent(pendingIntent)
                .build();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(2, notification,
                    android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC);
        } else {
            startForeground(2, notification);
        }
    }

    private void createServiceNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    SERVICE_CHANNEL_ID,
                    "Service d'Arrière-plan Grey Corner",
                    NotificationManager.IMPORTANCE_LOW);
            channel.setDescription("Maintient le service d'alerte en arrière-plan");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) manager.createNotificationChannel(channel);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // WakeLock CPU
    // ─────────────────────────────────────────────────────────────────────────

    private void acquireWakeLock() {
        try {
            PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
            if (pm != null) {
                if (wakeLock != null && wakeLock.isHeld()) wakeLock.release();
                wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK,
                        "GreyCorner::WaiterWakeLock");
                wakeLock.acquire(WAKELOCK_TIMEOUT_MS);
            }
        } catch (Exception e) { e.printStackTrace(); }
    }

    private void releaseWakeLock() {
        try {
            if (wakeLock != null && wakeLock.isHeld()) wakeLock.release();
        } catch (Exception e) { e.printStackTrace(); }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Restart automatique (compatible Doze)
    // ─────────────────────────────────────────────────────────────────────────

    private void scheduleRestart() {
        try {
            Intent restartIntent = new Intent(getApplicationContext(), WaiterForegroundService.class);
            restartIntent.setPackage(getPackageName());
            PendingIntent pi = PendingIntent.getService(
                    getApplicationContext(), 1, restartIntent,
                    PendingIntent.FLAG_ONE_SHOT | PendingIntent.FLAG_IMMUTABLE);
            AlarmManager am = (AlarmManager) getApplicationContext()
                    .getSystemService(Context.ALARM_SERVICE);
            if (am != null) {
                long triggerAt = System.currentTimeMillis() + RESTART_DELAY_MS;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
                    am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pi);
                else
                    am.setExact(AlarmManager.RTC_WAKEUP, triggerAt, pi);
            }
        } catch (Exception e) { e.printStackTrace(); }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ██████████████████████████████████████████████████████████████████████
    // ██  FALLBACK POLLER — Firestore REST (secours uniquement)           ██
    // ██████████████████████████████████████████████████████████████████████
    //
    // Active seulement si aucun message FCM reçu depuis 2 minutes.
    // Intervalle : 60s (au lieu de 6s) → économie batterie significative.
    //
    // Logique :
    //   • Si FCM fonctionne → poll ignoré (FCM assure les notifs)
    //   • Si FCM silencieux depuis > 2 min → poll déclenché en secours
    // ─────────────────────────────────────────────────────────────────────────

    private void startFallbackFirestorePolling() {
        pollerThread = new HandlerThread("GC-FallbackPoller");
        pollerThread.start();
        pollerHandler = new Handler(pollerThread.getLooper());

        pollerRunnable = new Runnable() {
            @Override
            public void run() {
                try {
                    long msSinceLastFcm = System.currentTimeMillis() - lastFcmReceivedMs;
                    boolean fcmSilent   = msSinceLastFcm > FCM_FALLBACK_THRESHOLD_MS;

                    if (fcmSilent) {
                        // FCM semble inactif → activer le secours REST
                        String token = getValidAuthToken();
                        if (token != null) {
                            pollCollection("waiter_calls", "call",  token);
                            pollCollection("pre_orders",   "order", token);
                        }
                    }
                    // Si FCM actif → ne rien faire, économie batterie maximale
                } catch (Exception ignored) {}

                pollerHandler.postDelayed(this, POLL_INTERVAL_MS);
            }
        };

        pollerHandler.post(pollerRunnable);
    }

    private void stopFallbackFirestorePolling() {
        try {
            if (pollerHandler != null && pollerRunnable != null)
                pollerHandler.removeCallbacks(pollerRunnable);
            if (pollerThread != null) {
                pollerThread.quitSafely();
                pollerThread = null;
            }
            pollerHandler = null;
        } catch (Exception e) { e.printStackTrace(); }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Auth anonyme Firebase (REST synchrone — pour HandlerThread)
    // ─────────────────────────────────────────────────────────────────────────

    private String getValidAuthToken() {
        long now = System.currentTimeMillis();
        if (authIdToken != null && now < tokenExpiryMs) return authIdToken;
        if (authRefreshTok != null) {
            String refreshed = refreshAuthToken();
            if (refreshed != null) return refreshed;
        }
        return signInAnonymously();
    }

    private String signInAnonymously() {
        try {
            URL url = new URL(AUTH_SIGNUP_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);
            conn.setConnectTimeout(CONNECT_TIMEOUT);
            conn.setReadTimeout(READ_TIMEOUT);
            try (OutputStream os = conn.getOutputStream()) {
                os.write("{\"returnSecureToken\":true}".getBytes("UTF-8"));
            }
            if (conn.getResponseCode() == 200) {
                JSONObject json = new JSONObject(readStream(conn));
                conn.disconnect();
                authIdToken    = json.getString("idToken");
                authRefreshTok = json.getString("refreshToken");
                tokenExpiryMs  = now() + (json.getLong("expiresIn") - 300) * 1000L;
                return authIdToken;
            }
            conn.disconnect();
        } catch (Exception e) { e.printStackTrace(); }
        return null;
    }

    private String refreshAuthToken() {
        try {
            URL url = new URL(AUTH_REFRESH_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setDoOutput(true);
            conn.setConnectTimeout(CONNECT_TIMEOUT);
            conn.setReadTimeout(READ_TIMEOUT);
            String b = "grant_type=refresh_token&refresh_token=" + authRefreshTok;
            try (OutputStream os = conn.getOutputStream()) { os.write(b.getBytes("UTF-8")); }
            if (conn.getResponseCode() == 200) {
                JSONObject json = new JSONObject(readStream(conn));
                conn.disconnect();
                authIdToken    = json.getString("id_token");
                authRefreshTok = json.getString("refresh_token");
                tokenExpiryMs  = now() + (json.getLong("expires_in") - 300) * 1000L;
                return authIdToken;
            }
            conn.disconnect();
        } catch (Exception e) { e.printStackTrace(); }
        authRefreshTok = null;
        authIdToken    = null;
        tokenExpiryMs  = 0;
        return null;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Poll Firestore REST (secours)
    // ─────────────────────────────────────────────────────────────────────────

    private void pollCollection(String collectionId, String type, String token) {
        boolean     isCall   = "call".equals(type);
        Set<String> knownIds = isCall ? knownPendingCallIds : knownPendingOrderIds;

        try {
            String queryBody = "{"
                + "\"structuredQuery\":{"
                + "  \"from\":[{\"collectionId\":\"" + collectionId + "\"}],"
                + "  \"where\":{"
                + "    \"fieldFilter\":{"
                + "      \"field\":{\"fieldPath\":\"status\"},"
                + "      \"op\":\"EQUAL\","
                + "      \"value\":{\"stringValue\":\"pending\"}"
                + "    }"
                + "  },"
                + "  \"limit\":50"
                + "}"
                + "}";

            URL url = new URL(FIRESTORE_BASE + ":runQuery?key=" + API_KEY);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Authorization", "Bearer " + token);
            conn.setDoOutput(true);
            conn.setConnectTimeout(CONNECT_TIMEOUT);
            conn.setReadTimeout(READ_TIMEOUT);
            try (OutputStream os = conn.getOutputStream()) {
                os.write(queryBody.getBytes("UTF-8"));
            }

            int code = conn.getResponseCode();
            if (code == 401) { authIdToken = null; tokenExpiryMs = 0; conn.disconnect(); return; }
            if (code != 200) { conn.disconnect(); return; }

            JSONArray   results          = new JSONArray(readStream(conn));
            conn.disconnect();
            Set<String> currentPendingIds = new HashSet<>();

            for (int i = 0; i < results.length(); i++) {
                JSONObject result = results.getJSONObject(i);
                if (!result.has("document")) continue;

                JSONObject doc   = result.getJSONObject("document");
                String     name  = doc.getString("name");
                String     docId = name.substring(name.lastIndexOf('/') + 1);
                currentPendingIds.add(docId);

                if (!knownIds.contains(docId)) {
                    boolean isFirst = isCall ? isFirstCallPoll : isFirstOrderPoll;
                    if (!isFirst) {
                        String tableStr = extractTableStr(doc);
                        String title    = isCall
                                ? "🔔 [Secours] Appel Table " + tableStr
                                : "📋 [Secours] Précommande Table " + tableStr;
                        String message  = isCall
                                ? "Un client demande un serveur"
                                : "Nouvelle commande à valider";
                        MainActivity.showNotificationWithActions(
                            getApplicationContext(), docId, type, title, message);
                    }
                    knownIds.add(docId);
                }
            }
            knownIds.retainAll(currentPendingIds);
            if (isCall)  isFirstCallPoll  = false;
            else         isFirstOrderPoll = false;

        } catch (Exception e) { e.printStackTrace(); }
    }

    private String extractTableStr(JSONObject doc) {
        try {
            JSONObject fields = doc.getJSONObject("fields");
            if (fields.has("table")) {
                JSONObject t = fields.getJSONObject("table");
                if (t.has("integerValue")) return t.getString("integerValue");
                if (t.has("doubleValue"))  return String.valueOf((int) t.getDouble("doubleValue"));
            }
        } catch (Exception ignored) {}
        return "?";
    }

    private String readStream(HttpURLConnection conn) throws Exception {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader br = new BufferedReader(
                new InputStreamReader(conn.getInputStream(), "UTF-8"))) {
            String line;
            while ((line = br.readLine()) != null) sb.append(line);
        }
        return sb.toString();
    }

    private long now() { return System.currentTimeMillis(); }

    // ─────────────────────────────────────────────────────────────────────────
    // WebView de secours (bridge JS)
    // ─────────────────────────────────────────────────────────────────────────

    public void initBackgroundWebView() {
        if (sharedWebView != null) return;

        sharedWebView = new WebView(getApplicationContext());
        WebSettings ws = sharedWebView.getSettings();
        ws.setJavaScriptEnabled(true);
        ws.setDomStorageEnabled(true);
        ws.setDatabaseEnabled(true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP)
            ws.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        ws.setMediaPlaybackRequiresUserGesture(false);
        ws.setCacheMode(WebSettings.LOAD_DEFAULT);

        sharedWebView.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView v, int code, String desc, String url) {
                super.onReceivedError(v, code, desc, url);
                v.postDelayed(() -> { if (sharedWebView != null) sharedWebView.reload(); }, 5000);
            }
        });
        sharedWebView.setWebChromeClient(new WebChromeClient());
        sharedWebView.addJavascriptInterface(
                new MainActivity.WebAppInterface(getApplicationContext()),
                "AndroidInterface");
        sharedWebView.loadUrl("https://espace-serveurs.pages.dev/");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Traitement des boutons d'actions interactifs via REST + WebView
    // ─────────────────────────────────────────────────────────────────────────

    private void handleAcceptAction(String collectionId, String docId) {
        cancelNotification(1);

        // Retrait immédiat des listes de notifications locales du poller
        if ("waiter_calls".equals(collectionId)) {
            knownPendingCallIds.remove(docId);
        } else {
            knownPendingOrderIds.remove(docId);
        }

        // 1. Mise à jour directe en arrière-plan via l'API REST Firestore
        if (pollerHandler != null) {
            pollerHandler.post(() -> {
                try {
                    String token = getValidAuthToken();
                    if (token != null) {
                        updateDocumentStatusRest(collectionId, docId, "accepted", "Serveur", token);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }

        // 2. Mise à jour de la WebView locale si elle est prête/chargée
        if (sharedWebView != null) {
            final String safe = docId.replace("'", "\\'");
            sharedWebView.post(() -> {
                if ("waiter_calls".equals(collectionId)) {
                    sharedWebView.evaluateJavascript(
                            "if(typeof dbService!=='undefined'){"
                            + "dbService.updateCallStatus('" + safe + "','accepted','Serveur');}",
                            null);
                } else {
                    sharedWebView.evaluateJavascript(
                            "if(typeof dbService!=='undefined'){"
                            + "dbService.updatePreOrderStatus('" + safe + "','accepted','Serveur');}",
                            null);
                }
            });
        }
    }

    private void updateDocumentStatusRest(String collectionId, String docId, String status, String waiterId, String token) {
        try {
            java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US);
            sdf.setTimeZone(java.util.TimeZone.getTimeZone("UTC"));
            String nowIso = sdf.format(new java.util.Date());

            String urlStr = FIRESTORE_BASE + "/" + collectionId + "/" + docId
                    + "?updateMask.fieldPaths=status"
                    + "&updateMask.fieldPaths=acceptedAt"
                    + "&updateMask.fieldPaths=assignedTo"
                    + "&key=" + API_KEY;

            URL url = new URL(urlStr);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Authorization", "Bearer " + token);
            conn.setRequestProperty("X-HTTP-Method-Override", "PATCH");
            conn.setDoOutput(true);
            conn.setConnectTimeout(CONNECT_TIMEOUT);
            conn.setReadTimeout(READ_TIMEOUT);

            String body = "{"
                    + "\"fields\":{"
                    + "  \"status\":{\"stringValue\":\"" + status + "\"},"
                    + "  \"assignedTo\":{\"stringValue\":\"" + waiterId + "\"},"
                    + "  \"acceptedAt\":{\"timestampValue\":\"" + nowIso + "\"}"
                    + "}"
                    + "}";

            try (OutputStream os = conn.getOutputStream()) {
                os.write(body.getBytes("UTF-8"));
            }

            int code = conn.getResponseCode();
            if (code == 200) {
                readStream(conn);
            }
            conn.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void cancelNotification(int notifId) {
        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (nm != null) nm.cancel(notifId);
    }
}
