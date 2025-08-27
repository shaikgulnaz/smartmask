import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Users, Clock } from 'lucide-react';
import { useDetection } from '../context/DetectionContext';

const StatusPanel: React.FC = () => {
  const { detections, stats } = useDetection();
  
  const currentStatus = detections.some(d => !d.hasMask) ? 'alert' : 'safe';
  const maskedCount = detections.filter(d => d.hasMask).length;
  const unmaskedCount = detections.filter(d => !d.hasMask).length;

  return (
    <motion.div 
      className="glass-effect rounded-2xl p-6 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="w-6 h-6 text-white" />
        <h3 className="text-xl font-semibold text-white">System Status</h3>
      </div>

      <div className="space-y-4">
        {/* Overall Status */}
        <motion.div 
          className={`p-4 rounded-xl ${
            currentStatus === 'safe' 
              ? 'bg-green-500/20 border border-green-500/30' 
              : 'bg-red-500/20 border border-red-500/30'
          }`}
          animate={{ 
            scale: currentStatus === 'alert' ? [1, 1.02, 1] : 1 
          }}
          transition={{ 
            duration: 1, 
            repeat: currentStatus === 'alert' ? Infinity : 0 
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`status-indicator ${currentStatus}`}></div>
              <span className="text-white font-medium">
                {currentStatus === 'safe' ? 'All Clear' : 'Alert Active'}
              </span>
            </div>
            {currentStatus === 'alert' && (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            )}
          </div>
          <p className="text-white/80 text-sm mt-2">
            {currentStatus === 'safe' 
              ? 'All detected faces are wearing masks' 
              : `${unmaskedCount} person(s) without mask detected`
            }
          </p>
        </motion.div>

        {/* Current Detection Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-white/80 text-sm">With Mask</span>
            </div>
            <p className="text-2xl font-bold text-white">{maskedCount}</p>
          </div>
          
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-white/80 text-sm">No Mask</span>
            </div>
            <p className="text-2xl font-bold text-white">{unmaskedCount}</p>
          </div>
        </div>

        {/* System Uptime */}
        <div className="bg-white/10 p-3 rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-white/80 text-sm">System Uptime</span>
          </div>
          <p className="text-lg font-semibold text-white">
            {Math.floor(stats.uptime / 3600)}h {Math.floor((stats.uptime % 3600) / 60)}m
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusPanel;