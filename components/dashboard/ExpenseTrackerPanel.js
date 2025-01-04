'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineCash, HiOutlineShoppingBag } from 'react-icons/hi';
import { FaLeaf } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

if (typeof window !== 'undefined') {
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
}

const ExpenseTrackerPanel = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [expenseData, setExpenseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    monthlySpent: 0,
    avgOrderValue: 0,
    sustainablePurchases: 0
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const labels = generateTimeLabels(timeRange);
      setExpenseData({
        labels,
        datasets: [
          {
            label: 'Spending',
            data: labels.map(() => Math.floor(Math.random() * 200) + 50),
            borderColor: '#FF6B35',
            tension: 0.4,
            fill: true,
            backgroundColor: 'rgba(255, 107, 53, 0.1)'
          },
          {
            label: 'Savings',
            data: labels.map(() => Math.floor(Math.random() * 50) + 20),
            borderColor: '#22C55E',
            tension: 0.4
          }
        ]
      });

      setMetrics({
        monthlySpent: Math.floor(Math.random() * 1000) + 500,
        avgOrderValue: Math.floor(Math.random() * 100) + 50,
        sustainablePurchases: Math.floor(Math.random() * 5) + 3
      });

      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  const generateTimeLabels = (range) => {
    const labels = [];
    const now = new Date();
    const days = range === '24h' ? 24 : range === '7d' ? 7 : 30;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      labels.push(range === '24h' 
        ? date.toLocaleTimeString([], { hour: '2-digit' })
        : date.toLocaleDateString([], { month: 'short', day: 'numeric' })
      );
    }
    return labels;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { display: false }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Spending Analytics</h2>
          <p className="text-sm text-gray-500">Track your fashion expenses</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-fashion-orange/20"
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-fashion-orange/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineCash className="text-fashion-orange" />
            <span className="text-sm text-gray-600">Monthly Spent</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            ${metrics.monthlySpent}
          </div>
        </div>
        <div className="p-4 bg-fashion-pink/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineShoppingBag className="text-fashion-pink" />
            <span className="text-sm text-gray-600">Avg Order</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            ${metrics.avgOrderValue}
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FaLeaf className="text-green-500" />
            <span className="text-sm text-gray-600">Eco Purchases</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {metrics.sustainablePurchases}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[300px] animate-pulse bg-gray-100 rounded-lg" />
      ) : (
        <div className="h-[300px]">
          {typeof window !== 'undefined' && expenseData && (
            <Line data={expenseData} options={chartOptions} />
          )}
        </div>
      )}
    </div>
  );
};

export default ExpenseTrackerPanel; 