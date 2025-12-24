import { Router } from 'express';
import { statsController } from '../controllers/statsController';
import { cacheMiddleware } from '../config/cache';
import { query } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Validation middleware
const yearValidation = query('year')
  .optional()
  .isInt({ min: 2000, max: 2100 })
  .withMessage('Year must be between 2000 and 2100');

const certTypeValidation = query('cert_type')
  .optional()
  .isString()
  .isLength({ min: 1, max: 20 })
  .withMessage('Certification type must be a valid string');

/**
 * @route   GET /api/stats/global
 * @desc    Get global statistics with optional filters
 * @query   year (optional) - Filter by year
 * @query   cert_type (optional) - Filter by certification type
 * @access  Public
 */
router.get(
  '/global',
  yearValidation,
  certTypeValidation,
  validateRequest,
  cacheMiddleware(3600), // Cache 1 heure
  statsController.getGlobalStats.bind(statsController)
);

/**
 * @route   GET /api/stats/by-country
 * @desc    Get statistics grouped by country
 * @query   year (optional) - Filter by year
 * @query   cert_type (optional) - Filter by certification type
 * @access  Public
 */
router.get(
  '/by-country',
  yearValidation,
  certTypeValidation,
  validateRequest,
  cacheMiddleware(3600), // Cache 1 heure
  statsController.getStatsByCountry.bind(statsController)
);

/**
 * @route   GET /api/stats/country/:country_code
 * @desc    Get detailed statistics for a specific country
 * @param   country_code - ISO 3166-1 alpha-2 country code (e.g., US, FR, IN)
 * @query   year (optional) - Filter by year
 * @access  Public
 */
router.get(
  '/country/:country_code',
  yearValidation,
  validateRequest,
  cacheMiddleware(3600), // Cache 1 heure
  statsController.getCountryDetail.bind(statsController)
);

/**
 * @route   GET /api/stats/cert-types
 * @desc    Get list of available certification types
 * @access  Public
 */
router.get(
  '/cert-types',
  cacheMiddleware(86400), // Cache 24 heures
  statsController.getCertTypes.bind(statsController)
);

/**
 * @route   GET /api/stats/years
 * @desc    Get list of available years
 * @access  Public
 */
router.get(
  '/years',
  cacheMiddleware(86400), // Cache 24 heures
  statsController.getYears.bind(statsController)
);

export default router;
