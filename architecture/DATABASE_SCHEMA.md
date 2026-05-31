# Database Schema - Store Intelligence System

## Phase 1: Foundation

In Phase 1, no persistent data models are implemented. The system only includes health monitoring endpoints.

## Planned Collections (Phase 2+)

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: String (admin, manager, viewer),
  status: String (active, inactive),
  createdAt: Date,
  updatedAt: Date
}
```

### Cameras Collection
```javascript
{
  _id: ObjectId,
  name: String,
  location: String,
  ipAddress: String,
  port: Number,
  username: String,
  password: String (encrypted),
  status: String (online, offline, error),
  resolution: String,
  fps: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Streams Collection
```javascript
{
  _id: ObjectId,
  cameraId: ObjectId (ref: Camera),
  status: String (active, inactive, error),
  startTime: Date,
  endTime: Date,
  frameCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Alerts Collection
```javascript
{
  _id: ObjectId,
  type: String,
  severity: String (low, medium, high, critical),
  message: String,
  cameraId: ObjectId (ref: Camera),
  metadata: Object,
  acknowledged: Boolean,
  acknowledgedBy: ObjectId (ref: User),
  acknowledgedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Analytics Collection
```javascript
{
  _id: ObjectId,
  cameraId: ObjectId (ref: Camera),
  date: Date,
  metrics: {
    totalFrames: Number,
    processedFrames: Number,
    detections: Number,
    alerts: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Indexes (Phase 2+)

- Users: email (unique)
- Cameras: status, location
- Streams: cameraId, status, startTime
- Alerts: cameraId, severity, createdAt
- Analytics: cameraId, date

## Data Retention Policy

To be defined in Phase 2.

## Backup Strategy

To be defined in Phase 2.
