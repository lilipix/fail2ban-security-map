# Fail2ban Security Map

> - **DEMURE Aurélie**

---

## 1. Présentation du Projet

Ce projet a pour objectif de visualiser sur une carte interactive les adresses IP bannies par Fail2ban à partir de logs simulés.

**Fonctionnalités principales :**

- Collecte des IP bannies par Fail2ban
- Envoi des IP vers une base de données PostgreSQL
- Géolocalisation des IP (GeoIP)
- Exposition des bannissements par une API backend
- Affichage des IP sur une carte interactive dans une interface web

**Lien accessible (si tunnel actif) :**
Non disponible. Le tunnel cloudfare génère une URL éphémère, visible dans les logs du conteneur `coudflared`.

**Screenshot de l'application déployée** :
![deploy-map](deploy-map.png)

## 2. Architecture Technique

### Schéma d'infrastructure

_Ce schéma est généré dynamiquement à partir du fichier `architecture.puml` présent dans ce dépôt._

![Architecture du Projet](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/lilipix/fail2ban-security-map/main/architecture.puml)

### Description des services

| Service            | Image Docker                 | Rôle                        | Port Interne |
| :----------------- | :--------------------------- | :-------------------------- | :----------- |
| **Caddy Public**   | `caddy-public`               | Reverse Proxy public        | 80           |
| **Caddy Privzate** | `caddy-private`              | Reverse Proxy interne       | 80           |
| **Frontend**       | `f2b-frontend`               | Application web (map + UI)  | 80           |
| **Backend**        | `f2b-backend`                | API REST                    | 3000         |
| **GeoIP**          | `maxmindinc/geoipupdate`     | Géolocalisation             | N/A          |
| **Log Generator**  | `f2b-log-generator`          | Simulation d'attaques       | N/A          |
| **Fail2ban**       | `linuxserver/fail2ban:1.1.0` | Détection & bannissement IP | 5432         |
| **DB**             | `postgres:15`                | Stockage des bannissements  | 5432         |
| **Tunnel**         | `cloudflared`                | Exposition Internet         | N/A          |

## Organisation du dépôt

Ce dépôt contient plusieurs implémentations du projet, correspondant à différentes approches techniques :

- `docker/` : version Docker Compose fonctionnelle (Fail2ban réel)
- `kubernetes-v1/` : première tentative Kubernetes simple (Fail2ban non fonctionnel)
- `kubernetes-v2/` : version Kubernetes avec simulation de Fail2ban et load balancing
