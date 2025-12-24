# Guide de contribution

Merci de votre intérêt pour contribuer à PMI Certification Map ! Ce document explique comment contribuer efficacement au projet.

## Code de conduite

En participant à ce projet, vous vous engagez à respecter notre code de conduite :
- Être respectueux et inclusif
- Accepter les critiques constructives
- Se concentrer sur ce qui est le mieux pour la communauté

## Comment contribuer

### Rapporter un bug

1. Vérifier que le bug n'a pas déjà été signalé dans les [Issues](../../issues)
2. Créer une nouvelle issue avec le template "Bug Report"
3. Inclure :
   - Description détaillée du problème
   - Étapes pour reproduire
   - Comportement attendu vs. actuel
   - Screenshots si applicable
   - Environnement (OS, version navigateur, etc.)

### Proposer une fonctionnalité

1. Vérifier que la fonctionnalité n'existe pas déjà
2. Créer une issue avec le template "Feature Request"
3. Décrire :
   - Le problème que cela résout
   - La solution proposée
   - Des alternatives considérées

### Soumettre une Pull Request

#### 1. Setup de développement

```bash
# Fork le projet sur GitHub
# Cloner votre fork
git clone https://github.com/VOTRE-USERNAME/mappmi.git
cd mappmi

# Ajouter le repo original comme remote
git remote add upstream https://github.com/ORIGINAL/mappmi.git

# Créer une branche pour votre fonctionnalité
git checkout -b feature/ma-super-fonctionnalite
```

#### 2. Développement

**Backend**
```bash
cd backend
npm install
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

**Tests**
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

#### 3. Commits

Utilisez des messages de commit clairs et descriptifs :

```
feat: Ajout du filtre par région géographique

- Nouveau composant RegionFilter
- Endpoint API /api/stats/by-region
- Tests unitaires
```

**Format recommandé** :
- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `docs:` Documentation uniquement
- `style:` Formatage, lint
- `refactor:` Refactorisation sans changement de fonctionnalité
- `test:` Ajout ou modification de tests
- `chore:` Maintenance (dépendances, build, etc.)

#### 4. Code Style

**TypeScript/JavaScript**
- Utiliser TypeScript strict mode
- Pas de `any` (sauf cas exceptionnels documentés)
- ESLint doit passer sans erreur
- Prettier pour le formatage

**CSS/Tailwind**
- Utiliser les classes Tailwind en priorité
- Éviter le CSS inline
- Responsive mobile-first

**Naming conventions**
- Composants React : PascalCase (ex: `CountryDetailPanel`)
- Fichiers : camelCase ou kebab-case cohérent
- Variables : camelCase
- Constantes : UPPER_SNAKE_CASE

#### 5. Tests

Ajouter des tests pour :
- Nouvelles fonctionnalités
- Corrections de bugs
- Endpoints API

```typescript
// Exemple de test (Jest)
describe('StatsService', () => {
  it('should return global stats', async () => {
    const stats = await statsService.getGlobalStats();
    expect(stats.total).toBeGreaterThan(0);
  });
});
```

#### 6. Documentation

Mettre à jour la documentation si nécessaire :
- README.md
- ARCHITECTURE.md
- Commentaires dans le code
- JSDoc pour les fonctions publiques

#### 7. Soumettre la PR

```bash
# Synchroniser avec upstream
git fetch upstream
git rebase upstream/main

# Pousser vers votre fork
git push origin feature/ma-super-fonctionnalite
```

Sur GitHub :
1. Créer une Pull Request depuis votre branche
2. Remplir le template de PR
3. Lier l'issue associée (si applicable)
4. Attendre la review

#### 8. Review process

- Un reviewer sera assigné
- Répondre aux commentaires
- Effectuer les modifications demandées
- Une fois approuvée, la PR sera mergée

## Structure du projet

```
mappmi/
├── backend/          # API Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── middleware/
│   └── scripts/
├── frontend/         # Application React
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
├── scripts/          # Scripts Python d'import
└── docker/           # Configuration Docker
```

## Bonnes pratiques

### Backend

✅ **À faire**
- Typer tous les paramètres et retours de fonction
- Valider tous les inputs utilisateur
- Logger les erreurs importantes
- Utiliser le cache intelligemment
- Documenter les endpoints API

❌ **À éviter**
- Requêtes SQL brutes (utiliser TypeORM)
- Exposer des informations sensibles
- Ignorer les erreurs
- Bloquer l'event loop

### Frontend

✅ **À faire**
- Utiliser les hooks React appropriés
- Gérer les états de chargement et d'erreur
- Optimiser les re-renders (memo, useMemo)
- Accessibility (aria-labels, keyboard navigation)
- Responsive design

❌ **À éviter**
- Mutations directes d'état
- Logique métier dans les composants UI
- Console.log en production
- Appels API non gérés

### Base de données

✅ **À faire**
- Utiliser les migrations TypeORM
- Ajouter des index sur colonnes fréquemment utilisées
- Contraintes d'intégrité référentielle
- Transactions pour opérations multiples

❌ **À éviter**
- Modifications directes du schéma
- Requêtes N+1
- Absence de contraintes
- Données non normalisées (sauf justifié)

## Versioning

Nous suivons [Semantic Versioning](https://semver.org/) :
- MAJOR : Changements incompatibles
- MINOR : Nouvelles fonctionnalités compatibles
- PATCH : Corrections de bugs

## Release process

1. Créer une branche `release/vX.Y.Z`
2. Mettre à jour `package.json` versions
3. Mettre à jour CHANGELOG.md
4. Créer une PR vers main
5. Après merge, créer un tag Git
6. Publier la release sur GitHub

## Questions ?

- Ouvrir une [Discussion](../../discussions)
- Rejoindre notre [Discord](https://discord.gg/...)
- Envoyer un email à contact@example.com

## Remerciements

Merci à tous les contributeurs qui rendent ce projet possible ! 🎉

Votre nom sera ajouté automatiquement dans la section Contributors.
