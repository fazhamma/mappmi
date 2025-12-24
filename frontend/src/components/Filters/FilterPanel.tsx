import React from 'react';
import { Filters, CertificationType } from '../../types';
import { useCertTypes, useAvailableYears } from '../../hooks/useStats';

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const { data: certTypes } = useCertTypes();
  const { data: years } = useAvailableYears();

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onFilterChange({
      ...filters,
      year: value ? parseInt(value) : undefined,
    });
  };

  const handleCertTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as CertificationType | 'ALL';
    onFilterChange({
      ...filters,
      certType: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-pmi-blue mb-4">Filtres</h2>

      <div className="space-y-4">
        {/* Filtre par année */}
        <div>
          <label
            htmlFor="year-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Année
          </label>
          <select
            id="year-filter"
            value={filters.year || ''}
            onChange={handleYearChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pmi-lightblue focus:border-transparent"
          >
            <option value="">Toutes les années</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Filtre par type de certification */}
        <div>
          <label
            htmlFor="cert-type-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Type de certification
          </label>
          <select
            id="cert-type-filter"
            value={filters.certType || 'ALL'}
            onChange={handleCertTypeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pmi-lightblue focus:border-transparent"
          >
            <option value="ALL">Tous les types</option>
            {certTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Indicateur de filtres actifs */}
      {(filters.year || (filters.certType && filters.certType !== 'ALL')) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Filtres actifs</span>
            <button
              onClick={() => onFilterChange({ certType: 'ALL' })}
              className="text-sm text-pmi-orange hover:text-pmi-blue transition-colors"
            >
              Réinitialiser
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {filters.year && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pmi-lightblue text-white">
                {filters.year}
              </span>
            )}
            {filters.certType && filters.certType !== 'ALL' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pmi-orange text-white">
                {filters.certType}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
