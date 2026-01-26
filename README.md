# Fail2ban Security Map

> - **DEMURE Aurélie** Développeuse Full Stack /DevOps

---

## 1. Présentation du Projet

**Fail2ban Security Map** a pour objectif de **collecter, analyser et visualiser des adresses IP bannies par Fail2ban** sur une carte dynamique.

Le projet s'inscrit dans une démarche :

- de **conteneurisation** (Docker),
- d'**orchestration** (Kubernetes),
- et de **mise à disposition sécurisée** via Cloudflare Zero Trust.

**Fonctionnalités principales :**

- Collecte des IP bannies par Fail2ban
- Envoi des IP vers une base de données PostgreSQL
- Géolocalisation des IP (GeoIP)
- Exposition des bannissements par une API backend
- Affichage des IP sur une carte interactive dans une interface web

**Lien accessible (si tunnel actif) :**

Non disponible. Le tunnel Cloudfare génère une URL éphémère, visible dans les logs du conteneur `coudflared`.

**Screenshot de l'application déployée** :
![deploy-map](images/deploy-map.png)

## 2. Architecture Technique

L'architecture repose sur les principes suivants :

- **Cloudflare Tunnel (Zero Trust)** pour exposer l'application sans ouvrir de ports entrants
- **Caddy** comme reverse proxy (séparation public/privé)
- **Backend API (Node.js)** pour centraliser les bannissements
- **Base de données PostgreSQL** pour persister les IP
- **Frontend web (React)** pour la visualisation
- **Fail2ban** réel ou simulé selon la version

### Schéma d'infrastructure

_Ce schéma est généré dynamiquement à partir du fichier `architecture.puml` présent dans ce dépôt._

![Architecture du Projet](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/lilipix/fail2ban-security-map/main/architecture.puml)

## 3. Organisation du dépôt

Ce dépôt contient **plusieurs versions du même projet**, correspondant à différentes approches techniques et à une progression pédagogique :

- `docker/` : version Docker Compose fonctionnelle
- `kubernetes-v1/` : première tentative Kubernetes simple (Fail2ban réel)
- `kubernetes-v2/` : version Kubernetes avec simulation de Fail2ban et load balancing

## 4. Démarrage du projet

Ce README global ne décrit pas les commandes de lancement.

Chaque version dispose de son propre README :

- [docker](docker/README.md)
- [kubernetes-v1](kubernetes-v1/README.md)
- [kubernetes-v2](kubernetes-v2/README.md)

## 5. Bilan du projet

Ce projet m’a permis de découvrir le modèle de sécurité Zero Trust et la protection via Fail2ban. J'ai envie d'aller plus loin sur ces sujets et je projette d'implémenter Cloudflare et Fail2ban sur mon propre serveur afin d'améliorer sa sécurité.
