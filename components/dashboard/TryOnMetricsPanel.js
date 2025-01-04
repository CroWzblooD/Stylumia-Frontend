import { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function TryOnMetricsPanel() {
  const chartRef = useRef(null);
  const [metrics, setMetrics] = useState({
    totalTryOns: 0,
    successRate: 0,
    avgTime: 0
  });

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        totalTryOns: Math.floor(Math.random() * 1000) + 5000,
        successRate: Math.floor(Math.random() * 10) + 85,
        avgTime: Math.floor(Math.random() * 2) + 3
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: ['Success', 'Failed', 'Processing'],
    datasets: [{
      data: [metrics.successRate, 100 - metrics.successRate - 5, 5],
      backgroundColor: ['#FF6B35', '#FFB5C2', '#FFE5D9'],
      borderWidth: 0
    }]
  };

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Virtual Try-On Metrics</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {metrics.totalTryOns.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Total Try-Ons</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-[#FF6B35]">
            {metrics.successRate}%
          </div>
          <div className="text-sm text-gray-500">Success Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {metrics.avgTime}s
          </div>
          <div className="text-sm text-gray-500">Avg. Processing</div>
        </div>
      </div>

      <div className="relative h-48">
        <Doughnut 
          ref={chartRef}
          data={chartData} 
          options={chartOptions}
          id="tryOnMetricsChart"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#FF6B35]">
              {metrics.successRate}%
            </div>
            <div className="text-sm text-gray-500">Success</div>
          </div>
        </div>
      </div>
    </div>
  );
} 