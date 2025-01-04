import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {  HiOutlineShoppingCart, HiOutlineEye } from 'react-icons/hi';
import Image from 'next/image';

export default function TrendingItemsPanel() {
  const [trendingItems, setTrendingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    // Simulate trending items loading
    setTimeout(() => {
      setTrendingItems([
        {
          id: 1,
          name: "Summer Breeze Dress",
          category: "Dresses",
          image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
          views: 2456,
          sales: 189,
          trend: "+45%",
          price: 89.99
        },
        {
          id: 2,
          name: "Urban Comfort Sneakers",
          category: "Footwear",
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
          views: 1897,
          sales: 145,
          trend: "+28%",
          price: 129.99
        },
        {
          id: 3,
          name: "Eco-Friendly Tote",
          category: "Accessories",
          image: "https://images.unsplash.com/photo-1591561954557-26941169b49e",
          views: 1543,
          sales: 98,
          trend: "+33%",
          price: 49.99
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Trending Items</h2>
          <p className="text-sm text-gray-500">Most popular products</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {trendingItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:shadow-md transition-all"
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${item.price}</p>
                    <p className="text-sm text-green-500">{item.trend}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <HiOutlineEye />
                    <span>{item.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <HiOutlineShoppingCart />
                    <span>{item.sales.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 