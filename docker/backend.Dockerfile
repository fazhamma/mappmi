FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY backend/package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY backend/ .

# Compiler TypeScript
RUN npm run build

# Image de production
FROM node:20-alpine

WORKDIR /app

# Copier les node_modules depuis le builder
COPY --from=builder /app/node_modules ./node_modules

# Copier le code compilé
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./

# Créer le dossier logs
RUN mkdir -p /app/logs

# Utilisateur non-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exposer le port
EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Démarrer l'application
CMD ["node", "dist/server.js"]
