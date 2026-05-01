# Memory Match Game - Completion Setup Guide

## Overview
The memory match game now uses 8 custom images and displays a completion picture with a message when the player wins.

## How to Upload Game Completion Image & Message

### Step 1: Go to Admin Panel
- Navigate to `/admin`
- You'll see three tabs: **Wishes**, **Videos**, and **🎮 Game Completion**

### Step 2: Click "Game Completion" Tab
- This is where you upload the image and message shown after winning the game

### Step 3: Upload Completion Image
- Click **"Upload Video from Cloudinary"** button
- Select your image file (JPG, PNG, etc.)
- The image URL will be auto-filled
- You can also use Google Drive by switching the upload method

### Step 4: Fill in Details
- **Title**: The heading shown after winning (e.g., "You Did It!", "Congratulations!")
- **Message**: The message displayed below the image (e.g., "I'm so proud of you!", "You're amazing!")

### Step 5: Submit
- Click **"Add Game Completion"**
- Enter your admin token (from .env file)
- The image and message will be saved to MongoDB

## Game Images (8 Emojis)
The memory match game uses these 8 images:
1. 🌹 Rose
2. 💕 Hearts
3. ✨ Sparkles
4. 🎀 Ribbon
5. 💐 Bouquet
6. 🌸 Flower
7. 💖 Love Heart
8. 🎁 Gift

Each image appears twice (16 cards total in a 4x4 grid).

## How the Game Works

### Before Winning
- Player sees a 4x4 grid of cards with "?" on them
- Each card has one of the 8 images
- Player flips cards to find matching pairs
- Shows moves counter and progress percentage

### After Winning
- Confetti animation plays
- Shows "You Won!" message
- Displays the completion image you uploaded
- Shows the title and message you added
- Player can click "Play Again" to restart

## File Locations

### Game Component
- **File**: `src/components/sections/game-section.tsx`
- **Images Array**: `GAME_IMAGES` (line ~25)
- **Fetches from**: `/api/game-completion`

### API Endpoint
- **File**: `src/app/api/game-completion/route.ts`
- **Methods**: GET (fetch), POST (create)
- **Requires**: Admin token for POST requests

### Database Model
- **File**: `src/lib/models/GameCompletion.ts`
- **Fields**: title, message, imageUrl, isActive

### Admin Panel
- **File**: `src/app/admin/page.tsx`
- **Tab**: "🎮 Game Completion"

## Customizing Game Images

To change the 8 game images, edit `src/components/sections/game-section.tsx`:

```typescript
const GAME_IMAGES = [
  "🌹",  // Change these emojis
  "💕",
  "✨",
  "🎀",
  "💐",
  "🌸",
  "💖",
  "🎁",
];
```

Or use image URLs instead of emojis:
```typescript
const GAME_IMAGES = [
  "https://example.com/image1.png",
  "https://example.com/image2.png",
  // ... etc
];
```

## Troubleshooting

### Image not showing after upload
- Make sure the image URL is accessible
- Check that Cloudinary credentials are correct in `.env`
- Verify the image format is supported (JPG, PNG, WebP)

### Message not appearing
- Ensure you entered both title and message
- Check that admin token is correct
- Verify MongoDB connection is working

### Game not loading
- Check browser console for errors
- Verify `/api/game-completion` endpoint is accessible
- Make sure the game component is properly imported

## Default Behavior

If no completion image/message is set:
- Title: "Congratulations!"
- Message: "You completed the memory match game! 🎉"
- Image: None (just shows the text)

## Next Steps

1. Prepare your completion image (recommended: 400x400px or larger)
2. Go to `/admin` → "Game Completion" tab
3. Upload the image
4. Add title and message
5. Submit with admin token
6. Test by playing the game and winning!
