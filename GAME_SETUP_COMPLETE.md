# Memory Match Game - Complete Setup Guide

## Overview
The memory match game now supports:
1. **8 Custom Images** - Upload your own images for game cards
2. **Completion Video** - Play a video after winning the game
3. **Custom Title & Message** - Personalized completion screen

---

## Part 1: Upload 8 Game Images

### Step 1: Go to Admin Panel
- Navigate to `/admin`
- Click the **"🎮 Game Images"** tab

### Step 2: Prepare Your 8 Images
You have two options:

**Option A: Upload to Cloudinary First**
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Upload all 8 images
3. Copy the URL for each image

**Option B: Use Local Images**
1. Upload images to any image hosting service (Imgur, Cloudinary, etc.)
2. Get the direct image URLs

### Step 3: Add Images to Admin Panel
1. In the **"🎮 Game Images"** tab, you'll see 8 slots
2. For each slot (Image 1-8):
   - Paste the image URL in the text field
   - The preview will show below
3. Fill all 8 slots with your images

### Step 4: Submit
- Click **"Add All 8 Game Images"**
- Enter your admin token: `chotey`
- Images will be saved to MongoDB

### Result
- Game cards will now display your 8 images
- Each image appears twice (16 cards total)
- Images are shuffled each game

---

## Part 2: Upload Game Completion Video

### Step 1: Go to Admin Panel
- Navigate to `/admin`
- Click the **"🎬 Game Completion"** tab

### Step 2: Upload Video
Choose your upload method:

**Option A: Cloudinary**
1. Click **"☁️ Cloudinary"** button
2. Click **"Upload Video from Cloudinary"**
3. Select your video file
4. Video URL will auto-fill

**Option B: Google Drive**
1. Click **"🔗 Google Drive"** button
2. Upload video to Google Drive
3. Right-click → Share → "Anyone with link"
4. Copy the link
5. Paste in the text field
6. Click **"Add Google Drive Video"**

### Step 3: Fill in Details
- **Title**: Heading shown after winning (e.g., "You Did It!", "Congratulations!")
- **Message**: Text below the video (e.g., "I'm so proud of you!", "You're amazing!")

### Step 4: Submit
- Click **"Add Game Completion"**
- Enter admin token: `chotey`
- Video will be saved to MongoDB

### Result
After winning the game:
1. Shows "You Won!" message
2. Displays video thumbnail with play button
3. Shows your custom title and message
4. Click play button to watch the video

---

## How the Game Works

### Playing the Game
1. Go to `/game`
2. See 4x4 grid (16 cards)
3. Click cards to flip and find matching pairs
4. Shows moves counter and progress %
5. Win when all pairs are matched

### After Winning
1. Confetti animation 🎉
2. "You Won!" message
3. Video thumbnail with play button
4. Your custom title and message
5. Click play to watch the video
6. "Play Again" button to restart

---

## File Locations

### Game Component
- **File**: `src/components/sections/game-section.tsx`
- **Fetches from**: `/api/game-images` and `/api/game-completion`

### API Endpoints
- **Game Images**: `src/app/api/game-images/route.ts`
  - GET: Fetch 8 images
  - POST: Save 8 images (requires admin token)

- **Game Completion**: `src/app/api/game-completion/route.ts`
  - GET: Fetch completion video and message
  - POST: Save completion (requires admin token)

### Database Models
- **Game Images**: `src/lib/models/GameImage.ts`
  - Stores: imageUrl, order (0-7), isActive

- **Game Completion**: `src/lib/models/GameCompletion.ts`
  - Stores: title, message, videoUrl, thumbnail, isActive

### Admin Panel
- **File**: `src/app/admin/page.tsx`
- **Tabs**: 
  - 📝 Wishes
  - 🎥 Videos
  - 🎮 Game Images (NEW)
  - 🎬 Game Completion (UPDATED)

---

## Image Format Requirements

### Recommended Specifications
- **Format**: JPG, PNG, WebP
- **Size**: 200x200px to 500x500px
- **Aspect Ratio**: Square (1:1) works best
- **File Size**: Under 5MB each

### Image URL Requirements
- Must be a direct image URL (ends with .jpg, .png, etc.)
- Must be publicly accessible
- HTTPS recommended for security

---

## Video Format Requirements

### Supported Formats
- **Video**: MP4, WebM, OGG
- **Max Size**: 100MB
- **Duration**: Any length
- **Aspect Ratio**: 16:9 recommended

### Video URL Requirements
- Must be a direct video URL
- Must be publicly accessible
- HTTPS required

---

## Troubleshooting

### Images not showing in game
- Check that all 8 image URLs are valid
- Verify images are publicly accessible
- Try uploading to Cloudinary first
- Check browser console for errors

### Video not playing after winning
- Ensure video URL is correct
- Check that video is publicly accessible
- Try different video format (MP4 usually works best)
- For Google Drive: Make sure sharing is set to "Anyone with link"

### Admin panel not saving
- Verify admin token is correct (default: `chotey`)
- Check MongoDB connection in `.env`
- Ensure all required fields are filled
- Check browser console for error messages

### Images/Video not updating
- MongoDB might be caching old data
- Try refreshing the page
- Clear browser cache
- Check that `isActive` flag is set to true in database

---

## Default Behavior

If no custom images are set:
- Game uses default emojis: 🌹 💕 ✨ 🎀 💐 🌸 💖 🎁

If no completion video is set:
- Shows: "Congratulations! You completed the memory match game! 🎉"
- No video plays

---

## Admin Token

Default admin token: `chotey`

To change it, edit `.env`:
```
ADMIN_TOKEN=your-new-token
```

---

## Next Steps

1. **Prepare 8 Images**
   - Take/find 8 images you want to use
   - Upload to Cloudinary or image hosting service
   - Get direct URLs for each

2. **Prepare Completion Video**
   - Record or find a video
   - Upload to Cloudinary or Google Drive
   - Get the video URL

3. **Go to Admin Panel** (`/admin`)
   - Add 8 game images
   - Add completion video with title and message

4. **Test the Game** (`/game`)
   - Play and win
   - See your custom images and video

---

## Tips & Tricks

### For Best Results
- Use high-quality images
- Keep images consistent in style
- Use clear, readable titles and messages
- Test video playback before uploading
- Keep video file size reasonable for fast loading

### Customization Ideas
- Use photos of people for a personal touch
- Use themed images (hearts, flowers, etc.)
- Create a custom video message
- Add music to the completion video
- Use emojis in title/message for fun

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all URLs are correct and accessible
3. Check browser console for error messages
4. Ensure MongoDB is connected
5. Verify admin token is correct
