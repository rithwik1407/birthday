# How to Add Videos & Images After Deployment 📱

After deploying to Render or Vercel, you can still add wishes, videos, and game images using the **Admin Panel**.

## Access the Admin Panel

### For Render Deployment
```
https://sweety-birthday.onrender.com/admin
```

### For Vercel Deployment
```
https://birthday-gnf7.vercel.app/admin
```

---

## 📝 Adding Wishes

1. Go to Admin Panel → **Wishes** tab
2. Fill in the form:
   - **Sender's Name**: Who is sending the wish (e.g., "Sarah", "Mom")
   - **Message**: The heartfelt message
   - **Hint**: A clue for the guessing game (e.g., "💭 The one who always supports you")
   - **Reveal Photo URL**: Photo to show after correct guess
   - **Reveal Message**: Special message with the photo
   - **Category**: Friend, Family, or Personal

3. Click **Add Wish** ✅

**Note**: No admin token needed for wishes!

---

## 🎥 Adding Videos

### Step 1: Choose Upload Method

**Option A: Cloudinary (Recommended for videos < 100MB)**
- Click "☁️ Cloudinary" button
- Click "Upload Video" button
- Select from:
  - 📱 Device (your computer)
  - 🌐 URL (paste video link)
  - 📷 Camera (record directly)
  - 🔗 Google Drive (select from Drive)

**Option B: Local Device (For videos > 100MB, up to 300MB)**
- Click "💾 Local Device (Max 300MB)" button
- Click "📤 Upload Video" button
- Select video file from your computer
- Wait for upload to complete

### Step 2: Fill Video Details

After upload completes, fill in:
- **Video Title**: Name of the video (e.g., "Sarah's Birthday Message")
- **Video URL**: Auto-filled from upload
- **Thumbnail URL**: Auto-filled from upload
- **Recorded By**: Person's name (e.g., "Sarah") - **This is what she'll guess!**
- **Hint for Guessing Game**: Clue for guessing (e.g., "💭 The one who always supports you")

### Step 3: Submit

1. Click **Add Video**
2. Enter **Admin Token** when prompted
   - Default token: `chotey` (change this in `.env` for security!)
3. Video is now added to MongoDB ✅

**Video will appear in the Video Wall section!**

---

## 🎮 Adding Game Images (Memory Match Game)

### Step 1: Prepare 8 Images

You need exactly **8 images** for the memory match game. These should be:
- Photos of people/memories
- Same size (recommended: 400x400px or larger)
- JPG or PNG format

### Step 2: Upload Images

1. Go to Admin Panel → **Game Images** tab
2. Click **Select 8 Images** button
3. Select all 8 images at once from your computer
4. Images will upload automatically
5. You'll see a preview grid showing upload progress

### Step 3: Save

1. Click **Add All Game Images**
2. Enter **Admin Token** when prompted
3. All 8 images are now saved to MongoDB ✅

**Images will appear in the Memory Match Game!**

---

## 🎬 Adding Game Completion Video

This is the special video shown after completing the memory match game.

### Step 1: Upload Video

1. Go to Admin Panel → **Game Completion** tab
2. Choose upload method:
   - **☁️ Cloudinary**: For videos < 100MB
   - **💾 Local Device**: For videos up to 300MB

### Step 2: Fill Details

- **Title**: Completion message title (e.g., "You Did It!")
- **Message**: Special message for completing the game

### Step 3: Submit

1. Click **Add Game Completion**
2. Enter **Admin Token** when prompted
3. Video is now saved ✅

**Video will play after completing the memory match game!**

---

## ⚙️ Settings

Go to Admin Panel → **Settings** tab to configure:
- **Background Image URL**: Custom background for the app
- **Background Blur**: Blur amount (0-20)

---

## 🔐 Admin Token

The admin token protects your content from unauthorized uploads.

### Current Token
```
chotey
```

### Change Token (Optional)

1. Open `.env` file in your project
2. Find: `ADMIN_TOKEN=chotey`
3. Change to: `ADMIN_TOKEN=your-new-token`
4. Push to GitHub
5. Redeploy to Render/Vercel

---

## 📊 Video Upload Limits

| Method | Max Size | Best For |
|--------|----------|----------|
| Cloudinary | 100MB | Most videos |
| Local Device | 300MB | Large videos |
| Google Drive | Unlimited | Shared videos |

---

## 🎯 Tips for Best Results

### Videos
- **Format**: MP4 (H.264 codec) for best compatibility
- **Resolution**: 1080p or higher
- **Duration**: 30 seconds to 5 minutes
- **File Size**: Keep under 100MB for Cloudinary, under 300MB for Local

### Images
- **Format**: JPG or PNG
- **Size**: 400x400px or larger
- **Count**: Exactly 8 images for game

### Wishes
- **Message**: Keep it heartfelt and personal
- **Hint**: Make it fun but not too easy
- **Photo**: Use high-quality images

---

## ❌ Troubleshooting

### "Admin token required" error
- Make sure you enter the correct admin token
- Default: `chotey`

### Video upload fails
- Check file size (< 100MB for Cloudinary, < 300MB for Local)
- Check internet connection
- Try a different upload method

### Images not showing
- Make sure all 8 images uploaded successfully
- Check image URLs are accessible
- Try uploading again

### Changes not showing on deployed site
- Wait 2-5 minutes for deployment to complete
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check MongoDB connection in Render/Vercel logs

---

## 📱 Mobile Optimization

All content added through the admin panel is automatically optimized for mobile:
- Videos load faster (6-12x improvement)
- Images are responsive
- Smooth animations on all devices

---

## 🚀 Next Steps

1. ✅ Access admin panel on your deployed site
2. ✅ Add wishes, videos, and game images
3. ✅ Test on mobile and desktop
4. ✅ Share the link with friends!

**Questions?** Check the deployment links or review the admin panel interface.

---

**Status**: ✅ Admin panel ready for content management
**Deployment**: Both Render and Vercel
**Database**: MongoDB (all data persists)
