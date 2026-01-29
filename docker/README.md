# Fail2ban Security Map - Version Docker Compose – Stack fonctionnelle

Cette version du projet repose sur **Docker Compose** et constitue la version **fonctionnelle de référence.**
Elle intègre un **Fail2ban réel**, un backend API, un frontend web et une base de données PostgreSQL, exposés de manière sécurisée via **Caddy** et **Cloudflare Tunnel.**

## 1. Description des services

| Service           | Image Docker                 | Rôle                        | Port Interne |
| :---------------- | :--------------------------- | :-------------------------- | :----------- |
| **Caddy Public**  | `caddy-public`               | Reverse Proxy public        | 80           |
| **Caddy Private** | `caddy-private`              | Reverse Proxy interne       | 80           |
| **Frontend**      | `f2b-frontend`               | Application web (map + UI)  | 80           |
| **Backend**       | `f2b-backend`                | API REST                    | 3000         |
| **GeoIP**         | `maxmindinc/geoipupdate`     | Mise à jour base GeoIP      | N/A          |
| **Log Generator** | `f2b-log-generator`          | Simulation d'attaques       | N/A          |
| **Fail2ban**      | `linuxserver/fail2ban:1.1.0` | Détection & bannissement IP | N/A          |
| **DB**            | `postgres:15`                | Stockage des bannissements  | 5432         |
| **Tunnel**        | `cloudflare/cloudflared`     | Exposition Internet         | N/A          |

## 2. Prérequis

- Docker
- Docker Compose
- Taskfile

---

## Outils et automatisation

**Taskfile**
Les versions utilisent un **Taskfile** afin de simplifier les commandes récurrentes Docker (démarrage, arrêt, construction, ...)

**Dockge**
Le projet peut également être administré via **Dockge**, une interface web permettant de :

- gérer les stacks Docker Compose,
- visualiser l'état des services,
- consulter les logs.
