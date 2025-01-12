'use client';
import { useState, useEffect } from 'react';
import { 
  FiTrendingUp, FiThumbsUp, FiThumbsDown, FiShoppingBag, 
  FiHeart, FiBarChart2, FiPieChart, FiFilter, FiTag 
} from 'react-icons/fi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const FeedbackAnalyticsTracker = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [feedbackMetrics, setFeedbackMetrics] = useState({
    totalFeedback: 0,
    positiveRate: 0,
    negativeRate: 0,
    topPreferences: [],
    avoidedStyles: [],
    styleAlignment: 0
  });
  const [trendData, setTrendData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeedbackAnalytics();
  }, [timeRange]);

  const loadFeedbackAnalytics = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual API
      const response = await fetch('/api/feedback-analytics', {
        method: 'POST',
        body: JSON.stringify({ timeRange })
      });
      const data = await response.json();
      
      // Update metrics
      setFeedbackMetrics({
        totalFeedback: 245,
        positiveRate: 78,
        negativeRate: 22,
        topPreferences: [
          { style: 'Casual Chic', count: 45 },
          { style: 'Minimalist', count: 38 },
          { style: 'Bohemian', count: 27 }
        ],
        avoidedStyles: [
          { style: 'Neon Colors', count: 15 },
          { style: 'Animal Prints', count: 12 },
          { style: 'Oversized', count: 8 }
        ],
        styleAlignment: 85
      });

      // Trend data
      setTrendData({
        labels: generateTimeLabels(timeRange),
        datasets: [
          {
            label: 'Positive Feedback',
            data: generateRandomData(timeRange, 60, 90),
            borderColor: '#22C55E',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Style Matches',
            data: generateRandomData(timeRange, 70, 95),
            borderColor: '#FF6B35',
            tension: 0.4
          }
        ]
      });

      // Category breakdown
      setCategoryData({
        labels: ['Color', 'Style', 'Fit', 'Price', 'Quality'],
        datasets: [{
          data: [35, 25, 20, 15, 5],
          backgroundColor: [
            '#FF6B35',
            '#22C55E',
            '#6366F1',
            '#EC4899',
            '#F59E0B'
          ]
        }]
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading feedback analytics:', error);
      setIsLoading(false);
    }
  };

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

  const generateRandomData = (range, min, max) => {
    const days = range === '24h' ? 24 : range === '7d' ? 7 : 30;
    return Array.from({ length: days }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
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

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12 }
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Feedback Analytics</h2>
          <p className="text-sm text-gray-500">Understanding user preferences</p>
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

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-fashion-orange/10 to-fashion-orange/5 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FiBarChart2 className="text-fashion-orange" />
            <span className="text-sm text-gray-600">Total Feedback</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {feedbackMetrics.totalFeedback}
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FiThumbsUp className="text-green-500" />
            <span className="text-sm text-gray-600">Positive Rate</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {feedbackMetrics.positiveRate}%
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FiFilter className="text-purple-500" />
            <span className="text-sm text-gray-600">Style Alignment</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {feedbackMetrics.styleAlignment}%
          </div>
        </div>
        <div className="p-4 bg-gradient-to-br from-pink-100 to-pink-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FiHeart className="text-pink-500" />
            <span className="text-sm text-gray-600">Top Preferences</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {feedbackMetrics.topPreferences.length}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Trend Chart */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Feedback Trends</h3>
          <div className="h-[300px]">
            {!isLoading && trendData && (
              <Line data={trendData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Feedback Categories</h3>
          <div className="h-[300px]">
            {!isLoading && categoryData && (
              <Doughnut data={categoryData} options={doughnutOptions} />
            )}
          </div>
        </div>
      </div>

      {/* Style Preferences */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Preferences */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            <FiThumbsUp className="inline mr-2 text-green-500" />
            Top Style Preferences
          </h3>
          <div className="space-y-3">
            {feedbackMetrics.topPreferences.map((pref, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{pref.style}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(pref.count / feedbackMetrics.totalFeedback) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">{pref.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Avoided Styles */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            <FiThumbsDown className="inline mr-2 text-red-500" />
            Avoided Styles
          </h3>
          <div className="space-y-3">
            {feedbackMetrics.avoidedStyles.map((style, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{style.style}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${(style.count / feedbackMetrics.totalFeedback) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">{style.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackAnalyticsTracker; 