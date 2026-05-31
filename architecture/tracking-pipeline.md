# Visitor Tracking Pipeline Architecture

**Date**: May 31, 2026  
**Phase**: Phase 4  
**Status**: Implementation Complete

## Overview

The Visitor Tracking Pipeline implements ByteTrack-based multi-object tracking for retail CCTV video analysis. This layer converts frame-level person detections into persistent visitor tracks and sessions.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  (React + Vite + Tailwind CSS)                          │
│  - Tracking Page with Control Panel                      │
│  - Visitor Statistics Display                            │
│  - Session Duration Metrics                              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    API Layer                             │
│  (Express.js Routes)                                    │
│  - Tracking Control APIs                                │
│  - Visitor Results APIs                                 │
│  - Tracking Statistics APIs                             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                          │
│  (Business Logic)                                       │
│  - TrackingService (Results Storage & Retrieval)        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Model Layer                           │
│  (MongoDB + Mongoose)                                   │
│  - Visitor Model (Session-level tracking)               │
│  - Track Model (Frame-level tracking)                   │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  AI Service Layer                        │
│  (Python + FastAPI)                                     │
│  - ByteTrack Service (Track Management)                 │
│  - Track Manager (Session Lifecycle)                    │
│  - Tracking Processor (Frame Processing)                │
│  - Visitor Tracker (Pipeline Orchestration)             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Detection Layer                         │
│  (Phase 3 - YOLO Person Detection)                      │
│  - Person Detection Output                              │
└─────────────────────────────────────────────────────────┘
```

## Tracking Pipeline Flow

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
    ├─ [Detection Engine]
    │   ├─ Run YOLO Model
    │   ├─ Filter Person Class
    │   └─ Extract Bounding Boxes
    ├─ [ByteTrack]
    │   ├─ Match Detections to Tracks
    │   ├─ Create New Tracks
    │   ├─ Update Existing Tracks
    │   └─ Remove Old Tracks
    ├─ [Track Manager]
    │   ├─ Create Visitor Sessions
    │   ├─ Update Session Data
    │   └─ Manage Session Lifecycle
    └─ Generate Frame Result
    ↓
[Results Aggregation]
    ├─ Calculate Statistics
    ├─ Generate Summary
    └─ Return Results
    ↓
Tracking Output
```

## Core Components

### 1. ByteTrack Service (bytetrack_service.py)

Manages multi-object tracking using Intersection over Union (IoU) matching.

**Responsibilities:**
- Track creation and lifecycle management
- Detection-to-track matching using IoU
- Track age and confidence tracking
- Automatic track removal for old/lost tracks

**Key Methods:**
- `update()` - Update tracks with new detections
- `_match_detections()` - Match detections to existing tracks
- `_compute_iou()` - Calculate IoU between bounding boxes
- `get_tracks()` - Get confirmed tracks
- `reset()` - Reset tracker state

**Track Lifecycle:**
1. **New Track** - Created when detection doesn't match existing tracks
2. **Active Track** - Track with age >= min_hits (default: 3)
3. **Missed Update** - Track not matched in current frame
4. **Removed Track** - Track with time_since_update > max_age (default: 30)

### 2. Track Manager (track_manager.py)

Manages visitor sessions and track-to-visitor mapping.

**Responsibilities:**
- Create visitor sessions from tracks
- Manage session lifecycle (active → ended)
- Track visitor duration and frame count
- Generate session statistics

**Key Methods:**
- `process_tracks()` - Process tracks and manage sessions
- `_create_visitor()` - Create new visitor session
- `_cleanup_sessions()` - Remove ended sessions
- `get_active_sessions()` - Get active visitors
- `get_session_stats()` - Calculate statistics

**Session Lifecycle:**
1. **Created** - New visitor session from track
2. **Active** - Session with recent updates
3. **Ended** - Session without updates for session_timeout seconds
4. **Archived** - Session kept for 2x session_timeout before removal

### 3. Tracking Processor (tracking_processor.py)

Processes video frames with detection and tracking.

**Responsibilities:**
- Video file handling
- Frame-by-frame processing
- Integration of detection and tracking
- Results aggregation and statistics

**Key Methods:**
- `process_video()` - Process entire video with tracking
- `process_frame()` - Process single frame with tracking
- `open_video()` - Open and validate video file

### 4. Visitor Tracker (tracker.py)

Main orchestrator for the tracking pipeline.

**Responsibilities:**
- Pipeline initialization
- Configuration management
- Status reporting
- Session retrieval

**Key Methods:**
- `initialize()` - Initialize tracker components
- `track_video()` - Run tracking on video
- `get_status()` - Get tracker status
- `get_active_sessions()` - Get active visitors
- `get_all_sessions()` - Get all visitors

## Track Output Format

```json
{
  "trackId": "T000001",
  "bbox": {
    "x1": 100,
    "y1": 200,
    "x2": 300,
    "y2": 500
  },
  "confidence": 0.9400,
  "age": 15,
  "timeSinceUpdate": 0
}
```

## Visitor Session Format

```json
{
  "visitorId": "V000001",
  "trackId": "T000001",
  "cameraId": "CAM1",
  "firstSeen": "2026-06-01T12:00:00Z",
  "lastSeen": "2026-06-01T12:00:05Z",
  "duration": 5.23,
  "frameCount": 157,
  "status": "active",
  "detectionCount": 157
}
```

## Frame-Level Tracking Output

```json
{
  "cameraId": "CAM1",
  "frameNumber": 123,
  "timestamp": "2026-06-01T12:00:00Z",
  "detectionCount": 3,
  "trackCount": 2,
  "sessionCount": 2,
  "tracks": [
    {
      "trackId": "T000001",
      "bbox": { "x1": 100, "y1": 200, "x2": 300, "y2": 500 },
      "confidence": 0.94,
      "age": 15,
      "timeSinceUpdate": 0
    }
  ],
  "sessions": [
    {
      "visitorId": "V000001",
      "trackId": "T000001",
      "cameraId": "CAM1",
      "firstSeen": "2026-06-01T12:00:00Z",
      "lastSeen": "2026-06-01T12:00:00Z",
      "duration": 0.04,
      "frameCount": 1,
      "status": "active",
      "detectionCount": 1
    }
  ]
}
```

## Database Schema

### Visitor Model
```typescript
{
  visitorId: string (unique, indexed)
  trackId: string (indexed)
  cameraId: string (indexed)
  firstSeen: Date (indexed)
  lastSeen: Date (indexed)
  status: 'active' | 'ended' (indexed)
  frameCount: number
  detectionCount: number
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Indexes:**
- Single: `visitorId`, `trackId`, `cameraId`, `firstSeen`, `lastSeen`, `status`
- Compound: `cameraId + firstSeen`, `cameraId + status`, `firstSeen + lastSeen`

### Track Model
```typescript
{
  trackId: string (indexed)
  cameraId: string (indexed)
  frameNumber: number (indexed)
  timestamp: Date (indexed)
  boundingBox: {
    x1: number
    y1: number
    x2: number
    y2: number
  }
  confidence: number (0-1)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

**Indexes:**
- Single: `trackId`, `cameraId`, `frameNumber`, `timestamp`
- Compound: `trackId + timestamp`, `cameraId + timestamp`, `cameraId + frameNumber`

## API Endpoints

### Tracking Control
- `POST /api/tracking/run` - Start tracking for camera
- `GET /api/tracking/status` - Get tracker status

### Visitor Results
- `GET /api/tracking/results` - Get all visitors
- `GET /api/tracking/results/:cameraId` - Get visitors for camera
- `GET /api/tracking/visitors` - Get all visitors
- `GET /api/tracking/visitors/active` - Get active visitors

### Tracking Statistics
- `GET /api/tracking/stats` - Get overall statistics
- `GET /api/tracking/stats/by-camera` - Get visitor count by camera
- `GET /api/tracking/stats/duration` - Get average session duration

### Track Data
- `GET /api/tracking/tracks/:cameraId` - Get tracks for camera

## Configuration

### Environment Variables

```bash
# ByteTrack Configuration
TRACKER_MAX_AGE=30              # Frames to keep track without update
TRACKER_MIN_HITS=3              # Minimum hits before track confirmed

# Session Configuration
SESSION_TIMEOUT=300             # Seconds before session ends
```

### Default Values

| Parameter | Default | Range | Description |
|-----------|---------|-------|-------------|
| max_age | 30 | 1-100 | Frames to keep unmatched track |
| min_hits | 3 | 1-10 | Hits before track confirmed |
| session_timeout | 300 | 10-3600 | Seconds before session ends |
| IoU threshold | 0.5 | 0-1 | Minimum IoU for matching |

## Performance Characteristics

### Time Complexity
- Detection matching: O(n*m) where n=tracks, m=detections
- IoU computation: O(1) per pair
- Session management: O(n) where n=active sessions

### Space Complexity
- Tracks: O(n) where n=max concurrent tracks
- Sessions: O(m) where m=total visitors
- History: O(n*f) where f=frames per track

### Typical Performance
- Frame processing: ~50-100ms per frame (CPU)
- Track matching: ~10-20ms per frame
- Session management: ~5-10ms per frame

## Limitations

### Phase 4 Scope
- ✅ Multi-object tracking (ByteTrack)
- ✅ Visitor session management
- ✅ Track persistence across frames
- ✅ Session statistics

### Not Implemented (Phase 5+)
- ❌ Zone-based mapping
- ❌ Heatmap generation
- ❌ Conversion analytics
- ❌ Funnel analytics
- ❌ Anomaly detection
- ❌ Re-identification across cameras

## Future Enhancements (Phase 5+)

1. **Zone-Based Mapping** - Map tracks to store zones
2. **Heatmap Generation** - Visualize visitor density
3. **Conversion Analytics** - Track customer journey
4. **Funnel Analytics** - Analyze customer flow
5. **Cross-Camera Tracking** - Track visitors across cameras
6. **Re-identification** - Identify same person across cameras
7. **Anomaly Detection** - Detect unusual behavior patterns

## Testing & Validation

### Unit Tests
- ByteTrack matching algorithm
- IoU computation accuracy
- Session lifecycle management
- Track age and timeout logic

### Integration Tests
- Video processing pipeline
- Detection-to-track conversion
- Session creation and updates
- Database storage and retrieval

### Performance Tests
- Frame processing speed
- Memory usage with concurrent tracks
- Database query performance
- API response times

## Deployment Considerations

### Resource Requirements
- **CPU**: 2+ cores for real-time processing
- **Memory**: 2-4GB for model and tracking state
- **Storage**: MongoDB for visitor/track data
- **Network**: API communication with backend

### Scalability
- Horizontal: Multiple AI service instances
- Vertical: Increase CPU/memory per instance
- Database: MongoDB sharding for large datasets

### Monitoring
- Track creation/deletion rates
- Session duration distribution
- API response times
- Database query performance
- Memory usage trends

---

**END OF TRACKING PIPELINE ARCHITECTURE**
