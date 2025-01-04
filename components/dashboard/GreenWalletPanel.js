import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {  HiOutlineGift, HiOutlineStar } from 'react-icons/hi';
import { FaLeaf, FaMedal } from 'react-icons/fa';

export default function GreenWalletPanel() {
  const [wallet, setWallet] = useState({
    points: 0,
    level: 'Eco Pioneer',
    rewards: [],
    progress: 0
  });

  useEffect(() => {
    // Simulate wallet updates
    setWallet({
      points: 750,
      level: 'Eco Pioneer',
      rewards: [
        {
          id: 1,
          title: '15% Off Sustainable Brands',
          points: 500,
          expires: '5 days',
          icon: <HiOutlineGift />
        },
        {
          id: 2,
          title: 'Free Carbon Neutral Shipping',
          points: 300,
          expires: '7 days',
          icon: <FaLeaf />
        },
        {
          id: 3,
          title: 'Exclusive Eco Collection Access',
          points: 1000,
          expires: '12 days',
          icon: <HiOutlineStar />
        }
      ],
      progress: 75
    });
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Green Wallet</h2>
          <p className="text-sm text-gray-500">Eco-rewards & benefits</p>
        </div>
        <div className="flex items-center gap-2">
          <FaMedal className="text-yellow-500" />
          <span className="text-sm font-medium text-gray-600">{wallet.level}</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Current Balance</span>
          <span className="text-2xl font-bold text-green-600">{wallet.points} pts</span>
        </div>
        <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${wallet.progress}%` }}
            className="absolute h-full bg-green-500 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">Level Progress</span>
          <span className="text-xs text-gray-500">{wallet.progress}%</span>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-700">Available Rewards</h3>
        {wallet.rewards.map((reward) => (
          <motion.div
            key={reward.id}
            whileHover={{ scale: 1.02 }}
            className="p-4 border border-gray-100 rounded-lg hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg text-green-500">
                {reward.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-800">{reward.title}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">{reward.points} points</span>
                  <span className="text-xs text-orange-500">Expires in {reward.expires}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 