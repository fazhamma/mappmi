import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { CertificationDetail, CERT_TYPE_COLORS } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CertificationDoughnutChartProps {
  certifications: CertificationDetail[];
}

const CertificationDoughnutChart: React.FC<CertificationDoughnutChartProps> = ({
  certifications,
}) => {
  const data = {
    labels: certifications.map((cert) => cert.cert_type),
    datasets: [
      {
        label: 'Certifications',
        data: certifications.map((cert) => cert.active_count),
        backgroundColor: certifications.map(
          (cert) => CERT_TYPE_COLORS[cert.cert_type] || '#0ea5e9'
        ),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 62, 107, 0.9)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default CertificationDoughnutChart;
