import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Eye, Zap } from 'lucide-react';
import { useDetection } from '../context/DetectionContext';

const StatsPanel: React.FC = () => {
  const { stats } = useDetection();

  const statItems = [
    {
      icon: Eye,
      label: 'Total Detections',
      value: stats.totalDetections,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      icon: TrendingUp,
      label: 'Compliance Rate',
      value: `${stats.complianceRate}%`,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      icon: Zap,
      label: 'Alerts Today',
      value: stats.alertsToday,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20'
    }
  ];

  return (
    <motion.div 
      className="glass-effect rounded-2xl p-6 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <BarChart3 className="w-6 h-6 text-white" />
        <h3 className="text-xl font-semibold text-white">Analytics</h3>
      </div>

      <div className="space-y-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            className={`p-4 rounded-xl ${item.bgColor} border border-white/10`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="text-white/80 text-sm">{item.label}</span>
              </div>
              <span className="text-2xl font-bold text-white">{item.value}</span>
            </div>
          </motion.div>
        ))}

        {/* Compliance Chart Placeholder */}
        <div className="bg-white/10 p-4 rounded-xl">
          <h4 className="text-white font-medium mb-3">Today's Compliance</h4>
          <div className="flex items-end space-x-1 h-16">
            {Array.from({ length: 12 }, (_, i) => (
              <motion.div
                key={i}
                className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-sm flex-1"
                style={{ 
                  height: `${Math.random() * 60 + 20}%`,
                  minHeight: '8px'
                }}
                initial={{ height: 0 }}
                animate={{ height: `${Math.random() * 60 + 20}%` }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-white/60 mt-2">
            <span>6AM</span>
            <span>12PM</span>
            <span>6PM</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsPanel;