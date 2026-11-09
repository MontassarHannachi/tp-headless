# 🛍️ Headless Commerce
### Modern E-commerce Platform · Strapi 5 × Next.js 16

<p align="center">
  A modern, containerized headless e-commerce platform built with <strong>Strapi 5</strong>, <strong>Next.js 16</strong>, <strong>React 19</strong> and <strong>Docker</strong>.
  <br />
  <br />
  Designed with a decoupled architecture, server-side API processing and HTTPS-enabled local deployment.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Strapi-5-4945FF?logo=strapi&logoColor=white" alt="Strapi" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Nginx-009639?logo=nginx&logoColor=white" alt="Nginx" />
</p>

<p align="center">
  <a href="#-english">English</a> ·
  <a href="#-français">Français</a>
</p>

---

# 🇬🇧 English

## Overview

**Headless Commerce** is a full-stack e-commerce project built around a decoupled architecture.

The backend uses Strapi 5 as a headless CMS to manage products and application data through a REST API. The frontend is developed with Next.js 16 and provides the customer-facing shopping experience.

Docker Compose orchestrates the services, while Nginx acts as a reverse proxy and handles HTTPS connections.

The project focuses on frontend/backend separation, secure server-side processing, containerization and practical deployment concepts.

## Preview

### Storefront

![Storefront Preview](docs/captures/vitrine-docker.png)

### Strapi Administration

![Strapi Administration](docs/captures/vitrine.png)

## Key Features

| Area | Features |
|---|---|
| Product Catalog | Product listing, search, sorting and result counter |
| Product Details | Product information, breadcrumbs and related products |
| Shopping Cart | Persistent cart using localStorage, quantity management and totals |
| Checkout | Server-side order processing and price calculation |
| Order Protection | Idempotency mechanism to prevent duplicate order creation |
| Contact | Contact form with server-side API processing |
| User Interface | Responsive storefront, dark mode and loading states |
| CMS | Product and category management with Strapi |
| Infrastructure | Docker Compose, Nginx reverse proxy and local HTTPS |

## Architecture

The application is divided into three main services.

| Service | Responsibility |
|---|---|
| Nginx | HTTPS termination, HTTP redirection and reverse proxy |
| Next.js | Storefront, server-side rendering and API routes |
| Strapi 5 | Headless CMS, REST API and application data management |

### Architecture Diagram

```text
                     CUSTOMER
                        |
                        | HTTPS / HTTP
                        v
                +------------------+
                |      NGINX       |
                | Reverse Proxy    |
                |    80 / 443      |
                +------------------+
                        |
                        | Internal HTTP
                        v
                +------------------+
                |     NEXT.JS      |
                |    Frontend      |
                |      :3000       |
                +------------------+
                        |
                        | Internal Docker Network
                        | API_INTERNAL_URL
                        v
                +------------------+
                |     STRAPI 5     |
                |     Backend      |
                |      :1337       |
                +------------------+
                        |
                        v
                +------------------+
                |      SQLITE      |
                |    Database      |
                +------------------+
                        |
                        v
                Persistent Storage
```

### Network Design

- Nginx is the public entry point on the host's configured network interface.
- HTTP traffic is redirected to HTTPS.
- Next.js communicates with Strapi through the internal Docker network.
- Strapi is published on `127.0.0.1:1337` on the host, not directly exposed to the LAN.
- Next.js port `3000` is not directly published on the host.
- SQLite data and uploaded media are persisted through Docker bind mounts.

## Technology Stack

| Category | Technology |
|---|---|
| CMS / Backend | Strapi 5 |
| Frontend Framework | Next.js 16 |
| UI Library | React 19 |
| Programming Languages | TypeScript, JavaScript |
| Styling | Tailwind CSS 4 |
| Database | SQLite |
| Runtime | Node.js 22 |
| Containerization | Docker |
| Orchestration | Docker Compose |
| Reverse Proxy | Nginx |
| Local HTTPS | mkcert |
| Version Control | Git / GitHub |

## API Design

The Next.js application uses server-side API routes to communicate with Strapi.

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/checkout` | POST | Processes checkout requests |
| `/api/contact` | POST | Submits contact messages |
| `/api/media/[...path]` | GET | Handles media requests |

### Checkout Processing

The checkout workflow includes:

- Server-side request processing.
- Server-side price calculation.
- Backend communication through an internal API helper.
- Secret-based authentication between the frontend server and Strapi.
- Idempotency protection to prevent duplicate orders when a request is retried.

The backend remains responsible for order creation and price validation rather than trusting prices supplied by the browser.

## Security and HTTPS

The local deployment uses Nginx and mkcert to provide HTTPS without requiring a public domain.

Implemented measures include:

- HTTPS with TLS certificates.
- HTTP-to-HTTPS redirection.
- Restricted host port exposure for Strapi.
- Internal Docker communication between application services.
- Server-side storage of the API secret.
- Security-related HTTP response headers.
- Protected private certificate keys.

**Important:** mkcert certificates are intended for local development and trusted local environments. They are not publicly trusted certificates for an Internet-facing production website.

Never commit `.env` files, private keys or application secrets.

## Project Structure

```text
tp-headless/
│
├── backend-accessoires/
│   ├── src/
│   │   └── api/
│   │       ├── contact-message/
│   │       └── order/
│   ├── public/
│   │   └── uploads/
│   ├── Dockerfile
│   └── ...
│
├── frontend-vitrine/
│   ├── app/
│   │   ├── api/
│   │   │   ├── _lib/
│   │   │   ├── checkout/
│   │   │   ├── contact/
│   │   │   └── media/
│   │   ├── commande/
│   │   ├── contact/
│   │   └── produit/
│   ├── Dockerfile
│   └── ...
│
├── nginx/
│   └── default.conf
│
├── docs/
│   └── captures/
│
├── docker-compose.yml
├── .env.example
└── .gitignore
```

The `certs/` directory and private environment files are generated locally and excluded from version control.

## Getting Started

### Prerequisites

- Linux host or virtual machine.
- Docker Engine.
- Docker Compose.
- Git.
- mkcert.
- A network-accessible host IP address.

Node.js does not need to be installed directly on the host because the applications run inside Docker containers.

### 1. Clone the repository

```bash
git clone https://github.com/MontassarHannachi/tp-headless.git
cd tp-headless
```

### 2. Configure environment variables

Create the root environment file:

```bash
cp .env.example .env
```

Create the Strapi environment file:

```bash
cp backend-accessoires/.env.example backend-accessoires/.env
```

Generate a strong application secret:

```bash
openssl rand -base64 32
```

Configure the required variables in the root `.env` file.

Example:

```env
NEXT_PUBLIC_API_URL=https://YOUR_HOST_IP
STORE_API_SECRET=YOUR_GENERATED_SECRET
```

Use the same secret in the relevant backend configuration.

The frontend also uses the internal service URL:

```text
API_INTERNAL_URL=http://strapi:1337
```

Do not publish real environment files or secrets.

### 3. Configure the host IP address

The provided Nginx and Docker Compose configurations use the example VM IP address `192.168.213.129`.

Before deployment, replace this address with your actual host IP in:

- `docker-compose.yml`
- `nginx/default.conf`

Also update `NEXT_PUBLIC_API_URL` in the root `.env` file.

### 4. Generate local HTTPS certificates

Install mkcert:

```bash
sudo apt update
sudo apt install mkcert
```

Install the local Certificate Authority:

```bash
mkcert -install
```

Generate certificates for the host IP:

```bash
mkdir -p certs

mkcert \
  -cert-file certs/local-cert.pem \
  -key-file certs/local-key.pem \
  YOUR_HOST_IP
```

Protect the private key:

```bash
chmod 600 certs/local-key.pem
chmod 644 certs/local-cert.pem
```

For browsers on other devices to trust the certificate, install the public mkcert root certificate on those devices.

Never distribute `rootCA-key.pem` or `local-key.pem`.

### 5. Build and start the containers

```bash
docker compose up -d --build
```

Check the services:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

## Accessing the Application

Replace `YOUR_HOST_IP` with the configured host IP.

| Service | Address |
|---|---|
| Storefront | `https://YOUR_HOST_IP` |
| HTTP redirect | `http://YOUR_HOST_IP` |
| Strapi API (host only) | `http://127.0.0.1:1337` |
| Strapi Health Check (host only) | `http://127.0.0.1:1337/_health` |

### Strapi Administration

The Strapi administration panel is not directly exposed to the local network.

To access it from another computer, create an SSH tunnel:

```bash
ssh -L 1337:127.0.0.1:1337 USERNAME@YOUR_HOST_IP
```

Then open:

```text
http://localhost:1337/admin
```

Create the initial administrator account through the Strapi setup interface.

## Data Persistence

The project uses persistent host directories:

| Directory | Purpose |
|---|---|
| `backend-accessoires/.tmp` | SQLite database |
| `backend-accessoires/public/uploads` | Uploaded media |

These directories preserve data when containers are recreated.

**Warning:** Removing containers with `docker compose down` does not remove these host directories. Manually deleting them can result in permanent data loss. Regular backups are recommended.

## Useful Docker Commands

```bash
# Start services
docker compose up -d

# Rebuild and start
docker compose up -d --build

# Stop services
docker compose down

# View all logs
docker compose logs -f

# Follow Strapi logs
docker compose logs -f strapi

# Follow Next.js logs
docker compose logs -f frontend

# Follow Nginx logs
docker compose logs -f nginx

# Check container status
docker compose ps
```

## Project Goals and Learning Outcomes

This project provided practical experience with:

- Headless CMS architecture.
- Decoupled frontend and backend design.
- REST API integration.
- Server-side request processing.
- Secure handling of application secrets.
- E-commerce checkout workflows.
- Idempotent order processing.
- Docker containerization and orchestration.
- Reverse proxy configuration.
- Local HTTPS and TLS certificates.
- Persistent database and media storage.
- Git-based version control.

## Future Improvements

Potential areas for further development:

- Automated testing and CI/CD pipelines.
- Automated database backup and recovery.
- Production-grade public HTTPS deployment.
- Improved monitoring and application logging.
- Payment provider integration.
- Automated deployment workflow.

## Author

**Montassar Hannachi**

Full Stack Development Project

- GitHub: [@MontassarHannachi](https://github.com/MontassarHannachi)
- Repository: [tp-headless](https://github.com/MontassarHannachi/tp-headless)

---

# 🇫🇷 Français

## Présentation

**Headless Commerce** est un projet e-commerce Full Stack reposant sur une architecture découplée.

Le backend utilise Strapi 5 comme CMS Headless pour gérer les produits et les données de l'application via une API REST. Le frontend, développé avec Next.js 16, fournit l'interface de navigation et d'achat.

Docker Compose orchestre les différents services, tandis que Nginx assure le reverse proxy et la gestion des connexions HTTPS.

Ce projet met en pratique la séparation frontend/backend, le traitement sécurisé des requêtes serveur, la conteneurisation et les principes de déploiement d'applications web.

## Fonctionnalités principales

| Domaine | Fonctionnalités |
|---|---|
| Catalogue | Affichage des produits, recherche, tri et compteur de résultats |
| Fiches produits | Informations détaillées, fil d'Ariane et produits associés |
| Panier | Persistance avec localStorage, gestion des quantités et calcul des totaux |
| Commandes | Traitement des commandes côté serveur et calcul des prix |
| Protection | Idempotence pour limiter les commandes en double |
| Contact | Formulaire avec traitement via API serveur |
| Interface | Design responsive, mode sombre et états de chargement |
| CMS | Gestion des produits et catégories avec Strapi |
| Infrastructure | Docker Compose, Nginx et HTTPS local |

## Architecture technique

L'application repose sur trois services principaux :

- **Nginx :** point d'entrée HTTP/HTTPS, terminaison TLS et reverse proxy.
- **Next.js :** frontend e-commerce et routes API côté serveur.
- **Strapi 5 :** CMS Headless, API REST et gestion des données applicatives.

Les services communiquent à travers un réseau Docker interne. Le frontend utilise `API_INTERNAL_URL` pour accéder à Strapi.

### Exposition réseau

- Nginx expose les ports 80 et 443 sur l'interface réseau configurée de la machine.
- Les requêtes HTTP sont redirigées vers HTTPS.
- Next.js communique avec Strapi via le réseau interne Docker.
- Strapi est publié sur `127.0.0.1:1337` côté hôte et n'est pas directement exposé au réseau local.
- Le port 3000 de Next.js n'est pas directement publié sur l'hôte.
- La base SQLite et les fichiers téléversés sont conservés dans des répertoires persistants.

## Technologies utilisées

| Catégorie | Technologie |
|---|---|
| CMS / Backend | Strapi 5 |
| Framework Frontend | Next.js 16 |
| Bibliothèque UI | React 19 |
| Langages | TypeScript, JavaScript |
| Styles | Tailwind CSS 4 |
| Base de données | SQLite |
| Runtime | Node.js 22 |
| Conteneurisation | Docker |
| Orchestration | Docker Compose |
| Reverse Proxy | Nginx |
| HTTPS local | mkcert |
| Gestion de versions | Git / GitHub |

## API et traitement des commandes

L'application Next.js expose des routes serveur qui communiquent avec Strapi.

| Route | Méthode | Fonction |
|---|---|---|
| `/api/checkout` | POST | Traitement des commandes |
| `/api/contact` | POST | Envoi des messages de contact |
| `/api/media/[...path]` | GET | Gestion des requêtes média |

Le processus de commande comprend :

- Le traitement des requêtes côté serveur.
- Le calcul des prix côté serveur.
- La communication interne avec Strapi.
- L'authentification entre le frontend serveur et Strapi via un secret.
- Un mécanisme d'idempotence pour éviter la création de commandes en double lors de nouvelles tentatives.

## Sécurité et HTTPS

Le déploiement local utilise Nginx et mkcert afin d'activer HTTPS sans nom de domaine public.

Les mesures mises en place comprennent :

- Chiffrement HTTPS avec certificats TLS.
- Redirection automatique HTTP vers HTTPS.
- Limitation de l'exposition réseau de Strapi.
- Communication interne entre les conteneurs.
- Protection des secrets côté serveur.
- En-têtes HTTP liés à la sécurité.
- Protection des clés privées des certificats.

**Important :** les certificats mkcert sont destinés aux environnements locaux et aux appareils configurés pour leur faire confiance. Ils ne constituent pas des certificats publiquement reconnus pour un site Internet en production.

## Installation

### Prérequis

- Machine Linux ou machine virtuelle.
- Docker Engine.
- Docker Compose.
- Git.
- mkcert.
- Adresse IP accessible sur le réseau.

Node.js n'a pas besoin d'être installé directement sur l'hôte puisque les applications s'exécutent dans des conteneurs Docker.

### 1. Cloner le dépôt

```bash
git clone https://github.com/MontassarHannachi/tp-headless.git
cd tp-headless
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
cp backend-accessoires/.env.example backend-accessoires/.env
```

Générer un secret robuste :

```bash
openssl rand -base64 32
```

Configurer les variables nécessaires dans `.env`.

Exemple :

```env
NEXT_PUBLIC_API_URL=https://YOUR_HOST_IP
STORE_API_SECRET=YOUR_GENERATED_SECRET
```

Le frontend utilise également l'adresse interne suivante :

```text
API_INTERNAL_URL=http://strapi:1337
```

Ne jamais publier les fichiers d'environnement réels ni les secrets.

### 3. Configurer l'adresse IP

Les configurations Nginx et Docker Compose utilisent initialement l'adresse IP d'exemple `192.168.213.129`.

Il faut la remplacer par l'adresse IP réelle de la machine dans :

- `docker-compose.yml`
- `nginx/default.conf`

Il faut également adapter `NEXT_PUBLIC_API_URL` dans `.env`.

### 4. Générer les certificats HTTPS

Installer mkcert :

```bash
sudo apt update
sudo apt install mkcert
```

Installer l'autorité de certification locale :

```bash
mkcert -install
```

Générer les certificats :

```bash
mkdir -p certs

mkcert \
  -cert-file certs/local-cert.pem \
  -key-file certs/local-key.pem \
  YOUR_HOST_IP
```

Protéger la clé privée :

```bash
chmod 600 certs/local-key.pem
chmod 644 certs/local-cert.pem
```

Pour que les navigateurs des autres appareils reconnaissent le certificat, il faut installer le certificat racine public mkcert sur ces appareils.

Ne jamais partager `rootCA-key.pem` ou `local-key.pem`.

### 5. Construire et démarrer les services

```bash
docker compose up -d --build
```

Vérifier les conteneurs :

```bash
docker compose ps
```

Consulter les journaux :

```bash
docker compose logs -f
```

## Accès à l'application

| Service | Adresse |
|---|---|
| Boutique | `https://YOUR_HOST_IP` |
| Redirection HTTP | `http://YOUR_HOST_IP` |
| API Strapi (hôte uniquement) | `http://127.0.0.1:1337` |
| Vérification de santé Strapi | `http://127.0.0.1:1337/_health` |

### Administration Strapi

Le panneau d'administration Strapi n'est pas directement exposé au réseau local.

Pour y accéder depuis un autre ordinateur, créer un tunnel SSH :

```bash
ssh -L 1337:127.0.0.1:1337 USERNAME@YOUR_HOST_IP
```

Puis ouvrir :

```text
http://localhost:1337/admin
```

Créer le premier compte administrateur depuis l'interface de configuration Strapi.

## Persistance des données

Deux répertoires assurent la persistance des données :

| Répertoire | Utilisation |
|---|---|
| `backend-accessoires/.tmp` | Base de données SQLite |
| `backend-accessoires/public/uploads` | Fichiers téléversés |

Ces répertoires conservent les données lorsque les conteneurs sont recréés.

**Attention :** `docker compose down` ne supprime pas ces répertoires. En revanche, leur suppression manuelle peut entraîner une perte définitive des données. Des sauvegardes régulières sont recommandées.

## Commandes Docker utiles

```bash
# Démarrer les services
docker compose up -d

# Reconstruire et démarrer
docker compose up -d --build

# Arrêter les services
docker compose down

# Consulter tous les journaux
docker compose logs -f

# Journaux Strapi
docker compose logs -f strapi

# Journaux Next.js
docker compose logs -f frontend

# Journaux Nginx
docker compose logs -f nginx

# Vérifier les conteneurs
docker compose ps
```

## Objectifs pédagogiques et compétences développées

Ce projet m'a permis de mettre en pratique :

- L'architecture Headless CMS.
- La séparation frontend et backend.
- L'intégration d'API REST.
- Le traitement des requêtes côté serveur.
- La gestion sécurisée des secrets applicatifs.
- Le processus de commande e-commerce.
- L'idempotence des opérations.
- La conteneurisation et l'orchestration Docker.
- La configuration d'un reverse proxy.
- Le HTTPS local et les certificats TLS.
- La persistance des données.
- La gestion de versions avec Git et GitHub.

## Auteur

**Montassar Hannachi**

Projet de développement Full Stack.

- GitHub : [@MontassarHannachi](https://github.com/MontassarHannachi)
- Dépôt : [tp-headless](https://github.com/MontassarHannachi/tp-headless)

---

<p align="center">
  <strong>Built with Strapi, Next.js and Docker.</strong>
  <br />
  <sub>Full Stack Development · Headless Architecture · Containerization</sub>
</p>
