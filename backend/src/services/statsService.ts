import { AppDataSource } from '../config/database';
import { CountryCertStat } from '../models/CountryCertStat';
import { logger } from '../config/logger';

export interface GlobalStats {
  total: number;
  by_cert_type: Record<string, number>;
  countries_count: number;
  last_update: string;
}

export interface CountryStats {
  country_code: string;
  country_name: string;
  total: number;
  by_cert_type: Record<string, number>;
}

export interface CountryDetail {
  country_code: string;
  country_name: string;
  total: number;
  certifications: Array<{
    cert_type: string;
    active_count: number;
    year: number;
  }>;
  evolution?: Record<number, number>;
}

export class StatsService {
  private repository = AppDataSource.getRepository(CountryCertStat);

  /**
   * Récupère les statistiques globales
   */
  async getGlobalStats(year?: number, certType?: string): Promise<GlobalStats> {
    try {
      const queryBuilder = this.repository.createQueryBuilder('stat');

      if (year) {
        queryBuilder.andWhere('stat.year = :year', { year });
      }
      if (certType) {
        queryBuilder.andWhere('stat.cert_type = :certType', { certType });
      }

      const stats = await queryBuilder.getMany();

      const total = stats.reduce((sum, stat) => sum + stat.activeCount, 0);

      const byCertType: Record<string, number> = {};
      stats.forEach(stat => {
        byCertType[stat.certType] = (byCertType[stat.certType] || 0) + stat.activeCount;
      });

      const uniqueCountries = new Set(stats.map(stat => stat.countryCode));

      const lastUpdate = stats.length > 0
        ? stats.reduce((latest, stat) =>
            stat.updatedAt > latest ? stat.updatedAt : latest,
            stats[0].updatedAt
          )
        : new Date();

      logger.info('Global stats retrieved', {
        total,
        countries: uniqueCountries.size,
        certTypes: Object.keys(byCertType).length,
      });

      return {
        total,
        by_cert_type: byCertType,
        countries_count: uniqueCountries.size,
        last_update: lastUpdate.toISOString(),
      };
    } catch (error) {
      logger.error('Error fetching global stats', { error });
      throw error;
    }
  }

  /**
   * Récupère les statistiques par pays
   */
  async getStatsByCountry(year?: number, certType?: string): Promise<CountryStats[]> {
    try {
      const queryBuilder = this.repository.createQueryBuilder('stat');

      if (year) {
        queryBuilder.andWhere('stat.year = :year', { year });
      }
      if (certType) {
        queryBuilder.andWhere('stat.cert_type = :certType', { certType });
      }

      const stats = await queryBuilder.getMany();

      const countryMap = new Map<string, CountryStats>();

      stats.forEach(stat => {
        if (!countryMap.has(stat.countryCode)) {
          countryMap.set(stat.countryCode, {
            country_code: stat.countryCode,
            country_name: stat.countryName,
            total: 0,
            by_cert_type: {},
          });
        }

        const country = countryMap.get(stat.countryCode)!;
        country.total += stat.activeCount;
        country.by_cert_type[stat.certType] =
          (country.by_cert_type[stat.certType] || 0) + stat.activeCount;
      });

      const result = Array.from(countryMap.values())
        .sort((a, b) => b.total - a.total);

      logger.info('Stats by country retrieved', {
        countries: result.length,
        year,
        certType,
      });

      return result;
    } catch (error) {
      logger.error('Error fetching stats by country', { error });
      throw error;
    }
  }

  /**
   * Récupère les détails d'un pays spécifique
   */
  async getCountryDetail(countryCode: string, year?: number): Promise<CountryDetail | null> {
    try {
      const queryBuilder = this.repository.createQueryBuilder('stat')
        .where('stat.country_code = :countryCode', { countryCode: countryCode.toUpperCase() });

      if (year) {
        queryBuilder.andWhere('stat.year = :year', { year });
      }

      const stats = await queryBuilder.getMany();

      if (stats.length === 0) {
        return null;
      }

      const total = stats.reduce((sum, stat) => sum + stat.activeCount, 0);

      const certifications = stats.map(stat => ({
        cert_type: stat.certType,
        active_count: stat.activeCount,
        year: stat.year,
      }));

      // Calculer l'évolution par année
      const evolutionQuery = this.repository.createQueryBuilder('stat')
        .select('stat.year', 'year')
        .addSelect('SUM(stat.active_count)', 'total')
        .where('stat.country_code = :countryCode', { countryCode: countryCode.toUpperCase() })
        .groupBy('stat.year')
        .orderBy('stat.year', 'ASC');

      const evolutionData = await evolutionQuery.getRawMany();
      const evolution: Record<number, number> = {};
      evolutionData.forEach((row: any) => {
        evolution[row.year] = parseInt(row.total);
      });

      logger.info('Country detail retrieved', {
        countryCode,
        total,
        certifications: certifications.length,
      });

      return {
        country_code: countryCode.toUpperCase(),
        country_name: stats[0].countryName,
        total,
        certifications,
        evolution,
      };
    } catch (error) {
      logger.error('Error fetching country detail', { error, countryCode });
      throw error;
    }
  }

  /**
   * Récupère la liste des types de certification disponibles
   */
  async getAvailableCertTypes(): Promise<string[]> {
    try {
      const result = await this.repository
        .createQueryBuilder('stat')
        .select('DISTINCT stat.cert_type', 'cert_type')
        .orderBy('stat.cert_type', 'ASC')
        .getRawMany();

      return result.map((row: any) => row.cert_type);
    } catch (error) {
      logger.error('Error fetching cert types', { error });
      throw error;
    }
  }

  /**
   * Récupère la liste des années disponibles
   */
  async getAvailableYears(): Promise<number[]> {
    try {
      const result = await this.repository
        .createQueryBuilder('stat')
        .select('DISTINCT stat.year', 'year')
        .orderBy('stat.year', 'DESC')
        .getRawMany();

      return result.map((row: any) => row.year);
    } catch (error) {
      logger.error('Error fetching years', { error });
      throw error;
    }
  }
}

export const statsService = new StatsService();
