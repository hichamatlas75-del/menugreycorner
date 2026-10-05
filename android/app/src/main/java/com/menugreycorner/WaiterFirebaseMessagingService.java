package com.menugreycorner;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import androidx.core.app.NotificationCompat;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.google.firebase.messaging.FirebaseMessaging;

import java.util.Map;

/**
 * ════════════════════════════════════════════════════════════════
 *  WaiterFirebaseMessagingService
 *  Système principal de notification — Firebase Cloud Messaging
 * ════════════════════════════════════════════════════════════════
 *
 *  Reçoit les DATA MESSAGES FCM HIGH PRIORITY envoyés par la
 *  Cloud Function. Fonctionne dans tous les états :
 *    ✓ App en arrière-plan
 *    ✓ App swipée des récentes
 *    ✓ Écran éteint / Doze mode
 *    ✓ Autre app en foreground permanent
 *    ✓ Android 10 → 15
 *
 *  À la réception d'un message :
 *    1. Informe WaiterForegroundService (désactive le poller 2 min)
 *    2. Affiche notification PRIORITY_MAX avec vibration + son
 *    3. Réveille l'écran
 *    4. Active fullScreenIntent pour écran verrouillé
 */
public class WaiterFirebaseMessagingService extends FirebaseMessagingService {

    private static final String ALERT_CHANNEL_ID = "waiter_alerts";

    // ─────────────────────────────────────────────────────────────
    // onMessageReceived — déclenché même app tuée (DATA message)
    // ─────────────────────────────────────────────────────────────

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);

        Map<String, String> data = remoteMessage.getData();
        if ((data == null || data.isEmpty()) && remoteMessage.getNotification() == null) return;

        // Signaler au fallback poller qu'FCM fonctionne → pause 2 min
        WaiterForegroundService.notifyFcmReceived();

        String type  = (data != null && data.containsKey("type")) ? data.get("type") : "WAITER_CALL";
        boolean isOrder = "order".equalsIgnoreCase(type)
                || "pre_order".equalsIgnoreCase(type)
                || "PRE_ORDER".equalsIgnoreCase(type);
        String internalType = isOrder ? "order" : "call";

        String table = (data != null && data.containsKey("table")) ? data.get("table")
                : ((data != null && data.containsKey("tableId")) ? data.get("tableId") : "?");

        String zoneTbl = WaiterForegroundService.formatZoneTable(table);
        String title = (data != null && data.containsKey("title") && !data.get("title").isEmpty())
                ? data.get("title")
                : (remoteMessage.getNotification() != null && remoteMessage.getNotification().getTitle() != null
                    ? remoteMessage.getNotification().getTitle()
                    : (isOrder ? "👨‍🍳 Nouvelle Commande — " + zoneTbl : "🔔 Appel Serveur — " + zoneTbl));

        String body  = (data != null && data.containsKey("body") && !data.get("body").isEmpty())
                ? data.get("body")
                : (remoteMessage.getNotification() != null && remoteMessage.getNotification().getBody() != null
                    ? remoteMessage.getNotification().getBody()
                    : (isOrder ? "Nouvelle commande reçue" : "Un client demande un serveur"));

        String docId = (data != null && data.containsKey("docId")) ? data.get("docId")
                     : ((data != null && data.containsKey("callId")) ? data.get("callId")
                     : ((data != null && data.containsKey("orderId")) ? data.get("orderId")
                     : "fcm_" + System.currentTimeMillis()));

        // Réveil écran + notification
        wakeScreenIfPossible();
        createNotificationChannel();
        showNotification(title, body, table, docId, internalType);

        // S'assurer que le ForegroundService est démarré
        try {
            Intent serviceIntent = new Intent(this, WaiterForegroundService.class);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                startForegroundService(serviceIntent);
            } else {
                startService(serviceIntent);
            }
        } catch (Exception ignored) {}
    }

    // ─────────────────────────────────────────────────────────────
    // onNewToken — re-abonnement automatique si token FCM change
    // ─────────────────────────────────────────────────────────────

    @Override
    public void onNewToken(String token) {
        super.onNewToken(token);
        // Re-subscribe au topic après rotation de token
        FirebaseMessaging.getInstance().subscribeToTopic("waiters");
        MainActivity.latestFcmToken = token;
        MainActivity.saveFcmToken(getApplicationContext(), token);
    }

    // ─────────────────────────────────────────────────────────────
    // Affichage de la notification
    // ─────────────────────────────────────────────────────────────

    private void showNotification(String title, String body, String table,
                                  String docId, String type) {
        Context context = getApplicationContext();
        NotificationManager nm =
                (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (nm == null) return;

        int notifId = Math.abs(docId.hashCode());
        if (notifId == 0) notifId = 1;

        // Annuler la notif précédente spécifique et générique
        nm.cancel(1);
        nm.cancel(notifId);

        // Intent principal → ouvre MainActivity
        Intent launchIntent = context.getPackageManager()
                .getLaunchIntentForPackage(context.getPackageName());
        if (launchIntent == null) launchIntent = new Intent(context, MainActivity.class);
        launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK
                | Intent.FLAG_ACTIVITY_CLEAR_TOP
                | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        PendingIntent contentPi = PendingIntent.getActivity(
                context, 0, launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        // FullScreenIntent — affiche sur écran verrouillé
        PendingIntent fullScreenPi = PendingIntent.getActivity(
                context, 1, launchIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, ALERT_CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_launcher)
                .setContentTitle(title)
                .setContentText(body)
                .setStyle(new NotificationCompat.BigTextStyle().bigText(body))
                .setPriority(NotificationCompat.PRIORITY_MAX)          // PRIORITY_MAX
                .setCategory(NotificationCompat.CATEGORY_CALL)         // CATEGORY_CALL
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)   // VISIBILITY_PUBLIC
                .setContentIntent(contentPi)
                .setFullScreenIntent(fullScreenPi, true)               // Écran verrouillé
                .setAutoCancel(true)
                .setSound(soundUri)
                .setVibrate(new long[]{0, 600, 200, 600, 200, 600})
                .setLights(0xFFFFAA00, 500, 500)
                .setOnlyAlertOnce(false);

        int reqCode = Math.abs(docId.hashCode());

        // Bouton d'action selon le type
        if ("order".equals(type)) {
            Intent acceptIntent = new Intent(context, WaiterForegroundService.class);
            acceptIntent.setAction("com.menugreycorner.ACTION_ACCEPT_ORDER");
            acceptIntent.putExtra("ORDER_ID", docId);
            PendingIntent acceptPi;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                acceptPi = PendingIntent.getForegroundService(
                        context, reqCode, acceptIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            } else {
                acceptPi = PendingIntent.getService(
                        context, reqCode, acceptIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            }
            builder.addAction(R.drawable.ic_launcher, "✓  Valider", acceptPi);
        } else {
            Intent acceptIntent = new Intent(context, WaiterForegroundService.class);
            acceptIntent.setAction("com.menugreycorner.ACTION_ACCEPT_CALL");
            acceptIntent.putExtra("CALL_ID", docId);
            PendingIntent acceptPi;
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                acceptPi = PendingIntent.getForegroundService(
                        context, reqCode, acceptIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            } else {
                acceptPi = PendingIntent.getService(
                        context, reqCode, acceptIntent,
                        PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            }
            builder.addAction(R.drawable.ic_launcher, "✓  S'y Rendre", acceptPi);
        }

        nm.notify(notifId, builder.build());
        nm.notify(1, builder.build());
    }

    // ─────────────────────────────────────────────────────────────
    // Réveil écran (SCREEN_BRIGHT_WAKE_LOCK)
    // ─────────────────────────────────────────────────────────────

    private void wakeScreenIfPossible() {
        try {
            PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
            if (pm == null) return;
            //noinspection deprecation
            PowerManager.WakeLock wl = pm.newWakeLock(
                    PowerManager.SCREEN_BRIGHT_WAKE_LOCK
                    | PowerManager.ACQUIRE_CAUSES_WAKEUP
                    | PowerManager.ON_AFTER_RELEASE,
                    "GreyCorner::ScreenWakeLock");
            wl.acquire(10_000L); // 10 secondes — assez pour allumer l'écran et voir la notification
        } catch (Exception ignored) {}
    }

    // ─────────────────────────────────────────────────────────────
    // Canal de notification FCM (IMPORTANCE_HIGH)
    // ─────────────────────────────────────────────────────────────

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;

        NotificationManager nm = getSystemService(NotificationManager.class);
        if (nm == null) return;

        // Recréer le canal à chaque fois garantit les bonnes priorités
        NotificationChannel channel = new NotificationChannel(
                ALERT_CHANNEL_ID,
                "Alertes Serveurs Grey Corner",
                NotificationManager.IMPORTANCE_HIGH);

        channel.setDescription("Appels clients et précommandes — temps réel");
        channel.enableVibration(true);
        channel.setVibrationPattern(new long[]{0, 600, 200, 600, 200, 600});
        channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);
        channel.enableLights(true);
        channel.setLightColor(0xFFFFAA00);
        channel.setBypassDnd(true); // Passe en mode Ne pas déranger

        Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        AudioAttributes aa = new AudioAttributes.Builder()
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .setUsage(AudioAttributes.USAGE_NOTIFICATION_EVENT)
                .build();
        channel.setSound(soundUri, aa);

        nm.createNotificationChannel(channel);
    }
}
