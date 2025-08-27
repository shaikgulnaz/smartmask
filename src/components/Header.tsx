import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Activity, AlertTriangle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header 
      className="glass-effect rounded-2xl p-6 shadow-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.div
            className="p-3 bg-white/20 rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-white">SmartMask</h1>
            <p className="text-white/80 text-sm">Face Mask Detection & Alert System</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.div 
            className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg"
            whileHover={{ scale: 1.02 }}
          >
            <Activity className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">System Active</span>
          </motion.div>
          
          <motion.button
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;