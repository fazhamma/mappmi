import React from 'react';
import { GlobalStats } from '../../types';

interface GlobalStatsPanelProps {
  stats: GlobalStats | null;
  loading: boolean;
}

const GlobalStatsPanel: React.FC<GlobalStatsPanelProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const topCertTypes = Object.entries(stats.by_cert_type)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-pmi-blue mb-4">
        Statistiques Mondiales
      </h2>

      {/* Total mondial */}
      <div className="mb-6 p-4 bg-gradient-to-r from-pmi-blue to-pmi-lightblue rounded-lg">
        <div className="text-white">
          <div className="text-sm font-medium opacity-90">Total mondial</div>
          <div className="text-3xl font-bold mt-1">
            {stats.total.toLocaleString()}
          </div>
          <div className="text-xs opacity-75 mt-1">
            certifications actives
          </div>
        </div>
      </div>

      {/* Nombre de pays */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-gray-600 text-sm">Pays</div>
          <div className="text-2xl font-bold text-pmi-blue mt-1">
            {stats.countries_count}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-gray-600 text-sm">Types</div>
          <div className="text-2xl font-bold text-pmi-blue mt-1">
            {Object.keys(stats.by_cert_type).length}
          </div>
        </div>
      </div>

      {/* Top 5 certifications */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Top 5 Certifications
        </h3>
        <div className="space-y-2">
          {topCertTypes.map(([certType, count], index) => {
            const percentage = (count / stats.total) * 100;
            return (
              <div key={certType} className="relative">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {certType}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {count.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-pmi-lightblue h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dernière mise à jour */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Dernière mise à jour:{' '}
          {new Date(stats.last_update).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </div>
  );
};

export default GlobalStatsPanel;
