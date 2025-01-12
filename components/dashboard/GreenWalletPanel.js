'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineFire, HiOutlineShoppingBag, HiOutlineHeart, HiOutlineTrendingUp } from 'react-icons/hi';
import { FiUsers, FiStar } from 'react-icons/fi';
import Image from 'next/image';

const TrendingItemsPanel = () => {
  const [trendingItems, setTrendingItems] = useState([]);
  const [trendingMetrics, setTrendingMetrics] = useState({
    totalViews: 0,
    engagementRate: 0,
    trendingCategories: []
  });

  const trendingProducts = [
    {
      name: 'Summer Breeze Dress',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
      price: 149.99,
      originalPrice: 189.99,
      category: 'Dresses',
      trending: 95,
      engagement: 1250,
      views: 3800
    },
    {
      name: 'Urban Chic Blazer',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
      price: 199.99,
      originalPrice: 249.99,
      category: 'Outerwear',
      trending: 88,
      engagement: 980,
      views: 2900
    },
    {
      name: 'Boho Paradise Set',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae',
      price: 129.99,
      originalPrice: 159.99,
      category: 'Sets',
      trending: 92,
      engagement: 1100,
      views: 3200
    },
    {
      name: 'Crystal Evening Clutch',
      image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d',
      price: 89.99,
      originalPrice: 119.99,
      category: 'Accessories',
      trending: 85,
      engagement: 850,
      views: 2400
    }
  ];

  useEffect(() => {
    // Initialize trending items
    setTrendingItems(trendingProducts);
    updateMetrics();

    // Update metrics every 30 seconds
    const interval = setInterval(updateMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateMetrics = () => {
    setTrendingMetrics({
      totalViews: Math.floor(Math.random() * 5000) + 10000,
      engagementRate: Math.floor(Math.random() * 15) + 75,
      trendingCategories: ['Dresses', 'Outerwear', 'Sets', 'Accessories']
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Trending Now</h2>
          <p className="text-sm text-gray-500">Hot items in the last 24 hours</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-500 rounded-full">
            <HiOutlineFire className="animate-pulse" />
            <span className="text-sm font-medium">{trendingMetrics.engagementRate}% Engagement</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-500 rounded-full">
            <FiUsers />
            <span className="text-sm font-medium">{trendingMetrics.totalViews.toLocaleString()} Views</span>
          </div>
        </div>
      </div>

      {/* Trending Categories */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {trendingMetrics.trendingCategories.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="px-4 py-2 bg-gradient-to-r from-fashion-pink/10 to-fashion-orange/10 rounded-full"
          >
            <span className="text-sm font-medium text-gray-700">{category}</span>
          </motion.div>
        ))}
      </div>

      {/* Trending Items Grid */}
      <div className="grid grid-cols-2 gap-4">
        {trendingItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
          >
            <div className="relative h-48 w-full">
              <Image
                src={item.image}
                alt={item.name}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Trending Score */}
              <div className="absolute top-2 left-2">
                <div className="flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full">
                  <HiOutlineTrendingUp className="w-4 h-4 text-fashion-pink" />
                  <span className="text-xs font-medium text-gray-800">{item.trending}% Trend</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors">
                  <HiOutlineHeart className="w-4 h-4 text-fashion-pink" />
                </button>
                <button className="p-1.5 bg-white/90 rounded-full hover:bg-white transition-colors">
                  <HiOutlineShoppingBag className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Item Details */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-sm mb-1">{item.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-200">{item.category}</span>
                    <div className="flex items-center gap-1">
                      <FiUsers className="w-3 h-3" />
                      <span className="text-xs">{item.engagement}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold">${item.price}</span>
                    <span className="text-xs line-through text-gray-300">
                      ${item.originalPrice}
                    </span>
                  </div>
                  <span className="text-xs text-green-400">
                    Save {Math.round((1 - item.price/item.originalPrice) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 py-2.5 px-4 bg-gradient-to-r from-fashion-pink to-fashion-orange text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        Explore All Trending Items
      </motion.button>
    </div>
  );
};

export default TrendingItemsPanel;