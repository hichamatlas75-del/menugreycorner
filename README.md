# ☕ Grey Corner — Plateforme Digitale & Club Fidélité

Ce document détaille l'architecture complète, les règles métier du **Menu Digital**, le système d'**Appels Serveurs** et toutes les règles du **Club Fidélité** de Grey Corner.

---

## 📑 Sommaire
1. [Vue d'ensemble de la Plateforme](#1-vue-densemble-de-la-plateforme)
2. [Règles du Menu Digital Client & Commandes](#2-règles-du-menu-digital-client--commandes)
3. [Règles de l'Application Serveurs (Waiter POS)](#3-règles-de-lapplication-serveurs-waiter-pos)
4. [Règles d'Or du Club Fidélité (Loyalty)](#4-règles-dor-du-club-fidélité-loyalty)
5. [Pleins Pouvoirs Administrateur & Direction](#5-pleins-pouvoirs-administrateur--direction)
6. [Architecture Technique & Base de Données](#6-architecture-technique--base-de-données)

---

## 1. Vue d'ensemble de la Plateforme

Grey Corner dispose d'un écosystème web connecté en temps réel via Cloudflare Pages & D1 SQLite :

- **Menu Client (`index.html`) :** Application PWA responsive multi-langue (Français, Arabe, Anglais, Allemand), consultation du menu, pré-commandes par table, adhésion au Club Fidélité, et suivi du solde de points.
- **Application Serveurs (`waiter.html` / APK Android Native) :** Réception instantanée des appels et commandes par table, sonneries d'alerte, validation d'encaissement et attribution de points fidélité.
- **Tableau de Bord Direction (`admin.html`) :** Supervision en temps réel des tables, audit des encaissements, validation des alertes fidélité (> 100 pts), ajustement libre des points, export WhatsApp et statistiques.
- **API Cloudflare Pages (`functions/api/[[route]].js`) :** Moteur REST sécurisé connecté à la base SQLite D1 haute performance.

---

## 2. Règles du Menu Digital Client & Commandes

### A. Sélection de Table & Zone
- Chaque commande ou appel doit être rattaché à une **Table** (1 à 25) et une **Zone** :
  - **Zone 1 (RDC) :** Tables 101 à 112 (affichées Tables 1 à 12).
  - **Zone 2 (Étage) :** Tables 201 à 206 (affichées Tables 13 à 18).
  - **Zone 3 (Terrasse) :** Tables 301 à 307 (affichées Tables 19 à 25).
- Si le client scanne un QR code de table avec paramètre d'URL (ex. `?table=5`), la table est pré-sélectionnée automatiquement.

### B. Panier & Pré-commandes
- Le client compose son panier avec choix des options (laits, sirops, cuisson, suppléments).
- Envoi de la commande avec ou sans numéro de fidélité.
- Statuts de la commande :
  - `pending` : Commande reçue, sonne sur les téléphones des serveurs.
  - `accepted` : Prise en charge par un serveur (la sonnerie s'arrête sur tous les appareils).
  - `completed` : Commande servie, encaissée et clôturée.

### C. Appels Serveurs & Sons
- Le client peut émettre 3 types d'appels :
  1. **Appel Serveur Standard** (Besoin d'aide, commande additionnelle).
  2. **Demande de l'Addition** (Espèces / TPE / Carte).
  3. **Demande de Consommation Gratuite Fidélité** (500 pts).
- L'appel fait sonner les appareils serveurs connectés. Dès qu'un serveur clique sur **« Prendre en charge »**, un push silencieux `CANCEL_ALERT` coupe immédiatement l'alarme sonore de tous ses collègues.

---

## 3. Règles de l'Application Serveurs (Waiter POS)

1. **Identification du Serveur :** Chaque serveur sélectionne son profil (ex. *Serveur 1*, *Karim*, *Hamza*) ou renseigne son nom.
2. **Encaissement Direct & Attribution de Points :**
   - Le serveur peut encaisser une commande existante ou saisir un encaissement direct par numéro de téléphone.
   - **Règle 1 DH = 1 Point.**
3. **Contrôle Antifraude :**
   - Le serveur est soumis aux règles d'anti-fraude automatiques (délai de 2h et seuil direction > 100 pts).
   - Les messages d'avertissement et de succès sont affichés clairement sans bloquer l'activité en salle.

---

## 4. Règles d'Or du Club Fidélité (Loyalty)

### 🥇 Règle 1 : Identifiant Unique
- **Le numéro de téléphone est le seul et unique repère du client.**
- Normalisation automatique des formats marocains (`06...`, `07...`, `05...`, `+212...`, `00212...`).
- Même si le client saisit un prénom différent ou fait une faute d'orthographe, le compte rattaché au numéro de téléphone prime toujours.

### 🎁 Règle 2 : Cadeau de Bienvenue
- Dès l'inscription ou la première commande enregistrée sur un numéro, **+20 points de bienvenue** sont offerts automatiquement sur le compte.

### 💰 Règle 3 : Ratio d'Attribution
- **1 DH = 1 Point Fidélité.**
- Exemple : Une addition de 85 DH rapporte **+85 points**.

### ☕ Règle 4 : Récompense (Consommation Offerte)
- **500 Points = 1 Consommation Offerte** (Boisson chaude, fraîche, café de spécialité ou gourmandise).
- Lorsque le client atteint 500 points :
  - Le badge doré et le bouton festif **« 🎁 Demander ma consommation gratuite »** se débloquent sur son écran.
  - Le serveur ou l'administrateur peut déduire les 500 points pour accorder la récompense.

### 🛑 Règle 5 : Règle Antifraude Serveurs (< 2 Heures)
- **Objectif :** Empêcher les abus ou attributions répétées de points sur le même numéro de téléphone lors d'un même service.
- **Principe :** Un serveur ne peut attribuer des points au même numéro de téléphone qu'**une seule fois toutes les 2 heures (120 minutes)**.
- **En cas de tentative prématurée :**
  - La demande est immédiatement bloquée par l'API Cloudflare.
  - L'écran indique précisément : *« ⛔ BLOCAGE ANTIFRAUDE (Moins de 2h) : Ce numéro a déjà été crédité il y a moins de 2 heures (Table X). Nouveau crédit autorisé dans Y minute(s). »*

### 🚨 Règle 6 : Additions > 100 DH (> 100 Points) par les Serveurs
- **L'encaissement et la commande passent TOUJOURS :**
  - Le montant passe obligatoirement, la commande est encaissée, clôturée et le client n'est jamais bloqué en caisse.
- **Mise en attente de validation direction :**
  - Si le montant saisi par un serveur est supérieur à **100 DH (> 100 pts)**, les points ne sont pas crédités instantanément.
  - La transaction est créée avec le statut :  
    `⏳ [EN ATTENTE VALIDATION ADMIN >100 PTS] Encaissement X DH (+X pts) — Table Y`.
  - Le serveur et le client reçoivent la confirmation :  
    *« ✅ Addition validée ! Les points (>100 pts) sont en attente de confirmation par la direction. »*
- **Traitement par la Direction (`admin.html`) :**
  - L'alerte apparaît en haut du tableau de bord dans la section **« Contrôle & Validation des Points (> 100 pts) »**.
  - L'administrateur dispose de 3 actions directes :
    1. **✅ Valider & Créditer :** Valide le ticket de caisse. Les points sont immédiatement crédités sur le compte client.
    2. **✏️ Rectifier :** Si le serveur s'est trompé dans la saisie (ex. a tapé 500 DH au lieu de 50 DH), l'admin renseigne le vrai montant (50 DH) ; le client reçoit exactement +50 points et la transaction est archivée avec l'historique complet.
    3. **❌ Rejeter :** En cas d'erreur totale ou de fraude, l'admin rejette la demande. **0 point n'est crédité**, et le client n'est pas pénalisé par le blocage des 2 heures.

---

## 5. Pleins Pouvoirs Administrateur & Direction

L'administrateur dispose d'une **liberté totale et sans aucune restriction** pour gérer les points des clients :

| Action Admin | Restriction de délai (2h) ? | Seuil >100 pts ? | Description |
| :--- | :---: | :---: | :--- |
| **Ajouter des points** | ❌ **Aucune** | ❌ **Aucun** | L'admin peut créditer n'importe quel montant (10 pts, 150 pts, 1000 pts) à tout moment, sans aucun délai d'attente. |
| **Déduire des points** | ❌ **Aucune** | ❌ **Aucun** | L'admin peut déduire n'importe quel nombre de points (correction, remboursement, annulation) avec motif d'ajustement. |
| **Offrir une consommation** | ❌ **Aucune** | ❌ **Aucun** | Déduction directe de 500 points pour accorder une consommation offerte. |
| **Rectifier un montant** | ❌ **Aucune** | ❌ **Aucun** | Correction en 1 clic des erreurs de saisie des serveurs. |

---

## 6. Architecture Technique & Base de Données

### Schéma des Tables D1 SQLite

1. **`loyalty_members` :**
   - `phone` (TEXT, Clé primaire normalisée)
   - `firstName` (TEXT, Prénom du client)
   - `points` (INTEGER, Solde actif)
   - `totalEarned` (INTEGER, Cumul historique)
   - `rewardsClaimed` (INTEGER, Nombre de boissons gratuites reçues)
   - `source` (TEXT, `qr_menu`, `waiter_direct`, `admin`)
   - `createdAt`, `updatedAt` (ISO Timestamp)

2. **`loyalty_transactions` :**
   - `id` (TEXT, Clé primaire)
   - `phone` (TEXT, Référence client)
   - `type` (`WELCOME`, `EARN`, `REDEEM`, `ADMIN_ADJUST`, `REJECTED`)
   - `pointsDelta` (INTEGER, Points ajoutés ou déduits)
   - `amountDH` (REAL, Montant de l'addition)
   - `tableNumber` (TEXT, Table concernée)
   - `orderId` (TEXT, Id de commande liée)
   - `validatedBy` (TEXT, Profil du serveur ou admin)
   - `note` (TEXT, Historique et détails de validation)
   - `createdAt` (ISO Timestamp)

3. **`pre_orders` :**
   - Commandes clients avec statut, liste des articles, table, zone et flag `loyaltyCredited`.

4. **`waiters_calls` :**
   - Appels serveurs, demandes d'addition et demandes de consommation gratuite.

5. **`system_config` :**
   - Réglages globaux (`loyalty_config`, `system_frozen`).

---

*Grey Corner — Système d'Encaissement & Club Fidélité développé pour Cloudflare Pages & D1.*
