import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Server, AlertCircle } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';

const ConnectionStatus: React.FC = () => {
  const { isConnected } = useWebSocket('ws://localhost:8000');

  return (
    <motion.div 
      className="glass-effect rounded-xl p-4 shadow-lg"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            className={`p-2 rounded-lg ${
              isConnected ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}
            animate={{ 
              scale: isConnected ? [1, 1.05, 1] : 1 
            }}
            transition={{ 
              duration: 2, 
              repeat: isConnected ? Infinity : 0 
            }}
          >
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-400" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-400" />
            )}
          </motion.div>
          <div>
            <p className="text-white font-medium text-sm">
              Backend Connection
            </p>
            <p className={`text-xs ${
              isConnected ? 'text-green-400' : 'text-red-400'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Server className="w-4 h-4 text-white/60" />
          {!isConnected && (
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            </motion.div>
          )}
        </div>
      </div>

      {!isConnected && (
        <motion.div 
          className="mt-3 p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-yellow-400 text-xs">
            ⚠️ Backend server not available. Using demo mode.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ConnectionStatus;