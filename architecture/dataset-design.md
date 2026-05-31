# Dataset and Store Layout Design

## Overview

This document describes the dataset layer and store layout architecture for the Store Intelligence System. This layer provides the foundation for future AI-powered video analytics and customer behavior tracking.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  (React + Vite + Tailwind CSS)                          │
│  - Dashboard, Datasets, Cameras, Store Layout Pages     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    API Layer                             │
│  (Express.js Routes)                                    │
│  - Dataset APIs, Camera APIs, Layout APIs               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                          │
│  (Business Logic)                                       │
│  - DatasetService, LayoutService                        │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Model Layer                           │
│  (MongoDB + Mongoose)                                   │
│  - Dataset, Camera, Zone Models                         │
└─────────────────────────────────────────────────────────┘
```

## Data Models

### Dataset Model

Represents a video dataset from a camera.

```typescript
interface IDataset extends Document {
  datasetId: string              // Unique identifier
  cameraId: string               // Associated camera
  fileName: string               // Video file name
  filePath: string               // Full path to file
  status: DatasetStatus          // Current status
  duration: number               // Duration in seconds
  fps: number                    // Frames per second
  resolution: string             // Video resolution
  fileSize: number               // File size in bytes
  createdAt: Date
  updatedAt: Date
}

type DatasetStatus = 'pending' | 'registered' | 'processing' | 'completed' | 'failed'
```

**Indexes:**
- `datasetId` (unique)
- `cameraId` (for camera-based queries)

### Camera Model

Represents a CCTV camera in the store.

```typescript
interface ICamera extends Document {
  cameraId: string               // Unique identifier (CAM1-CAM5)
  cameraName: string             // Descriptive name
  cameraLocation: string         // Physical location
  status: CameraStatus           // Current status
  streamType: StreamType         // Stream protocol
  streamUrl?: string             // Connection URL
  createdAt: Date
  updatedAt: Date
}

type CameraStatus = 'active' | 'inactive' | 'offline'
type StreamType = 'rtsp' | 'http' | 'file' | 'mock'
```

**Indexes:**
- `cameraId` (unique)

### Zone Model

Represents a region in the store layout.

```typescript
interface ICoordinates {
  x1: number                     // Top-left X
  y1: number                     // Top-left Y
  x2: number                     // Bottom-right X
  y2: number                     // Bottom-right Y
}

interface IZone extends Document {
  zoneId: string                 // Unique identifier
  zoneName: string               // Display name
  zoneType: ZoneType             // Category
  coordinates: ICoordinates      // Bounding box
  description: string            // Description
  brandName?: string             // Brand (if applicable)
  createdAt: Date
  updatedAt: Date
}

type ZoneType = 'entrance' | 'counter' | 'fragrance' | 'makeup' | 'brand'
```

**Indexes:**
- `zoneId` (unique)
- `zoneType` (for type-based queries)
- `brandName` (for brand lookups)

## Service Layer

### DatasetService

Manages dataset registration and retrieval.

**Methods:**
- `registerDataset(data)` - Register new dataset
- `getAllDatasets()` - Retrieve all datasets
- `getDatasetById(id)` - Get specific dataset
- `getDatasetsByCamera(cameraId)` - Get datasets for camera
- `getDatasetStats()` - Get statistics
- `updateDatasetStatus(id, status)` - Update status
- `deleteDataset(id)` - Delete dataset
- `validateDatasetStructure(data)` - Validate data

**Statistics Returned:**
```typescript
{
  totalDatasets: number
  totalCameras: number
  totalDuration: number
  averageFps: number
  statusBreakdown: Record<string, number>
}
```

### LayoutService

Manages store layout and zone configuration.

**Methods:**
- `initializeLayout()` - Initialize default zones
- `getAllZones()` - Get all zones
- `getZonesByType(type)` - Get zones by type
- `getZoneById(id)` - Get specific zone
- `getZoneByBrand(brand)` - Get zone by brand
- `getBrandZones()` - Get all brand zones
- `getLayoutSummary()` - Get layout summary
- `validateCoordinates(coords)` - Validate coordinates

**Layout Summary:**
```typescript
{
  totalZones: number
  zonesByType: Record<string, number>
  brands: string[]
}
```

## API Endpoints

### Dataset Endpoints

```
GET /api/datasets
  Response: { success: boolean, data: IDataset[], count: number }

GET /api/datasets/:id
  Response: { success: boolean, data: IDataset }

GET /api/datasets/stats/summary
  Response: { success: boolean, data: DatasetStats }
```

### Camera Endpoints

```
GET /api/cameras
  Response: { success: boolean, data: ICamera[], count: number }

GET /api/cameras/:id
  Response: { success: boolean, data: ICamera }
```

### Store Layout Endpoints

```
GET /api/store-layout
  Response: { success: boolean, data: LayoutSummary }

GET /api/store-layout/zones/all
  Response: { success: boolean, data: IZone[], count: number }

GET /api/store-layout/zones/:id
  Response: { success: boolean, data: IZone }

GET /api/store-layout/type/:type
  Response: { success: boolean, data: IZone[], count: number }

GET /api/store-layout/brand/:brandName
  Response: { success: boolean, data: IZone }

GET /api/store-layout/brands/all
  Response: { success: boolean, data: IZone[], count: number }
```

## Frontend Pages

### Dashboard Page
- System status overview
- Quick statistics
- System information

### Dataset Page
- Dataset statistics (total, cameras, duration, FPS)
- Status breakdown
- Dataset table with filtering
- Dataset details

### Camera Page
- Camera registry
- Camera status (active, inactive, offline)
- Camera details and stream information
- Location mapping

### Store Layout Page
- Layout summary (total zones, brands)
- Zone type breakdown
- Zone filtering by type
- Zone details with coordinates
- Brand listing

## Data Flow

### Dataset Registration Flow

```
1. Video file uploaded/registered
   ↓
2. Dataset model created with metadata
   ↓
3. Dataset stored in MongoDB
   ↓
4. Status set to 'registered'
   ↓
5. Available for processing
```

### Store Layout Initialization

```
1. Server starts
   ↓
2. LayoutService.initializeLayout() called
   ↓
3. Check if zones already exist
   ↓
4. If not, insert 20 default zones
   ↓
5. Layout ready for queries
```

### Query Flow

```
Frontend Request
   ↓
Express Route Handler
   ↓
Service Method
   ↓
MongoDB Query
   ↓
Response Formatting
   ↓
JSON Response to Frontend
```

## Database Schema

### Collections

1. **datasets**
   - Stores video dataset metadata
   - Indexed on: datasetId, cameraId
   - Typical size: 1000s of documents

2. **cameras**
   - Stores camera registry
   - Indexed on: cameraId
   - Typical size: 5-20 documents

3. **zones**
   - Stores store layout zones
   - Indexed on: zoneId, zoneType, brandName
   - Typical size: 20-30 documents

## Scalability Considerations

### Current Design
- Supports 5 cameras
- Supports 20+ zones
- Supports 1000s of datasets
- Single MongoDB instance

### Future Enhancements
- Sharding by cameraId for large deployments
- Caching layer for frequently accessed zones
- Batch dataset processing
- Dataset archival and cleanup policies
- Multi-region support

## Integration Points

### With AI Service (Future)
- AI service will consume dataset metadata
- Process videos frame-by-frame
- Generate detection results
- Store results in separate collections

### With Analytics Layer (Future)
- Correlate detections with zones
- Track customer movement patterns
- Generate heatmaps
- Calculate dwell times

### With POS System (Future)
- Correlate video events with transactions
- Track product interactions
- Measure conversion rates
- Analyze customer journey

## Error Handling

### Dataset Validation
- Required fields: datasetId, cameraId, fileName, filePath
- FPS range: 1-120
- Duration must be positive
- File path must be valid

### Zone Validation
- Coordinates must be numeric
- x1 < x2, y1 < y2
- Coordinates within video bounds (0-1920, 0-1080)

### API Error Responses
```typescript
{
  success: false,
  error: "Error message"
}
```

## Security Considerations

- Input validation on all endpoints
- No sensitive data in responses
- CORS configured for frontend
- Error messages don't expose system details
- MongoDB connection secured via environment variables

## Monitoring and Logging

- Server logs dataset registration
- Layout initialization logged on startup
- API errors logged with context
- Database connection status monitored

## Future Roadmap

### Phase 2 (Current)
- ✅ Dataset layer
- ✅ Store layout layer
- ✅ Camera registry
- ✅ API endpoints
- ✅ Frontend pages

### Phase 3 (Future)
- AI model integration
- Video processing pipeline
- Detection results storage
- Analytics calculations

### Phase 4 (Future)
- Real-time streaming
- Advanced analytics
- Heatmap generation
- Customer behavior insights
