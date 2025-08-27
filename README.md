# SmartMask - Real-time Face Mask Detection System

A modern, real-time face mask detection system with a professional web interface built with React, TypeScript, and TensorFlow.js.

## 🚀 Features

### Real-time Detection
- **Live Camera Feed**: Real-time video processing with WebRTC
- **AI-Powered Detection**: Face mask detection using deep learning models
- **WebSocket Integration**: Real-time communication with backend services
- **Performance Monitoring**: FPS tracking and processing time metrics

### Professional Interface
- **Modern Design**: Glass morphism effects with smooth animations
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Real-time Alerts**: Instant notifications for mask violations
- **Analytics Dashboard**: Comprehensive statistics and compliance tracking

### Technical Features
- **TypeScript**: Full type safety and better development experience
- **Modular Architecture**: Clean, maintainable component structure
- **WebSocket Support**: Real-time bidirectional communication
- **Camera API Integration**: Direct browser camera access
- **Performance Optimized**: Efficient frame processing and rendering

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Real-time**: Socket.IO, WebRTC
- **AI/ML**: TensorFlow.js (ready for integration)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom animations

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartmask-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🔧 Configuration

### Backend Integration

To connect with your Python backend:

1. **Update WebSocket URL** in `src/hooks/useWebSocket.ts`:
   ```typescript
   const { socket, isConnected } = useWebSocket('ws://your-backend-url:8000');
   ```

2. **Configure API endpoints** in `src/services/detectionService.ts`:
   ```typescript
   constructor(
     wsUrl: string = 'ws://your-backend-url:8000',
     apiUrl: string = 'http://your-backend-url:8000'
   )
   ```

### Camera Settings

Modify camera configuration in `src/hooks/useCamera.ts`:
```typescript
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user' // or 'environment' for back camera
  }
});
```

## 🔌 Backend Integration

### Expected API Endpoints

**POST /detect**
```json
{
  "image": "base64_encoded_image",
  "timestamp": 1234567890
}
```

**Response:**
```json
{
  "detections": [
    {
      "has_mask": true,
      "confidence": 0.95,
      "bbox": {
        "x": 100,
        "y": 50,
        "width": 120,
        "height": 150
      }
    }
  ],
  "processing_time": 45,
  "frame_id": "frame_123"
}
```

### WebSocket Events

**Client → Server:**
- `frame_processed`: Send detection results
- `camera_status`: Camera state changes

**Server → Client:**
- `detection_result`: Real-time detection updates
- `alert`: System alerts and notifications
- `stats_update`: Analytics updates

## 🎯 Usage

### Starting Real-time Detection

1. Click "Start" to activate camera
2. Grant camera permissions when prompted
3. Real-time detection begins automatically
4. View live results with bounding boxes and confidence scores

### Monitoring System

- **Status Panel**: Current safety status and live counts
- **Analytics**: Detection statistics and compliance rates
- **Alerts**: Real-time notifications for violations
- **Connection Status**: Backend connectivity monitoring

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── RealTimeCameraFeed.tsx
│   ├── StatusPanel.tsx
│   ├── StatsPanel.tsx
│   └── AlertPanel.tsx
├── hooks/              # Custom React hooks
│   ├── useCamera.ts
│   └── useWebSocket.ts
├── services/           # API and business logic
│   └── detectionService.ts
├── context/            # React context providers
│   └── DetectionContext.tsx
└── types/              # TypeScript type definitions
```

### Adding New Features

1. **New Detection Models**: Update `detectionService.ts`
2. **UI Components**: Add to `components/` directory
3. **Real-time Features**: Extend WebSocket handlers
4. **Analytics**: Modify `DetectionContext.tsx`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Static Hosting
The built files in `dist/` can be deployed to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

## 🔒 Security Considerations

- **Camera Permissions**: Always request user consent
- **Data Privacy**: Process video locally when possible
- **HTTPS Required**: Camera API requires secure context
- **CORS Configuration**: Ensure proper backend CORS setup

## 📊 Performance Optimization

- **Frame Rate Control**: Adjustable detection FPS (default: 10 FPS)
- **Efficient Rendering**: Canvas-based overlay system
- **Memory Management**: Proper cleanup of video streams
- **Lazy Loading**: Components loaded on demand

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the example implementations

---

**Built with ❤️ for public safety and health compliance**