'use client';
import { useState, useEffect } from 'react';

import { 
   FaTshirt,
  FaLeaf
} from 'react-icons/fa';
import { 
   HiOutlineShoppingBag,
  HiOutlineTag
} from 'react-icons/hi';


import StatsCard from './dashboard/StatsCard';
import UserStylePanel from './dashboard/UserStylePanel';
import TrendingItemsPanel from './dashboard/TrendingItemsPanel';
import ExpenseTrackerPanel from './dashboard/ExpenseTrackerPanel';
import UserActivityPanel from './dashboard/UserActivityPanel';
import TryOnMetricsPanel from './dashboard/TryOnMetricsPanel';
import GreenWalletPanel from './dashboard/GreenWalletPanel';
import SavedItemsPanel from './dashboard/SavedItemsPanel';

export default function DashboardContent() {
  const [userMetrics, setUserMetrics] = useState({
    totalSpent: 0,
    totalSaved: 0,
    ecoPoints: 0,
    tryOns: 0
  });

  useEffect(() => {
    // Simulate loading user metrics
    setUserMetrics({
      totalSpent: 1250.75,
      totalSaved: 450.25,
      ecoPoints: 2500,
      tryOns: 15
    });
  }, []);

  return (
    <div className="p-6">
      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Monthly Spending"
          value={`$${userMetrics.totalSpent.toFixed(2)}`}
          icon={<HiOutlineShoppingBag />}
          trend="+12% from last month"
          color="blue"
        />
        <StatsCard 
          title="Total Savings"
          value={`$${userMetrics.totalSaved.toFixed(2)}`}
          icon={<HiOutlineTag />}
          trend="+15% this month"
          color="green"
        />
        <StatsCard 
          title="Green Points"
          value={userMetrics.ecoPoints}
          icon={<FaLeaf />}
          trend="Level 3 Eco Shopper"
          color="emerald"
        />
        <StatsCard 
          title="Virtual Try-Ons"
          value={userMetrics.tryOns}
          icon={<FaTshirt />}
          trend="+5 this week"
          color="purple"
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <UserStylePanel />
          <TrendingItemsPanel />
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