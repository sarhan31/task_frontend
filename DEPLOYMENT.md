# Deployment Guide

## 🚀 Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest way to deploy a Vite + React application.

#### Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Production Deployment**
```bash
vercel --prod
```

#### Configuration

Create `vercel.json` in root:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Netlify

#### Via Netlify CLI:

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build the project**
```bash
npm run build
```

3. **Deploy**
```bash
netlify deploy --prod --dir=dist
```

#### Via Git Integration:

1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages

1. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **Update package.json**
```json
{
  "homepage": "https://yourusername.github.io/task-management-system",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Update vite.config.js**
```javascript
export default defineConfig({
  base: '/task-management-system/',
  // ... rest of config
});
```

4. **Deploy**
```bash
npm run deploy
```

### 4. Docker

#### Dockerfile:

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Build and Run:

```bash
# Build image
docker build -t task-management-system .

# Run container
docker run -p 80:80 task-management-system
```

#### Docker Compose:

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_API_BASE_URL=http://backend:5000/api
    depends_on:
      - backend

  backend:
    image: your-backend-image
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/taskdb
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=taskdb
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 5. AWS S3 + CloudFront

1. **Build the project**
```bash
npm run build
```

2. **Install AWS CLI**
```bash
# Follow AWS CLI installation guide
```

3. **Create S3 bucket**
```bash
aws s3 mb s3://your-bucket-name
```

4. **Upload files**
```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

5. **Configure bucket for static hosting**
```bash
aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
```

6. **Set up CloudFront distribution** (via AWS Console)

### 6. Heroku

1. **Create Procfile**
```
web: npm run preview
```

2. **Create heroku.yml**
```yaml
build:
  docker:
    web: Dockerfile
```

3. **Deploy**
```bash
heroku login
heroku create your-app-name
git push heroku main
```

## Environment Variables

### Production Environment Variables

Create `.env.production`:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_NAME=Task Management System
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
```

### Setting Environment Variables

#### Vercel:
```bash
vercel env add VITE_API_BASE_URL
```

#### Netlify:
```bash
netlify env:set VITE_API_BASE_URL "https://api.yourdomain.com/api"
```

#### Docker:
```bash
docker run -e VITE_API_BASE_URL=https://api.yourdomain.com/api -p 80:80 task-management-system
```

## Pre-Deployment Checklist

- [ ] Update API base URL in `.env.production`
- [ ] Test production build locally: `npm run build && npm run preview`
- [ ] Verify all environment variables are set
- [ ] Check that all routes work correctly
- [ ] Test authentication flow
- [ ] Verify API integration
- [ ] Check responsive design on mobile
- [ ] Test file upload functionality
- [ ] Verify charts and analytics
- [ ] Check browser console for errors
- [ ] Test in different browsers (Chrome, Firefox, Safari)
- [ ] Optimize images and assets
- [ ] Enable HTTPS
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Configure CDN for static assets
- [ ] Set up analytics (Google Analytics, Mixpanel)

## Performance Optimization

### 1. Code Splitting

```javascript
// Lazy load routes
const AdminDashboard = lazy(() => import('@pages/admin/Dashboard'));
const UserDashboard = lazy(() => import('@pages/user/Dashboard'));
```

### 2. Image Optimization

```bash
# Install image optimization plugin
npm install vite-plugin-imagemin --save-dev
```

### 3. Bundle Analysis

```bash
# Install bundle analyzer
npm install rollup-plugin-visualizer --save-dev

# Add to vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
});
```

### 4. Compression

Enable gzip/brotli compression on your server.

## Monitoring and Analytics

### Error Tracking (Sentry)

```bash
npm install @sentry/react
```

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
});
```

### Analytics (Google Analytics)

```bash
npm install react-ga4
```

```javascript
// src/main.jsx
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
```

## SSL/HTTPS

Most platforms (Vercel, Netlify) provide free SSL certificates automatically.

For custom domains:
- Use Let's Encrypt for free SSL
- Configure SSL in your hosting provider
- Redirect HTTP to HTTPS

## Custom Domain

### Vercel:
```bash
vercel domains add yourdomain.com
```

### Netlify:
1. Go to Domain settings
2. Add custom domain
3. Update DNS records

## Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## Rollback Strategy

### Vercel:
```bash
vercel rollback
```

### Netlify:
Use the Netlify dashboard to rollback to previous deployments.

### Docker:
```bash
docker tag task-management-system:latest task-management-system:backup
docker pull task-management-system:previous-version
```

## Support

For deployment issues:
1. Check build logs
2. Verify environment variables
3. Test locally with production build
4. Check platform-specific documentation
5. Review error monitoring tools
