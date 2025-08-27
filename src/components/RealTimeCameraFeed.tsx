import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Camera, Play, Pause, RotateCcw, Wifi, WifiOff, Zap } from 'lucide-react';
import { useDetection } from '../context/DetectionContext';
import { useCamera } from '../hooks/useCamera';
import { useWebSocket } from '../hooks/useWebSocket';
import { DetectionService } from '../services/detectionService';

const RealTimeCameraFeed: React.FC = () => {
  const { videoRef, canvasRef, isStreaming, error, startCamera, stopCamera, captureFrame } = useCamera();
  const { socket, isConnected, sendMessage } = useWebSocket('ws://localhost:8000');
  const { detections, updateDetection, addAlert } = useDetection();
  const [detectionService] = useState(() => new DetectionService());
  const [isProcessing, setIsProcessing] = useState(false);
  const [fps, setFps] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);

  // Real-time frame processing
  useEffect(() => {
    if (!isStreaming) return;

    let frameCount = 0;
    let lastTime = Date.now();
    let animationId: number;

    const processFrames = async () => {
      if (!isStreaming) return;

      setIsProcessing(true);
      const startTime = Date.now();

      try {
        // For demo purposes, use mock detection
        // In production, replace with: const frame = captureFrame();
        // const result = await detectionService.processFrame(frame);
        const result = detectionService.generateMockDetection();
        
        if (result) {
          updateDetection(result.detections);
          setProcessingTime(result.processingTime);
          
          // Send to WebSocket if connected
          if (isConnected && socket) {
            sendMessage('frame_processed', {
              detections: result.detections,
              timestamp: Date.now(),
            });
          }
        }
      } catch (error) {
        console.error('Frame processing error:', error);
      }

      setIsProcessing(false);

      // Calculate FPS
      frameCount++;
      const currentTime = Date.now();
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }

      // Schedule next frame (targeting ~10 FPS for detection)
      setTimeout(() => {
        if (isStreaming) {
          animationId = requestAnimationFrame(processFrames);
        }
      }, 100);
    };

    animationId = requestAnimationFrame(processFrames);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isStreaming, isConnected, socket, sendMessage, updateDetection, detectionService, captureFrame]);

  // WebSocket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('detection_result', (data) => {
      updateDetection(data.detections);
    });

    socket.on('alert', (data) => {
      addAlert({
        type: data.type,
        message: data.message,
      });
    });

    return () => {
      socket.off('detection_result');
      socket.off('alert');
    };
  }, [socket, updateDetection, addAlert]);

  const resetCamera = useCallback(() => {
    stopCamera();
    setTimeout(startCamera, 500);
  }, [startCamera, stopCamera]);

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
          <h2 className="text-xl font-semibold text-white">Real-time Detection</h2>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            {isProcessing && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-4 h-4 text-yellow-400" />
              </motion.div>
            )}
          </div>
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
              <p className="mb-4">Click "Start" to begin real-time face mask detection</p>
              <button 
                onClick={startCamera}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg transition-colors font-medium"
              >
                Start Real-time Detection
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
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ display: 'none' }}
              />
              
              {/* Real-time Detection Overlays */}
              {detections.map((detection) => (
                <motion.div
                  key={detection.id}
                  className={`detection-box ${detection.hasMask ? 'mask' : 'no-mask'}`}
                  style={{
                    left: `${(detection.bbox.x / 640) * 100}%`,
                    top: `${(detection.bbox.y / 480) * 100}%`,
                    width: `${(detection.bbox.width / 640) * 100}%`,
                    height: `${(detection.bbox.height / 480) * 100}%`,
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="absolute -top-8 left-0 text-sm font-semibold whitespace-nowrap">
                    {detection.hasMask ? '✅ Mask' : '❌ No Mask'} ({Math.round(detection.confidence * 100)}%)
                  </div>
                </motion.div>
              ))}

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-lg">
                  <div className="flex items-center space-x-2 text-white text-sm">
                    <motion.div
                      className="w-2 h-2 bg-yellow-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                    <span>Processing...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white/10 p-3 rounded-lg">
          <p className="text-white/80 text-xs">Connection</p>
          <p className={`font-semibold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'Connected' : 'Offline'}
          </p>
        </div>
        <div className="bg-white/10 p-3 rounded-lg">
          <p className="text-white/80 text-xs">Detection FPS</p>
          <p className="text-white font-semibold">{fps}</p>
        </div>
        <div className="bg-white/10 p-3 rounded-lg">
          <p className="text-white/80 text-xs">Processing Time</p>
          <p className="text-white font-semibold">{processingTime}ms</p>
        </div>
        <div className="bg-white/10 p-3 rounded-lg">
          <p className="text-white/80 text-xs">Faces Detected</p>
          <p className="text-white font-semibold">{detections.length}</p>
        </div>
      </div>

      {isStreaming && (
        <div className="mt-4 text-center text-white/80 text-sm">
          <p>🔴 Real-time detection active - AI processing every frame</p>
        </div>
      )}
    </motion.div>
  );
};

export default RealTimeCameraFeed;