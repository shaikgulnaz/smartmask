import { Detection } from '../context/DetectionContext';

export interface DetectionResult {
  detections: Detection[];
  processingTime: number;
  frameId: string;
}

export class DetectionService {
  private wsUrl: string;
  private apiUrl: string;

  constructor(wsUrl: string = 'ws://localhost:8000', apiUrl: string = 'http://localhost:8000') {
    this.wsUrl = wsUrl;
    this.apiUrl = apiUrl;
  }

  // Send frame data for processing
  async processFrame(imageData: ImageData): Promise<DetectionResult | null> {
    try {
      // Convert ImageData to base64
      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return null;
      
      ctx.putImageData(imageData, 0, 0);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8);

      const response = await fetch(`${this.apiUrl}/detect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          timestamp: Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Detection API error: ${response.status}`);
      }

      const result = await response.json();
      return this.parseDetectionResult(result);
    } catch (error) {
      console.error('Frame processing error:', error);
      return null;
    }
  }

  private parseDetectionResult(apiResult: any): DetectionResult {
    const detections: Detection[] = (apiResult.detections || []).map((det: any, index: number) => ({
      id: `${Date.now()}-${index}`,
      hasMask: det.has_mask || det.hasMask,
      confidence: det.confidence || 0,
      bbox: {
        x: det.bbox?.x || det.x || 0,
        y: det.bbox?.y || det.y || 0,
        width: det.bbox?.width || det.width || 0,
        height: det.bbox?.height || det.height || 0,
      },
    }));

    return {
      detections,
      processingTime: apiResult.processing_time || 0,
      frameId: apiResult.frame_id || Date.now().toString(),
    };
  }

  // Simulate real-time detection for demo purposes
  generateMockDetection(): DetectionResult {
    const numFaces = Math.floor(Math.random() * 3) + 1;
    const detections: Detection[] = [];

    for (let i = 0; i < numFaces; i++) {
      detections.push({
        id: `mock-${Date.now()}-${i}`,
        hasMask: Math.random() > 0.3, // 70% chance of wearing mask
        confidence: 0.75 + Math.random() * 0.25,
        bbox: {
          x: 50 + Math.random() * 400,
          y: 50 + Math.random() * 200,
          width: 80 + Math.random() * 40,
          height: 100 + Math.random() * 50,
        },
      });
    }

    return {
      detections,
      processingTime: 50 + Math.random() * 100,
      frameId: Date.now().toString(),
    };
  }
}