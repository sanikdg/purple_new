# Business Intelligence Design

**Date**: May 31, 2026  
**Phase**: Phase 6  
**Status**: Implementation Complete

## Overview

The Business Intelligence layer provides comprehensive retail analytics through KPI calculations, aggregation services, and reporting APIs. It transforms visitor tracking data into actionable business metrics.

## Business Metrics

### Footfall Analysis
- **Total Visitors**: Cumulative count of all visitors
- **Unique Visitors**: Count of distinct visitor IDs
- **Visitors Per Hour**: Hourly distribution of visitor arrivals
- **Visitors Per Day**: Daily distribution of visitor arrivals

### Zone Performance
- **Zone Visits**: Total visits to each zone
- **Unique Zone Visitors**: Distinct visitors per zone
- **Average Dwell Time**: Average time spent in each zone
- **Most Visited Zones**: Top performing zones
- **Least Visited Zones**: Underperforming zones

### Customer Journey
- **Average Visit Duration**: Mean total store visit time
- **Average Zones Visited**: Mean number of zones per visit
- **Most Common Paths**: Top visitor journey patterns
- **Store Entry Count**: Total store entries
- **Store Exit Count**: Total store exits

### Operational Metrics
- **Active Visitors**: Currently active visitor sessions
- **Completed Visits**: Finished visitor sessions
- **Average Session Length**: Mean session duration

## KPI Calculation Methods

### Footfall Metrics Calculation

```
Total Visitors = COUNT(DISTINCT visitorId FROM Visitor)
Unique Visitors = COUNT(DISTINCT visitorId FROM Event)
Visitors Per Hour = GROUP BY HOUR(timestamp) COUNT(visitorId)
Visitors Per Day = GROUP BY DATE(timestamp) COUNT(visitorId)
```

### Zone Metrics Calculation

```
Zone Visits = COUNT(*) FROM Event WHERE eventType = 'ZONE_ENTER' GROUP BY zoneId
Unique Zone Visitors = COUNT(DISTINCT visitorId) FROM Event WHERE eventType = 'ZONE_ENTER' GROUP BY zoneId
Average Dwell Time = AVG(metadata.dwellTime) FROM Event WHERE eventType = 'ZONE_EXIT' GROUP BY zoneId
Most Visited = ORDER BY Zone Visits DESC LIMIT 10
Least Visited = ORDER BY Zone Visits ASC LIMIT 10
```

### Journey Metrics Calculation

```
Average Visit Duration = AVG(totalDwellTime) FROM VisitorJourney
Average Zones Visited = AVG(COUNT(visitedZones)) FROM VisitorJourney
Most Common Paths = GROUP BY zoneSequence COUNT(*) ORDER BY count DESC LIMIT 10
Store Entry Count = COUNT(*) FROM Event WHERE eventType = 'VISITOR_SESSION_START'
Store Exit Count = COUNT(*) FROM Event WHERE eventType = 'VISITOR_SESSION_END'
```

### Operational Metrics Calculation

```
Active Visitors = COUNT(*) FROM Visitor WHERE status = 'active'
Completed Visits = COUNT(*) FROM Visitor WHERE status = 'ended'
Average Session Length = AVG(lastSeen - firstSeen) FROM Visitor
```

## Data Aggregation Strategy

### Aggregation Dimensions

1. **By Event Type**
   - ZONE_ENTER events
   - ZONE_EXIT events
   - ZONE_TRANSITION events
   - SESSION_START events
   - SESSION_END events
   - DWELL_TIME_UPDATE events

2. **By Camera**
   - Events per camera
   - Visitors per camera
   - Journeys per camera

3. **By Zone**
   - Visits per zone
   - Unique visitors per zone
   - Dwell time per zone

4. **By Time**
   - Hourly aggregation
   - Daily aggregation
   - Weekly aggregation
   - Monthly aggregation

### Aggregation Pipeline

```
Raw Events
    ↓
[Filter by Dimension]
    ├─ By Event Type
    ├─ By Camera
    ├─ By Zone
    └─ By Time Range
    ↓
[Group and Aggregate]
    ├─ COUNT aggregation
    ├─ AVG aggregation
    ├─ SUM aggregation
    └─ DISTINCT aggregation
    ↓
[Calculate Derived Metrics]
    ├─ Percentages
    ├─ Ratios
    └─ Trends
    ↓
[Store Results]
    ├─ MetricSnapshot
    └─ Cache
```

## API Response Format

### Overview Metrics Response

```json
{
  "success": true,
  "data": {
    "totalVisitors": 150,
    "activeVisitors": 18,
    "averageVisitDuration": 420,
    "mostVisitedZone": "Loreal",
    "completedVisits": 132
  }
}
```

### Footfall Metrics Response

```json
{
  "success": true,
  "data": {
    "totalVisitors": 150,
    "uniqueVisitors": 145,
    "visitorsPerHour": {
      "2026-05-31 09:00": 12,
      "2026-05-31 10:00": 18,
      "2026-05-31 11:00": 25
    },
    "visitorsPerDay": {
      "2026-05-31": 150,
      "2026-05-30": 142
    }
  }
}
```

### Zone Metrics Response

```json
{
  "success": true,
  "data": {
    "zoneVisits": {
      "Loreal": 45,
      "Maybelline": 38,
      "Lakme": 32
    },
    "uniqueZoneVisitors": {
      "Loreal": 42,
      "Maybelline": 35,
      "Lakme": 30
    },
    "averageZoneDwellTime": {
      "Loreal": 125.5,
      "Maybelline": 98.3,
      "Lakme": 87.2
    },
    "mostVisitedZones": [
      { "zone": "Loreal", "visits": 45 },
      { "zone": "Maybelline", "visits": 38 }
    ],
    "leastVisitedZones": [
      { "zone": "EBT", "visits": 5 },
      { "zone": "FSG", "visits": 8 }
    ]
  }
}
```

### Journey Metrics Response

```json
{
  "success": true,
  "data": {
    "averageVisitDuration": 420,
    "averageZonesVisited": 3.5,
    "mostCommonPaths": [
      { "path": "Entrance → Loreal → Maybelline → Counter", "count": 25 },
      { "path": "Entrance → Lakme → Faces → Counter", "count": 18 }
    ],
    "storeEntryCount": 150,
    "storeExitCount": 132
  }
}
```

### Live Metrics Response

```json
{
  "success": true,
  "data": {
    "overview": { ... },
    "footfall": { ... },
    "zones": { ... },
    "journeys": { ... },
    "operational": { ... },
    "timestamp": "2026-05-31T12:00:00Z"
  }
}
```

## Frontend Display

### Metrics Page Layout

1. **Overview Section**
   - Total Visitors (large card)
   - Active Visitors (large card)
   - Average Visit Duration (large card)
   - Most Visited Zone (large card)
   - Completed Visits (large card)

2. **Operational Section**
   - Active Visitors (metric card)
   - Completed Visits (metric card)
   - Average Session Length (metric card)

3. **Zone Performance Section**
   - Most Visited Zones (list)
   - Least Visited Zones (list)
   - Average Dwell Times (grid)

4. **Journey Analysis Section**
   - Journey Metrics (4-column grid)
   - Most Common Paths (list)

## Performance Optimization

### Query Optimization
- Compound indexes on frequently queried fields
- Aggregation pipeline optimization
- Query result caching

### Caching Strategy
- Cache metric snapshots
- Cache aggregation results
- TTL-based cache invalidation

### Batch Processing
- Batch metric calculations
- Scheduled aggregation jobs
- Off-peak processing

## Scalability Considerations

### Horizontal Scaling
- Stateless service design
- Database sharding by camera
- Load balancing for API endpoints

### Vertical Scaling
- Optimize aggregation queries
- Implement query result caching
- Use database indexes effectively

### Data Retention
- Archive old metric snapshots
- Compress historical data
- Implement data lifecycle policies

## Integration Points

### Data Sources
- Event model (raw events)
- VisitorJourney model (journey data)
- Visitor model (visitor data)
- Track model (tracking data)

### Downstream Systems
- Frontend Metrics Page
- Reporting APIs
- Export services (Phase 7+)
- Alert systems (Phase 7+)

## Error Handling

### Common Errors
- Database connection failures
- Aggregation timeouts
- Invalid date ranges
- Missing data

### Error Recovery
- Retry logic with exponential backoff
- Fallback to cached results
- Graceful degradation
- Detailed error messages

## Monitoring and Logging

### Metrics to Monitor
- API response times
- Aggregation duration
- Database query performance
- Cache hit rates

### Logging Strategy
- Structured logging
- Log levels (INFO, WARN, ERROR)
- Request/response logging
- Performance metrics logging

## Security Considerations

### Data Protection
- No sensitive visitor data in metrics
- Aggregated data only
- No PII in responses

### Access Control
- Input validation on all parameters
- Date range validation
- Query parameter sanitization

## Conclusion

The Business Intelligence layer provides comprehensive retail analytics through well-designed KPI calculations and aggregation services. The modular architecture allows for easy extension and integration with future analytics features while maintaining performance and scalability.
