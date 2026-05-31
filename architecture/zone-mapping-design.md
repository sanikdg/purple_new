# Zone Mapping & Event Generation Architecture

**Date**: May 31, 2026  
**Phase**: Phase 5  
**Status**: Implementation Complete

## Overview

The Zone Mapping & Event Generation layer maps tracked visitors to store zones and generates business events for visitor journey analysis. This layer converts raw tracking data into actionable business intelligence.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  (React + Vite + Tailwind CSS)                          │
│  - Events Page (Live Event Feed)                         │
│  - Journeys Page (Visitor Paths)                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    API Layer                             │
│  (Express.js Routes)                                    │
│  - Event APIs                                            │
│  - Journey APIs                                          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                          │
│  (Business Logic)                                       │
│  - EventService (Event Storage & Retrieval)             │
│  - JourneyService (Journey Management)                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Model Layer                           │
│  (MongoDB + Mongoose)                                   │
│  - Event Model (Business Events)                        │
│  - VisitorJourney Model (Visitor Paths)                 │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  AI Service Layer                        │
│  (Python + FastAPI)                                     │
│  - Polygon Engine (Point-in-Polygon Detection)          │
│  - Zone Mapper (Zone Assignment)                        │
│  - Event Generator (Event Creation)                     │
│  - Dwell Time Engine (Duration Calculation)             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Tracking Layer                          │
│  (Phase 4 - ByteTrack Visitor Tracking)                 │
│  - Visitor Positions                                    │
└─────────────────────────────────────────────────────────┘
```

## Zone Mapping Flow

```
Visitor Track (x, y)
    ↓
[Polygon Engine]
    ├─ Point-in-Polygon Detection
    ├─ Bounding Box Center Calculation
    └─ Zone Lookup
    ↓
[Zone Mapper]
    ├─ Current Zone Assignment
    ├─ Zone Transition Detection
    └─ Dwell Time Tracking
    ↓
[Event Generator]
    ├─ ZONE_ENTER Event
    ├─ ZONE_EXIT Event
    ├─ ZONE_TRANSITION Event
    └─ Session Events
    ↓
Event Output
```

## Core Components

### 1. Polygon Engine (polygon_engine.py)

Implements point-in-polygon detection using ray casting algorithm.

**Responsibilities:**
- Store zone polygons with vertices
- Detect if point is inside polygon
- Compute bounding boxes for optimization
- Calculate polygon centroids

**Key Methods:**
- `add_zone()` - Add zone polygon
- `get_zone_at_point()` - Get zone containing point
- `get_zone_at_bbox()` - Get zone containing bbox center
- `get_all_zones()` - Get all zones

### 2. Zone Mapper (zone_mapper.py)

Maps visitors to zones and tracks zone transitions.

**Responsibilities:**
- Assign visitors to zones
- Detect zone transitions
- Track zone visit history
- Calculate dwell times per zone

**Key Methods:**
- `update_visitor_zone()` - Update visitor's current zone
- `get_visitor_zone()` - Get current zone
- `get_visitor_zone_history()` - Get zone visit history
- `get_visitor_dwell_times()` - Get dwell time per zone
- `end_visitor_session()` - Finalize zone assignments

### 3. Event Generator (event_generator.py)

Generates business events from zone transitions.

**Responsibilities:**
- Create zone enter/exit events
- Create zone transition events
- Create session start/end events
- Store events in memory

**Event Types:**
- `ZONE_ENTER` - Visitor entered zone
- `ZONE_EXIT` - Visitor exited zone
- `ZONE_TRANSITION` - Visitor moved between zones
- `VISITOR_SESSION_START` - Session started
- `VISITOR_SESSION_END` - Session ended
- `DWELL_TIME_UPDATE` - Dwell time updated

### 4. Dwell Time Engine (dwell_time_engine.py)

Calculates and tracks dwell times.

**Responsibilities:**
- Record zone entry/exit times
- Calculate dwell duration
- Aggregate dwell times per zone
- Generate dwell statistics

**Key Methods:**
- `record_zone_entry()` - Record entry
- `record_zone_exit()` - Record exit and calculate dwell
- `get_visitor_dwell_times()` - Get per-zone dwell times
- `get_zone_dwell_times()` - Get zone statistics

## Store Zones

### Primary Zones
1. **Entrance** - Store entrance area
2. **Cash Counter** - Checkout area
3. **Fragrance Unit** - Fragrance section
4. **Makeup Unit** - Makeup section

### Brand Zones (15 total)
1. **EBT** - EBT brand
2. **FSG** - FSG brand
3. **VD** - VD brand
4. **Derm** - Dermatology brand
5. **Minimalist** - Minimalist brand
6. **Aqualogica** - Aqualogica brand
7. **Pilgrim** - Pilgrim brand
8. **D&K** - D&K brand
9. **Maybelline** - Maybelline brand
10. **Faces** - Faces brand
11. **Lakme** - Lakme brand
12. **Swiss** - Swiss brand
13. **Mars** - Mars brand
14. **Good Loreal** - Good Loreal brand
15. **Beauty** - Beauty brand

## Event Output Format

### Zone Enter Event
```json
{
  "eventId": "E00000001",
  "visitorId": "V000001",
  "trackId": "T000001",
  "cameraId": "CAM1",
  "zoneId": "Loreal",
  "eventType": "ZONE_ENTER",
  "timestamp": "2026-06-01T12:00:00Z",
  "metadata": {}
}
```

### Zone Exit Event
```json
{
  "eventId": "E00000002",
  "visitorId": "V000001",
  "trackId": "T000001",
  "cameraId": "CAM1",
  "zoneId": "Loreal",
  "eventType": "ZONE_EXIT",
  "timestamp": "2026-06-01T12:00:30Z",
  "metadata": {
    "dwellTime": 30.5
  }
}
```

### Zone Transition Event
```json
{
  "eventId": "E00000003",
  "visitorId": "V000001",
  "trackId": "T000001",
  "cameraId": "CAM1",
  "zoneId": "Maybelline",
  "eventType": "ZONE_TRANSITION",
  "timestamp": "2026-06-01T12:00:31Z",
  "metadata": {
    "fromZone": "Loreal",
    "toZone": "Maybelline"
  }
}
```

## Database Schema

### Event Model
```typescript
{
  eventId: string (unique, indexed)
  visitorId: string (indexed)
  trackId: string (indexed)
  cameraId: string (indexed)
  zoneId: string (indexed)
  eventType: enum (indexed)
  timestamp: Date (indexed)
  metadata: object
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### VisitorJourney Model
```typescript
{
  visitorId: string (indexed)
  cameraId: string (indexed)
  visitedZones: string[]
  totalDwellTime: number
  entryTime: Date (indexed)
  exitTime: Date (indexed)
  zoneSequence: Array<{
    zoneId: string
    entryTime: Date
    exitTime: Date
    dwellTime: number
  }>
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## API Endpoints

### Events API (5 endpoints)
- `GET /api/events` - Get all events
- `GET /api/events/live` - Get recent events
- `GET /api/events/:visitorId` - Get visitor events
- `GET /api/events/camera/:cameraId` - Get camera events
- `GET /api/events/zone/:zoneId` - Get zone events
- `GET /api/events/stats` - Get event statistics

### Journeys API (6 endpoints)
- `GET /api/journeys` - Get all journeys
- `GET /api/journeys/:visitorId` - Get visitor journey
- `GET /api/journeys/camera/:cameraId` - Get camera journeys
- `GET /api/journeys/stats` - Get journey statistics
- `GET /api/journeys/zones/frequency` - Get zone visit frequency
- `GET /api/journeys/paths/common` - Get common paths

## Point-in-Polygon Algorithm

Uses ray casting algorithm for efficient detection:

1. Cast ray from point to infinity
2. Count intersections with polygon edges
3. If odd number of intersections, point is inside
4. If even number, point is outside

**Optimization:**
- Bounding box check first (O(1))
- Only check edges within bounding box
- Handles edge cases (point on edge, zero area)

## Dwell Time Calculation

**Per Zone:**
- Track entry time when visitor enters zone
- Track exit time when visitor leaves zone
- Calculate: dwell_time = exit_time - entry_time

**Per Visitor:**
- Sum dwell times across all zones
- Calculate average dwell time per zone
- Track zone visit sequence

**Statistics:**
- Total dwell time across all visitors
- Average dwell time per zone
- Min/max dwell times
- Zone visit frequency

## Limitations

### Phase 5 Scope (By Design)
- ✅ Zone mapping
- ✅ Event generation
- ✅ Dwell time calculation
- ✅ Visitor journeys

### Not Implemented (Phase 6+)
- ❌ Heatmap generation
- ❌ Conversion analytics
- ❌ Revenue analytics
- ❌ Sales correlation
- ❌ Anomaly detection
- ❌ Business KPI calculations

## Future Enhancements (Phase 6+)

1. **Heatmap Generation** - Visualize visitor density
2. **Conversion Analytics** - Track customer journey to purchase
3. **Revenue Analytics** - Correlate visits with sales
4. **Anomaly Detection** - Detect unusual patterns
5. **Real-time Alerts** - Alert on specific events
6. **Advanced Analytics** - Customer behavior insights

---

**END OF ZONE MAPPING ARCHITECTURE**
