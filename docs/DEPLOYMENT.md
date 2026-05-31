# Deployment Guide - Store Intelligence System

## Production Deployment

### Prerequisites
- Docker & Docker Compose
- Server with 4GB+ RAM
- Linux OS (Ubuntu 20.04+ recommended)
- Domain name (optional)
- SSL certificate (recommended)

### Environment Setup

1. Create production environment files:

```bash
# Backend
cp backend/.env.example backend/.env.production
```

Edit `backend/.env.production`:
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://admin:password@mongodb:27017/store-intelligence?authSource=admin
JWT_SECRET=<generate-strong-secret>
FRONTEND_URL=https://yourdomain.com
AI_SERVICE_URL=http://ai-service:8000
```

2. Create production docker-compose file:

```bash
cp docker-compose.yml docker-compose.prod.yml
```

### Deployment Steps

1. **Pull Latest Code**
```bash
git pull origin main
```

2. **Build Images**
```bash
docker-compose -f docker-compose.prod.yml build
```

3. **Start Services**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

4. **Verify Deployment**
```bash
docker-compose -f docker-compose.prod.yml ps
curl http://localhost:3000/api/health
```

### Reverse Proxy Setup (Nginx)

Create `/etc/nginx/sites-available/store-intelligence`:

```nginx
upstream backend {
    server localhost:3000;
}

upstream frontend {
    server localhost:5173;
}

server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Backend API
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # WebSocket
    location /socket.io {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/store-intelligence /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Monitoring

1. **Check Service Status**
```bash
docker-compose -f docker-compose.prod.yml ps
```

2. **View Logs**
```bash
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f ai-service
```

3. **Health Checks**
```bash
curl https://yourdomain.com/api/health
curl https://yourdomain.com/api/health/detailed
```

### Backup Strategy

1. **Database Backup**
```bash
docker exec store-intelligence-mongodb mongodump --out /backup
```

2. **Automated Backups**
Create a cron job:
```bash
0 2 * * * docker exec store-intelligence-mongodb mongodump --out /backup/$(date +\%Y\%m\%d)
```

### Scaling

For high-traffic scenarios:

1. **Load Balancing**: Use Nginx upstream with multiple backend instances
2. **Database Replication**: Configure MongoDB replica sets
3. **Caching**: Add Redis for session/data caching
4. **CDN**: Use CloudFront or similar for static assets

### Security Checklist

- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerts
- [ ] Enable database authentication
- [ ] Rotate JWT secrets regularly
- [ ] Keep dependencies updated
- [ ] Enable audit logging

### Rollback Procedure

```bash
# Stop current deployment
docker-compose -f docker-compose.prod.yml down

# Checkout previous version
git checkout <previous-commit>

# Rebuild and restart
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
