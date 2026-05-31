# Store Intelligence System

AI-Powered Retail CCTV Analytics Platform

## Overview

Store Intelligence System is a production-grade platform for retail CCTV analytics powered by AI. This is **Phase 2** - the dataset and store layout integration layer.

### Key Features (Phase 1) ✓
- ✓ Production-grade architecture
- ✓ Full project skeleton
- ✓ Health monitoring endpoints
- ✓ Docker containerization
- ✓ Comprehensive documentation
- ✓ Real-time WebSocket support (Socket.IO)

### Key Features (Phase 2) ✓
- ✓ Dataset registry and management
- ✓ Camera registry
- ✓ Store layout with 20+ zones
- ✓ Dataset APIs (GET endpoints)
- ✓ Camera APIs (GET endpoints)
- ✓ Store layout APIs (GET endpoints)
- ✓ Frontend pages (Datasets, Cameras, Store Layout)
- ✓ Mock data support

### Planned Features (Phase 3+)
- AI model integration
- Video processing pipeline
- Detection results storage
- Analytics calculations
- Real-time alerts

## Tech Stack

### Frontend
- React 18.2
- Vite 5.0
- Tailwind CSS 3.4
- React Router 6.20
- Axios 1.6
- Socket.IO Client 4.7
- Recharts 2.10

### Backend
- Node.js 20
- Express.js 4.18
- MongoDB 7.0
- Mongoose 8.0
- JWT (jsonwebtoken 9.1)
- Joi 17.11
- Socket.IO 4.7
- Helmet 7.1

### AI Service
- Python 3.11
- FastAPI 0.104
- Uvicorn 0.24
- Pydantic 2.5

### DevOps
- Docker
- Docker Compose

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- Git

### Installation

1. **Clone Repository**
```bash
git clone <repository-url>
cd store-intelligence
```

2. **Setup Environment**
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env

# AI Service
cp ai-service/.env.example ai-service/.env
```

3. **Start Services**
```bash
docker-compose up -d
```

4. **Verify Installation**
```bash
# Check health
curl http://localhost:3000/api/health

# Access frontend
open http://localhost:5173
```

## Project Structure

```
store-intelligence/
├── frontend/                 # React application
├── backend/                  # Express.js API
├── ai-service/              # FastAPI service
├── architecture/            # Architecture documentation
├── docs/                    # Setup & deployment guides
├── sample-data/             # Sample data (Phase 2+)
├── scripts/                 # Utility scripts
├── docker-compose.yml       # Docker Compose config
├── README.md               # This file
└── DEVELOPMENT_PROGRESS.md # Development status
```

## Documentation

- **[ARCHITECTURE.md](./architecture/ARCHITECTURE.md)** - System design and components
- **[API_SPECIFICATION.md](./architecture/API_SPECIFICATION.md)** - API endpoints
- **[DATABASE_SCHEMA.md](./architecture/DATABASE_SCHEMA.md)** - Database structure
- **[SETUP.md](./docs/SETUP.md)** - Local development setup
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Production deployment
- **[TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Common issues
- **[DEVELOPMENT_PROGRESS.md](./DEVELOPMENT_PROGRESS.md)** - Development status

## API Endpoints

### Health Checks (Phase 1)
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed service health

### Dataset APIs (Phase 2)
- `GET /api/datasets` - Get all datasets
- `GET /api/datasets/:id` - Get specific dataset
- `GET /api/datasets/stats/summary` - Get dataset statistics

### Camera APIs (Phase 2)
- `GET /api/cameras` - Get all cameras
- `GET /api/cameras/:id` - Get specific camera

### Store Layout APIs (Phase 2)
- `GET /api/store-layout` - Get layout summary
- `GET /api/store-layout/zones/all` - Get all zones
- `GET /api/store-layout/zones/:id` - Get specific zone
- `GET /api/store-layout/type/:type` - Get zones by type
- `GET /api/store-layout/brand/:brandName` - Get zone by brand
- `GET /api/store-layout/brands/all` - Get all brand zones

### Response Format
```json
{
  "success": true,
  "data": {},
  "count": 0
}
```

## Services

### Frontend
- **URL**: http://localhost:5173
- **Port**: 5173
- **Status**: Development ready

### Backend
- **URL**: http://localhost:3000
- **Port**: 3000
- **Status**: Development ready

### AI Service
- **URL**: http://localhost:8000
- **Port**: 8000
- **Status**: Development ready

### MongoDB
- **URL**: mongodb://localhost:27017
- **Port**: 27017
- **Status**: Development ready

## Development

### Local Development Setup

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev

# AI Service (new terminal)
cd ai-service
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

### Build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build

# AI Service
# No build required, runs directly
```

### Type Checking

```bash
# Frontend
cd frontend
npm run type-check

# Backend
cd backend
npm run type-check
```

### Linting

```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run lint
```

## Docker

### Build Images
```bash
docker-compose build
```

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

### Check Service Status
```bash
docker-compose ps
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/store-intelligence
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

### AI Service (.env)
```
PORT=8000
BACKEND_URL=http://localhost:3000
ENVIRONMENT=development
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check connection string in .env
- Verify credentials

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

See [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) for more solutions.

## Deployment

For production deployment, see [DEPLOYMENT.md](./docs/DEPLOYMENT.md).

### Quick Deploy
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Ensure all tests pass
4. Submit a pull request

## License

Proprietary - All rights reserved

## Support

For issues and questions:
1. Check [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
2. Review [SETUP.md](./docs/SETUP.md)
3. Check [ARCHITECTURE.md](./architecture/ARCHITECTURE.md)

## Roadmap

### Phase 1 ✓ COMPLETE
- Foundation & Architecture
- Health monitoring
- Docker containerization

### Phase 2 ✓ COMPLETE
- Dataset registry and management
- Camera registry
- Store layout with 20+ zones
- Dataset, Camera, and Layout APIs
- Frontend pages for data visualization
- Mock data support

### Phase 3 (Planned)
- AI model integration (YOLO)
- Video processing pipeline
- Detection results storage
- Analytics calculations

### Phase 4 (Planned)
- Real-time streaming
- Advanced dashboards
- Reporting system
- Performance optimization

### Phase 5 (Planned)
- Authentication & Authorization
- User management
- Advanced analytics

## Status

**Phase 2: COMPLETE** ✓

Dataset and store layout integration is fully implemented. All APIs are functional with mock data support.

### Build Status
- ✓ Frontend: Builds successfully (Vite)
- ✓ Backend: Compiles without errors (TypeScript)
- ✓ AI Service: Validates without errors (Python)
- ✓ Docker: All Dockerfiles valid
- ✓ Documentation: Complete

### Phase 2 Deliverables
- ✓ Dataset Model & Service
- ✓ Camera Model & Service
- ✓ Zone Model & Service
- ✓ Dataset APIs (6 endpoints)
- ✓ Camera APIs (2 endpoints)
- ✓ Store Layout APIs (6 endpoints)
- ✓ Frontend Pages (3 pages)
- ✓ Architecture Documentation
- ✓ Dataset Structure Documentation

---

**Last Updated**: May 31, 2026
**Version**: 2.0.0
**Status**: Production-Ready (Phase 2)
**Verification**: All builds passing
