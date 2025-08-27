import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Play, Pause, RotateCcw } from 'lucide-react';
import { useDetection } from '../context/DetectionContext';

const CameraFeed: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string>('');
  const { detections, updateDetection } = useDetection();

  useEffect(() => {
    // Simulate detection updates for demo
    const interval = setInterval(() => {
      const mockDetections = [
        {
          id: '1',
          hasMask: Math.random() > 0.3,
          confidence: 0.85 + Math.random() * 0.15,
          bbox: {
            x: 150 + Math.random() * 100,
            y: 100 + Math.random() * 50,
            width: 120,
            height: 150
          }
        }
      ];
      updateDetection(mockDetections);
    }, 2000);

    return () => clearInterval(interval);
  }, [updateDetection]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError('');
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const resetCamera = () => {
    stopCamera();
    setTimeout(startCamera, 500);
  };

  return (
    <motion.div 
      className="glass-effect rounded-2xl p-6 shadow-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Camera className="w-6 h-6 text-white" />
          <h2 className="text-xl font-semibold text-white">Live Camera Feed</h2>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            onClick={isStreaming ? stopCamera : startCamera}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isStreaming 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isStreaming ? 'Stop' : 'Start'}</span>
          </motion.button>
          
          <motion.button
            onClick={resetCamera}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </motion.button>
        </div>
      </div>

      <div className="relative">
        <div className="camera-frame aspect-video bg-gray-900 flex items-center justify-center relative overflow-hidden">
          {error ? (
            <div className="text-center text-white">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-red-400 mb-2">{error}</p>
              <button 
                onClick={startCamera}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : !isStreaming ? (
            <div className="text-center text-white">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="mb-4">Click "Start" to begin face mask detection</p>
              <button 
                onClick={startCamera}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg transition-colors font-medium"
              >
                Start Camera
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
              
              {/* Detection Overlays */}
              {detections.map((detection) => (
                <motion.div
                  key={detection.id}
                  className={`detection-box ${detection.hasMask ? 'mask' : 'no-mask'}`}
                  style={{
                    left: `${detection.bbox.x}px`,
                    top: `${detection.bbox.y}px`,
                    width: `${detection.bbox.width}px`,
                    height: `${detection.bbox.height}px`,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className="absolute -top-8 left-0 text-sm font-semibold">
                    {detection.hasMask ? 'Mask' : 'No Mask'} ({Math.round(detection.confidence * 100)}%)
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="mt-4 text-center text-white/80 text-sm">
        {isStreaming && (
          <p>🔴 Live detection active - {detections.length} face(s) detected</p>
        )}
      </div>
    </motion.div>
  );
};

export default CameraFeed;