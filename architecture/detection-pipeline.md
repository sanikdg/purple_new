# Person Detection Pipeline Architecture

**Date**: May 31, 2026  
**Phase**: Phase 3  
**Status**: Implementation Complete

## Overview

The Person Detection Pipeline implements YOLO-based real-time person detection for retail CCTV video analysis. This layer processes video frames and generates structured detection results for downstream analytics.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  (React + Vite + Tailwind CSS)                          │
│  - Detection Page with Control Panel                     │
│  - Detection Statistics Display                          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    API Layer                             │
│  (Express.js Routes)                                    │
│  - Detection Control APIs                               │
│  - Detection Results APIs                               │
│  - Detection Statistics APIs                            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                          │
│  (Business Logic)                                       │
│  - DetectionService (Results Storage & Retrieval)       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Model Layer                           │
│  (MongoDB + Mongoose)                                   │
│  - Detection Model (Frame-level detections)             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  AI Service Layer                        │
│  (Python + FastAPI)                                     │
│  - YOLO Service (Model Management)                      │
│  - Inference Engine (Detection Execution)               │
│  - Video Processor (Frame Processing)                   │
│  - Person Detector (Pipeline Orchestration)             │
└─────────────────────────────────────────────────────────┘
```

## Detection Pipeline Flow

```
Video Input
    ↓
[Video Processor]
    ├─ Load Video
    ├─ Extract Frames
    └─ Get Video Properties
    ↓
[Frame Loop]
    ├─ Read Frame
    ├─ [Inference Engine]
    │   ├─ Run YOLO Model
    │   ├─ Filter Person Class
    │   └─ Extract Bounding Boxes
    ├─ Generate Frame Result
    └─ Store Detection
    ↓
[Results Aggregation]
    ├─ Calculate Statistics
    ├─ Generate Summary
    └─ Return Results
    ↓
Detection Output
```

## Core Components

### 1. YOLO Service (yolo_service.py)

Manages YOLOv8n model lifecycle.

**Responsibilities:**
- Load model on startup
- Manage device selection (CPU/CUDA)
- Handle confidence threshold configuration
- Provide singleton model instance

**Key Methods:**
- `load_model()` - Load YOLOv8n model
- `get_model()` - Get loaded model instance
- `set_confidence()` - Update confidence threshold
- `is_loaded()` - Check model status

### 2. Inference Engine (inference.py)

Executes YOLO inference on frames.

**Responsibilities:**
- Run YOLO inference
- Filter person class detections only
- Extract bounding box coordinates
- Convert results to structured format

**Key Classes:**
- `Detection` - Single detection result
- `InferenceEngine` - Inference execution

**Key Methods:**
- `detect_persons()` - Detect persons in single frame
- `detect_persons_batch()` - Detect persons in multiple frames

### 3. Video Processor (video_processor.py)

Processes video files frame-by-frame.

**Responsibilities:**
- Open and validate video files
- Extract frames sequentially
- Process frames through inference
- Generate structured output
- Calculate statistics

**Key Classes:**
- `FrameProcessor` - Video frame processing

**Key Methods:**
- `open_video()` - Open video file
- `process_video()` - Process entire video
- `process_frame()` - Process single frame

### 4. Person Detector (detector.py)

Orchestrates the detection pipeline.

**Responsibilities:**
- Initialize all components
- Coordinate detection workflow
- Manage configuration
- Provide status information

**Key Classes:**
- `PersonDetector` - Pipeline orchestrator

**Key Methods:**
- `initialize()` - Initialize detector
- `detect_video()` - Run detection on video
- `get_status()` - Get detector status
- `set_confidence()` - Update confidence

## Data Models

### Detection Model (Backend)

```typescript
interface IDetection extends Document {
  cameraId: string              // Camera identifier
  frameNumber: number           // Frame number in video
  timestamp: Date               // Detection timestamp
  className: string             // Class name (always 'person')
  confidence: number            // Confidence score (0-1)
  boundingBox: IBoundingBox     // Bounding box coordinates
  createdAt: Date
  updatedAt: Date
}

interface IBoundingBox {
  x1: number                    // Top-left x
  y1: number                    // Top-left y
  x2: number                    // Bottom-right x
  y2: number                    // Bottom-right y
}
```

### Detection Output Format

```json
{
  "cameraId": "CAM1",
  "frameNumber": 123,
  "timestamp": "2026-06-01T12:00:00Z",
  "detections": [
    {
      "class": "person",
      "confidence": 0.94,
      "bbox": {
        "x1": 100,
        "y1": 200,
        "x2": 300,
        "y2": 500
      }
    }
  ],
  "personCount": 1
}
```

## API Endpoints

### Detection Control

```
POST /api/detection/run
  Body: { "cameraId": "CAM1" }
  Response: { "success": true, "message": "Detection started" }

GET /api/detection/status
  Response: { "success": true, "data": { "status": "ready", ... } }
```

### Detection Results

```
GET /api/detection/results
  Response: { "success": true, "data": [detections], "count": number }

GET /api/detection/results/:cameraId
  Response: { "success": true, "data": [detections], "count": number }
```

### Detection Statistics

```
GET /api/detection/stats
  Response: { "success": true, "data": { "totalDetections": number, ... } }

GET /api/detection/stats/by-camera
  Response: { "success": true, "data": [{ "cameraId": "CAM1", "count": 100 }] }

GET /api/detection/stats/confidence
  Response: { "success": true, "data": [{ "cameraId": "CAM1", "avgConfidence": 0.92 }] }
```

## Configuration

### Environment Variables

```
# AI Service
MODEL_PATH=yolov8n.pt              # YOLO model path
CONFIDENCE_THRESHOLD=0.5           # Detection confidence threshold
DEVICE=cpu                         # Device: cpu or cuda
PORT=8000                          # AI service port

# Backend
MONGODB_URI=mongodb://localhost:27017/store-intelligence
NODE_ENV=development
```

### Model Configuration

- **Model**: YOLOv8n (Nano - lightweight)
- **Input Resolution**: 640x640 (auto-scaled)
- **Confidence Threshold**: 0.5 (configurable)
- **Device**: CPU/CUDA (auto-detected)
- **Class Filter**: Person only

## Processing Flow

### Video Processing

1. **Load Video**
   - Open video file with OpenCV
   - Extract video properties (FPS, resolution, frame count)
   - Validate video format

2. **Frame Processing Loop**
   - Read frame from video
   - Run YOLO inference
   - Filter person detections
   - Extract bounding boxes
   - Create frame result
   - Store detection

3. **Results Aggregation**
   - Calculate statistics
   - Generate summary
   - Return results

### Detection Extraction

1. **Run YOLO**
   - Input: Frame (numpy array)
   - Output: YOLO results object

2. **Filter Persons**
   - Iterate through detections
   - Check class name
   - Keep only 'person' class

3. **Extract Coordinates**
   - Get bounding box (x1, y1, x2, y2)
   - Get confidence score
   - Create Detection object

## Performance Characteristics

### Model Performance
- **Model Size**: ~6.3 MB (YOLOv8n)
- **Inference Speed**: ~5-10ms per frame (CPU)
- **Inference Speed**: ~1-2ms per frame (CUDA)
- **Memory Usage**: ~200-300 MB (CPU)

### Processing Capacity
- **CPU**: ~100-150 FPS (depending on resolution)
- **CUDA**: ~500-1000 FPS (depending on GPU)
- **Batch Processing**: Supported for efficiency

### Storage
- **Detection Size**: ~200 bytes per detection
- **Frame Result Size**: ~500 bytes - 5 KB (depending on detections)
- **Video Result Size**: ~50 MB - 500 MB (depending on video length)

## Logging

### Log Levels
- **INFO**: Model loaded, video started, processing progress
- **WARNING**: CUDA fallback to CPU, low confidence detections
- **ERROR**: Model loading failures, video processing errors

### Log Format
```
2026-06-01 12:00:00 - app.detection.detector - INFO - PersonDetector initialized successfully
2026-06-01 12:00:01 - app.detection.yolo_service - INFO - Model loaded successfully on cpu
2026-06-01 12:00:02 - app.detection.video_processor - INFO - Processing video: CAM1 (1800 frames, 30.0 fps)
2026-06-01 12:00:32 - app.detection.video_processor - INFO - Video processing complete: 1800 frames, 450 persons detected
```

## Error Handling

### Common Errors

1. **Model Loading Failure**
   - Cause: Missing model file or corrupted download
   - Solution: Verify model path, re-download model

2. **Video Processing Error**
   - Cause: Invalid video format or corrupted file
   - Solution: Verify video format, check file integrity

3. **CUDA Unavailable**
   - Cause: CUDA not installed or GPU not available
   - Solution: Falls back to CPU automatically

4. **Out of Memory**
   - Cause: Processing large videos or batch processing
   - Solution: Reduce batch size or use CPU

## Security Considerations

- **Input Validation**: Video path validation
- **Resource Limits**: Max frames limit to prevent DoS
- **Error Messages**: No sensitive information in errors
- **Model Security**: Model loaded from trusted source

## Future Enhancements

### Phase 4
- Multi-person tracking (ByteTrack)
- Visitor ID assignment
- Zone-based analytics
- Heatmap generation

### Phase 5
- Real-time streaming
- Advanced analytics
- Anomaly detection
- Performance optimization

## Testing

### Unit Tests
- YOLO service initialization
- Inference engine detection
- Video processor frame extraction
- Detection model storage

### Integration Tests
- End-to-end video processing
- API endpoint functionality
- Database storage and retrieval
- Error handling

### Performance Tests
- Inference speed benchmarks
- Memory usage profiling
- Batch processing efficiency
- Database query performance

## Deployment

### Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

### Environment Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export MODEL_PATH=yolov8n.pt
export CONFIDENCE_THRESHOLD=0.5
export DEVICE=cpu

# Run service
python main.py
```

## Monitoring

### Metrics to Track
- Detection count per camera
- Average confidence per camera
- Processing time per video
- Model inference latency
- API response times

### Health Checks
- Model loaded status
- Database connectivity
- API availability
- Resource usage

## References

- [YOLOv8 Documentation](https://docs.ultralytics.com/)
- [OpenCV Documentation](https://docs.opencv.org/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
