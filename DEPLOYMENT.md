# Deployment Guide - Free Hosting on Render

This guide will help you deploy your portfolio website for **FREE** on Render.

## Prerequisites

- GitHub account (free)
- Render account (free, no credit card needed)

## Step-by-Step Deployment

### 1. Push Your Code to GitHub

```bash
# Initialize git (if not already done)
cd /home/tonmoy/Desktop/protfolio
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Portfolio website"

# Create a new repository on GitHub (https://github.com/new)
# Then link it:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 2. Deploy on Render

1. **Sign up for Render**:
   - Go to https://render.com
   - Sign up with your GitHub account (free)

2. **Create a New Web Service**:
   - Click "New +" button
   - Select "Web Service"
   - Connect your GitHub repository

3. **Configure the Service**:
   - **Name**: `my-portfolio` (or any name you like)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Select "Free"

4. **Click "Create Web Service"**

5. **Wait for Deployment**: Render will build and deploy your app (takes 2-5 minutes)

6. **Access Your Site**: You'll get a URL like `https://my-portfolio.onrender.com`

### 3. Important: Change Admin Password

**Before sharing your site**, update the admin credentials:

1. In your local files, edit `server/data/config.json`
2. Change the password to something secure
3. Commit and push:
   ```bash
   git add server/data/config.json
   git commit -m "Update admin password"
   git push
   ```
4. Render will automatically redeploy

### 4. Access Your Deployed Site

- **Portfolio**: `https://your-app-name.onrender.com`
- **Admin Panel**: `https://your-app-name.onrender.com/admin.html`

## Important Notes

### Free Tier Limitations

- ⚠️ **Sleep Mode**: Free services sleep after 15 minutes of inactivity
- ⚠️ **Wake-up Time**: First visit after sleep takes 30-60 seconds
- ⚠️ **Data Persistence**: Files (JSON data) persist between sleeps
- ⚠️ **Monthly Hours**: 750 free hours/month (enough for personal use)

### Keeping Your Site Awake (Optional)

If you want faster response times, use a free uptime monitor:
- **UptimeRobot** (https://uptimerobot.com) - Pings your site every 5 minutes
- This keeps it awake during the day

## Alternative Free Hosting Options

### Option 2: Railway

- Free tier: $5 credit/month
- https://railway.app
- Similar setup to Render
- Slightly faster but limited free credits

### Option 3: Fly.io

- Free tier with 3 shared VMs
- https://fly.io
- More technical setup
- Better performance

## Custom Domain (Optional)

You can add a custom domain on Render's free tier:

1. Buy a domain (from Namecheap, Google Domains, etc.)
2. In Render dashboard, go to "Settings" → "Custom Domain"
3. Add your domain and update DNS records

## Troubleshooting

### Site Not Loading
- Check Render logs in the dashboard
- Ensure `npm start` works locally first

### Admin Login Not Working
- Clear browser cookies
- Check that session secret is set in config.json

### Changes Not Appearing
- Push changes to GitHub
- Render auto-deploys on new commits
- Check deployment logs in Render dashboard

## Support

If you encounter issues:
- Render Docs: https://render.com/docs
- Render Community: https://community.render.com

---

**Your portfolio is production-ready! Just follow these steps and you'll be live in minutes! 🚀**
