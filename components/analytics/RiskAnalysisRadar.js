'use client';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function RiskAnalysisRadar({ riskData }) {
  const data = {
    labels: ['Market Risk', 'Trend Risk', 'Price Risk', 'Season Risk', 'Competition'],
    datasets: [
      {
        label: 'Risk Level',
        data: riskData,
        backgroundColor: 'rgba(255, 107, 53, 0.2)',
        borderColor: '#FF6B35',
        borderWidth: 2,
      }
    ]
  };

  const options = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-pink-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Risk Analysis</h3>
      <Radar data={data} options={options} />
    </div>
  );
} 