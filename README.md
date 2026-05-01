# 🎉 Sweety Birthday Surprise

A premium, full-stack romantic birthday surprise web app built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. Create an unforgettable interactive experience with countdown reveals, puzzle games, wish jars, and video walls.

## ✨ Features

### Core Experience
- **Countdown + Reveal**: Fullscreen romantic landing with live countdown to birthday date
- **Unlock Logic**: Auto-reveal when timer hits zero OR passcode entry
- **Typing Effect**: Animated reveal message with confetti celebration
- **Optional 3D Scene**: Subtle rotating orb reveal animation
- **Music Toggle**: Optional background music player

### Mini Game
- **Love Puzzle**: Tile-by-tile image reveal game
- **Love Points**: Score system tracking progress
- **Sweet Notes**: Romantic messages appear as tiles are revealed
- **Win State**: Celebration with confetti and success message

### Wish Jar
- **Submit Wishes**: Users add name + message + category
- **MongoDB Storage**: Persistent storage with fallback to sample data
- **Random Reveal**: Open wishes with smooth animations
- **Special Wish**: One locked wish unlocks after opening all others
- **Categories**: Friend, Family, You

### Video Wall
- **Responsive Grid**: Beautiful video card layout
- **Modal Player**: Full-screen video playback with autoplay-next
- **Watch Tracking**: Track which videos have been watched
- **Special Video**: One locked video unlocks after watching all others
- **Cloudinary Ready**: Upload flow prepared for video hosting

### Navigation & Design
- **Glassmorphism Sidebar**: Animated navigation with icons
- **Section Highlighting**: Active section indication
- **QR Codes**: Per-section QR codes for real-life scanning
- **Premium Palette**: Soft rose/peach gradients with glow effects
- **Responsive Design**: Mobile-first, works on all devices
- **Smooth Animations**: Framer Motion micro-interactions throughout

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB (optional - app works with sample data if not configured)

### Installation

```bash
# Clone and install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure environment variables (see below)
# Then start development server
npm run dev
```

Visit `http://localhost:3000` to see your birthday surprise!

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Database (optional - app works without it)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/sweety-bday

# Admin token for video uploads
ADMIN_TOKEN=your-secret-admin-token

# Cloudinary (optional - for video uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset
```

### Site Configuration

Edit `src/lib/site-config.ts` to customize:

```typescript
export const siteConfig = {
  herName: "Sweety",                    // Birthday person's name
  eventTitle: "Sweety Birthday Surprise", // Event title
  birthdayDate: "2026-05-03T00:00:00",  // Birthday date/time
  passcode: "chotey",                   // Unlock passcode
  revealMessage: "Hey Sweety... its finally your day <3",
  revealSubmessage: "Tonight is the beginning of your surprises.",
  hint: "Your first surprise is waiting outside...",
  music: {
    title: "Our Song",
    url: "", // Add music URL here
  },
  siteUrl: "", // Your site URL for QR codes
  // ... more config
};
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── wishes/route.ts      # Wish API endpoints
│   │   └── videos/route.ts      # Video API endpoints
│   ├── countdown/page.tsx       # Countdown page
│   ├── game/page.tsx            # Game page
│   ├── wish-jar/page.tsx        # Wish jar page
│   ├── videos/page.tsx          # Video wall page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home/landing page
│   └── globals.css              # Global styles
├── components/
│   ├── main-page.tsx            # Landing page component
│   ├── sidebar-nav.tsx          # Navigation sidebar
│   ├── music-player.tsx         # Music player
│   ├── preloader.tsx            # Loading animation
│   ├── typing-text.tsx          # Typing effect
│   ├── qr-card.tsx              # QR code card
│   ├── reveal-scene.tsx         # 3D reveal scene
│   ├── sections/
│   │   ├── countdown-section.tsx
│   │   ├── game-section.tsx
│   │   ├── wish-jar-section.tsx
│   │   └── video-wall-section.tsx
│   └── ui/
│       ├── button.tsx           # Button component
│       └── dialog.tsx           # Dialog/modal component
└── lib/
    ├── db.ts                    # MongoDB connection
    ├── site-config.ts           # Configuration
    ├── sample-data.ts           # Sample wishes & videos
    ├── utils.ts                 # Utility functions
    └── models/
        ├── Wish.ts              # Wish schema
        └── Video.ts             # Video schema
```

## 🎨 Customization

### Colors & Styling
- Edit CSS variables in `src/app/globals.css`
- Tailwind classes use custom color tokens (rose, peach, ink)
- Glassmorphism effects via `.glass` and `.glass-strong` utilities

### Content
- **Wishes**: Edit `src/lib/sample-data.ts` for default wishes
- **Videos**: Add video URLs to sample data
- **Love Notes**: Update game notes in `site-config.ts`
- **Messages**: Customize all text in `site-config.ts`

### Animations
- Framer Motion controls in each component
- Adjust `transition` props for speed
- Modify `initial`/`animate` states for different effects

## 🔌 API Endpoints

### Wishes
- `GET /api/wishes` - Fetch all wishes
- `POST /api/wishes` - Create new wish
  ```json
  {
    "name": "Friend Name",
    "message": "Your wish message",
    "category": "friend|family|you"
  }
  ```

### Videos
- `GET /api/videos` - Fetch all videos
- `POST /api/videos` - Create new video (requires admin token)
  ```json
  {
    "title": "Video Title",
    "url": "https://...",
    "thumbnail": "https://..."
  }
  ```

## 🗄️ Database

### MongoDB Setup
1. Create MongoDB Atlas account
2. Create cluster and database
3. Get connection string
4. Add to `.env.local` as `MONGODB_URI`

### Models
- **Wish**: name, message, category, isSpecial, timestamps
- **Video**: title, url, thumbnail, isSpecial, timestamps

### Fallback Behavior
If MongoDB is not configured, the app uses sample data from `src/lib/sample-data.ts`. This allows full functionality without a database.

## 🎬 Video Integration

### Using Cloudinary
1. Sign up at cloudinary.com
2. Get cloud name and create upload preset
3. Add to `.env.local`
4. Videos can be uploaded via Cloudinary widget

### Using Direct URLs
Simply add video URLs to the database or sample data. Supports:
- MP4, WebM, Ogg formats
- YouTube embeds (with proper iframe setup)
- Cloudinary hosted videos

## 🔐 Admin Features

### Video Upload Protection
Videos can only be created with valid admin token:

```bash
curl -X POST http://localhost:3000/api/videos \
  -H "Authorization: Bearer your-admin-token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Special Video",
    "url": "https://...",
    "thumbnail": "https://..."
  }'
```

## 📱 Responsive Design

- **Mobile**: Full-screen experience with hamburger menu
- **Tablet**: Optimized layout with sidebar
- **Desktop**: Full sidebar navigation with all features
- **Touch**: Optimized interactions for touch devices

## 🎯 QR Code Integration

Each section has a QR code that links to:
- `{siteUrl}/countdown`
- `{siteUrl}/game`
- `{siteUrl}/wish-jar`
- `{siteUrl}/videos`

Set `siteUrl` in config to enable QR code generation.

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Deploy via Vercel dashboard
# Add environment variables in Vercel settings
```

### Other Platforms
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **3D**: React Three Fiber + Three.js
- **Database**: MongoDB + Mongoose
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **QR Codes**: react-qr-code
- **Confetti**: canvas-confetti

## 📝 Notes

- Birthday date format: `YYYY-MM-DDTHH:mm:ss`
- Passcode is case-sensitive
- Special wishes/videos unlock after opening all others
- Sample data is used if MongoDB is not configured
- All animations respect `prefers-reduced-motion`

## 🎁 Tips for Best Experience

1. **Customize Everything**: Update names, dates, messages in config
2. **Add Music**: Include a romantic song URL
3. **Real Videos**: Replace sample videos with personal ones
4. **Personal Wishes**: Pre-populate with messages from friends/family
5. **QR Codes**: Print and place around for real-life discovery
6. **Mobile First**: Test on mobile for best experience
7. **Timing**: Set birthday date to create anticipation

## 📄 License

This project is open source and available for personal use.

## 💝 Credits

Built with love for special moments. Customize and make it your own!

---

**Happy Birthday! 🎉💕**
