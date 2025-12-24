/**
 * Types partagés pour l'application PMI Certification Map
 */

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
  certifications: CertificationDetail[];
  evolution?: Record<number, number>;
}

export interface CertificationDetail {
  cert_type: string;
  active_count: number;
  year: number;
}

export type CertificationType =
  | 'PMP'
  | 'PMI-ACP'
  | 'PMI-RMP'
  | 'PMI-SP'
  | 'PgMP'
  | 'PfMP'
  | 'CAPM';

export interface Filters {
  year?: number;
  certType?: CertificationType | 'ALL';
}

export interface MapMarker {
  country_code: string;
  country_name: string;
  latitude: number;
  longitude: number;
  total: number;
  by_cert_type: Record<string, number>;
}

// Configuration des couleurs pour la carte choroplèthe
export const CERT_TYPE_COLORS: Record<string, string> = {
  PMP: '#0369a1',
  'PMI-ACP': '#ea580c',
  'PMI-RMP': '#7c3aed',
  'PMI-SP': '#0891b2',
  PgMP: '#be123c',
  PfMP: '#4f46e5',
  CAPM: '#15803d',
};

// Configuration des couleurs pour les niveaux de la carte
export const CHOROPLETH_COLORS = [
  '#fee5d9',
  '#fcbba1',
  '#fc9272',
  '#fb6a4a',
  '#ef3b2c',
  '#cb181d',
  '#99000d',
];

// Centres géographiques approximatifs des pays (pour les marqueurs)
// En production, utiliser une bibliothèque de géocodage complète
export const COUNTRY_CENTERS: Record<string, [number, number]> = {
  US: [37.0902, -95.7129],
  IN: [20.5937, 78.9629],
  CN: [35.8617, 104.1954],
  GB: [55.3781, -3.4360],
  CA: [56.1304, -106.3468],
  DE: [51.1657, 10.4515],
  FR: [46.2276, 2.2137],
  AU: [-25.2744, 133.7751],
  BR: [-14.2350, -51.9253],
  JP: [36.2048, 138.2529],
  SG: [1.3521, 103.8198],
  AE: [23.4241, 53.8478],
  NL: [52.1326, 5.2913],
  CH: [46.8182, 8.2275],
  BE: [50.5039, 4.4699],
};
