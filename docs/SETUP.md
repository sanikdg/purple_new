# Setup Guide - Store Intelligence System

## Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- Git

## Local Development Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd store-intelligence
```

### 2. Environment Configuration

#### Backend
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/store-intelligence
JWT_SECRET=your-dev-secret-key
FRONTEND_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
```

#### Frontend
```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:
```
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

#### AI Service
```bash
cp ai-service/.env.example ai-service/.env
```

Edit `ai-service/.env`:
```
PORT=8000
BACKEND_URL=http://localhost:3000
ENVIRONMENT=development
```

### 3. Install Dependencies

#### Backend
```bash
cd backend
npm install
cd ..
```

#### Frontend
```bash
cd frontend
npm install
cd ..
```

#### AI Service
```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 4. Start Services

#### Option A: Using Docker Compose (Recommended)
```bash
docker-compose up -d
```

Services will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- AI Service: http://localhost:8000
- MongoDB: localhost:27017

#### Option B: Local Development

**Terminal 1 - Backend**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**
```bash
cd frontend
npm run dev
```

**Terminal 3 - AI Service**
```bash
cd ai-service
source venv/bin/activate
python main.py
```

**Terminal 4 - MongoDB**
```bash
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:7.0
```

### 5. Verify Installation

Check health endpoints:
```bash
# Backend health
curl http://localhost:3000/api/health

# Detailed health
curl http://localhost:3000/api/health/detailed

# AI Service health
curl http://localhost:8000/health
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### MongoDB Connection Failed
- Ensure MongoDB is running
- Check connection string in .env
- Verify credentials

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Python Virtual Environment Issues
```bash
# Recreate virtual environment
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Next Steps

1. Review [ARCHITECTURE.md](../architecture/ARCHITECTURE.md)
2. Check [API_SPECIFICATION.md](../architecture/API_SPECIFICATION.md)
3. Read [DEVELOPMENT_PROGRESS.md](../DEVELOPMENT_PROGRESS.md)
