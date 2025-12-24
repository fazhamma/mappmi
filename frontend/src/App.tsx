import React, { useState } from 'react';
import PMIWorldMap from './components/Map/PMIWorldMap';
import FilterPanel from './components/Filters/FilterPanel';
import GlobalStatsPanel from './components/Stats/GlobalStatsPanel';
import TopCountriesPanel from './components/Stats/TopCountriesPanel';
import CountryDetailPanel from './components/CountryDetail/CountryDetailPanel';
import { useGlobalStats, useCountryStats, useCountryDetail } from './hooks/useStats';
import { Filters } from './types';

const App: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({ certType: 'ALL' });
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const { data: globalStats, loading: globalLoading } = useGlobalStats(filters);
  const { data: countryStats, loading: countriesLoading } = useCountryStats(filters);
  const { data: countryDetail, loading: detailLoading } = useCountryDetail(
    selectedCountry,
    filters.year
  );

  const handleCountryClick = (countryCode: string) => {
    setSelectedCountry(countryCode);
  };

  const handleCloseDetail = () => {
    setSelectedCountry(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pmi-blue to-pmi-lightblue text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">PMI Certification Map</h1>
              <p className="text-sm opacity-90 mt-1">
                Répartition mondiale des certifications PMI
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.pmi.org/certifications/certification-resources/registry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                PMI Registry
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-gray-50 p-6 overflow-y-auto border-r border-gray-200">
          <FilterPanel filters={filters} onFilterChange={setFilters} />
          <GlobalStatsPanel stats={globalStats} loading={globalLoading} />
          <TopCountriesPanel
            countries={countryStats}
            loading={countriesLoading}
            onCountryClick={handleCountryClick}
          />
        </aside>

        {/* Map */}
        <main className="flex-1 p-6">
          {countriesLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-white rounded-lg shadow-lg">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-pmi-blue mb-4"></div>
                <p className="text-gray-600">Chargement de la carte...</p>
              </div>
            </div>
          ) : (
            <PMIWorldMap
              countries={countryStats}
              onCountryClick={handleCountryClick}
            />
          )}
        </main>
      </div>

      {/* Country Detail Panel */}
      {selectedCountry && (
        <CountryDetailPanel
          countryDetail={countryDetail}
          loading={detailLoading}
          onClose={handleCloseDetail}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-3 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              Données source:{' '}
              <a
                href="https://www.pmi.org/certifications/certification-resources/registry"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pmi-blue hover:underline"
              >
                PMI Certification Registry
              </a>
            </div>
            <div>
              Développé avec{' '}
              <span className="text-red-500">❤</span> pour la communauté PMI
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
