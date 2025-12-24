import axios, { AxiosInstance } from 'axios';
import { GlobalStats, CountryStats, CountryDetail, Filters } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class PMIApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour logger les erreurs
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Récupérer les statistiques globales
   */
  async getGlobalStats(filters: Filters = {}): Promise<GlobalStats> {
    const params: any = {};
    if (filters.year) params.year = filters.year;
    if (filters.certType && filters.certType !== 'ALL') {
      params.cert_type = filters.certType;
    }

    const response = await this.client.get<GlobalStats>('/stats/global', { params });
    return response.data;
  }

  /**
   * Récupérer les statistiques par pays
   */
  async getStatsByCountry(filters: Filters = {}): Promise<CountryStats[]> {
    const params: any = {};
    if (filters.year) params.year = filters.year;
    if (filters.certType && filters.certType !== 'ALL') {
      params.cert_type = filters.certType;
    }

    const response = await this.client.get<CountryStats[]>('/stats/by-country', { params });
    return response.data;
  }

  /**
   * Récupérer le détail d'un pays
   */
  async getCountryDetail(countryCode: string, year?: number): Promise<CountryDetail> {
    const params: any = {};
    if (year) params.year = year;

    const response = await this.client.get<CountryDetail>(
      `/stats/country/${countryCode}`,
      { params }
    );
    return response.data;
  }

  /**
   * Récupérer les types de certification disponibles
   */
  async getCertTypes(): Promise<string[]> {
    const response = await this.client.get<string[]>('/stats/cert-types');
    return response.data;
  }

  /**
   * Récupérer les années disponibles
   */
  async getAvailableYears(): Promise<number[]> {
    const response = await this.client.get<number[]>('/stats/years');
    return response.data;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<any> {
    const response = await this.client.get('/health');
    return response.data;
  }
}

export const apiService = new PMIApiService();
