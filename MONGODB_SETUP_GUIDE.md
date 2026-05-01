# 🎬 MongoDB Setup & Data Management Guide

## ✅ MongoDB Connection Status

Your MongoDB is **already configured** in `.env`:
```
MONGODB_URI=mongodb+srv://akularithwik1407_db_user:rithwikakula@bday.9ard0a1.mongodb.net/
```

**Database Name**: `bday` (auto-created)
**Collections**: 
- `videos` - for video messages
- `wishes` - for wish jar messages

---

## 📝 Step 1: Add Wishes (Messages) to MongoDB

### Option A: Using API (Recommended)

**Add a single wish:**
```bash
curl -X POST http://localhost:3000/api/wishes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Friend Name",
    "message": "Your heartfelt message here",
    "category": "friend"
  }'
```

**Categories available:**
- `friend` - Friend's message
- `family` - Family member's message
- `you` - Your personal message

**Example wishes to add:**
```json
{
  "name": "Sarah",
  "message": "Happy birthday to the most amazing person! You deserve all the happiness in the world. Can't wait to celebrate with you! 💕",
  "category": "friend"
}

{
  "name": "Mom",
  "message": "My beautiful daughter, watching you grow has been the greatest joy of my life. Wishing you a day as special as you are! 🎂",
  "category": "family"
}

{
  "name": "Best Friend",
  "message": "To my partner in crime - here's to more adventures, laughter, and unforgettable memories together! 🎉",
  "category": "friend"
}
```

### Option B: Using MongoDB Compass (GUI)

1. **Download MongoDB Compass**: https://www.mongodb.com/products/compass
2. **Connect with your URI**: `mongodb+srv://akularithwik1407_db_user:rithwikakula@bday.9ard0a1.mongodb.net/`
3. **Navigate to**: `bday` → `wishes`
4. **Click "Insert Document"** and paste:
```json
{
  "name": "Friend Name",
  "message": "Your message",
  "category": "friend",
  "isSpecial": false,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

---

## 🎥 Step 2: Add Videos to MongoDB

### Prerequisites:
1. **Host your videos** on:
   - YouTube (get shareable link)
   - Cloudinary (free tier available)
   - AWS S3
   - Any video hosting service with direct URL

2. **Get video URL** (must be direct link to video file or embed URL)

### Option A: Using API with Admin Token

**Update your admin token in `.env`:**
```
ADMIN_TOKEN=your-secret-admin-token-here
```

**Add a video:**
```bash
curl -X POST http://localhost:3000/api/videos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret-admin-token-here" \
  -d '{
    "title": "Friend Name",
    "url": "https://your-video-url.com/video.mp4",
    "thumbnail": "https://your-image-url.com/thumbnail.jpg",
    "recordedBy": "Friend Name",
    "hint": "💭 The one who always supports you"
  }'
```

### Option B: Using MongoDB Compass

1. **Navigate to**: `bday` → `videos`
2. **Click "Insert Document"** and paste:
```json
{
  "title": "Friend Name's Message",
  "url": "https://your-video-url.com/video.mp4",
  "thumbnail": "https://your-image-url.com/thumbnail.jpg",
  "recordedBy": "Friend Name",
  "hint": "💭 The one who always supports you",
  "isSpecial": false,
  "createdAt": new Date(),
  "updatedAt": new Date()
}
```

---

## 🎬 Step 3: Upload Videos to Cloudinary (Free)

### Setup Cloudinary:

1. **Sign up**: https://cloudinary.com/users/register/free
2. **Get your credentials** from Dashboard:
   - Cloud Name
   - Upload Preset (create one)

3. **Update `.env`:**
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
```

4. **Upload video** using Cloudinary's web interface or API
5. **Copy the video URL** and use in Step 2

---

## 📊 Video & Wish Schema

### Wish Schema:
```typescript
{
  _id: ObjectId,
  name: string,           // Person's name
  message: string,        // The wish message
  category: "friend" | "family" | "you",
  isSpecial: boolean,     // Unlock after opening others
  createdAt: Date,
  updatedAt: Date
}
```

### Video Schema:
```typescript
{
  _id: ObjectId,
  title: string,          // Video title
  url: string,            // Direct video URL
  thumbnail: string,      // Thumbnail image URL
  recordedBy: string,     // Person who recorded it
  hint: string,           // Hint for guessing game
  isSpecial: boolean,     // Unlock after watching others
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Security Notes

1. **Admin Token**: Change `ADMIN_TOKEN` in `.env` to something secure
2. **Only POST to `/api/videos` requires token**
3. **POST to `/api/wishes` is public** (anyone can add wishes)
4. **MongoDB credentials are secure** (server-side only)

---

## 🧪 Testing Your Setup

### Check if MongoDB is connected:
```bash
npm run dev
# Visit http://localhost:3000/api/wishes
# Should return wishes from MongoDB or sample data
```

### Add a test wish:
```bash
curl -X POST http://localhost:3000/api/wishes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "message": "This is a test message",
    "category": "friend"
  }'
```

### Verify in MongoDB Compass:
1. Open MongoDB Compass
2. Connect to your URI
3. Navigate to `bday` → `wishes`
4. You should see your test wish

---

## 📱 Frontend Display

### Wishes appear in:
- **Wish Jar Section** (`/wish-jar`)
- Shows all wishes with random reveal
- Special wish unlocks after opening all others

### Videos appear in:
- **Video Wall Section** (`/videos`)
- Guess-the-person game
- Locked until correct guess
- Special video unlocks after watching all others

---

## 🚀 Next Steps

1. ✅ Verify MongoDB connection
2. 📝 Add 5-10 wishes from friends/family
3. 🎥 Record/upload 5-10 videos
4. 🎮 Test the app at http://localhost:3000
5. 🎉 Deploy when ready!

---

## ❓ Troubleshooting

**Q: Videos not showing?**
- Check video URL is accessible
- Verify CORS headers if hosting on different domain
- Try direct MP4 URL instead of embed

**Q: Wishes not saving?**
- Check MongoDB connection in `.env`
- Verify database name is `bday`
- Check browser console for errors

**Q: Getting 401 on video POST?**
- Verify `ADMIN_TOKEN` matches in `.env`
- Use correct format: `Authorization: Bearer token`

**Q: MongoDB connection failing?**
- Check internet connection
- Verify URI in `.env` is correct
- Check MongoDB Atlas IP whitelist (allow all IPs)

