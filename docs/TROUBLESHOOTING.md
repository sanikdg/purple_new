# Troubleshooting Guide - Store Intelligence System

## Common Issues

### Backend Issues

#### Port 3000 Already in Use
```bash
# Find process
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=3001 npm run dev
```

#### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
1. Ensure MongoDB is running
2. Check connection string in .env
3. Verify credentials
4. Check firewall rules

```bash
# Test MongoDB connection
mongosh mongodb://localhost:27017
```

#### Module Not Found
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd backend
npm install
npm run build
```

#### TypeScript Compilation Error
```bash
npm run type-check
npm run build
```

### Frontend Issues

#### Port 5173 Already in Use
```bash
# Use different port
npm run dev -- --port 5174
```

#### API Connection Failed
```
Error: Failed to fetch system status
```

**Check:**
1. Backend is running on port 3000
2. CORS is enabled
3. API URL in .env is correct
4. Network connectivity

```bash
# Test API
curl http://localhost:3000/api/health
```

#### Module Not Found
```bash
cd frontend
npm install
npm run build
```

#### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### AI Service Issues

#### Port 8000 Already in Use
```bash
# Use different port
PORT=8001 python main.py
```

#### Python Module Not Found
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution:**
```bash
cd ai-service
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Virtual Environment Issues
```bash
# Recreate environment
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Docker Issues

#### Container Won't Start
```bash
# Check logs
docker-compose logs <service-name>

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

#### Port Conflicts
```bash
# List running containers
docker ps

# Stop specific container
docker stop <container-id>

# Or use different ports in docker-compose.yml
```

#### MongoDB Data Persistence
```bash
# Check volume
docker volume ls
docker volume inspect store-intelligence_mongodb_data

# Backup data
docker exec store-intelligence-mongodb mongodump --out /backup
```

### Network Issues

#### Services Can't Communicate
```bash
# Check network
docker network ls
docker network inspect store-intelligence_store-intelligence-network

# Verify service names in docker-compose
```

#### WebSocket Connection Failed
```
WebSocket connection failed
```

**Check:**
1. Socket.IO server is running
2. CORS is configured correctly
3. Firewall allows WebSocket connections
4. Check browser console for errors

### Database Issues

#### MongoDB Authentication Failed
```
Error: authentication failed
```

**Solution:**
```bash
# Check credentials in .env
# Verify MongoDB is initialized with correct user

docker-compose down
docker volume rm store-intelligence_mongodb_data
docker-compose up -d
```

#### Database Connection Timeout
```bash
# Increase timeout in connection string
MONGODB_URI=mongodb://admin:password@localhost:27017/store-intelligence?serverSelectionTimeoutMS=5000
```

### Performance Issues

#### High Memory Usage
```bash
# Check container stats
docker stats

# Limit memory in docker-compose.yml
services:
  backend:
    mem_limit: 512m
```

#### Slow API Response
1. Check database performance
2. Monitor network latency
3. Review application logs
4. Check CPU usage

```bash
docker stats store-intelligence-backend
```

### Logging & Debugging

#### Enable Debug Logging
```bash
# Backend
DEBUG=* npm run dev

# AI Service
export LOGLEVEL=DEBUG
python main.py
```

#### View Container Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

#### Check Application Logs
```bash
# Backend logs
tail -f backend/logs/app.log

# MongoDB logs
docker logs store-intelligence-mongodb
```

## Getting Help

1. Check logs: `docker-compose logs -f`
2. Verify health: `curl http://localhost:3000/api/health`
3. Check connectivity: `docker network inspect store-intelligence_store-intelligence-network`
4. Review documentation: See [SETUP.md](./SETUP.md) and [ARCHITECTURE.md](../architecture/ARCHITECTURE.md)

## Reporting Issues

When reporting issues, include:
- Error message and stack trace
- Steps to reproduce
- Environment details (OS, Node version, etc.)
- Relevant logs
- Docker version and Docker Compose version
