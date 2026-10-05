package com.menugreycorner;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import com.google.firebase.messaging.FirebaseMessaging;

/**
 * BootReceiver
 *
 * Relance automatiquement le système Grey Corner après :
 *   • Redémarrage du téléphone  (BOOT_COMPLETED)
 *   • Redémarrage rapide Xiaomi (QUICKBOOT_POWERON)
 *   • HTC/Samsung fast boot     (ACTION_REBOOT)
 *
 * Ce receiver garantit que même après un reboot, les serveurs
 * reçoivent leurs notifications sans devoir rouvrir l'application.
 *
 * Déclaré dans AndroidManifest.xml avec :
 *   <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
 */
public class BootReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if (action == null) return;

        boolean isBoot =
                Intent.ACTION_BOOT_COMPLETED.equals(action)
                || "android.intent.action.QUICKBOOT_POWERON".equals(action)
                || "android.intent.action.REBOOT".equals(action);

        if (!isBoot) return;

        // 1. Relancer le ForegroundService de surveillance
        try {
            Intent serviceIntent = new Intent(context, WaiterForegroundService.class);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent);
            } else {
                context.startService(serviceIntent);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 2. Re-souscrire au topic FCM (le token persiste mais le sub peut expirer)
        try {
            FirebaseMessaging.getInstance()
                    .subscribeToTopic("waiters")
                    .addOnFailureListener(e -> {
                        // Retry géré automatiquement par le SDK Firebase
                    });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
