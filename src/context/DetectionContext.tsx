import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Detection {
  id: string;
  hasMask: boolean;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface Alert {
  id: string;
  type: 'no_mask' | 'system';
  message: string;
  timestamp: number;
}

export interface Stats {
  totalDetections: number;
  complianceRate: number;
  alertsToday: number;
  uptime: number;
}

interface DetectionContextType {
  detections: Detection[];
  alerts: Alert[];
  stats: Stats;
  updateDetection: (detections: Detection[]) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void;
  dismissAlert: (id: string) => void;
}

const DetectionContext = createContext<DetectionContextType | undefined>(undefined);

export const useDetection = () => {
  const context = useContext(DetectionContext);
  if (!context) {
    throw new Error('useDetection must be used within a DetectionProvider');
  }
  return context;
};

interface DetectionProviderProps {
  children: ReactNode;
}

export const DetectionProvider: React.FC<DetectionProviderProps> = ({ children }) => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalDetections: 0,
    complianceRate: 100,
    alertsToday: 0,
    uptime: 0
  });

  // Update uptime every second
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        uptime: Math.floor((Date.now() - startTime) / 1000)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateDetection = (newDetections: Detection[]) => {
    setDetections(newDetections);
    
    // Check for no-mask alerts
    const noMaskDetections = newDetections.filter(d => !d.hasMask);
    if (noMaskDetections.length > 0) {
      const alertMessage = noMaskDetections.length === 1 
        ? 'Person detected without face mask'
        : `${noMaskDetections.length} people detected without face masks`;
      
      addAlert({
        type: 'no_mask',
        message: alertMessage
      });
    }

    // Update stats
    setStats(prev => ({
      ...prev,
      totalDetections: prev.totalDetections + newDetections.length,
      complianceRate: Math.round(
        ((prev.totalDetections * prev.complianceRate / 100) + 
         newDetections.filter(d => d.hasMask).length) / 
        (prev.totalDetections + newDetections.length) * 100
      )
    }));
  };

  const addAlert = (alertData: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    
    setAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep only last 10 alerts
    
    if (alertData.type === 'no_mask') {
      setStats(prev => ({
        ...prev,
        alertsToday: prev.alertsToday + 1
      }));
    }
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <DetectionContext.Provider value={{
      detections,
      alerts,
      stats,
      updateDetection,
      addAlert,
      dismissAlert
    }}>
      {children}
    </DetectionContext.Provider>
  );
};