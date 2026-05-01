# Local Upload Feature - Complete Guide

## Overview
You can now upload files directly from your local device for:
1. **8 Game Images** - Memory match game cards
2. **Completion Video** - Video shown after winning the game

No need to upload to Cloudinary or Google Drive first - just select files from your device!

---

## How to Upload 8 Game Images from Local Device

### Step 1: Go to Admin Panel
- Navigate to `/admin`
- Click the **"🎮 Game Images"** tab

### Step 2: Select Upload Method
- Click **"💾 Local Device"** button
- This will show local file upload options for each image slot

### Step 3: Upload Each Image
For each of the 8 image slots:
1. Click **"Upload Image 1"** button
2. Select an image file from your device
3. The image will automatically upload to Cloudinary
4. The preview will show below
5. Repeat for all 8 images

### Step 4: Submit
- Once all 8 images are uploaded, click **"Add All 8 Game Images"**
- Enter your admin token: `chotey`
- Images will be saved to MongoDB

### Supported Image Formats
- JPG, PNG, WebP
- Max 5MB per image
- Recommended: 200x200px to 500x500px
- Square aspect ratio (1:1) works best

---

## How to Upload Completion Video from Local Device

### Step 1: Go to Admin Panel
- Navigate to `/admin`
- Click the **"🎬 Game Completion"** tab

### Step 2: Select Upload Method
- Click **"💾 Local Device"** button
- This will show local file upload option

### Step 3: Upload Video
1. Click **"Upload Completion Video"** button
2. Select a video file from your device
3. The video will automatically upload to Cloudinary
4. The preview will show below

### Step 4: Fill in Details
- **Title**: Heading shown after winning (e.g., "You Did It!")
- **Message**: Text below the video (e.g., "I'm so proud of you!")

### Step 5: Submit
- Click **"Add Game Completion"**
- Enter admin token: `chotey`
- Video will be saved to MongoDB

### Supported Video Formats
- MP4, WebM, OGG
- Max 100MB
- 16:9 aspect ratio recommended
- Any duration

---

## How It Works Behind the Scenes

### Local Upload Process
1. You select a file from your device
2. File is converted to base64 format
3. Sent to Cloudinary for hosting
4. Cloudinary returns a secure URL
5. URL is saved to MongoDB
6. Game displays the hosted file

### Why Use Cloudinary?
- Files are hosted on a reliable CDN
- Fast loading speeds worldwide
- Automatic optimization
- No storage limits on your device
- Files persist even if you delete local copies

---

## Upload Methods Comparison

| Method | Pros | Cons |
|--------|------|------|
| **Local Device** | Easy, no setup needed | Requires Cloudinary account |
| **Cloudinary** | Direct upload, full control | Extra step to get URL |
| **Google Drive** | Free, easy sharing | Slower loading, CORS issues |

---

## Making Changes

### Update Game Images
1. Go to `/admin` → "🎮 Game Images"
2. Select upload method (Local, Cloudinary, or Google Drive)
3. Upload new images
4. Click "Add All 8 Game Images"
5. Old images will be replaced

### Update Completion Video
1. Go to `/admin` → "🎬 Game Completion"
2. Select upload method (Local, Cloudinary, or Google Drive)
3. Upload new video
4. Fill in title and message
5. Click "Add Game Completion"
6. Old video will be replaced

---

## Troubleshooting

### File Upload Fails
- Check file size (images: max 5MB, videos: max 100MB)
- Verify file format is supported
- Check internet connection
- Ensure Cloudinary credentials are correct in `.env`

### File Uploads But Doesn't Show
- Refresh the page
- Check browser console for errors
- Verify MongoDB connection
- Try uploading again

### Upload Takes Too Long
- Large files take longer to upload
- Check internet speed
- Try a smaller file first
- Compress video/image before uploading

### Can't See Upload Button
- Make sure you're logged in as admin
- Check that you're on the correct tab
- Refresh the page
- Clear browser cache

---

## Tips for Best Results

### For Game Images
- Use consistent style across all 8 images
- Keep images clear and recognizable
- Use high-quality originals
- Test on mobile to ensure visibility
- Consider using themed images (hearts, flowers, etc.)

### For Completion Video
- Keep video under 30 seconds for fast loading
- Use clear audio and video quality
- Add music or voiceover for impact
- Test playback before uploading
- Consider adding text overlays

---

## File Size Guidelines

### Recommended Sizes
- **Game Images**: 200-500KB each
- **Completion Video**: 10-50MB

### How to Reduce File Size
- **Images**: Use online compressors (TinyPNG, ImageOptim)
- **Videos**: Use video editors (HandBrake, FFmpeg)
- **Format**: Convert to WebP for images, MP4 for videos

---

## Security Notes

- Files are uploaded to Cloudinary (secure CDN)
- URLs are stored in MongoDB
- Admin token required for uploads
- Files are publicly accessible (by design)
- No sensitive data should be uploaded

---

## Next Steps

1. **Prepare your files**
   - Gather 8 images for game cards
   - Record or find completion video

2. **Go to Admin Panel** (`/admin`)
   - Upload 8 game images
   - Upload completion video

3. **Test the Game** (`/game`)
   - Play and win
   - See your custom images and video

4. **Make Changes Anytime**
   - Go back to admin panel
   - Upload new files
   - Changes take effect immediately

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all files meet size/format requirements
3. Check browser console for error messages
4. Ensure admin token is correct
5. Try a different file or upload method
