# 🎯 Setup Guide - Sweety Birthday Surprise

Complete step-by-step guide to set up and customize your birthday surprise app.

## 📋 Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn package manager
- Git (optional, for version control)
- MongoDB Atlas account (optional, for persistent storage)

## 🚀 Initial Setup

### 1. Install Dependencies

```bash
npm install
```

This installs all required packages including Next.js, Framer Motion, Three.js, and more.

### 2. Create Environment File

```bash
cp .env.example .env.local
```

This creates your local environment configuration file.

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser. You should see the landing page!

## ⚙️ Configuration

### Basic Customization (Required)

Edit `src/lib/site-config.ts`:

```typescript
export const siteConfig = {
  herName: "Sweety",                    // Change to birthday person's name
  eventTitle: "Sweety Birthday Surprise", // Change event title
  birthdayDate: "2026-05-03T00:00:00",  // Set actual birthday date
  passcode: "chotey",                   // Set your passcode
  revealMessage: "Hey Sweety... its finally your day <3",
  revealSubmessage: "Tonight is the beginning of your surprises.",
  hint: "Your first surprise is waiting outside...",
  // ... rest of config
};
```

**Important**: Update `birthdayDate` to the actual birthday date and time.

### Music Setup (Optional)

1. Host your music file (Spotify, YouTube, or direct URL)
2. Update in `site-config.ts`:

```typescript
music: {
  title: "Our Song",
  url: "https://your-music-url.mp3", // Add URL here
}
```

### QR Code Setup (Optional)

For QR codes to work, set your site URL:

```typescript
siteUrl: "https://your-domain.com", // Your deployed URL
```

## 🗄️ Database Setup (Optional)

The app works perfectly without a database using sample data. To add persistent storage:

### MongoDB Atlas Setup

1. **Create Account**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Create Cluster**: 
   - Click "Create" → "Build a Cluster"
   - Choose free tier
   - Select region closest to you
   - Click "Create Cluster"
3. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Click "Add User"
4. **Get Connection String**:
   - Go to "Clusters" → "Connect"
   - Choose "Drivers"
   - Copy connection string
5. **Update .env.local**:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sweety-bday
```

Replace `username`, `password`, and `cluster` with your actual values.

### Verify Connection

The app will automatically use MongoDB if configured, otherwise it falls back to sample data.

## 🎮 Customize Content

### Game Love Notes

Edit `src/lib/site-config.ts`:

```typescript
game: {
  gridSize: 4,
  loveNotes: [
    "You make me smile.",
    "I am lucky to have you.",
    // Add more notes here
  ],
  winMessage: "You scored 100%... just like my love for you.",
}
```

### Wish Categories

Customize wish categories:

```typescript
wishCategories: [
  { id: "friend", label: "Friend", tone: "rose" },
  { id: "family", label: "Family", tone: "peach" },
  { id: "you", label: "You", tone: "amber" },
  // Add more categories
]
```

### Sample Wishes & Videos

Edit `src/lib/sample-data.ts` to add default wishes and videos:

```typescript
export const sampleWishes = [
  {
    _id: "1",
    name: "Best Friend",
    message: "You deserve all the happiness...",
    category: "friend",
    createdAt: new Date(),
  },
  // Add more wishes
];
```

## 🎨 Design Customization

### Colors

Edit `src/app/globals.css` to change the color scheme:

```css
:root {
  --rose-1: #ff6fa3;      /* Primary rose */
  --rose-2: #ff9cbc;      /* Secondary rose */
  --peach-1: #ffc3a4;     /* Primary peach */
  --peach-2: #ffe3d5;     /* Secondary peach */
  /* ... more colors */
}
```

### Fonts

Fonts are already configured in `src/app/layout.tsx`:
- Display Font: Cormorant Garamond (elegant)
- Body Font: Manrope (modern)

To change, update the font imports and variables.

### Animations

Adjust animation speeds in component files:

```typescript
// In any component
<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }} // Change duration here
>
```

## 🔐 Admin Features

### Video Upload Token

Set a secure admin token in `.env.local`:

```env
ADMIN_TOKEN=your-very-secure-token-here
```

Use this token to upload videos via API:

```bash
curl -X POST http://localhost:3000/api/videos \
  -H "Authorization: Bearer your-very-secure-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Special Video",
    "url": "https://example.com/video.mp4",
    "thumbnail": "https://example.com/thumb.jpg"
  }'
```

## 📱 Testing

### Test on Mobile

```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
hostname -I             # Linux
ipconfig                # Windows

# Visit from mobile on same network
http://YOUR_IP:3000
```

### Test Countdown

Change `birthdayDate` to a time in the near future to test the countdown and reveal.

### Test Passcode

Try entering the passcode you set in config to unlock early.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add `MONGODB_URI` and `ADMIN_TOKEN`
   - Redeploy

### Deploy to Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

Then deploy the `.next` folder to your hosting platform.

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### Database Connection Issues

- Verify MongoDB URI in `.env.local`
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

### Videos Not Playing

- Check video URL is accessible
- Verify CORS settings if hosting on different domain
- Try different video format (MP4 recommended)

### QR Codes Not Working

- Set `siteUrl` in config
- Ensure URL is publicly accessible
- Test QR code with phone camera

### Animations Stuttering

- Check browser performance
- Reduce animation complexity
- Test on different browser

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Framer Motion Guide](https://www.framer.com/motion/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Three.js Documentation](https://threejs.org/docs/)

## 💡 Pro Tips

1. **Pre-populate Wishes**: Add wishes from friends/family before sharing
2. **Test Everything**: Try all features before the actual date
3. **Backup Data**: Export wishes/videos before major changes
4. **Mobile First**: Always test on mobile devices
5. **Timing**: Set countdown to create anticipation
6. **Personal Touch**: Customize messages and colors
7. **Real Videos**: Replace sample videos with personal ones
8. **Print QR Codes**: Place around for real-life discovery

## 🎁 Next Steps

1. ✅ Complete initial setup
2. ✅ Customize site config
3. ✅ Add personal content
4. ✅ Test all features
5. ✅ Deploy to production
6. ✅ Share with friends/family
7. ✅ Enjoy the surprise!

---

**Need help?** Check the main README.md for more details!
