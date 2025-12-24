import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { CertificationDetail, CERT_TYPE_COLORS } from '../../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface CertificationBarChartProps {
  certifications: CertificationDetail[];
}

const CertificationBarChart: React.FC<CertificationBarChartProps> = ({
  certifications,
}) => {
  const data = {
    labels: certifications.map((cert) => cert.cert_type),
    datasets: [
      {
        label: 'Nombre de certifications',
        data: certifications.map((cert) => cert.active_count),
        backgroundColor: certifications.map(
          (cert) => CERT_TYPE_COLORS[cert.cert_type] || '#0ea5e9'
        ),
        borderColor: certifications.map(
          (cert) => CERT_TYPE_COLORS[cert.cert_type] || '#0ea5e9'
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
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
            return `${context.parsed.y.toLocaleString()} certifications`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => value.toLocaleString(),
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default CertificationBarChart;
