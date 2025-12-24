import NodeCache from 'node-cache';
import dotenv from 'dotenv';

dotenv.config();

// Cache TTL par défaut : 1 heure
const DEFAULT_TTL = parseInt(process.env.CACHE_TTL || '3600');

export const cache = new NodeCache({
  stdTTL: DEFAULT_TTL,
  checkperiod: 600, // Vérifie les expirations toutes les 10 minutes
  useClones: false, // Performance : ne pas cloner les objets
});

// Helper pour générer des clés de cache cohérentes
export const generateCacheKey = (prefix: string, params: Record<string, any>): string => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join(':');
  return `${prefix}:${sortedParams || 'all'}`;
};

// Middleware Express pour le caching
export const cacheMiddleware = (ttl?: number) => {
  return (req: any, res: any, next: any) => {
    const key = generateCacheKey(req.path, req.query);
    const cachedData = cache.get(key);

    if (cachedData) {
      console.log(`✅ Cache hit: ${key}`);
      return res.json(cachedData);
    }

    console.log(`❌ Cache miss: ${key}`);

    // Override res.json pour stocker dans le cache
    const originalJson = res.json.bind(res);
    res.json = (data: any) => {
      cache.set(key, data, ttl || DEFAULT_TTL);
      return originalJson(data);
    };

    next();
  };
};

// Fonction pour invalider le cache
export const invalidateCache = (pattern?: string): void => {
  if (pattern) {
    const keys = cache.keys();
    const keysToDelete = keys.filter(key => key.includes(pattern));
    cache.del(keysToDelete);
    console.log(`🗑️  Invalidated ${keysToDelete.length} cache entries matching "${pattern}"`);
  } else {
    cache.flushAll();
    console.log('🗑️  All cache cleared');
  }
};
