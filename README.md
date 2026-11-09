# Headless Commerce
### Modern E-commerce Platform · Strapi 5 × Next.js 16

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-blue?logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Strapi-5-4945FF?logo=strapi" alt="Strapi"/>
  <img src="https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker" alt="Docker"/>
  <img src="https://img.shields.io/badge/Nginx-Reverse%20Proxy-009639?logo=nginx" alt="Nginx"/>
</p>

<p align="center">
  A full-stack headless e-commerce application built with Next.js and Strapi, containerized with Docker and secured with local HTTPS.
</p>

<p align="center">
  <a href="#english">English</a> ·
  <a href="#français">Français</a>
</p>

---

# English

## 1. Project Overview

**Headless Commerce** is a full-stack e-commerce application developed using a headless architecture.

The project separates the frontend presentation layer from the backend content and product management system.

The frontend is built with Next.js, while Strapi provides the backend API and content management capabilities.

The application is containerized with Docker Compose and exposed through an Nginx reverse proxy using HTTPS for secure access on a local network.

## 2. Screenshots

### Homepage

![Homepage](docs/captures/vitrine.png)

### Product Details

![Product Details](docs/captures/produit.png)

### Shopping Cart

![Shopping Cart](docs/captures/panier.png)

### Checkout

![Checkout](docs/captures/commande.png)

## 3. Main Features

### Frontend
- Responsive e-commerce interface.
- Product catalog and product details.
- Product images and descriptions.
- Shopping cart management.
- Checkout form.
- Contact form.
- Informational and trust pages.

### Backend
- Strapi 5 headless CMS.
- REST API for product and content management.
- Order creation and management.
- Contact form processing.
- Server-side price calculation.
- Request validation.
- Idempotent order creation to prevent duplicate submissions.

### Infrastructure and Security
- Docker Compose multi-container architecture.
- Nginx reverse proxy.
- Local HTTPS using mkcert.
- HTTP to HTTPS redirection.
- Security-related HTTP response headers.
- Persistent SQLite database.
- Protected backend API routes using a shared server-side secret.

## 4. Technology Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | Frontend application |
| React 19 | User interface |
| TypeScript | Type-safe development |
| Strapi 5 | Headless CMS and backend API |
| SQLite | Database |
| Docker | Containerization |
| Docker Compose | Service orchestration |
| Nginx | Reverse proxy and HTTPS |
| mkcert | Local TLS certificates |
| Ubuntu | Deployment environment |

## 5. Architecture

```text
                 User Browser
                      |
                      | HTTPS :443
                      v
                +-----------+
                |   Nginx   |
                |  Reverse  |
                |   Proxy   |
                +-----------+
                      |
                      | HTTP
                      v
                +-----------+
                |  Next.js  |
                | Frontend  |
                +-----------+
                      |
                      | Internal HTTP
                      v
                +-----------+
                |  Strapi   |
                | Backend   |
                +-----------+
                      |
                      v
                +-----------+
                |  SQLite   |
                | Database  |
                +-----------+
```

### Network Configuration

| Service | Internal Port | Access |
|---|---:|---|
| Nginx | 80 / 443 | Local network |
| Next.js | 3000 | Docker network |
| Strapi | 1337 | Localhost / Docker network |
| SQLite | — | Persistent local storage |

Nginx is the main entry point for browser traffic. HTTPS terminates at Nginx, which forwards requests to the frontend.

The frontend communicates with Strapi through the internal Docker network.

## 6. API Routes

The Next.js application provides server-side API routes for sensitive operations.

| Endpoint | Method | Description |
|---|---|---|
| `/api/checkout` | POST | Creates an order |
| `/api/contact` | POST | Processes contact form submissions |
| `/api/media/[...path]` | GET | Proxies media requests |

The checkout implementation validates requests and calculates order prices on the server side.

Idempotency keys are used to prevent duplicate order creation when the same request is submitted more than once.

## 7. Project Structure

```text
tp-headless/
│
├── backend-accessoires/
│   ├── config/
│   ├── src/
│   ├── public/
│   └── .tmp/
│
├── frontend-vitrine/
│   ├── app/
│   │   ├── api/
│   │   ├── components/
│   │   └── ...
│   ├── public/
│   └── package.json
│
├── docs/
│   └── captures/
│       ├── vitrine.png
│       ├── produit.png
│       ├── panier.png
│       └── commande.png
│
├── nginx/
│   └── default.conf
│
├── certs/
│
├── docker-compose.yml
├── .env
├── .gitignore
└── README.md
```

Sensitive environment files and TLS private keys must not be committed to Git.

## 8. Installation and Deployment

### Prerequisites

- Ubuntu Linux
- Docker Engine
- Docker Compose plugin
- Git
- mkcert

### Clone the repository

```bash
git clone https://github.com/MontassarHannachi/tp-headless.git

cd tp-headless
```

### Configure environment variables

Create the root `.env` file:

```env
NEXT_PUBLIC_API_URL=https://YOUR_HOST_IP
STORE_API_SECRET=YOUR_GENERATED_SECRET
```

Configure the backend environment in `backend-accessoires/.env` using the variables required by the Strapi application.

**Important:** Never reuse the example values in a real deployment. Do not commit `.env` files or secrets.

### Generate local HTTPS certificates

Install mkcert and initialize its local certificate authority:

```bash
sudo apt install mkcert

mkcert -install
```

Generate a certificate for your Ubuntu machine's LAN IP:

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
```

Install the generated public root CA certificate on client devices that need to trust the local HTTPS connection.

### Build and start the containers

```bash
docker compose up -d --build
```

Check service status:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs -f
```

## 9. Access the Application

Open the following address in a browser:

```text
https://YOUR_HOST_IP
```

HTTP requests are redirected to HTTPS.

### Strapi Administration

The Strapi service is not directly exposed to the local network.

For administrative access, create an SSH tunnel from a trusted client:

```bash
ssh -L 1337:127.0.0.1:1337 USER@YOUR_HOST_IP
```

Then open:

```text
http://localhost:1337/admin
```

## 10. Data Persistence

Docker volumes and bind mounts preserve application data outside the container lifecycle.

The SQLite database is stored in:

```text
backend-accessoires/.tmp/data.db
```

Uploaded media files are stored in:

```text
backend-accessoires/public/uploads/
```

Rebuilding containers does not require deleting these persistent directories.

## 11. Useful Docker Commands

Start services:

```bash
docker compose up -d
```

Rebuild services:

```bash
docker compose up -d --build
```

Stop services:

```bash
docker compose down
```

View running containers:

```bash
docker compose ps
```

Follow logs:

```bash
docker compose logs -f
```

Restart services:

```bash
docker compose restart
```

## 12. Security Considerations

The project includes several security measures:

- HTTPS through Nginx.
- HTTP to HTTPS redirection.
- TLS 1.2 and TLS 1.3.
- Security response headers.
- Backend service isolation.
- Server-side validation of checkout requests.
- Server-side price calculation.
- Protected internal API operations.
- Idempotency protection against duplicate order submissions.
- Environment-based secret configuration.

**Deployment note:** mkcert certificates are intended for development and trusted local networks. They are not publicly trusted certificates. A public production deployment requires a valid public certificate, domain configuration, hardened infrastructure and additional security controls.

## 13. Future Improvements

Possible next development steps:

- Online payment gateway integration.
- Automated testing.
- Product search and advanced filtering.
- Customer authentication and account management.
- Order tracking.
- Production deployment with a public domain.
- Automated backups and monitoring.
- CI/CD pipeline.

## 14. Learning Outcomes

This project provides practical experience with:

- Headless CMS architecture.
- Full-stack development.
- REST API integration.
- Next.js and Strapi communication.
- Docker containerization.
- Reverse proxy configuration.
- HTTPS and TLS certificates.
- Environment variable management.
- Backend validation and API security.
- Persistent application storage.

---

# Français

## 1. Présentation du projet

**Headless Commerce** est une application e-commerce full-stack développée avec une architecture headless.

Le projet sépare la partie frontend, responsable de l'affichage et de l'expérience utilisateur, du backend qui gère les produits, les contenus et les opérations métier.

Le frontend utilise Next.js et le backend repose sur Strapi 5.

L'ensemble est conteneurisé avec Docker Compose et accessible via un reverse proxy Nginx configuré en HTTPS pour une utilisation sur un réseau local.

## 2. Captures d'écran

### Page d'accueil

![Page d'accueil](docs/captures/vitrine.png)

### Fiche produit

![Fiche produit](docs/captures/produit.png)

### Panier

![Panier](docs/captures/panier.png)

### Commande

![Commande](docs/captures/commande.png)

## 3. Fonctionnalités principales

### Frontend
- Interface e-commerce responsive.
- Catalogue de produits.
- Pages détaillées des produits.
- Affichage des images et descriptions.
- Gestion du panier.
- Formulaire de commande.
- Formulaire de contact.
- Pages informatives et de confiance.

### Backend
- CMS headless Strapi 5.
- API REST pour les produits et les contenus.
- Création et gestion des commandes.
- Traitement des formulaires de contact.
- Calcul des prix côté serveur.
- Validation des requêtes.
- Protection contre les commandes en double grâce à l'idempotence.

### Infrastructure et sécurité
- Architecture multi-conteneurs avec Docker Compose.
- Reverse proxy Nginx.
- HTTPS local avec mkcert.
- Redirection HTTP vers HTTPS.
- En-têtes HTTP de sécurité.
- Persistance des données SQLite.
- Protection des routes API sensibles avec un secret côté serveur.

## 4. Technologies utilisées

| Technologie | Utilisation |
|---|---|
| Next.js 16 | Application frontend |
| React 19 | Interface utilisateur |
| TypeScript | Développement typé |
| Strapi 5 | CMS headless et backend |
| SQLite | Base de données |
| Docker | Conteneurisation |
| Docker Compose | Orchestration |
| Nginx | Reverse proxy et HTTPS |
| mkcert | Certificats TLS locaux |
| Ubuntu | Environnement de déploiement |

## 5. Architecture technique

```text
                Navigateur utilisateur
                         |
                         | HTTPS :443
                         v
                   +-----------+
                   |   Nginx   |
                   |  Reverse  |
                   |   Proxy   |
                   +-----------+
                         |
                         | HTTP
                         v
                   +-----------+
                   |  Next.js  |
                   | Frontend  |
                   +-----------+
                         |
                         | HTTP interne
                         v
                   +-----------+
                   |  Strapi   |
                   | Backend   |
                   +-----------+
                         |
                         v
                   +-----------+
                   |  SQLite   |
                   | Base de   |
                   | données   |
                   +-----------+
```

### Configuration réseau

| Service | Port interne | Accès |
|---|---:|---|
| Nginx | 80 / 443 | Réseau local |
| Next.js | 3000 | Réseau Docker |
| Strapi | 1337 | Localhost / réseau Docker |
| SQLite | — | Stockage persistant |

Nginx constitue le point d'entrée des requêtes du navigateur. Le chiffrement HTTPS est terminé au niveau de Nginx, qui transmet ensuite les requêtes au frontend.

Le frontend communique avec Strapi à travers le réseau interne Docker.

## 6. Routes API

L'application Next.js fournit des routes API côté serveur pour les opérations sensibles.

| Endpoint | Méthode | Description |
|---|---|---|
| `/api/checkout` | POST | Création d'une commande |
| `/api/contact` | POST | Traitement du formulaire de contact |
| `/api/media/[...path]` | GET | Proxy des médias |

Le processus de commande valide les requêtes et calcule les prix côté serveur.

Des clés d'idempotence empêchent la création de commandes en double lorsqu'une même requête est envoyée plusieurs fois.

## 7. Structure du projet

```text
tp-headless/
│
├── backend-accessoires/
│   ├── config/
│   ├── src/
│   ├── public/
│   └── .tmp/
│
├── frontend-vitrine/
│   ├── app/
│   │   ├── api/
│   │   ├── components/
│   │   └── ...
│   ├── public/
│   └── package.json
│
├── docs/
│   └── captures/
│       ├── vitrine.png
│       ├── produit.png
│       ├── panier.png
│       └── commande.png
│
├── nginx/
│   └── default.conf
│
├── certs/
│
├── docker-compose.yml
├── .env
├── .gitignore
└── README.md
```

Les fichiers d'environnement sensibles et les clés privées TLS ne doivent jamais être publiés sur Git.

## 8. Installation et déploiement

### Prérequis

- Ubuntu Linux.
- Docker Engine.
- Plugin Docker Compose.
- Git.
- mkcert.

### Cloner le dépôt

```bash
git clone https://github.com/MontassarHannachi/tp-headless.git

cd tp-headless
```

### Configurer les variables d'environnement

Créer le fichier `.env` à la racine :

```env
NEXT_PUBLIC_API_URL=https://YOUR_HOST_IP
STORE_API_SECRET=YOUR_GENERATED_SECRET
```

Configurer également `backend-accessoires/.env` avec les variables nécessaires au fonctionnement de Strapi.

**Important :** remplacer les valeurs d'exemple par des valeurs adaptées à son environnement. Ne jamais publier les fichiers `.env` ni les secrets.

### Générer les certificats HTTPS locaux

Installer mkcert et initialiser son autorité de certification locale :

```bash
sudo apt install mkcert

mkcert -install
```

Générer un certificat pour l'adresse IP locale de la machine Ubuntu :

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
```

Installer le certificat racine public sur les appareils clients qui doivent faire confiance à la connexion HTTPS locale.

### Construire et démarrer les conteneurs

```bash
docker compose up -d --build
```

Vérifier l'état des services :

```bash
docker compose ps
```

Consulter les journaux :

```bash
docker compose logs -f
```

## 9. Accès à l'application

Ouvrir dans le navigateur :

```text
https://YOUR_HOST_IP
```

Les requêtes HTTP sont automatiquement redirigées vers HTTPS.

### Administration Strapi

Le service Strapi n'est pas directement exposé au réseau local.

Pour accéder à l'administration depuis un poste autorisé, créer un tunnel SSH :

```bash
ssh -L 1337:127.0.0.1:1337 USER@YOUR_HOST_IP
```

Puis ouvrir :

```text
http://localhost:1337/admin
```

## 10. Persistance des données

Les volumes et montages Docker permettent de conserver les données en dehors du cycle de vie des conteneurs.

La base SQLite se trouve dans :

```text
backend-accessoires/.tmp/data.db
```

Les fichiers médias téléversés sont stockés dans :

```text
backend-accessoires/public/uploads/
```

La reconstruction des conteneurs ne nécessite pas la suppression de
