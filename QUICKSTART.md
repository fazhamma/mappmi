# Quickstart Guide - PMI Certification Map

Guide de démarrage rapide pour lancer l'application en moins de 5 minutes.

## Prérequis

Assurez-vous d'avoir installé :
- Docker 24+ et Docker Compose
- Git

C'est tout ! Docker s'occupera du reste.

## Démarrage rapide (Docker)

### 1. Cloner le projet

```bash
git clone <repository-url>
cd mappmi
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Éditez `.env` si vous souhaitez personnaliser (optionnel) :
```bash
nano .env
```

Les valeurs par défaut fonctionnent out-of-the-box.

### 3. Lancer l'application

```bash
docker-compose up -d
```

Cette commande va :
- Télécharger les images Docker nécessaires
- Construire le backend et le frontend
- Initialiser la base de données PostgreSQL
- Insérer des données d'exemple
- Démarrer tous les services

**Première exécution** : Comptez 3-5 minutes pour le build complet.

### 4. Vérifier que tout fonctionne

```bash
# Vérifier les conteneurs
docker-compose ps

# Tous doivent être "Up (healthy)"
NAME                IMAGE               STATUS
pmi-map-db          postgres:15-alpine  Up (healthy)
pmi-map-backend     ...                 Up (healthy)
pmi-map-frontend    ...                 Up (healthy)
```

### 5. Accéder à l'application

Ouvrez votre navigateur :

- **Frontend** : http://localhost:3000
- **API Backend** : http://localhost:5000/api
- **Health Check** : http://localhost:5000/api/health

Vous devriez voir la carte du monde avec des données d'exemple !

## Arrêter l'application

```bash
# Arrêter sans supprimer les données
docker-compose stop

# Arrêter et supprimer les conteneurs (données conservées)
docker-compose down

# Arrêter et SUPPRIMER TOUTES LES DONNÉES
docker-compose down -v
```

## Voir les logs

```bash
# Tous les services
docker-compose logs -f

# Un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

## Importer vos propres données

### Option 1 : Via le conteneur backend

```bash
# Copier votre fichier CSV dans le conteneur
docker cp data/my_data.csv pmi-map-backend:/app/data.csv

# Exécuter le script d'import
docker-compose exec backend python scripts/import_data.py --input /app/data.csv
```

### Option 2 : Localement (si Python installé)

```bash
# Installer les dépendances Python
pip install -r scripts/requirements.txt

# Exécuter l'import
python scripts/import_data.py --input data/my_data.csv

# Format CSV attendu :
# country_code,country_name,year,cert_type,active_count
# US,United States,2025,PMP,35000
# FR,France,2025,PMP,2500
```

## Développement local (sans Docker)

### Backend

```bash
cd backend

# Installer Node.js 20+ si nécessaire
node --version  # doit être >= 20

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env

# Modifier DATABASE_HOST=localhost dans .env
nano .env

# Démarrer PostgreSQL localement (port 5432)
# Puis initialiser la base
npm run db:init -- --seed

# Démarrer le serveur de dev
npm run dev
```

Backend disponible sur http://localhost:5000

### Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env

# Démarrer le serveur de dev
npm run dev
```

Frontend disponible sur http://localhost:3000

## Problèmes courants

### Port déjà utilisé

**Erreur** : `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution** : Modifier les ports dans `docker-compose.yml`
```yaml
frontend:
  ports:
    - "8080:80"  # Au lieu de 3000:80
```

### Base de données ne démarre pas

**Erreur** : `pmi-map-db | database system is shut down`

**Solution** :
```bash
# Supprimer le volume et recommencer
docker-compose down -v
docker-compose up -d
```

### Backend ne se connecte pas à la DB

**Erreur** : `Backend | Error: connect ECONNREFUSED`

**Solution** : Vérifier que la DB est healthy
```bash
docker-compose ps
# Attendre que db soit "Up (healthy)"
docker-compose restart backend
```

### Carte ne s'affiche pas

**Vérifications** :
1. Les données sont-elles dans la base ?
   ```bash
   docker-compose exec db psql -U pmi_user -d pmi_certifications -c "SELECT COUNT(*) FROM country_cert_stats;"
   ```

2. L'API répond-elle ?
   ```bash
   curl http://localhost:5000/api/stats/global
   ```

3. Console navigateur : Y a-t-il des erreurs ?

## Commandes utiles

### Base de données

```bash
# Accéder au shell PostgreSQL
docker-compose exec db psql -U pmi_user -d pmi_certifications

# Compter les enregistrements
SELECT COUNT(*) FROM country_cert_stats;

# Voir les pays disponibles
SELECT DISTINCT country_code, country_name FROM country_cert_stats ORDER BY country_name;

# Stats par type de certification
SELECT cert_type, SUM(active_count) as total
FROM country_cert_stats
WHERE year = 2025
GROUP BY cert_type
ORDER BY total DESC;
```

### Rebuild après modifications

```bash
# Rebuild un service spécifique
docker-compose build backend
docker-compose up -d backend

# Rebuild tout
docker-compose build
docker-compose up -d
```

### Nettoyer complètement

```bash
# Supprimer tous les conteneurs, réseaux, volumes
docker-compose down -v

# Supprimer les images aussi
docker-compose down -v --rmi all

# Supprimer le cache Docker (optionnel)
docker system prune -a
```

## Prochaines étapes

Maintenant que l'application fonctionne :

1. **Lire la documentation complète** : `README.md`
2. **Comprendre l'architecture** : `ARCHITECTURE.md`
3. **Importer vos données réelles** : Voir section import ci-dessus
4. **Personnaliser** :
   - Couleurs : `frontend/tailwind.config.js`
   - Types de certification : `frontend/src/types/index.ts`
   - Palette carte : `frontend/src/types/index.ts` (CHOROPLETH_COLORS)

## Support

Pour toute question ou problème :
1. Vérifier les logs : `docker-compose logs -f`
2. Consulter `README.md` et `ARCHITECTURE.md`
3. Ouvrir une issue sur GitHub

---

Bon développement ! 🚀
