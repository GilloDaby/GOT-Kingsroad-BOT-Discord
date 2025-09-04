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
=======

## Commandes slash essentielles

#### Administration
- **setup** : crée salons, rôles et message des timers. *Administrateur requis.*
- **reload** : recharge la configuration et régénère les messages manquants. *Administrateur.*
- **cleanup** : supprime les messages dupliqués postés par le bot. *Administrateur.*
- **permissions** : vérifie les permissions nécessaires dans les salons configurés. *Administrateur.*
- **config export** : exporte la configuration du serveur en JSON. *Administrateur.*
- **config import `<fichier>`** : importe une configuration depuis un fichier JSON. *Administrateur.*
- **set timezone `<IANA>`** : définit le fuseau horaire du serveur (auto-complétion). *Administrateur.*
- **set language `<fr|en|es|pt-br>`** : définit la langue des messages. *Administrateur.*
- **set style `<compact|embed>`** : choisit l'apparence du message des timers. *Administrateur.*
- **rank post** : publie le message pour s'abonner aux rôles d'alerte. *Administrateur.*
- **rank `<drogon|daily|weekly|peddler|beast>` `<role>`** : assigne le rôle utilisé pour chaque alerte. *Administrateur.*
- **message** : envoie ou rafraîchit le message des timers dans le salon global. *Administrateur.*
- **reset** : supprime le message de timers enregistré. *Administrateur.*
- **patchnote** : envoie la dernière note de version et mémorise son message. *Administrateur.*
- **summon `<timer>`** : déclenche immédiatement une alerte (drogon, peddler, daily, weekly, beast). *Administrateur.*
- **status** : affiche la configuration actuelle du serveur (salons, rôles, fuseau...). *Administrateur.*
- **helpadmin** : affiche l'aide réservée aux administrateurs.

#### Utilisateurs
- **timers** : affiche les prochains événements avec compte à rebours.
- **reminder add `<timer>` `<minutes>`** : reçoit un DM `minutes` avant l'événement choisi.
- **reminder list** : liste vos rappels enregistrés.
- **reminder remove `<timer>` `<minutes>`** : supprime un rappel précis.
- **reminder clear `<timer>`** : supprime tous les rappels pour un timer donné.
- **reminder clearall** : efface tous vos rappels.
- **searchmarker `<nom>`** : capture d'écran centrée sur un marqueur de la carte.
- **event** : capture du calendrier d'événements en cours.
- **about** : informations générales sur le bot et le projet.
- **help** : aide générale pour les utilisateurs.
- **ping** : vérifie la latence du bot.
- **uptime** : indique depuis combien de temps le bot est en ligne.


## Scénarios d'usage
- **Nouvelle installation** : `/gotkingsroad setup` puis `/gotkingsroad rank post` pour permettre aux membres de s'abonner aux alertes.
- **Suivi quotidien** : consulter `/gotkingsroad timers` ou poster le message des timers avec `/gotkingsroad message`.
- **Rappels personnels** : `/gotkingsroad reminder add` pour recevoir un DM avant chaque événement.
- **Outils divers** : `/gotkingsroad patchnote`, `/gotkingsroad event`, `/gotkingsroad searchmarker` fournissent des informations et captures utiles aux joueurs.
