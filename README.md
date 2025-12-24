# PMI Certification Map - Carte Interactive des Certifications PMI

Application web de cartographie interactive affichant la répartition géographique mondiale des certifications PMI (PMP, PMI-ACP, PMI-RMP, etc.) par pays.

## 📋 Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [API Documentation](#api-documentation)
- [Alimentation des données](#alimentation-des-données)
- [Déploiement](#déploiement)
- [Bonnes pratiques](#bonnes-pratiques)

## 🎯 Fonctionnalités

### Cartographie Interactive
- Carte monde avec répartition par pays des certifications PMI
- Symbologie choroplèthe (couleurs par intensité) ou cercles proportionnels
- Filtrage par type de certification (PMP, PMI-ACP, PMI-RMP, PMI-SP, PgMP, PfMP, CAPM)
- Filtrage par année
- Interaction au survol et au clic sur les pays

### Visualisation de données
- Panneau latéral avec filtres et statistiques globales
- Détail par pays avec graphiques (barres + donut)
- Top 10 des pays par nombre de certifiés
- Statistiques mondiales en temps réel

### Interface
- Design moderne et responsive
- Support bilingue FR/EN (i18n ready)
- Palette de couleurs adaptée à la cartographie thématique

## 🏗️ Architecture

### Stack technique

**Frontend**
- React 18 + TypeScript
- Leaflet pour la cartographie
- Chart.js pour les graphiques
- Axios pour les appels API
- i18next pour l'internationalisation
- TailwindCSS pour le styling

**Backend**
- Node.js 20 + TypeScript
- Express.js pour l'API REST
- PostgreSQL 15 pour la base de données
- TypeORM comme ORM
- Node-cache pour le caching
- CORS et compression middleware

**DevOps**
- Docker + Docker Compose
- Nginx pour servir le frontend
- Scripts Python pour l'import de données

### Choix d'architecture

| Aspect | Choix | Avantages | Inconvénients |
|--------|-------|-----------|---------------|
| **Carte** | Leaflet | Open-source, gratuit, léger, communauté active | Moins de fonctionnalités 3D que Mapbox |
| **Base** | PostgreSQL | Performance, requêtes complexes, PostGIS dispo | Plus lourd qu'un JSON statique |
| **API** | Express | Simple, mature, écosystème riche | Moins performant que Fastify |
| **Cache** | node-cache | Simple, en mémoire, pas de dépendance externe | Limité à un seul serveur |

**Alternative considérée** : Application full front-end avec JSON statique
- ✅ Plus simple à déployer
- ✅ Moins de coûts (pas de serveur backend)
- ❌ Pas de mise à jour dynamique
- ❌ Fichier JSON potentiellement volumineux

**Choix retenu** : Backend + Database pour :
- Mise à jour périodique des données facilitée
- Requêtes optimisées et filtrage côté serveur
- Scalabilité future (ajout d'authentification, export PDF, etc.)

## 📦 Prérequis

- Docker 24+ et Docker Compose
- Node.js 20+ (pour dev local sans Docker)
- Python 3.10+ (pour scripts d'import)
- PostgreSQL 15+ (pour dev local sans Docker)

## 🚀 Installation

### Avec Docker (recommandé)

```bash
# Cloner le projet
git clone <repository-url>
cd mappmi

# Copier les variables d'environnement
cp .env.example .env

# Lancer l'application complète
docker-compose up -d

# L'application sera accessible sur :
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5000
# - PostgreSQL: localhost:5432
```

### Sans Docker (développement)

**Backend**
```bash
cd backend
npm install
cp .env.example .env
# Configurer DATABASE_URL dans .env
npm run db:init
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

## 📊 Utilisation

### Interface utilisateur

1. **Filtrer les données** : Utilisez le panneau latéral pour sélectionner :
   - Type de certification (PMP, PMI-ACP, etc.)
   - Année (2023, 2024, 2025...)

2. **Explorer la carte** :
   - Survol d'un pays → tooltip avec statistiques
   - Clic sur un pays → panneau détaillé avec graphiques

3. **Consulter les stats globales** :
   - Total mondial affiché en temps réel
   - Top 10 des pays
   - Répartition par type de certification

### Import de données

```bash
# Depuis un fichier CSV exporté manuellement du PMI Registry
python scripts/import_data.py --input data/pmi_registry_export.csv

# Mise à jour périodique (à configurer en cron)
0 2 * * 0 python /app/scripts/import_data.py --input /data/latest.csv
```

## 📁 Structure du projet

```
mappmi/
├── backend/                    # API Node.js + Express
│   ├── src/
│   │   ├── config/            # Configuration (DB, cache, env)
│   │   ├── controllers/       # Logique métier
│   │   ├── models/            # Entités TypeORM
│   │   ├── routes/            # Définition des routes API
│   │   ├── services/          # Services métier
│   │   ├── middleware/        # Middlewares Express
│   │   └── server.ts          # Point d'entrée
│   ├── scripts/               # Scripts SQL d'initialisation
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # Application React
│   ├── public/
│   ├── src/
│   │   ├── components/        # Composants React
│   │   │   ├── Map/          # Composant carte Leaflet
│   │   │   ├── Filters/      # Panneau de filtres
│   │   │   ├── CountryDetail/# Détail pays
│   │   │   └── Charts/       # Graphiques Chart.js
│   │   ├── services/          # Appels API
│   │   ├── types/             # Types TypeScript
│   │   ├── hooks/             # Custom hooks React
│   │   ├── styles/            # CSS/TailwindCSS
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
├── scripts/                    # Scripts d'import Python
│   ├── import_data.py         # Import CSV → PostgreSQL
│   └── requirements.txt
├── data/                       # Données sources
│   └── sample_data.csv        # Exemple de données
├── docker/                     # Configuration Docker
│   ├── backend.Dockerfile
│   ├── frontend.Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔌 API Documentation

### Endpoints disponibles

#### GET `/api/stats/global`

Statistiques globales avec filtres

**Query params :**
- `year` (optional) : Année (ex: 2025)
- `cert_type` (optional) : Type de certification (ex: PMP)

**Réponse :**
```json
{
  "total": 125000,
  "by_cert_type": {
    "PMP": 85000,
    "PMI-ACP": 25000,
    "PMI-RMP": 10000,
    "CAPM": 5000
  },
  "countries_count": 180,
  "last_update": "2025-01-15T00:00:00Z"
}
```

#### GET `/api/stats/by-country`

Liste des statistiques par pays

**Query params :**
- `year` (optional)
- `cert_type` (optional)

**Réponse :**
```json
[
  {
    "country_code": "US",
    "country_name": "United States",
    "total": 45000,
    "by_cert_type": {
      "PMP": 35000,
      "PMI-ACP": 8000,
      "PMI-RMP": 2000
    }
  },
  {
    "country_code": "IN",
    "country_name": "India",
    "total": 28000,
    "by_cert_type": {
      "PMP": 22000,
      "PMI-ACP": 5000,
      "CAPM": 1000
    }
  }
]
```

#### GET `/api/stats/country/:country_code`

Détail pour un pays spécifique

**Path params :**
- `country_code` : Code ISO 3166-1 alpha-2 (ex: FR, US, IN)

**Query params :**
- `year` (optional)

**Réponse :**
```json
{
  "country_code": "FR",
  "country_name": "France",
  "total": 3500,
  "certifications": [
    {
      "cert_type": "PMP",
      "active_count": 2500,
      "year": 2025
    },
    {
      "cert_type": "PMI-ACP",
      "active_count": 800,
      "year": 2025
    },
    {
      "cert_type": "PMI-RMP",
      "active_count": 200,
      "year": 2025
    }
  ],
  "evolution": {
    "2024": 3200,
    "2025": 3500
  }
}
```

#### GET `/api/health`

Health check de l'API

**Réponse :**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "database": "connected"
}
```

## 📥 Alimentation des données

### Stratégie d'acquisition des données

⚠️ **Important : Respect des conditions d'utilisation PMI**

Le [PMI Certification Registry](https://www.pmi.org/certifications/certification-resources/registry) permet de rechercher des certifiés individuels mais **n'offre pas d'API publique** ni d'export en masse.

#### Options légales et recommandées

1. **Export manuel périodique** ✅ RECOMMANDÉ
   - Utiliser les fonctionnalités d'export du site PMI (si disponibles)
   - Effectuer des recherches par pays et exporter les résultats
   - Import manuel mensuel/trimestriel

2. **Contact PMI pour accès données** ✅ RECOMMANDÉ
   - Contacter PMI pour demander un accès aux statistiques agrégées
   - Expliquer le cas d'usage (analyse, visualisation)
   - Négocier un partenariat ou licence de données

3. **Utiliser les rapports publics PMI** ✅ RECOMMANDÉ
   - PMI publie parfois des rapports statistiques
   - Extraire les données de ces rapports officiels

4. **Web scraping** ⚠️ À ÉVITER
   - Vérifier les Terms of Service du site PMI
   - Respecter le robots.txt
   - **Ne pas contourner** de mécanismes de sécurité (CAPTCHA, rate limiting)
   - Risque de violation des conditions d'utilisation
   - Risque de bannissement IP

#### Format de données attendu

Le script d'import accepte un CSV avec les colonnes suivantes :

```csv
country_code,country_name,year,cert_type,active_count
US,United States,2025,PMP,35000
US,United States,2025,PMI-ACP,8000
FR,France,2025,PMP,2500
FR,France,2025,PMI-ACP,800
IN,India,2025,PMP,22000
```

### Script d'import

```bash
# Installation des dépendances
pip install -r scripts/requirements.txt

# Import depuis CSV
python scripts/import_data.py --input data/pmi_registry_export.csv --year 2025

# Avec verbose
python scripts/import_data.py --input data/pmi_registry_export.csv --verbose

# Dry-run (test sans insertion)
python scripts/import_data.py --input data/pmi_registry_export.csv --dry-run
```

### Mise à jour périodique

Configuration d'un cron job pour mise à jour automatique :

```bash
# Éditer crontab
crontab -e

# Ajouter (tous les dimanches à 2h du matin)
0 2 * * 0 cd /path/to/mappmi && python scripts/import_data.py --input /data/latest.csv >> /var/log/pmi_import.log 2>&1
```

## 🚢 Déploiement

### Variables d'environnement

Créer un fichier `.env` à la racine :

```env
# Database
DATABASE_HOST=db
DATABASE_PORT=5432
DATABASE_NAME=pmi_certifications
DATABASE_USER=pmi_user
DATABASE_PASSWORD=change_me_in_production

# Backend
NODE_ENV=production
PORT=5000
API_BASE_URL=http://localhost:5000

# Frontend
REACT_APP_API_URL=http://localhost:5000/api

# Cache
CACHE_TTL=3600

# Security
CORS_ORIGIN=http://localhost:3000
```

### Déploiement avec Docker Compose

```bash
# Build et lancement
docker-compose up -d --build

# Vérifier les logs
docker-compose logs -f

# Initialiser la base de données
docker-compose exec backend npm run db:init

# Arrêter
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```

### Déploiement en production

**Recommandations :**

1. **Base de données**
   - Utiliser un service managé (AWS RDS, Google Cloud SQL, Azure Database)
   - Backups automatiques quotidiens
   - Réplication pour haute disponibilité

2. **Backend**
   - Déployer sur un serveur Node.js (PM2, Kubernetes)
   - Utiliser un reverse proxy (Nginx, Traefik)
   - Activer HTTPS avec Let's Encrypt
   - Mettre en place un rate limiting

3. **Frontend**
   - Build de production : `npm run build`
   - Servir via CDN (Cloudflare, AWS CloudFront)
   - Compression gzip/brotli
   - Cache des assets statiques

4. **Monitoring**
   - Logs centralisés (ELK, Datadog)
   - Monitoring d'uptime (UptimeRobot, Pingdom)
   - Alertes sur erreurs (Sentry)

## ✅ Bonnes pratiques

### Performance

1. **Caching API**
   ```typescript
   // Les stats changent peu fréquemment
   // Cache de 1h par défaut (configurable)
   cache.set('stats:global:2025', data, 3600);
   ```

2. **Optimisation des requêtes**
   ```sql
   -- Index sur les colonnes fréquemment filtrées
   CREATE INDEX idx_country_cert ON country_cert_stats(country_code, cert_type, year);
   ```

3. **Compression des réponses**
   ```typescript
   // Middleware compression activé
   app.use(compression());
   ```

### Sécurité

1. **Validation des inputs**
   - Tous les query params sont validés
   - Protection contre SQL injection (via ORM)
   - Sanitization des données

2. **CORS configuré**
   ```typescript
   // Seulement les origines autorisées
   app.use(cors({ origin: process.env.CORS_ORIGIN }));
   ```

3. **Rate limiting**
   ```typescript
   // Max 100 requêtes par 15 minutes par IP
   rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
   ```

### Maintenance

1. **Logging structuré**
   ```typescript
   logger.info('API request', {
     endpoint: '/api/stats/global',
     params: req.query,
     responseTime: Date.now() - startTime
   });
   ```

2. **Health checks**
   - Endpoint `/api/health` pour monitoring
   - Vérification connexion DB

3. **Documentation**
   - README à jour
   - Commentaires dans le code
   - API documentation (Swagger possible)

### Respect des sources de données

1. **PMI Registry**
   - ⚠️ Toujours vérifier les Terms of Service
   - Ne pas surcharger le serveur (rate limiting)
   - Préférer export manuel ou partenariat officiel

2. **Attribution**
   - Mentionner "Données source : PMI Certification Registry"
   - Lien vers https://www.pmi.org/certifications/certification-resources/registry

3. **Mise à jour**
   - Fréquence raisonnable (mensuelle ou trimestrielle)
   - Éviter les requêtes en temps réel

## 📝 License

MIT License - Voir LICENSE file

## 🤝 Contribution

Les contributions sont bienvenues ! Merci de :
1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📧 Contact

Pour toute question : [votre-email@example.com]

---

**Développé avec ❤️ pour la communauté PMI**
