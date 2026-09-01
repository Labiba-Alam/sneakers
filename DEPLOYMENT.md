# KINGSMAN Deployment & Production Infrastructure Guide

This guide details step-by-step procedures to deploy KINGSMAN to production environments with agency-grade reliability, SSL security, and global CDN acceleration.

---

## 1. Cloud Run / Docker Container Deployment

KINGSMAN includes a production-ready Express + Vite bundle engine compiled into `dist/server.cjs`.

### Build & Containerize Command
```bash
# Build the static Vite assets and bundle server.ts into dist/server.cjs
npm run build

# Start the bundled production server
npm start
```

### Dockerfile Configuration
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "dist/server.cjs"]
```

---

## 2. Deployment to Vercel

1. **Connect GitHub Repository** to Vercel.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Set Environment Variables in Vercel Dashboard:
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - `NEXT_PUBLIC_META_PIXEL_ID`

---

## 3. Deployment to Custom Linux VPS (Ubuntu + Nginx + PM2)

### Step 1: Install Node.js & PM2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot python3-certbot-nginx
sudo npm install -g pm2
```

### Step 2: Clone & Build Repository
```bash
git clone https://github.com/kingsman/kingsman-royal-sneakers.git
cd kingsman-royal-sneakers
npm ci
npm run build
```

### Step 3: Start PM2 Process
```bash
pm2 start dist/server.cjs --name "kingsman-app"
pm2 save
pm2 startup
```

### Step 4: Configure Nginx Reverse Proxy
Edit `/etc/nginx/sites-available/kingsman`:

```nginx
server {
    server_name kingsman-luxury.com www.kingsman-luxury.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Step 5: Enable SSL with Let's Encrypt
```bash
sudo ln -s /etc/nginx/sites-available/kingsman /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d kingsman-luxury.com -d www.kingsman-luxury.com
```

---

## 4. Health Check & Monitoring Endpoints

- **Health Check**: `https://kingsman-luxury.com/api/health`
- **Server Metrics**: `https://kingsman-luxury.com/api/metrics`
- **Backups Snapshot**: `https://kingsman-luxury.com/api/admin/backups`
- **Sitemap Index**: `https://kingsman-luxury.com/sitemap.xml`
- **Robots Index**: `https://kingsman-luxury.com/robots.txt`

---

## 5. Automated Backup & Disaster Recovery

- **Database Backups**: Supabase automatically captures daily point-in-time recovery snapshots.
- **In-Memory Store Snapshots**: `/api/admin/backups` exports JSON state snapshots every 6 hours.
