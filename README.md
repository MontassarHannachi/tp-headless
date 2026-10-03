# TP Headless : Strapi 5 + Next.js + Docker Compose

## Lancer le projet
1. Copier `backend-accessoires/.env.example` en `backend-accessoires/.env` et remplacer les `changeme` par de vraies valeurs (APP_KEYS, secrets, etc.).
2. `docker compose up --build`
3. Strapi : http://localhost:1337/admin - Vitrine : http://localhost:3002

## Architecture
- `backend-accessoires` : Strapi 5 (CMS headless, SQLite), API REST sur le port 1337
- `frontend-vitrine` : Next.js, consomme l'API Strapi
- `docker-compose.yml` : orchestre les deux services sur un réseau interne
