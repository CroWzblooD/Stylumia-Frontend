'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import TrendingFashion from './TrendingFashion';
import { GoogleGenerativeAI } from "@google/generative-ai";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const getFashionData = async (countryCode) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate fashion market analysis for country code ${countryCode}. Return only a valid JSON object with this exact structure, no markdown or additional text:
    {
      "name": "Country Name",
      "marketSize": {
        "value": "Value USD",
        "growth": "Growth%",
        "forecast": "Forecast text"
      },
      "trends": [
        {
          "name": "Trend name",
          "popularity": "Percentage%",
          "description": "Description"
        }
      ],
      "demographics": {
        "genZ": "Percentage%",
        "millennials": "Percentage%",
        "genX": "Percentage%",
        "boomers": "Percentage%"
      },
      "topBrands": ["Brand1", "Brand2", "Brand3", "Brand4"],
      "sustainability": {
        "ecoFriendly": "Percentage%",
        "recycledMaterials": "Percentage%",
        "carbonNeutral": "Percentage%"
      }
    }`;

    const result = await model.generateContent(prompt);
    let response = await result.response.text();
    
    // Clean the response by removing any markdown or extra characters
    response = response.replace(/```json\n?|\n?```/g, '').trim();
    
    // Additional cleaning if needed
    if (response.startsWith('{') && response.endsWith('}')) {
      try {
        const parsedData = JSON.parse(response);
        
        // Validate required fields
        if (!parsedData.name || !parsedData.marketSize || !parsedData.trends) {
          throw new Error('Missing required fields in response');
        }
        
        return parsedData;
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.log('Raw Response:', response);
        throw new Error('Invalid JSON response from AI');
      }
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error in getFashionData:', error);
    throw new Error('Failed to generate fashion data. Please try again.');
  }
};

// Add this new component for the donut chart
const DemographicsDonut = ({ data }) => {
  const chartData = {
    labels: Object.keys(data).map(key => 
      key.replace(/([A-Z])/g, ' $1').trim().charAt(0).toUpperCase() + 
      key.slice(1).replace(/([A-Z])/g, ' $1').trim().toLowerCase()
    ),
    datasets: [{
      data: Object.values(data).map(value => parseFloat(value)),
      backgroundColor: [
        'rgba(255, 107, 53, 0.8)',  // accent-orange
        'rgba(255, 143, 163, 0.8)', // deep-pink
        'rgba(255, 181, 194, 0.8)', // accent-pink
        'rgba(255, 240, 243, 0.8)'  // primary-pink
      ],
      borderColor: [
        'rgba(255, 107, 53, 1)',
        'rgba(255, 143, 163, 1)',
        'rgba(255, 181, 194, 1)',
        'rgba(255, 240, 243, 1)'
      ],
      borderWidth: 2,
    }],
  };

  return (
    <div className="h-[250px] relative">
      <Doughnut 
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 20,
                generateLabels: (chart) => {
                  const datasets = chart.data.datasets;
                  return chart.data.labels.map((label, i) => ({
                    text: `${label} (${datasets[0].data[i]}%)`,
                    fillStyle: datasets[0].backgroundColor[i],
                    strokeStyle: datasets[0].borderColor[i],
                    lineWidth: 1,
                  }));
                }
              }
            }
          },
          cutout: '65%',
        }}
      />
    </div>
  );
};

// Add real-time market data simulation
const getRealtimeMarketData = () => {
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = now.getMonth();
  
  return {
    labels: months.slice(currentMonth - 5, currentMonth + 1),
    datasets: [{
      label: 'Market Growth',
      data: Array(6).fill(0).map(() => Math.floor(Math.random() * 30) + 50), // Random data between 50-80
      borderColor: 'rgba(255, 107, 53, 1)',
      backgroundColor: 'rgba(255, 107, 53, 0.5)',
    }]
  };
};

// Update TrendChart component with real-time data
const TrendChart = ({ data }) => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Market Growth',
      data: [65, 59, 80, 81, 56, 55],
      backgroundColor: 'rgba(255, 107, 53, 0.5)',
      borderColor: 'rgba(255, 107, 53, 1)',
      borderWidth: 2,
    }]
  };

  return (
    <Bar
      data={chartData}
      options={{
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }}
    />
  );
};

// Add trending categories data
const trendingCategories = [
  {
    name: "Sustainable Fashion",
    growth: 28.5,
    categories: ["Eco-friendly", "Recycled", "Organic"],
    forecast: "Strong growth expected in Q3 2024"
  },
  {
    name: "Digital Fashion",
    growth: 45.2,
    categories: ["AR/VR", "NFTs", "Digital Clothing"],
    forecast: "Exponential growth in metaverse fashion"
  },
  {
    name: "Athleisure",
    growth: 15.8,
    categories: ["Sports", "Casual", "Comfort"],
    forecast: "Steady growth in hybrid workwear"
  }
];

// Add TrendAnalysis component
const TrendAnalysis = ({ trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[var(--accent-pink)]"
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-semibold text-[var(--deep-pink)]">{trend.name}</h3>
      <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
        +{trend.growth}%
      </span>
    </div>
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-500 mb-2">Categories</p>
        <div className="flex flex-wrap gap-2">
          {trend.categories.map((category, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-[var(--primary-pink)] text-[var(--deep-pink)] rounded-full text-sm"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-2">Forecast</p>
        <p className="text-sm text-[var(--accent-orange)]">{trend.forecast}</p>
      </div>
    </div>
  </motion.div>
);

const MarketInsightCard = ({ title, value, change, children }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-[var(--accent-pink)]">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-lg font-semibold text-[var(--deep-pink)]">{title}</h3>
      <div className="flex flex-col items-end">
        <span className="text-2xl font-bold text-[var(--accent-orange)]">{value}</span>
        {change && (
          <span className={`text-sm ${parseFloat(change) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {parseFloat(change) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(change))}%
          </span>
        )}
      </div>
    </div>
    {children}
  </div>
);

// Add new component for floating text input
const FloatingInput = ({ position, countryName, onSubmit, onClose }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Analyze this fashion market information for ${countryName}: "${input}"`;
      
      const result = await model.generateContent(prompt);
      const response = JSON.parse(result.response.text());
      onSubmit(response);
    } catch (error) {
      console.error('Error analyzing input:', error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div 
      className="fixed z-50 bg-white rounded-lg shadow-lg p-2 w-64"
      style={{ 
        left: position.x,
        top: position.y - 10, // Offset slightly above the click
      }}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent-orange)]"
        placeholder={`Enter ${countryName} fashion info...`}
        autoFocus
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-3 py-1 text-xs bg-[var(--accent-orange)] text-white rounded hover:bg-opacity-90"
        >
          {loading ? '...' : 'OK'}
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default function FashionTrend() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryData, setCountryData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showInput, setShowInput] = useState(false);
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);



  const handleCountrySelect = async (e, countryCode) => {
    if (!countryCode) return;

    try {
      setSelectedCountry(countryCode);
      setIsLoading(true);
      setCountryData(null);

      const data = await getFashionData(countryCode);
      if (data) {
        setCountryData(data);
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Error in country selection:', error);
      // Show error in UI instead of setting countryData to null
      setCountryData({
        error: true,
        message: error.message || 'Failed to load data. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputSubmit = (analyzedData) => {
    setCountryData(analyzedData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-pink)] to-white p-6">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--accent-orange)] mb-2">
          Global Fashion Intelligence
        </h1>
        <p className="text-gray-600">
          Real-time fashion trends and market insights powered by AI
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Map Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4">
          <div className="h-[450px] relative">
            <VectorMap
              map={worldMill}
              backgroundColor="transparent"
              containerStyle={{
                width: "100%",
                height: "100%"
              }}
              regionStyle={{
                initial: {
                  fill: "#FFE5E5",
                  "fill-opacity": 0.8,
                  stroke: "none",
                  "stroke-width": 0,
                },
                hover: {
                  fill: "var(--deep-pink)",
                  cursor: "pointer"
                },
                selected: {
                  fill: "var(--accent-orange)"
                }
              }}
              onRegionClick={handleCountrySelect}
              selectedRegions={selectedCountry ? [selectedCountry] : []}
            />
            {selectedCountry && !countryData && inputPosition.x !== 0 && (
              <FloatingInput
                position={inputPosition}
                countryName={selectedCountry}
                onSubmit={(analyzedData) => {
                  setCountryData(analyzedData);
                  setSelectedCountry(null);
                }}
                onClose={() => setSelectedCountry(null)}
              />
            )}
          </div>
        </div>

        {/* Market Insights Cards */}
        <div className="space-y-6">
          <MarketInsightCard
            title="Global Market Size"
            value="$2.5T"
            change="+4.2"
          >
            <TrendChart />
          </MarketInsightCard>

          <MarketInsightCard
            title="Sustainability Index"
            value="67.8"
            change="+5.3"
          >
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-sm text-gray-500">Eco-Friendly</div>
                <div className="text-lg font-semibold text-[var(--accent-orange)]">45%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500">Recycled</div>
                <div className="text-lg font-semibold text-[var(--accent-orange)]">32%</div>
              </div>
            </div>
          </MarketInsightCard>
        </div>
      </div>

      {/* Country Details Popup */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            className="fixed top-0 right-0 h-full w-[450px] bg-white/95 backdrop-blur-md shadow-2xl overflow-y-auto"
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-orange)]"></div>
                <p className="mt-4 text-[var(--deep-pink)]">Analyzing fashion trends...</p>
                <p className="text-sm text-gray-500 mt-2">Please wait while we generate insights</p>
              </div>
            ) : countryData ? (
              countryData.error ? (
                // Error State
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <p className="text-[var(--deep-pink)] text-center mb-4">
                    {countryData.message}
                  </p>
                  <button 
                    onClick={() => handleCountrySelect(null, selectedCountry)} 
                    className="mt-4 px-4 py-2 bg-[var(--accent-orange)] text-white rounded-lg"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedCountry(null);
                      setCountryData(null);
                    }} 
                    className="mt-2 px-4 py-2 text-[var(--accent-orange)]"
                  >
                    Close
                  </button>
                </div>
              ) : (
                // Success State - Existing popup content
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-3xl font-bold text-[var(--accent-orange)]">
                        {countryData.name}
                      </h2>
                      <p className="text-[var(--deep-pink)] mt-1">Fashion Market Analysis</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCountry(null);
                        setCountryData(null);
                      }}
                      className="p-2 hover:bg-[var(--primary-pink)] rounded-full transition-all"
                    >
                      <MdClose className="text-2xl text-[var(--accent-orange)]" />
                    </button>
                  </div>

                  {/* Market Size */}
                  <div className="bg-gradient-to-br from-white to-[var(--primary-pink)] p-6 rounded-2xl mb-6">
                    <h3 className="text-xl font-semibold text-[var(--accent-orange)] mb-4">
                      Market Overview
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Market Size</span>
                        <span className="text-xl font-bold text-[var(--accent-orange)]">
                          {countryData.marketSize.value}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Growth Rate</span>
                        <span className="text-green-500 font-semibold">
                          {countryData.marketSize.growth}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        {countryData.marketSize.forecast}
                      </div>
                    </div>
                  </div>

                  {/* Trends */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-[var(--accent-orange)] mb-4">
                      Current Trends
                    </h3>
                    <div className="space-y-4">
                      {countryData.trends.map((trend, index) => (
                        <div 
                          key={index}
                          className="bg-white rounded-xl p-4 border border-[var(--accent-pink)]"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-[var(--deep-pink)]">
                                {trend.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {trend.description}
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-[var(--primary-pink)] rounded-full text-sm text-[var(--accent-orange)]">
                              {trend.popularity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Demographics */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-[var(--accent-orange)] mb-4">
                      Demographics
                    </h3>
                    <DemographicsDonut data={countryData.demographics} />
                  </div>

                  {/* Sustainability */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-[var(--accent-orange)] mb-4">
                      Sustainability Metrics
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(countryData.sustainability).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-[var(--primary-pink)] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[var(--accent-orange)] rounded-full"
                                style={{ width: value }}
                              />
                            </div>
                            <span className="text-sm font-medium">{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Brands */}
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--accent-orange)] mb-4">
                      Top Brands
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {countryData.topBrands.map((brand, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-[var(--primary-pink)] rounded-full text-sm text-[var(--deep-pink)] font-medium"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trending Section */}
      <div className="mt-8">
        <div className="flex gap-4 mb-6">
          {['overview', 'trends', 'forecast'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl transition-all ${
                activeTab === tab
                  ? 'bg-[var(--accent-orange)] text-white'
                  : 'bg-white text-gray-600 hover:bg-[var(--primary-pink)]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Trending Fashion Component */}
        <TrendingFashion />
      </div>

      {/* Add Input Dialog */}
      {showInput && (
        <CountryInputDialog
          countryName={selectedCountry}
          onSubmit={handleInputSubmit}
          onClose={() => {
            setShowInput(false);
            setSelectedCountry(null);
          }}
        />
      )}
    </div>
  );
}
