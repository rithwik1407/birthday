# ⚡ Quick Start: Add Videos & Messages

## 🚀 Fastest Way to Add Data

### Step 1: Start the app
```bash
npm run dev
```

### Step 2: Open Admin Panel
Visit: **http://localhost:3000/admin**

### Step 3: Add Wishes (Messages)
1. Click **📝 Wishes** tab
2. Fill in:
   - **Person's Name**: e.g., "Sarah"
   - **Message**: Your heartfelt message
   - **Category**: Friend / Family / Personal
3. Click **Add Wish**
4. ✅ Done! Message saved to MongoDB

### Step 4: Add Videos
1. Click **🎥 Videos** tab
2. Fill in:
   - **Video Title**: e.g., "Sarah's Birthday Message"
   - **Video URL**: Direct link to video file (see below)
   - **Thumbnail URL**: (optional) Image preview
   - **Recorded By**: Person's name
   - **Hint**: Clue for guessing game
3. When prompted, enter your **Admin Token** from `.env`
4. Click **Add Video**
5. ✅ Done! Video saved to MongoDB

---

## 🎥 Where to Host Videos

### Option 1: Cloudinary (Easiest - Free)
1. Sign up: https://cloudinary.com/users/register/free
2. Upload video to dashboard
3. Copy video URL
4. Paste in admin panel

### Option 2: YouTube
1. Upload video (unlisted or private)
2. Right-click video → Copy video URL
3. Use that URL

### Option 3: Google Drive
1. Upload video to Google Drive
2. Right-click → Share → Get link
3. Extract file ID from URL
4. Use: `https://drive.google.com/uc?export=download&id=FILE_ID`

### Option 4: AWS S3 / Any Cloud Storage
1. Upload video
2. Get public URL
3. Use that URL

---

## 📝 Example Data to Add

### Sample Wishes:
```
Name: Sarah
Message: Happy birthday to the most amazing person! You deserve all the happiness in the world. Can't wait to celebrate with you! 💕
Category: Friend

---

Name: Mom
Message: My beautiful daughter, watching you grow has been the greatest joy of my life. Wishing you a day as special as you are! 🎂
Category: Family

---

Name: Best Friend
Message: To my partner in crime - here's to more adventures, laughter, and unforgettable memories together! 🎉
Category: Friend
```

### Sample Videos:
```
Title: Sarah's Message
URL: https://your-video-url.com/sarah-video.mp4
Recorded By: Sarah
Hint: 💭 The one who always supports you

---

Title: Mom's Birthday Wish
URL: https://your-video-url.com/mom-video.mp4
Recorded By: Mom
Hint: 🎂 Someone who never misses your birthday

---

Title: Best Friend's Surprise
URL: https://your-video-url.com/bestfriend-video.mp4
Recorded By: Best Friend
Hint: 📱 Your late-night chat partner
```

---

## 🔐 Admin Token Setup

1. Open `.env` file
2. Find: `ADMIN_TOKEN=your-secret-admin-token-here`
3. Change to something secure: `ADMIN_TOKEN=my-super-secret-token-12345`
4. Save file
5. Use this token when adding videos in admin panel

---

## ✅ Verify Data is Saved

### Check Wishes:
Visit: http://localhost:3000/api/wishes
Should show JSON array of wishes

### Check Videos:
Visit: http://localhost:3000/api/videos
Should show JSON array of videos

### View in App:
- **Wishes**: http://localhost:3000/wish-jar
- **Videos**: http://localhost:3000/videos

---

## 🎮 How Users Interact

### Wish Jar:
1. Click "Open a Wish" button
2. Random wish card opens
3. Read the message
4. After opening all wishes, special wish unlocks

### Video Wall:
1. See locked video cards with hints
2. Guess who recorded the video
3. If correct → video unlocks and plays
4. After watching all videos, special video unlocks

---

## 📊 MongoDB Data Check

### Using MongoDB Compass:
1. Download: https://www.mongodb.com/products/compass
2. Connect with URI from `.env`
3. Navigate to: `bday` → `wishes` or `bday` → `videos`
4. See all your data

---

## 🆘 Troubleshooting

**Q: Admin panel not loading?**
- Make sure app is running: `npm run dev`
- Visit: http://localhost:3000/admin

**Q: Video not playing?**
- Check video URL is accessible
- Try opening URL directly in browser
- Ensure video format is supported (MP4, WebM)

**Q: Data not saving?**
- Check MongoDB connection in `.env`
- Verify database name is `bday`
- Check browser console for errors

**Q: Admin token error?**
- Make sure token matches in `.env`
- Don't include "Bearer " prefix when entering token

---

## 🎉 You're All Set!

Your birthday surprise app is ready to go! 🎊

**Next Steps:**
1. ✅ Add 5-10 wishes
2. ✅ Add 5-10 videos
3. ✅ Test at http://localhost:3000
4. ✅ Deploy when ready!

