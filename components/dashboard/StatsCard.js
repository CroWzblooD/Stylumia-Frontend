import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon, trend, color }) {
  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        trend: 'text-blue-500'
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        trend: 'text-green-500'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        trend: 'text-purple-500'
      },
      orange: {
        bg: 'bg-[#FF6B35]/10',
        text: 'text-[#FF6B35]',
        trend: 'text-[#FF6B35]'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const colors = getColorClasses(color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <span className={`p-2 ${colors.bg} rounded-lg`}>
          <span className={colors.text}>{icon}</span>
        </span>
        {trend && (
          <span className={`text-sm font-medium ${colors.trend}`}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </motion.div>
  );
} 