import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import { logger } from './config/logger';
import { requestLogger } from './middleware/requestLogger';
import statsRoutes from './routes/statsRoutes';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Sécurité
app.use(helmet());

// CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Compression des réponses
app.use(compression());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes par défaut
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // 100 requêtes par fenêtre
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Routes
app.use('/api/stats', statsRoutes);

// Health check endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    // Vérifier la connexion à la base de données
    const { AppDataSource } = await import('./config/database');
    const isConnected = AppDataSource.isInitialized;

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: isConnected ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    logger.error('Health check failed', { error });
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'error',
    });
  }
});

// Route de base
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'PMI Certification Map API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      stats: {
        global: '/api/stats/global',
        byCountry: '/api/stats/by-country',
        countryDetail: '/api/stats/country/:country_code',
        certTypes: '/api/stats/cert-types',
        years: '/api/stats/years',
      },
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
  });

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    // Initialiser la connexion à la base de données
    await initializeDatabase();

    // Démarrer le serveur Express
    app.listen(PORT, () => {
      logger.info(`🚀 Server started successfully`, {
        port: PORT,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
      });
      console.log(`\n✅ Server is running on http://localhost:${PORT}`);
      console.log(`📊 API Documentation: http://localhost:${PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Gestion des signaux d'arrêt
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Démarrer le serveur
startServer();

export default app;
