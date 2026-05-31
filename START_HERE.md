# START HERE - Store Intelligence System

Welcome to the AI-Powered Store Intelligence System for retail CCTV analytics.

This is **Phase 1** - a production-grade foundation and architecture with health monitoring endpoints.

---

## Quick Navigation

### 📋 First Time? Start Here
1. **[README.md](./README.md)** - Project overview and quick start
2. **[PHASE_1_SUMMARY.md](./PHASE_1_SUMMARY.md)** - What was built
3. **[docs/SETUP.md](./docs/SETUP.md)** - Local development setup

### 🏗️ Understanding the System
1. **[architecture/ARCHITECTURE.md](./architecture/ARCHITECTURE.md)** - System design
2. **[architecture/API_SPECIFICATION.md](./architecture/API_SPECIFICATION.md)** - API endpoints
3. **[architecture/DATABASE_SCHEMA.md](./architecture/DATABASE_SCHEMA.md)** - Database structure

### 🚀 Getting Started
1. **[docs/SETUP.md](./docs/SETUP.md)** - Local development
2. **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Production deployment
3. **[docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Common issues

### 📊 Project Status
1. **[DEVELOPMENT_PROGRESS.md](./DEVELOPMENT_PROGRESS.md)** - Development status
2. **[VERIFICATION_REPORT.md](./VERIFICATION_REPORT.md)** - Build verification
3. **[FILES_CREATED.md](./FILES_CREATED.md)** - Complete file listing

---

## Quick Start (5 minutes)

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose

### Setup
```bash
# 1. Clone repository
git clone <repository-url>
cd store-intelligence

# 2. Start services
docker-compose up -d

# 3. Verify installation
curl http://localhost:3000/api/health

# 4. Access frontend
open http://localhost:5173
```

### Services
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **AI Service**: http://localhost:8000
- **MongoDB**: localhost:27017

---

## Project Structure

```
store-intelligence/
├── frontend/              # React application
├── backend/               # Express.js API
├── ai-service/            # FastAPI service
├── architecture/          # Architecture docs
├── docs/                  # Setup & deployment
├── sample-data/           # Sample data (Phase 2+)
├── scripts/               # Utility scripts
├── docker-compose.yml     # Docker Compose
├── README.md              # Project overview
└── START_HERE.md          # This file
```

---

## What's Included

### ✓ Frontend (React + Vite)
- Dashboard with system status
- Health monitoring page
- Real-time updates (Socket.IO)
- Responsive design (Tailwind CSS)
- TypeScript for type safety

### ✓ Backend (Node.js + Express)
- REST API with health endpoints
- MongoDB integration
- Socket.IO for real-time communication
- Security middleware (Helmet, CORS)
- Error handling and logging

### ✓ AI Service (Python + FastAPI)
- Health check endpoints
- Ready for AI model integration
- Async/await support
- CORS middleware

### ✓ DevOps
- Docker containerization
- Docker Compose orchestration
- Health checks for all services
- Production-ready configuration

### ✓ Documentation
- Architecture documentation
- API specification
- Setup guide
- Deployment guide
- Troubleshooting guide

---

## Build Status

| Component | Status | Details |
|-----------|--------|---------|
| Frontend | ✓ PASSING | Builds successfully with Vite |
| Backend | ✓ PASSING | Compiles without errors |
| AI Service | ✓ PASSING | Validates without errors |
| Docker | ✓ PASSING | All images valid |
| Documentation | ✓ COMPLETE | 2500+ lines |

---

## Key Features

### Health Monitoring
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed service status

### Real-time Communication
- Socket.IO integration
- WebSocket support
- Event-based architecture

### Security
- Helmet security headers
- CORS configuration
- JWT framework (ready for Phase 2)
- Environment variable management

### Development Experience
- Hot reload support
- TypeScript strict mode
- Comprehensive error handling
- Structured logging

---

## Documentation Map

### Getting Started
- [README.md](./README.md) - Project overview
- [docs/SETUP.md](./docs/SETUP.md) - Local setup
- [PHASE_1_SUMMARY.md](./PHASE_1_SUMMARY.md) - What was built

### Architecture & Design
- [architecture/ARCHITECTURE.md](./architecture/ARCHITECTURE.md) - System design
- [architecture/API_SPECIFICATION.md](./architecture/API_SPECIFICATION.md) - API docs
- [architecture/DATABASE_SCHEMA.md](./architecture/DATABASE_SCHEMA.md) - Database schema

### Deployment & Operations
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) - Production deployment
- [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) - Common issues
- [docker-compose.yml](./docker-compose.yml) - Docker configuration

### Project Status
- [DEVELOPMENT_PROGRESS.md](./DEVELOPMENT_PROGRESS.md) - Development status
- [VERIFICATION_REPORT.md](./VERIFICATION_REPORT.md) - Build verification
- [FILES_CREATED.md](./FILES_CREATED.md) - File listing

---

## Common Tasks

### Start Development
```bash
# Option 1: Docker Compose (Recommended)
docker-compose up -d

# Option 2: Local Development
# Terminal 1 - Backend
cd backend && npm install && npm run dev

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev

# Terminal 3 - AI Service
cd ai-service && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python main.py
```

### Check Health
```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/health/detailed
curl http://localhost:8000/health
```

### Build for Production
```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build

# Docker
docker-compose build
```

### Deploy to Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### View Logs
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f ai-service
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| Backend | Node.js 20, Express 4, MongoDB 7 |
| AI Service | Python 3.11, FastAPI 0.104 |
| DevOps | Docker, Docker Compose |

---

## Phase Roadmap

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

---

## Support & Help

### Having Issues?
1. Check [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
2. Review [docs/SETUP.md](./docs/SETUP.md)
3. Check [VERIFICATION_REPORT.md](./VERIFICATION_REPORT.md)

### Want to Learn More?
1. Read [architecture/ARCHITECTURE.md](./architecture/ARCHITECTURE.md)
2. Review [architecture/API_SPECIFICATION.md](./architecture/API_SPECIFICATION.md)
3. Check [PHASE_1_SUMMARY.md](./PHASE_1_SUMMARY.md)

### Need to Deploy?
1. Follow [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
2. Review [docker-compose.yml](./docker-compose.yml)
3. Check environment configuration

---

## File Statistics

- **Total Files**: 45
- **Total Lines of Code**: 2000+
- **Total Documentation**: 2500+ lines
- **Build Status**: ✓ All Passing
- **Verification Status**: ✓ Complete

---

## Next Steps

1. ✓ Read [README.md](./README.md)
2. ✓ Follow [docs/SETUP.md](./docs/SETUP.md)
3. ✓ Start services with `docker-compose up -d`
4. ✓ Verify health endpoints
5. ✓ Access frontend at http://localhost:5173
6. ✓ Review [architecture/ARCHITECTURE.md](./architecture/ARCHITECTURE.md)
7. ✓ Begin Phase 2 development

---

## Project Status

**Phase 1**: ✓ COMPLETE
**Build Status**: ✓ ALL PASSING
**Documentation**: ✓ COMPREHENSIVE
**Ready for Phase 2**: ✓ YES

---

## Questions?

- **Setup Issues**: See [docs/SETUP.md](./docs/SETUP.md)
- **Deployment**: See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- **Architecture**: See [architecture/ARCHITECTURE.md](./architecture/ARCHITECTURE.md)
- **Troubleshooting**: See [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)

---

**Welcome to Store Intelligence System!**

Start with [README.md](./README.md) and follow the quick start guide.

**Last Updated**: May 31, 2026
**Version**: 1.0.0
**Status**: Production-Ready (Phase 1)
