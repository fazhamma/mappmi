import { Request, Response } from 'express';
import { statsService } from '../services/statsService';
import { logger } from '../config/logger';

export class StatsController {
  /**
   * GET /api/stats/global
   * Statistiques globales avec filtres
   */
  async getGlobalStats(req: Request, res: Response): Promise<void> {
    try {
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const certType = req.query.cert_type as string | undefined;

      const stats = await statsService.getGlobalStats(year, certType);

      res.json(stats);
    } catch (error) {
      logger.error('Error in getGlobalStats controller', { error });
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch global statistics',
      });
    }
  }

  /**
   * GET /api/stats/by-country
   * Liste des statistiques par pays
   */
  async getStatsByCountry(req: Request, res: Response): Promise<void> {
    try {
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const certType = req.query.cert_type as string | undefined;

      const stats = await statsService.getStatsByCountry(year, certType);

      res.json(stats);
    } catch (error) {
      logger.error('Error in getStatsByCountry controller', { error });
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch country statistics',
      });
    }
  }

  /**
   * GET /api/stats/country/:country_code
   * Détail pour un pays spécifique
   */
  async getCountryDetail(req: Request, res: Response): Promise<void> {
    try {
      const countryCode = req.params.country_code;
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;

      // Validation du code pays (2 lettres)
      if (!/^[A-Z]{2}$/i.test(countryCode)) {
        res.status(400).json({
          error: 'Bad request',
          message: 'Invalid country code. Must be 2-letter ISO code (e.g., US, FR, IN)',
        });
        return;
      }

      const detail = await statsService.getCountryDetail(countryCode, year);

      if (!detail) {
        res.status(404).json({
          error: 'Not found',
          message: `No data found for country code: ${countryCode}`,
        });
        return;
      }

      res.json(detail);
    } catch (error) {
      logger.error('Error in getCountryDetail controller', { error });
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch country detail',
      });
    }
  }

  /**
   * GET /api/stats/cert-types
   * Liste des types de certification disponibles
   */
  async getCertTypes(req: Request, res: Response): Promise<void> {
    try {
      const certTypes = await statsService.getAvailableCertTypes();
      res.json(certTypes);
    } catch (error) {
      logger.error('Error in getCertTypes controller', { error });
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch certification types',
      });
    }
  }

  /**
   * GET /api/stats/years
   * Liste des années disponibles
   */
  async getYears(req: Request, res: Response): Promise<void> {
    try {
      const years = await statsService.getAvailableYears();
      res.json(years);
    } catch (error) {
      logger.error('Error in getYears controller', { error });
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch available years',
      });
    }
  }
}

export const statsController = new StatsController();
