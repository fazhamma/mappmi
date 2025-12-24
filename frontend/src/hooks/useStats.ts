import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { GlobalStats, CountryStats, CountryDetail, Filters } from '../types';

/**
 * Hook pour récupérer les statistiques globales
 */
export const useGlobalStats = (filters: Filters) => {
  const [data, setData] = useState<GlobalStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const stats = await apiService.getGlobalStats(filters);
        setData(stats);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.year, filters.certType]);

  return { data, loading, error };
};

/**
 * Hook pour récupérer les statistiques par pays
 */
export const useCountryStats = (filters: Filters) => {
  const [data, setData] = useState<CountryStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const stats = await apiService.getStatsByCountry(filters);
        setData(stats);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters.year, filters.certType]);

  return { data, loading, error };
};

/**
 * Hook pour récupérer le détail d'un pays
 */
export const useCountryDetail = (countryCode: string | null, year?: number) => {
  const [data, setData] = useState<CountryDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!countryCode) {
      setData(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const detail = await apiService.getCountryDetail(countryCode, year);
        setData(detail);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [countryCode, year]);

  return { data, loading, error };
};

/**
 * Hook pour récupérer les types de certification disponibles
 */
export const useCertTypes = () => {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const types = await apiService.getCertTypes();
        setData(types);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

/**
 * Hook pour récupérer les années disponibles
 */
export const useAvailableYears = () => {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const years = await apiService.getAvailableYears();
        setData(years);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
