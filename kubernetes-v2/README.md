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
