import React from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import RealTimeCameraFeed from './components/RealTimeCameraFeed';
import ConnectionStatus from './components/ConnectionStatus';
import StatusPanel from './components/StatusPanel';
import StatsPanel from './components/StatsPanel';
import AlertPanel from './components/AlertPanel';
import { DetectionProvider } from './context/DetectionContext';

function App() {
  return (
    <DetectionProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600">
        <div className="container mx-auto px-4 py-6">
          <Header />
          
          {/* Connection Status */}
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ConnectionStatus />
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Main Camera Feed */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <RealTimeCameraFeed />
            </motion.div>
            
            {/* Side Panel */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <StatusPanel />
              <StatsPanel />
              <AlertPanel />
            </motion.div>
          </div>
        </div>
      </div>
    </DetectionProvider>
  );
}

export default App;