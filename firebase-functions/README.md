# Grey Corner — Firebase Cloud Functions (FCM Serveur)

Ce dossier contient les fonctions serveur Firebase exécutées automatiquement dès qu'un document est créé dans **Firestore** (`waiters_calls` ou `pre_orders`).

## Fonctionnalités
- Envoi automatique de notifications **Google FCM HTTP v1** aux smartphones des serveurs.
- **Réveil des appareils même lorsque l'application est fermée et l'écran éteint**.
- Nettoyage automatique des tokens de téléphones expirés.
- Priorité haute (`Urgency: high`) et vibration puissante.

## Déploiement en 2 étapes

### 1. Prérequis
Installez la CLI Firebase si ce n'est pas déjà fait :
```bash
npm install -g firebase-tools
```

Connectez-vous à votre compte Google :
```bash
firebase login
```

### 2. Déploiement
Dans le dossier `firebase-functions` :
```bash
cd firebase-functions
npm install
firebase deploy --only functions
```

Une fois déployé, dès qu'un client appelle un serveur ou passe une commande, les téléphones enregistrés sonneront et afficheront la notification instantanément.
