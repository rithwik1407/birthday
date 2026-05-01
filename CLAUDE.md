# 🎉 Sweety Birthday Surprise - Project Documentation

## Project Overview

A full-stack romantic birthday surprise web application built with Next.js 16, TypeScript, Tailwind CSS, and Framer Motion. The app provides an interactive, multi-section experience with countdown reveals, puzzle games, wish jars, and video walls.

## Architecture

### Frontend Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with custom utilities
- **Animations**: Framer Motion
- **3D Graphics**: React Three Fiber + Three.js
- **UI Components**: Radix UI (Dialog)
- **Icons**: Lucide React
- **QR Codes**: react-qr-code
- **Effects**: canvas-confetti

### Backend Stack
- **API Routes**: Next.js API routes
- **Database**: MongoDB + Mongoose (optional)
- **Authentication**: Simple token-based admin auth
- **Fallback**: In-memory sample data when DB unavailable

## Project Structure

```
sweety-bday/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── wishes/route.ts       # GET/POST wishes
│   │   │   └── videos/route.ts       # GET/POST videos (admin)
│   │   ├── countdown/page.tsx        # Countdown section page
│   │   ├── game/page.tsx             # Game section page
│   │   ├── wish-jar/page.tsx         # Wish jar section page
│   │   ├── videos/page.tsx           # Video wall section page
│   │   ├── layout.tsx                # Root layout with fonts
│   │   ├── page.tsx                  # Landing page
│   │   └── globals.css               # Global styles & variables
│   ├── components/
│   │   ├── main-page.tsx             # Landing page component
│   │   ├── sidebar-nav.tsx           # Navigation sidebar
│   │   ├── music-player.tsx          # Music player widget
│   │   ├── preloader.tsx             # Loading animation
│   │   ├── typing-text.tsx           # Typing effect component
│   │   ├── qr-card.tsx               # QR code card
│   │   ├── reveal-scene.tsx          # 3D reveal scene
│   │   ├── sections/
│   │   │   ├── countdown-section.tsx # Countdown display
│   │   │   ├── game-section.tsx      # Puzzle game
│   │   │   ├── wish-jar-section.tsx  # Wish jar UI
│   │   │   └── video-wall-section.tsx # Video grid
│   │   └── ui/
│   │       ├── button.tsx            # Reusable button
│   │       └── dialog.tsx            # Modal dialog
│   └── lib/
│       ├── db.ts                     # MongoDB connection
│       ├── site-config.ts            # Configuration
│       ├── sample-data.ts            # Default wishes/videos
│       ├── utils.ts                  # Utility functions
│       └── models/
│           ├── Wish.ts               # Wish schema
│           └── Video.ts              # Video schema
├── public/                           # Static assets
├── .env.example                      # Environment template
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── postcss.config.mjs                # PostCSS config
├── eslint.config.mjs                 # ESLint config
├── README.md                         # Main documentation
├── SETUP.md                          # Setup guide
└── CLAUDE.md                         # This file
```

## Key Features Implementation

### 1. Countdown + Reveal
- **File**: `src/components/main-page.tsx`
- **Logic**: 
  - Calculates time remaining using `getTimeRemaining()` utility
  - Updates every second via `setInterval`
  - Auto-reveals when countdown reaches zero
  - Passcode unlock available
  - Triggers confetti on reveal
- **Components**: Countdown grid, typing text, reveal message

### 2. Mini Game (Love Puzzle)
- **File**: `src/components/sections/game-section.tsx`
- **Logic**:
  - Grid of tiles (configurable size, default 4x4)
  - Click to reveal tiles showing heart emoji
  - Tracks revealed tiles in Set
  - Win condition: all tiles revealed
  - Displays love notes on win
  - Confetti celebration
- **Features**: Reset button, love points counter, win state

### 3. Wish Jar
- **File**: `src/components/sections/wish-jar-section.tsx`
- **Logic**:
  - Fetch wishes from `/api/wishes`
  - Display as cards (closed/opened states)
  - Random wish selection
  - Form to add new wishes
  - Special wish unlocks after opening all others
  - Categories: friend, family, you
- **API**: POST to create, GET to fetch

### 4. Video Wall
- **File**: `src/components/sections/video-wall-section.tsx`
- **Logic**:
  - Grid of video cards with thumbnails
  - Modal player with video controls
  - Autoplay next feature
  - Track watched videos
  - Special video unlocks after watching all others
- **Features**: Responsive grid, modal player, watch tracking

### 5. Navigation
- **File**: `src/components/sidebar-nav.tsx`
- **Features**:
  - Glassmorphism design
  - Mobile hamburger menu
  - Active section highlighting
  - Smooth animations
  - Icons for each section

### 6. Design System
- **File**: `src/app/globals.css`
- **Features**:
  - CSS custom properties for colors
  - Glassmorphism utilities
  - Gradient text utility
  - Floating animations
  - Responsive design utilities

## Data Models

### Wish Schema
```typescript
{
  _id: ObjectId,
  name: String,
  message: String,
  category: "friend" | "family" | "you",
  isSpecial: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Video Schema
```typescript
{
  _id: ObjectId,
  title: String,
  url: String,
  thumbnail: String,
  isSpecial: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Wishes
- `GET /api/wishes` - Fetch all wishes
  - Returns: Array of wishes
  - Fallback: Sample data if no DB
  
- `POST /api/wishes` - Create new wish
  - Body: `{ name, message, category }`
  - Returns: Created wish object
  - Status: 201 on success

### Videos
- `GET /api/videos` - Fetch all videos
  - Returns: Array of videos
  - Fallback: Sample data if no DB
  
- `POST /api/videos` - Create new video (admin only)
  - Headers: `Authorization: Bearer {ADMIN_TOKEN}`
  - Body: `{ title, url, thumbnail }`
  - Returns: Created video object
  - Status: 201 on success, 401 if unauthorized

## Configuration

### Site Config (`src/lib/site-config.ts`)
- `herName`: Birthday person's name
- `eventTitle`: Event title
- `birthdayDate`: Target date/time (ISO format)
- `passcode`: Unlock passcode
- `revealMessage`: Main reveal message
- `revealSubmessage`: Secondary message
- `hint`: Hint text
- `music`: Music configuration
- `siteUrl`: Base URL for QR codes
- `sections`: Navigation sections
- `game`: Game configuration
- `wishCategories`: Wish categories

### Environment Variables
- `MONGODB_URI`: MongoDB connection string (optional)
- `ADMIN_TOKEN`: Admin token for video uploads
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name (optional)
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: Cloudinary upload preset (optional)

## Styling Approach

### Tailwind CSS
- Custom color tokens via CSS variables
- Responsive design with mobile-first approach
- Utility-first workflow
- Custom animations and keyframes

### Color Palette
- **Rose**: Primary romantic color (#ff6fa3, #ff9cbc, #ffd1e1)
- **Peach**: Secondary warm color (#ffc3a4, #ffe3d5)
- **Ink**: Text colors (#2b1a22, #4a2a39)
- **Glass**: Glassmorphism effects with transparency

### Animations
- Framer Motion for component animations
- CSS keyframes for continuous animations
- Respects `prefers-reduced-motion` preference

## Database Strategy

### With MongoDB
- Persistent storage for wishes and videos
- Mongoose models for schema validation
- Connection pooling via global cache

### Without MongoDB
- Falls back to sample data from `src/lib/sample-data.ts`
- Full functionality maintained
- Perfect for development and testing

## Deployment Considerations

### Build Output
- Static pages: Landing, countdown, game, wish-jar, videos
- Dynamic routes: API endpoints
- Optimized for Vercel deployment

### Environment Setup
- `.env.local` for development
- Environment variables in deployment platform
- Secrets management for admin token

### Performance
- Next.js automatic code splitting
- Image optimization ready
- CSS-in-JS with Tailwind
- Lazy loading for 3D components

## Security

### Admin Token
- Simple bearer token authentication
- Used for video upload endpoint
- Should be strong and unique
- Never commit to version control

### Input Validation
- Server-side validation for wishes and videos
- Required fields: name, message, title, url
- Category validation against allowed values

### CORS
- API routes handle same-origin requests
- Cloudinary integration ready for cross-origin uploads

## Browser Support

- Modern browsers with ES2017+ support
- CSS Grid and Flexbox
- CSS Custom Properties
- Backdrop Filter (with fallbacks)
- Web Audio API for music player

## Performance Optimizations

- Next.js automatic code splitting
- Framer Motion GPU acceleration
- CSS containment for animations
- Lazy loading for 3D scene
- Image optimization ready

## Future Enhancement Ideas

1. **Authentication**: User accounts for wish tracking
2. **Analytics**: Track page views and interactions
3. **Sharing**: Social media integration
4. **Notifications**: Email/SMS reminders
5. **Customization**: More theme options
6. **Internationalization**: Multi-language support
7. **Accessibility**: Enhanced ARIA labels
8. **PWA**: Offline support and installation

## Development Workflow

### Local Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npm start            # Start production server
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Framer Motion for animations

### Testing
- Manual testing recommended
- Test on multiple devices
- Verify countdown logic
- Check database fallback

## Maintenance

### Regular Tasks
- Update dependencies: `npm update`
- Check for security vulnerabilities: `npm audit`
- Monitor MongoDB usage
- Backup wish/video data

### Common Issues
- MongoDB connection timeouts
- Video playback issues
- Animation performance
- Mobile responsiveness

## Documentation Files

- **README.md**: Main documentation and features
- **SETUP.md**: Step-by-step setup guide
- **CLAUDE.md**: This technical documentation
- **.env.example**: Environment variable template

---

**Last Updated**: April 2026
**Version**: 1.0.0
**Status**: Production Ready
