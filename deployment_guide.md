# 🚀 Bhodi Learning Platform - Deployment Guide

## Overview
This guide explains how to deploy the full-stack Bhodi Learning Platform to production, integrating with your existing luischibata.com website.

## Current Architecture
- **Frontend**: Static HTML/CSS/JS with CodeMirror 5
- **Backend**: Python Flask server with code execution capabilities
- **Communication**: REST API calls between frontend and backend

## Deployment Strategy

### Option 1: Subdomain Approach (Recommended)
- Main site: `luischibata.com` (existing content)
- Learning platform: `learn.luischibata.com` or `bhodi.luischibata.com`

### Option 2: Path-Based Approach
- Main site: `luischibata.com` (existing content)
- Learning platform: `luischibata.com/learn/`

## Phase 1: Backend Deployment

### Step 1: Choose Hosting Platform

#### Railway.app (Recommended)
✅ Pros:
- Modern platform with excellent Python support
- Automatic deployments from Git
- Built-in environment variables
- Generous free tier
- Easy database integration

❌ Cons:
- Newer platform (less community content)

#### Alternative: Heroku
✅ Pros:
- Extensive documentation and tutorials
- Large community
- Many add-ons available

❌ Cons:
- Free tier limitations
- Can be more complex for beginners

### Step 2: Prepare Backend Code

#### 2.1 Create Production Configuration

Create `src/backend/config.py`:
```python
import os

class Config:
    # Basic Flask config
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = os.environ.get('FLASK_ENV') == 'development'
    
    # CORS configuration for production
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*').split(',')
    
    # Code execution settings
    EXECUTION_TIMEOUT = int(os.environ.get('EXECUTION_TIMEOUT', '10'))
    MAX_CODE_LENGTH = int(os.environ.get('MAX_CODE_LENGTH', '10000'))

class DevelopmentConfig(Config):
    DEBUG = True
    CORS_ORIGINS = ['http://localhost:8000', 'http://127.0.0.1:8000']

class ProductionConfig(Config):
    DEBUG = False
    CORS_ORIGINS = [
        'https://luischibata.com',
        'https://learn.luischibata.com',
        'https://bhodi.luischibata.com'
    ]

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
```

#### 2.2 Update server.py for Production

Modify `src/backend/server.py`:
```python
import os
from config import config

# Get configuration
config_name = os.environ.get('FLASK_ENV', 'development')
app.config.from_object(config[config_name])

# Update CORS with production origins
CORS(app, origins=app.config['CORS_ORIGINS'])

# Add production-ready error handling
@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({
        "status": "error",
        "message": "Internal server error",
        "error_type": "system_error"
    }), 500

# Add health check with more info
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "bhodi-learning-platform",
        "environment": config_name,
        "step": 6
    })
```

#### 2.3 Create Requirements File

Update `requirements.txt`:
```
Flask==2.3.3
Flask-CORS==4.0.0
gunicorn==21.2.0
```

#### 2.4 Create Deployment Files

Create `Procfile` (for Heroku):
```
web: gunicorn -w 4 -b 0.0.0.0:$PORT --chdir src/backend server:app
```

Create `railway.toml` (for Railway):
```toml
[build]
builder = "NIXPACKS"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"

[env]
FLASK_ENV = "production"
PYTHONPATH = "/app/src/backend"
```

### Step 3: Deploy Backend

#### For Railway.app:

1. **Create Account**: Go to railway.app
2. **Connect GitHub**: Link your repository
3. **Create Project**: "Deploy from GitHub repo"
4. **Configure**:
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `cd src/backend && gunicorn -w 4 -b 0.0.0.0:$PORT server:app`
5. **Environment Variables**:
   ```
   FLASK_ENV=production
   SECRET_KEY=your-random-secret-key
   CORS_ORIGINS=https://luischibata.com,https://learn.luischibata.com
   ```
6. **Deploy**: Push to GitHub triggers automatic deployment

#### For Heroku:

1. **Install Heroku CLI**
2. **Login**: `heroku login`
3. **Create App**: `heroku create bhodi-learning-backend`
4. **Set Environment Variables**:
   ```bash
   heroku config:set FLASK_ENV=production
   heroku config:set SECRET_KEY=your-random-secret-key
   heroku config:set CORS_ORIGINS=https://luischibata.com
   ```
5. **Deploy**: `git push heroku main`

## Phase 2: Frontend Deployment

### Step 1: Prepare Frontend for Production

#### 1.1 Update API Configuration

Modify `src/frontend/js/main.js`:
```javascript
// API Configuration for different environments
const getApiBaseUrl = () => {
    // Check if we're in development (localhost)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000';
    }
    
    // Production API URL (replace with your Railway/Heroku URL)
    return 'https://your-backend-app.railway.app';
};

const API_BASE_URL = getApiBaseUrl();
```

#### 1.2 Add Environment Detection

Add to `src/frontend/js/main.js`:
```javascript
// Environment detection
const ENVIRONMENT = {
    isDevelopment: window.location.hostname === 'localhost',
    isProduction: !window.location.hostname.includes('localhost'),
    apiUrl: getApiBaseUrl()
};

console.log(`Environment: ${ENVIRONMENT.isDevelopment ? 'Development' : 'Production'}`);
console.log(`API URL: ${ENVIRONMENT.apiUrl}`);
```

### Step 2: Create Build Process

#### 2.1 Optimize for Production

Create `src/frontend/build.js`:
```javascript
// Simple build script to prepare for production
const fs = require('fs');
const path = require('path');

// Minify CSS (basic)
const cssContent = fs.readFileSync('css/style.css', 'utf8');
const minifiedCSS = cssContent.replace(/\s+/g, ' ').trim();
fs.writeFileSync('dist/style.min.css', minifiedCSS);

console.log('Frontend build complete!');
```

#### 2.2 Create Production HTML

Create `src/frontend/index.prod.html` (copy of index.html with production optimizations):
- Update API URLs
- Add analytics if needed
- Optimize loading

### Step 3: Deploy to Netlify

#### Option A: Subdomain Deployment

1. **Create New Netlify Site**:
   - Go to Netlify dashboard
   - "Add new site" → "Import from Git"
   - Select your repository
   - Set build settings:
     ```
     Build command: (leave empty for static deployment)
     Publish directory: src/frontend
     ```

2. **Configure Custom Domain**:
   - In Netlify site settings → Domain management
   - Add custom domain: `learn.luischibata.com`
   - Netlify will provide DNS instructions

3. **DNS Configuration**:
   - In your domain provider, add CNAME record:
     ```
     learn.luischibata.com → your-netlify-site.netlify.app
     ```

#### Option B: Path-Based Deployment (More Complex)

This requires configuring your main site to serve the learning platform at `/learn/`.

## Phase 3: Domain and DNS Configuration

### Step 1: Subdomain Setup (Recommended)

1. **Choose Subdomain**: `learn.luischibata.com` or `bhodi.luischibata.com`

2. **DNS Records** (in your domain provider):
   ```
   Type: CNAME
   Name: learn
   Value: your-netlify-site.netlify.app
   TTL: 3600
   ```

3. **SSL Certificate**: Netlify automatically provides HTTPS

### Step 2: Test Deployment

1. **Backend Health Check**: Visit `https://your-backend.railway.app/health`
2. **Frontend Load**: Visit `https://learn.luischibata.com`
3. **API Connection**: Test code execution through the frontend

## Phase 4: Production Monitoring

### 1. Backend Monitoring
- Railway/Heroku dashboards
- Application logs
- Performance metrics

### 2. Frontend Monitoring
- Netlify analytics
- Browser console errors
- User experience metrics

## Security Considerations

### 1. Code Execution Security
- Input validation
- Execution timeouts
- Resource limits
- Sandboxing (future enhancement)

### 2. CORS Configuration
- Restrict origins to your domains
- Don't use wildcards in production

### 3. Environment Variables
- Never commit secrets to Git
- Use platform environment variable systems
- Rotate keys regularly

## Estimated Costs

### Free Tier Options:
- **Railway**: Free tier with good limits
- **Netlify**: Free tier perfect for frontend
- **Domain**: Already owned

### Paid Options (if needed):
- **Railway Pro**: ~$5/month for more resources
- **Heroku Hobby**: ~$7/month per dyno

## Next Steps After Deployment

1. **Test Everything**: Complete user workflow testing
2. **Performance Optimization**: Monitor and optimize
3. **Analytics**: Add user analytics if desired
4. **Content**: Add more lessons (Step 7+)
5. **Features**: Implement remaining steps from development plan

## Troubleshooting Common Issues

### Backend Issues:
- **CORS Errors**: Check origins configuration
- **503 Errors**: Check application logs
- **Timeout**: Increase server resources

### Frontend Issues:
- **API Connection**: Verify URL configuration
- **Loading Issues**: Check network tab in browser
- **HTTPS Mixed Content**: Ensure all resources use HTTPS

## Rollback Plan

1. **Keep Development Environment**: Always maintain local development
2. **Git Branches**: Use branches for deployment
3. **Netlify Rollback**: Easy one-click rollback in Netlify
4. **Railway/Heroku Rollback**: Platform-specific rollback features 