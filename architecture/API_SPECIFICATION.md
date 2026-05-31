# API Specification - Store Intelligence System

## Phase 1: Health & Status Endpoints

### Base URL
```
http://localhost:3000/api
```

### Health Endpoints

#### 1. Basic Health Check
```
GET /health
```

**Response (200 OK)**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### 2. Detailed Health Check
```
GET /health/detailed
```

**Response (200 OK)**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "services": {
    "backend": {
      "status": "healthy",
      "timestamp": "2024-01-15T10:30:00.000Z"
    },
    "database": {
      "status": "healthy",
      "timestamp": "2024-01-15T10:30:00.000Z"
    },
    "aiService": {
      "status": "healthy",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

### Error Response Format

```json
{
  "error": {
    "status": 500,
    "message": "Internal Server Error",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### WebSocket Events (Socket.IO)

#### Connection
```javascript
socket.on('connect', () => {
  console.log('Connected to server')
})
```

#### Disconnection
```javascript
socket.on('disconnect', () => {
  console.log('Disconnected from server')
})
```

### Rate Limiting

Not implemented in Phase 1. To be added in Phase 2.

### Authentication

Not implemented in Phase 1. JWT authentication to be added in Phase 2.

### Pagination

Not implemented in Phase 1.

### Filtering & Sorting

Not implemented in Phase 1.

## Future Endpoints (Phase 2+)

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - User logout

### Cameras
- `GET /cameras` - List cameras
- `POST /cameras` - Create camera
- `GET /cameras/:id` - Get camera details
- `PUT /cameras/:id` - Update camera
- `DELETE /cameras/:id` - Delete camera

### Streams
- `GET /streams` - List active streams
- `POST /streams` - Start stream
- `DELETE /streams/:id` - Stop stream

### Alerts
- `GET /alerts` - List alerts
- `POST /alerts` - Create alert
- `GET /alerts/:id` - Get alert details
- `PUT /alerts/:id` - Update alert
- `DELETE /alerts/:id` - Delete alert

### Analytics
- `GET /analytics/summary` - Get analytics summary
- `GET /analytics/trends` - Get trend data
- `GET /analytics/reports` - Generate reports
