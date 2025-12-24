import React from 'react';
import { CountryStats } from '../../types';

interface TopCountriesPanelProps {
  countries: CountryStats[];
  loading: boolean;
  onCountryClick: (countryCode: string) => void;
}

const TopCountriesPanel: React.FC<TopCountriesPanelProps> = ({
  countries,
  loading,
  onCountryClick,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const topCountries = countries.slice(0, 10);

  if (topCountries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-pmi-blue mb-4">
          Top 10 Pays
        </h2>
        <p className="text-gray-500 text-center py-8">
          Aucune donnée disponible
        </p>
      </div>
    );
  }

  const maxTotal = topCountries[0]?.total || 1;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-pmi-blue mb-4">
        Top 10 Pays
      </h2>

      <div className="space-y-3">
        {topCountries.map((country, index) => {
          const percentage = (country.total / maxTotal) * 100;
          const isTop3 = index < 3;

          return (
            <div
              key={country.country_code}
              onClick={() => onCountryClick(country.country_code)}
              className="relative cursor-pointer group hover:bg-gray-50 p-3 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {/* Rang */}
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                      isTop3
                        ? 'bg-gradient-to-br from-pmi-orange to-pmi-blue text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Nom du pays */}
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-pmi-blue transition-colors">
                      {country.country_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {country.country_code}
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="text-right">
                  <div className="text-lg font-bold text-pmi-blue">
                    {country.total.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    certifications
                  </div>
                </div>
              </div>

              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isTop3
                      ? 'bg-gradient-to-r from-pmi-orange to-pmi-blue'
                      : 'bg-pmi-lightblue'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>

              {/* Détail des certifications au survol */}
              <div className="mt-2 text-xs text-gray-600 hidden group-hover:block">
                {Object.entries(country.by_cert_type)
                  .slice(0, 3)
                  .map(([type, count]) => (
                    <span key={type} className="mr-3">
                      {type}: {count.toLocaleString()}
                    </span>
                  ))}
                {Object.keys(country.by_cert_type).length > 3 && (
                  <span className="text-gray-400">
                    +{Object.keys(country.by_cert_type).length - 3} autres
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {countries.length > 10 && (
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <span className="text-sm text-gray-500">
            +{countries.length - 10} autres pays
          </span>
        </div>
      )}
    </div>
  );
};

export default TopCountriesPanel;
