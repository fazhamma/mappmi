# Architecture Technique - PMI Certification Map

## Vue d'ensemble

L'application PMI Certification Map est une application web full-stack moderne qui visualise la répartition géographique des certifications PMI à l'échelle mondiale.

```
┌─────────────────────────────────────────────────────────────┐
│                        UTILISATEUR                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Leaflet    │  │  Chart.js    │  │  TailwindCSS │     │
│  │  Map Layer   │  │  Graphics    │  │   Styling    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         React Components & Hooks                    │   │
│  │  - PMIWorldMap  - FilterPanel  - CountryDetail     │   │
│  │  - GlobalStats  - TopCountries - Charts            │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND API (Node.js)                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express.js Server                        │  │
│  │  - CORS  - Compression  - Rate Limiting  - Helmet    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Routes     │  │ Controllers  │  │   Services   │     │
│  │              │  │              │  │              │     │
│  │ /stats/*     │─▶│ statsCtrl    │─▶│ statsService │     │
│  │ /health      │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                            │                │
│  ┌──────────────┐                         │                │
│  │  NodeCache   │◀────────────────────────┘                │
│  │  (In-Memory) │                                          │
│  └──────────────┘                                          │
└────────────────────────┬────────────────────────────────────┘
                         │ TypeORM
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (PostgreSQL)                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         country_cert_stats (Table)                  │   │
│  │  - id                    (PK)                       │   │
│  │  - country_code          (VARCHAR)                  │   │
│  │  - country_name          (VARCHAR)                  │   │
│  │  - year                  (INTEGER)                  │   │
│  │  - cert_type             (VARCHAR)                  │   │
│  │  - active_count          (INTEGER)                  │   │
│  │  - created_at, updated_at                           │   │
│  │                                                     │   │
│  │  Indexes:                                           │   │
│  │  - (country_code, cert_type, year)                 │   │
│  │  - (year), (cert_type), (country_code)             │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
           ▲
           │ Import CSV
           │
┌──────────┴──────────────────────────────────────────────────┐
│             DATA IMPORT (Python Script)                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  import_data.py                                     │   │
│  │  - Lecture CSV                                      │   │
│  │  - Validation des données                           │   │
│  │  - UPSERT dans PostgreSQL                           │   │
│  │  - Logging et statistiques                          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Stack Technique

### Frontend

**Framework & Build**
- **React 18** : Bibliothèque UI moderne avec hooks
- **TypeScript** : Typage statique pour la robustesse
- **Vite** : Build tool ultra-rapide avec HMR

**Cartographie**
- **Leaflet** : Bibliothèque de cartes open-source
- **react-leaflet** : Wrapper React pour Leaflet
- **OpenStreetMap** : Fond de carte gratuit

**Visualisation de données**
- **Chart.js 4** : Graphiques interactifs
- **react-chartjs-2** : Intégration React
- Types de graphiques : Barres, Donut, Ligne

**Styling**
- **TailwindCSS** : Framework CSS utility-first
- **PostCSS** : Transformation CSS
- **Autoprefixer** : Compatibilité navigateurs

**HTTP & État**
- **Axios** : Client HTTP avec intercepteurs
- **React Hooks** : Gestion d'état locale
- Custom hooks pour la logique métier

**Internationalisation**
- **i18next** : Framework i18n (structure prête)
- **react-i18next** : Intégration React

### Backend

**Runtime & Framework**
- **Node.js 20** : Runtime JavaScript moderne
- **Express.js** : Framework web minimaliste
- **TypeScript** : Typage côté serveur

**Base de données**
- **PostgreSQL 15** : SGBD relationnel
- **TypeORM** : ORM avec support TypeScript
- **pg** : Driver PostgreSQL natif

**Cache & Performance**
- **node-cache** : Cache en mémoire (TTL 1h)
- **compression** : Compression gzip/brotli
- Stratégie de cache sur endpoints /stats/*

**Sécurité & Middleware**
- **helmet** : Headers de sécurité HTTP
- **cors** : Configuration CORS stricte
- **express-rate-limit** : Protection anti-spam
- **express-validator** : Validation des inputs

**Logging**
- **winston** : Logger structuré
- Niveaux : error, warn, info, debug
- Fichiers : error.log, combined.log

### DevOps & Déploiement

**Containerisation**
- **Docker** : Conteneurisation des services
- **Docker Compose** : Orchestration multi-conteneurs
- Multi-stage builds pour optimisation

**Services Docker**
```yaml
- db (PostgreSQL)
- backend (Node.js API)
- frontend (Nginx + React build)
```

**Networking**
- Réseau Docker isolé : pmi-map-network
- Health checks sur tous les services
- Dépendances explicites (depends_on)

**Volumes**
- postgres_data : Persistance base de données
- ./backend/logs : Logs backend

### Scripts d'import

**Python 3.10+**
- **psycopg2** : Driver PostgreSQL
- **python-dotenv** : Variables d'environnement
- Validation stricte des données
- Mode dry-run pour tests
- Logging détaillé

## Flux de données

### 1. Chargement initial de l'application

```
User accède à http://localhost:3000
  │
  ├─▶ Frontend React chargé (index.html)
  │
  ├─▶ Appels API parallèles :
  │   ├─▶ GET /api/stats/global       → GlobalStats
  │   ├─▶ GET /api/stats/by-country   → CountryStats[]
  │   ├─▶ GET /api/stats/cert-types   → string[]
  │   └─▶ GET /api/stats/years        → number[]
  │
  └─▶ Rendu de la carte avec marqueurs
```

### 2. Filtrage des données

```
User change le filtre (année ou type de certification)
  │
  ├─▶ État React mis à jour (useState)
  │
  ├─▶ useEffect déclenché → nouveaux appels API
  │   GET /api/stats/global?year=2025&cert_type=PMP
  │   GET /api/stats/by-country?year=2025&cert_type=PMP
  │
  ├─▶ Backend vérifie le cache
  │   │
  │   ├─▶ Cache HIT  → retour immédiat
  │   └─▶ Cache MISS → requête DB → mise en cache
  │
  └─▶ Frontend re-rend la carte et les stats
```

### 3. Détail d'un pays

```
User clique sur un pays (cercle sur la carte)
  │
  ├─▶ selectedCountry setState("FR")
  │
  ├─▶ useCountryDetail hook déclenché
  │   GET /api/stats/country/FR?year=2025
  │
  ├─▶ Backend exécute requête SQL :
  │   SELECT * FROM country_cert_stats
  │   WHERE country_code = 'FR' AND year = 2025
  │
  └─▶ Panel latéral s'ouvre avec :
      ├─▶ Tableau détaillé
      ├─▶ Graphique en barres (Chart.js)
      ├─▶ Graphique donut (Chart.js)
      └─▶ Graphique d'évolution temporelle
```

### 4. Import de données

```
Admin exécute : python scripts/import_data.py --input data.csv
  │
  ├─▶ Lecture et parsing du CSV
  │
  ├─▶ Validation ligne par ligne :
  │   ├─▶ Codes pays ISO (2 lettres)
  │   ├─▶ Années (2000-2100)
  │   └─▶ Nombres positifs
  │
  ├─▶ Connexion PostgreSQL
  │
  ├─▶ UPSERT par batch (100 lignes) :
  │   INSERT ... ON CONFLICT (country_code, year, cert_type)
  │   DO UPDATE SET active_count = EXCLUDED.active_count
  │
  ├─▶ Backend cache invalidé automatiquement
  │   (via updated_at trigger)
  │
  └─▶ Rapport d'import :
      - Lignes insérées
      - Lignes mises à jour
      - Erreurs
```

## Endpoints API

### GET /api/stats/global

**Description** : Statistiques mondiales agrégées

**Query params**
- `year` (optional) : Filtrer par année
- `cert_type` (optional) : Filtrer par type de certification

**Réponse**
```json
{
  "total": 125000,
  "by_cert_type": {
    "PMP": 85000,
    "PMI-ACP": 25000
  },
  "countries_count": 180,
  "last_update": "2025-01-15T00:00:00Z"
}
```

**Cache** : 1 heure

**Requête SQL**
```sql
SELECT
  SUM(active_count) as total,
  cert_type,
  COUNT(DISTINCT country_code) as countries
FROM country_cert_stats
WHERE year = ? AND cert_type = ?
GROUP BY cert_type
```

### GET /api/stats/by-country

**Description** : Liste des pays avec leurs statistiques

**Query params**
- `year` (optional)
- `cert_type` (optional)

**Réponse**
```json
[
  {
    "country_code": "US",
    "country_name": "United States",
    "total": 45000,
    "by_cert_type": {
      "PMP": 35000,
      "PMI-ACP": 8000
    }
  }
]
```

**Cache** : 1 heure

**Requête SQL**
```sql
SELECT
  country_code,
  country_name,
  cert_type,
  SUM(active_count) as total
FROM country_cert_stats
WHERE year = ? AND cert_type = ?
GROUP BY country_code, country_name, cert_type
ORDER BY total DESC
```

### GET /api/stats/country/:country_code

**Description** : Détail complet d'un pays

**Path params**
- `country_code` : Code ISO 3166-1 alpha-2

**Query params**
- `year` (optional)

**Réponse**
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
    }
  ],
  "evolution": {
    "2024": 3200,
    "2025": 3500
  }
}
```

**Cache** : 1 heure

**Validation** : country_code doit être 2 lettres

### GET /api/stats/cert-types

**Description** : Liste des types de certification disponibles

**Réponse**
```json
["PMP", "PMI-ACP", "PMI-RMP", "CAPM", "PgMP", "PfMP", "PMI-SP"]
```

**Cache** : 24 heures

### GET /api/stats/years

**Description** : Liste des années disponibles

**Réponse**
```json
[2025, 2024, 2023]
```

**Cache** : 24 heures

### GET /api/health

**Description** : Health check de l'API

**Réponse**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "database": "connected",
  "uptime": 123456,
  "environment": "production"
}
```

**Pas de cache**

## Schéma de base de données

```sql
CREATE TABLE country_cert_stats (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(2) NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    cert_type VARCHAR(20) NOT NULL,
    active_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT unique_country_cert UNIQUE (country_code, year, cert_type),
    CONSTRAINT check_country_code CHECK (LENGTH(country_code) = 2),
    CONSTRAINT check_year CHECK (year >= 2000 AND year <= 2100),
    CONSTRAINT check_count CHECK (active_count >= 0)
);

-- Index de performance
CREATE INDEX idx_country_cert_year ON country_cert_stats(country_code, cert_type, year);
CREATE INDEX idx_year ON country_cert_stats(year);
CREATE INDEX idx_cert_type ON country_cert_stats(cert_type);
CREATE INDEX idx_active_count ON country_cert_stats(active_count DESC);
```

## Stratégie de cache

### Niveaux de cache

1. **Cache API (node-cache)**
   - Emplacement : Backend en mémoire
   - TTL : 1 heure (global stats, by-country)
   - TTL : 24 heures (cert-types, years)
   - Invalidation : Manuelle après import de données

2. **Cache HTTP (navigateur)**
   - Assets statiques : 1 an
   - API responses : Pas de cache navigateur (cache côté serveur uniquement)

3. **Cache PostgreSQL**
   - Shared buffers, effective_cache_size
   - Configuré automatiquement par PostgreSQL

### Invalidation du cache

**Automatique**
- Trigger `updated_at` sur modification de données
- Détection des changements par le backend

**Manuelle**
```javascript
import { invalidateCache } from './config/cache';

// Invalider tout le cache
invalidateCache();

// Invalider les stats uniquement
invalidateCache('stats');
```

## Sécurité

### Headers HTTP (helmet)

```http
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

### CORS

```javascript
cors({
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200
})
```

### Rate Limiting

```javascript
rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requêtes par IP
})
```

### Validation des inputs

```javascript
query('year')
  .optional()
  .isInt({ min: 2000, max: 2100 })

query('cert_type')
  .optional()
  .isString()
  .isLength({ min: 1, max: 20 })
```

### SQL Injection

- Protection via TypeORM (prepared statements)
- Validation stricte des paramètres

## Performance

### Optimisations Frontend

1. **Code splitting** : Vite génère des chunks optimisés
2. **Lazy loading** : Composants chargés à la demande
3. **Memoization** : React.memo sur composants lourds
4. **Debouncing** : Recherche et filtres débounced

### Optimisations Backend

1. **Connection pooling** : TypeORM gère un pool de connexions
2. **Index database** : Index composites sur requêtes fréquentes
3. **Compression** : gzip/brotli sur toutes les réponses
4. **Cache** : node-cache réduit les appels DB

### Optimisations Database

1. **EXPLAIN ANALYZE** : Analyse des requêtes lentes
2. **Index covering** : Index incluant toutes les colonnes SELECT
3. **Aggregations** : SUM, COUNT, GROUP BY optimisés

## Monitoring & Logging

### Logs Backend (winston)

```
[2025-01-15 10:30:00] INFO: Server started on port 5000
[2025-01-15 10:30:15] INFO: HTTP Request {
  method: 'GET',
  path: '/api/stats/global',
  query: { year: 2025 },
  statusCode: 200,
  duration: '45ms'
}
[2025-01-15 10:30:20] ERROR: Database connection failed
```

### Health Checks

**Docker Compose**
- db : `pg_isready`
- backend : HTTP GET /api/health
- frontend : wget /

**Intervalles**
- Interval : 30s
- Timeout : 10s
- Retries : 3

### Métriques à surveiller

1. **API**
   - Temps de réponse moyen
   - Taux d'erreur 5xx
   - Rate limit hits

2. **Database**
   - Connexions actives
   - Slow queries (> 100ms)
   - Taille de la base

3. **Cache**
   - Hit rate (idéalement > 80%)
   - Memory usage

## Scalabilité

### Horizontal Scaling

**Frontend**
- CDN pour assets statiques
- Load balancer (Nginx, Cloudflare)

**Backend**
- Multiple instances derrière load balancer
- Session-less (stateless API)
- Cache partagé (Redis si nécessaire)

**Database**
- Read replicas pour lecture
- Master-slave replication
- PgBouncer pour connection pooling

### Vertical Scaling

**Limites actuelles**
- Backend : 512 MB RAM (léger)
- Database : 1 GB RAM (suffisant pour < 1M records)
- Frontend : Statique, pas de limite

**Recommandations**
- Backend : 1-2 GB RAM pour production
- Database : 4 GB RAM pour > 1M records

## Backup & Disaster Recovery

### Stratégie de backup

**Database**
```bash
# Backup quotidien
docker exec pmi-map-db pg_dump -U pmi_user pmi_certifications > backup.sql

# Restore
docker exec -i pmi-map-db psql -U pmi_user pmi_certifications < backup.sql
```

**Retention**
- Quotidien : 7 jours
- Hebdomadaire : 4 semaines
- Mensuel : 12 mois

### Disaster Recovery

**RTO** : 1 heure (Recovery Time Objective)
**RPO** : 24 heures (Recovery Point Objective)

**Procédure**
1. Restaurer la base depuis le dernier backup
2. Re-déployer les conteneurs Docker
3. Importer les données manquantes si nécessaire

## Évolutions futures

### Court terme
- [ ] Authentification (JWT)
- [ ] Export PDF des statistiques
- [ ] Comparaison de pays
- [ ] Mode sombre

### Moyen terme
- [ ] Prédictions IA (évolution future)
- [ ] Clustering de pays similaires
- [ ] API GraphQL
- [ ] WebSockets pour mises à jour temps réel

### Long terme
- [ ] Mobile app (React Native)
- [ ] Intégration BI (Tableau, Power BI)
- [ ] Machine Learning pour détection d'anomalies
- [ ] API publique avec rate limiting par clé

---

**Auteur** : PMI Certification Map Team
**Version** : 1.0.0
**Date** : 2025-01-15
