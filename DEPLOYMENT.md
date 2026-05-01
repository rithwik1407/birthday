# 🚀 Deployment Guide - Sweety Birthday Surprise

Complete guide to deploy your birthday surprise app to production.

## 🎯 Deployment Options

### 1. Vercel (Recommended - Easiest)
### 2. AWS
### 3. Heroku
### 4. Self-Hosted

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

- [ ] Customized `src/lib/site-config.ts`
- [ ] Updated birthday date
- [ ] Added personal content
- [ ] Tested all features locally
- [ ] Built successfully: `npm run build`
- [ ] Environment variables configured
- [ ] MongoDB set up (if using database)

---

## 🎯 Option 1: Vercel (Recommended)

### Why Vercel?
- ✅ Easiest setup
- ✅ Free tier available
- ✅ Automatic deployments
- ✅ Built for Next.js
- ✅ Global CDN
- ✅ Serverless functions

### Step 1: Prepare Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Sweety Birthday Surprise"

# Create GitHub repository
# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/sweety-bday.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose your GitHub repository
5. Click "Import"

### Step 3: Configure Environment Variables

1. In Vercel dashboard, go to "Settings" → "Environment Variables"
2. Add the following variables:

```
MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/db
ADMIN_TOKEN = your-secret-admin-token
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = (optional)
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = (optional)
```

3. Click "Save"

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Get your production URL
4. Visit your deployed app!

### Step 5: Custom Domain (Optional)

1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions

### Automatic Deployments

Every push to `main` branch automatically deploys!

```bash
# Make changes
git add .
git commit -m "Update content"
git push origin main

# Vercel automatically deploys
```

---

## 🎯 Option 2: AWS (Amplify)

### Step 1: Prepare Repository

Same as Vercel - push to GitHub

### Step 2: Connect to AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. Click "New app" → "Host web app"
3. Select GitHub
4. Authorize AWS
5. Select your repository and branch
6. Click "Next"

### Step 3: Configure Build Settings

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Step 4: Add Environment Variables

1. In Amplify console, go to "Environment variables"
2. Add your variables:
   - MONGODB_URI
   - ADMIN_TOKEN
   - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   - NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

### Step 5: Deploy

1. Click "Save and deploy"
2. Wait for build to complete
3. Get your Amplify URL

---

## 🎯 Option 3: Heroku

### Step 1: Install Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

### Step 2: Create Heroku App

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add buildpack for Node.js
heroku buildpacks:set heroku/nodejs
```

### Step 3: Configure Environment Variables

```bash
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set ADMIN_TOKEN=your-secret-token
heroku config:set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
heroku config:set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=...
```

### Step 4: Deploy

```bash
# Push to Heroku
git push heroku main

# View logs
heroku logs --tail

# Open app
heroku open
```

### Step 5: Custom Domain (Optional)

```bash
heroku domains:add your-domain.com
```

---

## 🎯 Option 4: Self-Hosted (VPS)

### Requirements
- Node.js 18+
- npm or yarn
- Linux server (Ubuntu recommended)
- Domain name
- SSL certificate

### Step 1: Set Up Server

```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx
```

### Step 2: Clone Repository

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/sweety-bday.git
cd sweety-bday

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

### Step 3: Build Application

```bash
# Build for production
npm run build

# Start with PM2
pm2 start npm --name "sweety-bday" -- start

# Save PM2 config
pm2 save

# Enable PM2 startup
pm2 startup
```

### Step 4: Configure Nginx

Create `/etc/nginx/sites-available/sweety-bday`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
ln -s /etc/nginx/sites-available/sweety-bday /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 5: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d your-domain.com

# Auto-renewal
systemctl enable certbot.timer
```

### Step 6: Monitor

```bash
# View logs
pm2 logs sweety-bday

# Monitor processes
pm2 monit

# Restart app
pm2 restart sweety-bday
```

---

## 🗄️ Database Deployment

### MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create account
3. Create cluster
4. Create database user
5. Get connection string
6. Add to environment variables

### Self-Hosted MongoDB

```bash
# Install MongoDB
apt install -y mongodb

# Start service
systemctl start mongodb
systemctl enable mongodb

# Create database and user
mongo
> use sweety-bday
> db.createUser({user: "admin", pwd: "password", roles: ["dbOwner"]})
```

---

## 🔒 Security Checklist

- [ ] Use strong admin token
- [ ] Enable HTTPS/SSL
- [ ] Set secure MongoDB password
- [ ] Use environment variables for secrets
- [ ] Enable CORS if needed
- [ ] Set up firewall rules
- [ ] Regular backups
- [ ] Monitor logs
- [ ] Update dependencies regularly

---

## 📊 Performance Optimization

### Vercel
- Automatic optimization
- Global CDN
- Edge functions
- Image optimization

### AWS Amplify
- CloudFront CDN
- Lambda functions
- S3 storage
- Auto-scaling

### Self-Hosted
```bash
# Enable gzip compression
# Configure caching headers
# Use CDN (Cloudflare)
# Monitor performance
```

---

## 🔄 Continuous Deployment

### GitHub Actions (Vercel/AWS)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run lint
```

---

## 🐛 Troubleshooting Deployment

### Build Fails

```bash
# Clear cache
rm -rf node_modules .next
npm install
npm run build
```

### Environment Variables Not Working

- Verify variable names match exactly
- Check for typos
- Restart application
- Check deployment logs

### Database Connection Issues

- Verify MongoDB URI
- Check IP whitelist
- Verify credentials
- Test connection locally

### Performance Issues

- Check server resources
- Monitor database queries
- Enable caching
- Use CDN
- Optimize images

---

## 📈 Monitoring

### Vercel
- Built-in analytics
- Performance monitoring
- Error tracking

### AWS
- CloudWatch logs
- X-Ray tracing
- Performance insights

### Self-Hosted
```bash
# Monitor with PM2
pm2 monit

# Check logs
pm2 logs

# System monitoring
top
htop
```

---

## 🔄 Updates & Maintenance

### Deploy Updates

```bash
# Make changes
git add .
git commit -m "Update content"
git push origin main

# Automatic deployment (Vercel/AWS)
# Or manual deployment (Heroku/Self-hosted)
```

### Database Backups

```bash
# MongoDB Atlas - automatic backups
# Self-hosted - manual backups
mongodump --uri "mongodb://..." --out ./backup
```

### Dependency Updates

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions
npm install package@latest
```

---

## 💰 Cost Estimates

### Vercel
- Free tier: Sufficient for most use cases
- Pro: $20/month for advanced features

### AWS Amplify
- Free tier: 1000 build minutes/month
- Pay-as-you-go: ~$0.01 per build minute

### Heroku
- Free tier: Discontinued
- Hobby: $7/month
- Standard: $50+/month

### Self-Hosted (VPS)
- DigitalOcean: $5-40/month
- Linode: $5-40/month
- AWS EC2: $5-100+/month

### MongoDB
- Atlas Free: 512MB storage
- Atlas Paid: $57+/month

---

## 🎯 Recommended Setup

### For Most Users
1. **Hosting**: Vercel (free, easy)
2. **Database**: MongoDB Atlas (free tier)
3. **Domain**: Namecheap or GoDaddy (~$10/year)
4. **Total Cost**: ~$10/year

### For Production
1. **Hosting**: AWS Amplify or Vercel Pro
2. **Database**: MongoDB Atlas paid tier
3. **CDN**: Cloudflare (free)
4. **Domain**: Custom domain
5. **Total Cost**: ~$50-100/month

---

## ✅ Post-Deployment

1. Test all features on production
2. Verify countdown works
3. Test passcode unlock
4. Check wish submission
5. Test video playback
6. Monitor performance
7. Set up backups
8. Share with friends/family!

---

## 📞 Support

- **Vercel**: https://vercel.com/support
- **AWS**: https://aws.amazon.com/support
- **Heroku**: https://help.heroku.com
- **MongoDB**: https://docs.mongodb.com

---

**Your app is ready to go live! 🎉**

Choose your deployment option and follow the steps above. If you have questions, check the documentation or reach out to the platform's support team.

Happy deploying! 💕
