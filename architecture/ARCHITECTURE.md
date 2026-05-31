# Store Intelligence System - Architecture

## Phase 1: Foundation & Architecture

### Overview
This document describes the production-grade architecture for the AI-Powered Store Intelligence System for retail CCTV analytics.

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                 │
│                    Port: 5173 (Development)                 │
│                                                              │
│  - Dashboard                                                │
│  - System Health Monitoring                                 │
│  - Real-time Updates (Socket.IO)                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP/WebSocket
                         │
┌────────────────────────▼────────────────────────────────────┐
│                Backend (Node.js + Express)                  │
│                    Port: 3000                               │
│                                                              │
│  - REST API                                                 │
│  - WebSocket Server (Socket.IO)                             │
│  - Authentication (JWT)                                     │
│  - Health Endpoints                                         │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        │                │                │
        ▼                ▼                ▼
    MongoDB         AI Service        External APIs
    Port: 27017     Port: 8000
    (Database)      (Python/FastAPI)
```

### Technology Stack

#### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router 6.20
- **HTTP Client**: Axios 1.6
- **Real-time**: Socket.IO Client 4.7
- **Charts**: Recharts 2.10

#### Backend
- **Runtime**: Node.js 20
- **Framework**: Express.js 4.18
- **Database**: MongoDB 7.0 + Mongoose 8.0
- **Authentication**: JWT (jsonwebtoken 9.1)
- **Validation**: Joi 17.11
- **Real-time**: Socket.IO 4.7
- **Security**: Helmet 7.1, CORS

#### AI Service
- **Language**: Python 3.11
- **Framework**: FastAPI 0.104
- **Server**: Uvicorn 0.24
- **Validation**: Pydantic 2.5

#### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Database**: MongoDB 7.0

### Directory Structure

```
store-intelligence/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Page components
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── Dockerfile
│   └── .env.example
│
├── backend/                     # Express.js application
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/             # API routes
│   │   ├── models/             # Mongoose models
│   │   └── index.ts            # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
│
├── ai-service/                  # FastAPI application
│   ├── main.py                 # Entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── architecture/               # Architecture documentation
│   ├── ARCHITECTURE.md
│   ├── API_SPECIFICATION.md
│   └── DATABASE_SCHEMA.md
│
├── docs/                       # General documentation
│   ├── SETUP.md
│   ├── DEPLOYMENT.md
│   └── TROUBLESHOOTING.md
│
├── sample-data/                # Sample data for testing
│   └── seed.json
│
├── scripts/                    # Utility scripts
│   ├── setup.sh
│   └── seed-db.sh
│
├── docker-compose.yml          # Docker Compose configuration
├── .gitignore
├── README.md
└── DEVELOPMENT_PROGRESS.md
```

### API Endpoints (Phase 1)

#### Health Endpoints
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed service health

### Database Schema (Phase 1)

Currently, only health monitoring is implemented. Database models will be added in Phase 2.

### Security Considerations

1. **Authentication**: JWT-based authentication (to be implemented in Phase 2)
2. **CORS**: Configured for frontend origin
3. **Helmet**: Security headers enabled
4. **Environment Variables**: Sensitive data in .env files
5. **Input Validation**: Joi validation (to be implemented in Phase 2)

### Deployment Architecture

#### Development
- Local development with hot reload
- Docker Compose for local services
- MongoDB running in container

#### Production
- Containerized services
- Docker Compose orchestration
- Environment-specific configurations
- Health checks for all services

### Scalability Considerations

1. **Horizontal Scaling**: Services can be scaled independently
2. **Load Balancing**: Can be added via reverse proxy (nginx)
3. **Database**: MongoDB replica sets for high availability
4. **Caching**: Redis can be added for session/data caching
5. **Message Queue**: RabbitMQ/Kafka for async processing

### Monitoring & Logging

1. **Health Endpoints**: Real-time service status
2. **Morgan**: HTTP request logging
3. **Console Logging**: Application events
4. **Error Handling**: Centralized error middleware

### Next Phases

**Phase 2**: Authentication & Authorization
- User management
- JWT implementation
- Role-based access control

**Phase 3**: Core Features
- Camera management
- Stream ingestion
- Real-time alerts

**Phase 4**: AI Integration
- Model deployment
- Analytics processing
- Tracking implementation

**Phase 5**: Advanced Features
- Dashboard analytics
- Reporting
- System optimization
