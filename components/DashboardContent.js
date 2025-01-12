'use client';
import { useState, useEffect } from 'react';

import { 
   FaTshirt,
  FaLeaf
} from 'react-icons/fa';
import { 
   HiOutlineShoppingBag,
  HiOutlineTag,
  HiOutlineHeart,
  HiOutlineChatAlt,
  HiOutlineX,
  HiOutlineCollection,
  HiOutlineTrendingUp
} from 'react-icons/hi';


import StatsCard from './dashboard/StatsCard';
import UserStylePanel from './dashboard/UserStylePanel';
import ExpenseTrackerPanel from './dashboard/ExpenseTrackerPanel';
import UserActivityPanel from './dashboard/UserActivityPanel';
import TryOnMetricsPanel from './dashboard/TryOnMetricsPanel';
import GreenWalletPanel from './dashboard/GreenWalletPanel';
import SavedItemsPanel from './dashboard/SavedItemsPanel';

export default function DashboardContent() {
  const [userMetrics, setUserMetrics] = useState({
    styleMatchRate: 85,
    styleMatchTrend: 12,
    feedbackCount: 24,
    feedbackImpact: 18,
    avoidedCount: 15,
    avoidedTrend: 8,
    topCategories: 5,
    categoryEngagement: 92
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/user-metrics');
        const data = await response.json();
        setUserMetrics(data);
      } catch (error) {
        console.error('Error fetching user metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="p-6">
      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Style Match Rate Card */}
        <div className="bg-gradient-to-br from-green-100/50 via-white to-green-50/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-500">vs last month</span>
            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-500 rounded-full">
              +12% this month
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mt-4">Style Match Rate</h3>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-800">85%</span>
              <span className="text-xs text-gray-500">Growing</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">Personalized</span>
            <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">Accurate</span>
            <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">Improving</span>
            <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">Trending</span>
            <span className="px-2 py-1 text-xs font-medium bg-green-50 text-green-600 rounded-full">Optimized</span>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Previous: 73%</span>
              <span>Target: 95%</span>
            </div>
          </div>
        </div>

        {/* Feedback Impact Card */}
        <div className="bg-gradient-to-br from-orange-100/50 via-white to-orange-50/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-500">System learning</span>
            <span className="text-xs font-medium px-2 py-1 bg-orange-100 text-orange-500 rounded-full">
              18 improvements
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mt-4">Feedback Impact</h3>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-800">24</span>
              <span className="text-xs text-gray-500">feedbacks</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-2 py-1 text-xs font-medium bg-orange-50 text-orange-600 rounded-full">Style</span>
            <span className="px-2 py-1 text-xs font-medium bg-orange-50 text-orange-600 rounded-full">Fit</span>
            <span className="px-2 py-1 text-xs font-medium bg-orange-50 text-orange-600 rounded-full">Color</span>
            <span className="px-2 py-1 text-xs font-medium bg-orange-50 text-orange-600 rounded-full">Comfort</span>
            <span className="px-2 py-1 text-xs font-medium bg-orange-50 text-orange-600 rounded-full">Quality</span>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '75%' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Learning Rate</span>
              <span>75% Effective</span>
            </div>
          </div>
        </div>

        {/* Avoided Styles Card */}
        <div className="bg-gradient-to-br from-red-100/50 via-white to-red-50/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-500">Preference filters</span>
            <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-500 rounded-full">
              8 saved
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mt-4">Avoided Styles</h3>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-800">15</span>
              <span className="text-xs text-gray-500">filtered</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-full">Colors</span>
            <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-full">Patterns</span>
            <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-full">Styles</span>
            <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-full">Materials</span>
            <span className="px-2 py-1 text-xs font-medium bg-red-50 text-red-600 rounded-full">Brands</span>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: '60%' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Filter Accuracy</span>
              <span>60% Applied</span>
            </div>
          </div>
        </div>

        {/* Top Categories Card */}
        <div className="bg-gradient-to-br from-purple-100/50 via-white to-purple-50/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-xs text-gray-500">Active categories</span>
            <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-500 rounded-full">
              92% engaged
            </span>
          </div>
          <h3 className="text-gray-600 text-sm font-medium mt-4">Top Categories</h3>
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-800">5</span>
              <span className="text-xs text-gray-500">most active</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-600 rounded-full">Dresses</span>
            <span className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-600 rounded-full">Tops</span>
            <span className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-600 rounded-full">Accessories</span>
            <span className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-600 rounded-full">Shoes</span>
            <span className="px-2 py-1 text-xs font-medium bg-purple-50 text-purple-600 rounded-full">Outerwear</span>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '92%' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Total Categories: 12</span>
              <span>92% Active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <UserStylePanel />
          <ExpenseTrackerPanel />
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <UserActivityPanel />
          <GreenWalletPanel />
          <TryOnMetricsPanel />
          <SavedItemsPanel />
        </div>
      </div>
    </div>
  );
}