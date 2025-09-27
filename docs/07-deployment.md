# Deployment Guide

## Deployment Overview

ClipShare supports multiple deployment strategies, from static hosting to full-featured cloud platforms. This guide covers setup, configuration, and best practices for each deployment option.

## Current Deployment (GitHub Pages)

### Automated Deployment Pipeline

The project is currently configured for automatic deployment to GitHub Pages using GitHub Actions.

#### CI/CD Configuration

```yaml
# .github/workflows/cd.yml
name: Deploy React App to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: write  

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build the project
        run: npm run build

      - name: Configure Git identity
        run: |
          git config --global user.name "ronit0000"
          git config --global user.email "ronitkusahu@gmail.com"

      - name: Authenticate and deploy to GitHub Pages
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          git remote set-url origin https://x-access-token:${GITHUB_TOKEN}@github.com/${{ github.repository }}.git
          npm run deploy
```

#### Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### GitHub Pages Setup

1. **Repository Settings**
   - Navigate to repository Settings > Pages
   - Set source to "Deploy from a branch"
   - Select `gh-pages` branch
   - Set folder to `/ (root)`

2. **Custom Domain (Optional)**
   ```bash
   # Add CNAME file to public folder
   echo "your-domain.com" > public/CNAME
   ```

3. **Base URL Configuration**
   ```javascript
   // vite.config.js
   export default defineConfig({
     base: '/ClipShare/', // Repository name
     // ... other config
   });
   ```

## Alternative Deployment Options

### 1. Vercel Deployment

#### Automatic Deployment

1. **Import Project**
   - Connect GitHub repository to Vercel
   - Auto-detected as Vite project
   - Default settings work out of the box

2. **Manual Configuration**
   ```json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "functions": {},
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

3. **Environment Variables**
   ```bash
   # Vercel Dashboard > Project Settings > Environment Variables
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

#### CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 2. Netlify Deployment

#### Drag & Drop Deployment

1. Build locally: `npm run build`
2. Drag `dist` folder to Netlify
3. Configure custom domain if needed

#### Git Integration

1. **netlify.toml Configuration**
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"

   [build.environment]
     NODE_VERSION = "18"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Environment Variables**
   - Navigate to Site Settings > Environment Variables
   - Add Supabase configuration

### 3. AWS S3 + CloudFront

#### S3 Static Website Setup

```bash
# AWS CLI deployment script
#!/bin/bash

BUCKET_NAME="clipshare-app"
DISTRIBUTION_ID="your_distribution_id"

# Build the project
npm run build

# Sync files to S3
aws s3 sync dist/ s3://$BUCKET_NAME --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

#### CloudFormation Template

```yaml
# infrastructure/cloudformation.yml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'ClipShare Static Website Infrastructure'

Resources:
  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub "${AWS::StackName}-clipshare"
      PublicReadPolicy: true
      WebsiteConfiguration:
        IndexDocument: index.html
        ErrorDocument: index.html

  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - DomainName: !GetAtt S3Bucket.DomainName
            Id: S3Origin
            CustomOriginConfig:
              HTTPPort: 80
              HTTPSPort: 443
              OriginProtocolPolicy: https-only
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          Compress: true
          DefaultTTL: 86400
        Enabled: true
        DefaultRootObject: index.html
```

### 4. Docker Deployment

#### Dockerfile

```dockerfile
# Multi-stage build for production
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration

```nginx
# nginx.conf
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html index.htm;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  clipshare:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  # Optional: Add reverse proxy
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "443:443"
    volumes:
      - ./ssl:/etc/ssl/certs
      - ./proxy.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - clipshare
```

## Environment Configuration

### Environment Variables

```bash
# Production Environment (.env.production)
NODE_ENV=production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Optional: Feature flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=true
VITE_SENTRY_DSN=your_sentry_dsn

# Performance settings
VITE_MAX_FILE_SIZE=52428800
VITE_MAX_FILES=10
VITE_CACHE_TTL=3600
```

### Build Configuration

```javascript
// vite.config.js - Production optimizations
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  
  build: {
    sourcemap: mode === 'development',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          utils: ['nanoid', '@heroicons/react']
        }
      }
    },
    
    // Production optimizations
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true
      }
    }
  },

  // Base URL for different environments
  base: mode === 'production' ? '/ClipShare/' : '/',

  // Development server
  server: {
    port: 5173,
    host: true
  },

  // Preview server
  preview: {
    port: 4173,
    host: true
  }
}));
```

## Performance Optimization for Production

### Bundle Analysis

```bash
# Analyze bundle size
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true
    })
  ]
});
```

### Caching Strategy

```javascript
// Service Worker for caching (future implementation)
// public/sw.js
const CACHE_NAME = 'clipshare-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

### CDN Configuration

```javascript
// Upload assets to CDN and update references
const CDN_URL = 'https://cdn.example.com/clipshare';

// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  },
  
  // Use CDN for assets in production
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js' || hostType === 'css') {
        return `${CDN_URL}/${filename}`;
      }
      return { relative: true };
    }
  }
});
```

## Monitoring and Analytics

### Error Monitoring (Sentry)

```javascript
// src/monitoring/sentry.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  
  beforeSend(event) {
    // Filter out development errors
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  }
});

export { Sentry };
```

### Performance Monitoring

```javascript
// src/monitoring/performance.js
export const trackPerformance = () => {
  // Core Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  });
};

// Usage in main.jsx
if (process.env.NODE_ENV === 'production') {
  trackPerformance();
}
```

## Security Configuration

### Content Security Policy

```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://*.supabase.co;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
">
```

### HTTPS Redirect

```javascript
// Security middleware for production
if (process.env.NODE_ENV === 'production' && location.protocol !== 'https:') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
```

## Backup and Recovery

### Supabase Backup Strategy

```bash
# Database backup script
#!/bin/bash

PROJECT_ID="your-project-id"
BACKUP_PATH="./backups/$(date +%Y%m%d_%H%M%S)"

# Create backup directory
mkdir -p $BACKUP_PATH

# Export database schema
supabase db dump --project-id $PROJECT_ID > $BACKUP_PATH/schema.sql

# Export data
supabase db dump --project-id $PROJECT_ID --data-only > $BACKUP_PATH/data.sql

echo "Backup completed: $BACKUP_PATH"
```

### File Storage Backup

```javascript
// scripts/backup-storage.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function backupStorage() {
  const { data: files } = await supabase.storage
    .from('clipshare-files')
    .list('', { limit: 1000 });

  for (const file of files) {
    const { data } = await supabase.storage
      .from('clipshare-files')
      .download(file.name);

    if (data) {
      const backupPath = path.join('./storage-backup', file.name);
      fs.writeFileSync(backupPath, Buffer.from(await data.arrayBuffer()));
    }
  }
}

backupStorage().catch(console.error);
```

## Troubleshooting Deployment Issues

### Common Issues and Solutions

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variable Issues**
   ```bash
   # Check environment variables are loaded
   echo $VITE_SUPABASE_URL
   
   # Verify in build output
   cat dist/assets/*.js | grep -o "supabase"
   ```

3. **Routing Issues (SPA)**
   ```nginx
   # Ensure proper fallback to index.html
   location / {
     try_files $uri $uri/ /index.html;
   }
   ```

4. **CORS Issues**
   ```javascript
   // Add to Supabase CORS settings
   const corsOrigins = [
     'https://yourdomain.com',
     'https://www.yourdomain.com'
   ];
   ```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Build process completes without errors
- [ ] All routes work correctly (SPA routing)
- [ ] Assets load properly (CSS, JS, images)
- [ ] Supabase connection works
- [ ] File upload/download functionality tested
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable
- [ ] Security headers configured
- [ ] Analytics/monitoring active
- [ ] Backup strategy implemented

This comprehensive deployment guide ensures ClipShare can be successfully deployed across various platforms with proper configuration, optimization, and monitoring.