import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Bell, X, Clock } from 'lucide-react';
import { useDetection } from '../context/DetectionContext';

const AlertPanel: React.FC = () => {
  const { alerts, dismissAlert } = useDetection();

  return (
    <motion.div 
      className="glass-effect rounded-2xl p-6 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6 text-white" />
          <h3 className="text-xl font-semibold text-white">Recent Alerts</h3>
        </div>
        {alerts.length > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {alerts.length}
          </span>
        )}
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {alerts.length === 0 ? (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertTriangle className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/60">No recent alerts</p>
            </motion.div>
          ) : (
            alerts.map((alert) => (
              <motion.div
                key={alert.id}
                className="bg-red-500/20 border border-red-500/30 p-4 rounded-xl"
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                layout
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-white font-medium text-sm">
                        {alert.type === 'no_mask' ? 'No Mask Detected' : 'System Alert'}
                      </span>
                    </div>
                    <p className="text-white/80 text-sm mb-2">{alert.message}</p>
                    <div className="flex items-center space-x-2 text-xs text-white/60">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {alerts.length > 0 && (
        <motion.button
          className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => alerts.forEach(alert => dismissAlert(alert.id))}
        >
          Clear All Alerts
        </motion.button>
      )}
    </motion.div>
  );
};

export default AlertPanel;