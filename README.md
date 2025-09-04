# GOT Kingsroad Discord Bot

Ce bot Discord fournit aux guildes de **Game of Thrones: Kingsroad** des outils d'organisation : timers centralisés, rappels privés et diverses commandes utilitaires.

## Objectif

Automatiser les alertes du jeu et faciliter la gestion des salons/rôles liés aux événements Drogon, Peddler, Daily, Weekly et Beast.

## Fonctionnalités principales

- **Auto-setup** : crée les salons/roles nécessaires et poste le message des timers.
- **Compte à rebours global** pour Drogon, Peddler, reset quotidien/hebdomadaire et Beast.
- **Rappels DM** personnalisés avant chaque timer.
- **Gestion des rôles d'alerte** via un message à réactions.
- **Patchnote** et capture du calendrier d'événements.
- **Recherche de marqueurs** avec capture d'écran.

## Installation

### Prérequis
- Node.js 18+
- Base de données MySQL accessible
- Compte de bot Discord (token & ID d'application)

### Étapes
1. Cloner ce dépôt puis installer les dépendances :
   ```bash
   npm install
   ```
2. Créer un fichier `.env` contenant au minimum :
   ```ini
   DISCORD_TOKEN=xxxxxxxxxxxx
   CLIENT_ID=xxxxxxxxxxxx            # ou DISCORD_CLIENT_ID
   DB_HOST=localhost
   DB_USER=gotbot
   DB_PASS=motdepasse
   DB_NAME=gotbot
   BROWSERLESS_TOKEN=xxxxxxxxxxxx    # optionnel, pour les captures de calendrier
   ```
3. Enregistrer les commandes slash (à exécuter après chaque mise à jour de commandes) :
   ```bash
   npm run register
   ```
4. Lancer le bot :
   ```bash
   npm start
   ```

## Commandes slash essentielles
Toutes les commandes sont regroupées sous `/gotkingsroad`.

| Commande | Description |
|----------|-------------|
| `/gotkingsroad setup` | Configure automatiquement les salons et rôles du bot. |
| `/gotkingsroad set timezone|language|style` | Définit le fuseau horaire, la langue ou le style d'affichage. |
| `/gotkingsroad timers` | Affiche les prochains timers avec compte à rebours. |
| `/gotkingsroad reminder add|list|remove|clear|clearall` | Gère vos rappels privés. |
| `/gotkingsroad rank post` | Publie le sélecteur de rôles d'alerte. |
| `/gotkingsroad message` | Envoie ou rafraîchit le message des timers. |
| `/gotkingsroad searchmarker` | Affiche une capture centrée sur un marqueur. |
| `/gotkingsroad event` | Publie la capture du calendrier d'événements. |
| `/gotkingsroad patchnote` | Affiche la dernière note de version du bot. |
| `/gotkingsroad summon` | Déclenche manuellement une alerte. |
| `/gotkingsroad status` / `/gotkingsroad uptime` | Informations de diagnostic sur le bot. |

## Scénarios d'usage
- **Nouvelle installation** : `/gotkingsroad setup` puis `/gotkingsroad rank post` pour permettre aux membres de s'abonner aux alertes.
- **Suivi quotidien** : consulter `/gotkingsroad timers` ou poster le message des timers avec `/gotkingsroad message`.
- **Rappels personnels** : `/gotkingsroad reminder add` pour recevoir un DM avant chaque événement.
- **Outils divers** : `/gotkingsroad patchnote`, `/gotkingsroad event`, `/gotkingsroad searchmarker` fournissent des informations et captures utiles aux joueurs.
