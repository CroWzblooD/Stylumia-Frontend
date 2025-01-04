import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineClock, HiOutlineGlobe } from 'react-icons/hi';

export default function UserActivityPanel() {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => Math.floor(Math.random() * 50) + prev);
    }, 5000);

    // Initial activities
    setTimeout(() => {
      setActivities([
        {
          id: 1,
          user: {
            name: "Sarah M.",
            avatar: "https://i.pravatar.cc/150?img=1",
            location: "New York, US"
          },
          action: "purchased",
          item: "Floral Summer Dress",
          time: "2 minutes ago",
          amount: "$129.99"
        },
        {
          id: 2,
          user: {
            name: "John D.",
            avatar: "https://i.pravatar.cc/150?img=2",
            location: "London, UK"
          },
          action: "viewed",
          item: "Leather Jacket Collection",
          time: "5 minutes ago"
        },
        {
          id: 3,
          user: {
            name: "Emma W.",
            avatar: "https://i.pravatar.cc/150?img=3",
            location: "Paris, FR"
          },
          action: "added to cart",
          item: "Designer Sunglasses",
          time: "7 minutes ago",
          amount: "$199.99"
        }
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        user: {
          name: `User ${Math.floor(Math.random() * 1000)}`,
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
          location: ["US", "UK", "FR", "DE", "ES"][Math.floor(Math.random() * 5)]
        },
        action: ["purchased", "viewed", "added to cart"][Math.floor(Math.random() * 3)],
        item: ["Summer Dress", "Denim Jacket", "Sneakers", "Handbag"][Math.floor(Math.random() * 4)],
        time: "Just now",
        amount: `$${(Math.random() * 200 + 50).toFixed(2)}`
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 2)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Live Activity</h2>
          <p className="text-sm text-gray-500">Real-time user interactions</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm">{activeUsers} active now</span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <img
                src={activity.user.avatar}
                alt={activity.user.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {activity.user.name}
                      <span className="text-gray-500"> {activity.action} </span>
                      {activity.item}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <HiOutlineGlobe className="text-gray-400 w-3 h-3" />
                      <span className="text-xs text-gray-500">{activity.user.location}</span>
                      <HiOutlineClock className="text-gray-400 w-3 h-3 ml-2" />
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-medium text-fashion-orange">
                      {activity.amount}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
} 