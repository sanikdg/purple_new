# Metrics Engine Architecture

**Date**: May 31, 2026  
**Phase**: Phase 6  
**Status**: Implementation Complete

## Overview

The Metrics Engine transforms raw visitor events into actionable retail intelligence metrics. It provides comprehensive KPI calculations, aggregation services, and reporting APIs for store performance analysis.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  (React + Vite + Tailwind CSS)                          │
│  - Metrics Page (KPI Dashboard)                          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    API Layer                             │
│  (Express.js Routes)                                    │
│  - Metrics APIs (8 endpoints)                            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                          │
│  (Business Logic)                                       │
│  - MetricsService (KPI Calculation)                      │
│  - AggregationService (Data Aggregation)                 │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Model Layer                           │
│  (MongoDB + Mongoose)                                   │
│  - MetricSnapshot (Metric Storage)                       │
│  - Event (Event Data)                                    │
│  - VisitorJourney (Journey Data)                         │
│  - Visitor (Visitor Data)                               │
└─────────────────────────────────────────────────────────┘
```

## Core Components

### 1. MetricsService

Calculates KPIs from raw event and journey data.

**Responsibilities:**
- Calculate footfall metrics
- Calculate zone metrics
- Calculate journey metrics
- Calculate operational metrics
- Store metric snapshots
- Retrieve metric history

**Key Methods:**
- `getOverviewMetrics()` - Overview KPIs
- `getFootfallMetrics()` - Visitor counts and trends
- `getZoneMetrics()` - Zone performance
- `getJourneyMetrics()` - Journey analysis
- `getOperationalMetrics()` - Operational KPIs
- `storeMetricSnapshot()` - Store metrics
- `getMetricHistory()` - Retrieve historical metrics

### 2. AggregationService

Aggregates data across multiple dimensions.

**Responsibilities:**
- Aggregate events by type, camera, zone
- Aggregate visitor statistics
- Aggregate journey statistics
- Aggregate zone performance
- Generate comprehensive reports
- Time-based aggregation

**Key Methods:**
- `aggregateEventsByType()` - Event type breakdown
- `aggregateEventsByCamera()` - Camera breakdown
- `aggregateEventsByZone()` - Zone breakdown
- `aggregateVisitorStats()` - Visitor statistics
- `aggregateJourneyStats()` - Journey statistics
- `aggregateZonePerformance()` - Zone performance
- `aggregateTimeBasedMetrics()` - Time-range metrics
- `generateComprehensiveReport()` - Full report

### 3. MetricSnapshot Model

Stores metric snapshots for historical analysis.

**Fields:**
- metricType - Type of metric (footfall, zone, journey, operational, summary)
- value - Metric value (number or object)
- timestamp - Snapshot timestamp
- metadata - Additional metadata
- createdAt - Creation timestamp
- updatedAt - Update timestamp

## Metrics Implemented

### Footfall Metrics
- Total Visitors - Total unique visitors
- Unique Visitors - Count of unique visitor IDs
- Visitors Per Hour - Hourly visitor distribution
- Visitors Per Day - Daily visitor distribution

### Zone Metrics
- Zone Visits - Total visits per zone
- Unique Zone Visitors - Unique visitors per zone
- Average Zone Dwell Time - Average time spent in zone
- Most Visited Zones - Top 10 zones by visits
- Least Visited Zones - Bottom 10 zones by visits

### Journey Metrics
- Average Visit Duration - Average total dwell time
- Average Zones Visited - Average zones per journey
- Most Common Paths - Top 10 visitor paths
- Store Entry Count - Total store entries
- Store Exit Count - Total store exits

### Operational Metrics
- Active Visitors - Currently active visitors
- Completed Visits - Finished visitor sessions
- Average Session Length - Average session duration

## API Endpoints

### Metrics Endpoints (8 total)

1. **GET /api/metrics/overview**
   - Returns: Overview metrics (5 KPIs)
   - Response: totalVisitors, activeVisitors, averageVisitDuration, mostVisitedZone, completedVisits

2. **GET /api/metrics/footfall**
   - Returns: Footfall metrics
   - Response: totalVisitors, uniqueVisitors, visitorsPerHour, visitorsPerDay

3. **GET /api/metrics/zones**
   - Returns: Zone metrics
   - Response: zoneVisits, uniqueZoneVisitors, averageZoneDwellTime, mostVisitedZones, leastVisitedZones

4. **GET /api/metrics/journeys**
   - Returns: Journey metrics
   - Response: averageVisitDuration, averageZonesVisited, mostCommonPaths, storeEntryCount, storeExitCount

5. **GET /api/metrics/operational**
   - Returns: Operational metrics
   - Response: activeVisitors, completedVisits, averageSessionLength

6. **GET /api/metrics/live**
   - Returns: All metrics combined
   - Response: overview, footfall, zones, journeys, operational, timestamp

7. **GET /api/metrics/report**
   - Returns: Comprehensive report
   - Response: timestamp, visitors, events, journeys, zones

8. **GET /api/metrics/aggregation/events**
   - Returns: Aggregated events
   - Response: byType, byCamera, byZone

9. **GET /api/metrics/aggregation/zones**
   - Returns: Zone performance
   - Response: Array of zones with visits, uniqueVisitors, averageDwellTime

10. **GET /api/metrics/aggregation/time-range**
    - Returns: Time-based metrics
    - Query: startDate, endDate
    - Response: eventCount, visitorCount, journeyCount, averageDwellTime

## Data Flow

```
Raw Events (Event Model)
    ↓
[MetricsService]
    ├─ Calculate Footfall Metrics
    ├─ Calculate Zone Metrics
    ├─ Calculate Journey Metrics
    └─ Calculate Operational Metrics
    ↓
[AggregationService]
    ├─ Aggregate by Type
    ├─ Aggregate by Camera
    ├─ Aggregate by Zone
    └─ Generate Reports
    ↓
[MetricSnapshot Model]
    ├─ Store Snapshots
    └─ Historical Analysis
    ↓
[API Endpoints]
    ├─ Serve Metrics
    └─ Provide Reports
    ↓
[Frontend]
    ├─ Display KPIs
    └─ Visualize Metrics
```

## Performance Characteristics

### Time Complexity
- Overview metrics: O(n) where n=events
- Footfall metrics: O(n) aggregation
- Zone metrics: O(n) aggregation
- Journey metrics: O(m) where m=journeys
- Operational metrics: O(v) where v=visitors

### Space Complexity
- Metrics storage: O(m) where m=metric snapshots
- Aggregation results: O(z) where z=zones

### Typical Performance
- Overview metrics: ~100-500ms
- Footfall metrics: ~200-800ms
- Zone metrics: ~150-600ms
- Journey metrics: ~100-400ms
- Operational metrics: ~50-200ms

## Database Indexes

**MetricSnapshot Indexes:**
- metricType (single)
- timestamp (single)
- metricType + timestamp (compound)

**Event Indexes (used for aggregation):**
- eventType
- cameraId
- zoneId
- timestamp

**VisitorJourney Indexes (used for aggregation):**
- visitorId
- cameraId
- entryTime

## Limitations

### Phase 6 Scope (By Design)
1. **No Heatmaps** - No spatial visualization
2. **No Dashboard Visualization** - No charts or graphs
3. **No Advanced Charts** - No complex visualizations
4. **No Anomaly Detection** - No behavioral analysis
5. **No Predictive Analytics** - No forecasting

### Current Capabilities
- ✅ KPI calculation
- ✅ Data aggregation
- ✅ Metric storage
- ✅ Historical analysis
- ✅ Comprehensive reporting
- ✅ Time-based analysis

## Future Enhancements (Phase 7+)

1. **Heatmap Generation** - Spatial visitor density
2. **Advanced Visualizations** - Charts and graphs
3. **Anomaly Detection** - Unusual pattern detection
4. **Predictive Analytics** - Visitor forecasting
5. **Real-time Alerts** - Alert on KPI thresholds
6. **Custom Reports** - User-defined metrics
7. **Export Functionality** - CSV/PDF export
8. **Scheduled Reports** - Automated reporting

## Configuration

### Environment Variables
- METRICS_SNAPSHOT_RETENTION - Days to retain snapshots (default: 90)
- METRICS_AGGREGATION_INTERVAL - Aggregation interval in minutes (default: 60)

### Database Configuration
- Indexes automatically created on model initialization
- Compound indexes for performance optimization

## Monitoring

### Health Checks
- Metrics service availability
- Database connectivity
- Aggregation service status

### Logging
- Metric calculation logs
- Aggregation operation logs
- Error and exception logs

## Security

### Data Protection
- No sensitive visitor data in metrics
- Aggregated data only
- No PII in metric snapshots

### Access Control
- All endpoints require valid request
- Error handling for invalid queries
- Input validation on date ranges

## Conclusion

The Metrics Engine provides a comprehensive solution for retail intelligence. It transforms raw visitor tracking data into actionable KPIs and business metrics. The modular design allows for easy extension and integration with future analytics features.
