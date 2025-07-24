# 🚀 Bhodi Learning Platform - Deployment Instructions

## Quick Start Guide

Follow these steps to deploy your Bhodi Learning Platform to production using Fly.io + Netlify.

### 📋 Prerequisites

- [X] Code pushed to GitHub repository
- [ ] Fly.io account (sign up at https://fly.io)
- [ ] flyctl CLI installed
- [ ] Domain access (luischibata.com)

## Phase 1: Backend Deployment (Fly.io)

### Step 1: Install Fly.io CLI

```bash
# Install flyctl (Fly.io CLI)
curl -L https://fly.io/install.sh | sh

# Add to PATH (add this to your ~/.zshrc)
export PATH="$HOME/.fly/bin:$PATH"

# Verify installation
flyctl --version
```

### Step 2: Login to Fly.io

```bash
# Login to your Fly.io account
flyctl auth login
```

### Step 3: Deploy Backend

```bash
# Navigate to your project root
cd /path/to/bhodi-learning-platform

# Launch your app (this will create fly.toml and deploy)
flyctl launch

# During launch, choose:
# - App name: bhodi-learning-backend (or your preferred name)
# - Region: Sydney (syd) for best performance in Australia
# - Database: No (we don't need one yet)
# - Deploy now: Yes
```

### Step 4: Set Environment Variables

```bash
# Set production environment variables
flyctl secrets set SECRET_KEY=$(openssl rand -hex 32)
flyctl secrets set FLASK_ENV=production
flyctl secrets set CORS_ORIGINS=https://learn.luischibata.com,https://bhodi.luischibata.com
flyctl secrets set EXECUTION_TIMEOUT=5
flyctl secrets set MAX_CODE_LENGTH=5000
```

### Step 5: Verify Backend Deployment

```bash
# Check app status
flyctl status

# View logs
flyctl logs

# Test health endpoint
curl https://bhodi-learning-backend.fly.dev/health
```

You should see:

```json
{
  "status": "healthy",
  "service": "bhodi-learning-platform",
  "step": 6,
  "environment": "production",
  "code_execution": true
}
```

### Step 6: Update Frontend API URL

Edit `src/frontend/js/main.js` and update the production API URL:

```javascript
// Replace 'bhodi-learning-backend' with your actual app name
const productionApiUrl = 'https://YOUR-APP-NAME.fly.dev';
```

## Phase 2: Frontend Deployment (Netlify)

### Step 1: Prepare Frontend

```bash
# Navigate to frontend directory
cd src/frontend

# Test frontend locally with production backend
python -m http.server 8000
# Visit http://localhost:8000 and test with your Fly.io backend
```

### Step 2: Create Netlify Site

1. **Go to Netlify Dashboard**: https://app.netlify.com
2. **New site from Git**: Click "Add new site" → "Import from Git"
3. **Connect GitHub**: Link your repository
4. **Configure build**:
   - **Build command**: (leave empty)
   - **Publish directory**: `src/frontend`
   - **Branch**: `main`
5. **Deploy**: Click "Deploy site"

### Step 3: Configure Custom Domain

1. **In Netlify Dashboard**: Go to your site → Domain settings
2. **Add custom domain**: Click "Add domain alias"
3. **Enter domain**: `learn.luischibata.com`
4. **Verify ownership**: Follow Netlify's instructions

### Step 4: Update DNS

In your domain provider (where luischibata.com is registered):

```
Type: CNAME
Name: learn
Value: YOUR-NETLIFY-SITE.netlify.app
TTL: 3600
```

### Step 5: Enable HTTPS

Netlify will automatically provision SSL certificate. Wait for:

- ✅ DNS verification
- ✅ SSL certificate issued

## Phase 3: Testing Full Deployment

### Test Backend

```bash
# Health check
curl https://bhodi-learning-backend.fly.dev/health

# Code execution test
curl -X POST https://bhodi-learning-backend.fly.dev/api/run-code \
  -H "Content-Type: application/json" \
  -d '{"code":"print(\"Production test successful!\")"}'
```

### Test Frontend

1. **Visit**: https://learn.luischibata.com
2. **Open browser console**: Check for environment logs
3. **Test code execution**:
   - Enter Python code in editor
   - Click "Run Code" or use Ctrl+Enter
   - Verify output appears

Expected console output:

```
🌍 Environment: Production
🔗 API URL: https://bhodi-learning-backend.fly.dev
🏠 Hostname: learn.luischibata.com
```

## Phase 4: Monitoring & Maintenance

### Monitor Backend

```bash
# View real-time logs
flyctl logs -f

# Check app metrics
flyctl status

# Scale if needed
flyctl scale count 2  # Run 2 instances
```

### Monitor Frontend

- **Netlify Analytics**: Built-in traffic analytics
- **Browser Console**: Check for JavaScript errors
- **Network Tab**: Monitor API call performance

## 🔧 Troubleshooting

### Backend Issues

**503 Service Unavailable**:

```bash
flyctl logs  # Check for startup errors
flyctl status  # Verify app is running
```

**CORS Errors**:

```bash
# Update CORS origins
flyctl secrets set CORS_ORIGINS=https://learn.luischibata.com
```

**Code Execution Timeouts**:

```bash
# Increase timeout
flyctl secrets set EXECUTION_TIMEOUT=10
```

### Frontend Issues

**API Connection Failed**:

1. Check API URL in `main.js`
2. Verify backend is running: `curl https://your-app.fly.dev/health`
3. Check browser network tab for CORS errors

**DNS Issues**:

1. Verify CNAME record: `dig learn.luischibata.com`
2. Wait for DNS propagation (up to 24 hours)

## 💰 Cost Estimate

### Free Tier Usage:

- **Fly.io**: Free allowance covers basic usage
- **Netlify**: Free tier perfect for static frontend
- **Total**: $0/month for light usage

### If You Exceed Free Limits:

- **Fly.io**: ~$5-10/month for production usage
- **Netlify**: Still free for most use cases

## 🚀 Next Steps After Deployment

1. **Test thoroughly**: Complete user workflow testing
2. **Add monitoring**: Set up uptime monitoring
3. **Performance optimization**: Monitor response times
4. **Add analytics**: Consider adding user analytics
5. **Continue development**: Proceed with Step 7 (Lesson Content)

## 📞 Getting Help

- **Fly.io Docs**: https://fly.io/docs/
- **Netlify Docs**: https://docs.netlify.com/
- **Community**: Fly.io community forum

## 🔄 Rollback Plan

### Backend Rollback:

```bash
# View deployments
flyctl releases

# Rollback to previous version
flyctl releases rollback
```

### Frontend Rollback:

- Netlify dashboard → Deploys → Click "Publish deploy" on previous version

---

## 📋 Deployment Checklist

### Backend (Fly.io):

- [ ] flyctl installed and logged in
- [ ] App deployed with `flyctl launch`
- [ ] Environment variables set
- [ ] Health endpoint responding
- [ ] Code execution tested

### Frontend (Netlify):

- [ ] Site created and deployed
- [ ] Custom domain configured
- [ ] DNS updated
- [ ] HTTPS enabled
- [ ] Full workflow tested

### Integration:

- [ ] Frontend connects to backend
- [ ] Code execution works end-to-end
- [ ] No CORS errors
- [ ] Performance acceptable

🎉 **Congratulations! Your Bhodi Learning Platform is now live!**
