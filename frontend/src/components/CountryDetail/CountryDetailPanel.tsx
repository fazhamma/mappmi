import React from 'react';
import { CountryDetail } from '../../types';
import CertificationBarChart from '../Charts/CertificationBarChart';
import CertificationDoughnutChart from '../Charts/CertificationDoughnutChart';
import EvolutionLineChart from '../Charts/EvolutionLineChart';

interface CountryDetailPanelProps {
  countryDetail: CountryDetail | null;
  loading: boolean;
  onClose: () => void;
}

const CountryDetailPanel: React.FC<CountryDetailPanelProps> = ({
  countryDetail,
  loading,
  onClose,
}) => {
  if (!countryDetail && !loading) {
    return null;
  }

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-pmi-blue to-pmi-lightblue text-white p-6 z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-white/20 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-1">
                  {countryDetail?.country_name}
                </h2>
                <div className="text-sm opacity-90">
                  {countryDetail?.country_code}
                </div>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {!loading && countryDetail && (
          <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="text-sm opacity-90 mb-1">Total de certifications</div>
            <div className="text-3xl font-bold">
              {countryDetail.total.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          countryDetail && (
            <>
              {/* Tableau des certifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Détail par certification
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {countryDetail.certifications.map((cert) => {
                        const percentage =
                          (cert.active_count / countryDetail.total) * 100;
                        return (
                          <tr key={cert.cert_type} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900">
                                {cert.cert_type}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <span className="text-sm text-gray-900">
                                {cert.active_count.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <span className="text-sm text-gray-500">
                                {percentage.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Graphique en barres */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Répartition (Barres)
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <CertificationBarChart certifications={countryDetail.certifications} />
                </div>
              </div>

              {/* Graphique donut */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Répartition (Donut)
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <CertificationDoughnutChart
                    certifications={countryDetail.certifications}
                  />
                </div>
              </div>

              {/* Évolution dans le temps */}
              {countryDetail.evolution &&
                Object.keys(countryDetail.evolution).length > 1 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Évolution
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <EvolutionLineChart evolution={countryDetail.evolution} />
                    </div>
                  </div>
                )}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default CountryDetailPanel;
