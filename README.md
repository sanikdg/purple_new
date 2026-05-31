# Store Intelligence System

AI-Powered Retail CCTV Analytics Platform

## Overview

Store Intelligence System is a production-grade platform for retail CCTV analytics powered by AI. This is **Phase 1** - the foundation and architecture layer with health monitoring endpoints.

### Key Features (Phase 1)
- ✓ Production-grade architecture
- ✓ Full project skeleton
- ✓ Health monitoring endpoints
- ✓ Docker containerization
- ✓ Comprehensive documentation
- ✓ Real-time WebSocket support (Socket.IO)

### Planned Features (Phase 2+)
- Authentication & Authorization
- Camera management
- Stream ingestion
- Real-time alerts
- AI-powered analytics
- Advanced reporting

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

## API Endpoints (Phase 1)

### Health Checks
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed service health

### Response Format
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
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

### Phase 2 (Planned)
- Authentication & Authorization
- User management
- JWT implementation

### Phase 3 (Planned)
- Camera management
- Stream ingestion
- Alert system

### Phase 4 (Planned)
- AI model integration
- Analytics processing
- Tracking implementation

### Phase 5 (Planned)
- Advanced dashboards
- Reporting system
- Performance optimization

## Status

**Phase 1: COMPLETE** ✓

All foundation components are implemented and verified. See [VERIFICATION_REPORT.md](./VERIFICATION_REPORT.md) for detailed build verification.

### Build Status
- ✓ Frontend: Builds successfully (Vite)
- ✓ Backend: Compiles without errors (TypeScript)
- ✓ AI Service: Validates without errors (Python)
- ✓ Docker: All Dockerfiles valid
- ✓ Documentation: Complete

---

**Last Updated**: May 31, 2026
**Version**: 1.0.0
**Status**: Production-Ready (Phase 1)
**Verification**: All builds passing
