import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface EvolutionLineChartProps {
  evolution: Record<number, number>;
}

const EvolutionLineChart: React.FC<EvolutionLineChartProps> = ({ evolution }) => {
  const years = Object.keys(evolution)
    .map(Number)
    .sort((a, b) => a - b);
  const values = years.map((year) => evolution[year]);

  const data = {
    labels: years.map(String),
    datasets: [
      {
        label: 'Nombre total de certifications',
        data: values,
        borderColor: '#0369a1',
        backgroundColor: 'rgba(3, 105, 161, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#0369a1',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
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
          title: (context: any) => {
            return `Année ${context[0].label}`;
          },
          label: (context: any) => {
            const value = context.parsed.y;
            const prevValue =
              context.dataIndex > 0 ? values[context.dataIndex - 1] : null;
            let label = `${value.toLocaleString()} certifications`;

            if (prevValue !== null) {
              const diff = value - prevValue;
              const percentage = ((diff / prevValue) * 100).toFixed(1);
              const sign = diff > 0 ? '+' : '';
              label += ` (${sign}${diff.toLocaleString()}, ${sign}${percentage}%)`;
            }

            return label;
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
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default EvolutionLineChart;
