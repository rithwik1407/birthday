# ⚡ Quick Start Guide

Get your birthday surprise app running in 5 minutes!

## 🚀 Installation (2 minutes)

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` 🎉

## ⚙️ Customize (2 minutes)

Edit `src/lib/site-config.ts`:

```typescript
export const siteConfig = {
  herName: "Sweety",                    // ← Change name
  birthdayDate: "2026-05-03T00:00:00",  // ← Set birthday
  passcode: "chotey",                   // ← Set passcode
  revealMessage: "Hey Sweety... its finally your day <3",
  // ... more config
};
```

## 🎵 Add Music (Optional)

```typescript
music: {
  title: "Our Song",
  url: "https://your-music-url.mp3",  // ← Add music URL
}
```

## 🗄️ Add Database (Optional)

1. Create MongoDB Atlas account
2. Get connection string
3. Add to `.env.local`:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
```

## 📱 Test on Mobile

```bash
# Get your IP
ipconfig  # Windows

# Visit from mobile on same network
http://YOUR_IP:3000
```

## 🚀 Deploy

### Vercel (Easiest)
1. Push to GitHub
2. Go to vercel.com
3. Import repository
4. Add environment variables
5. Deploy!

### Other Platforms
```bash
npm run build
npm start
```

## 📚 Full Guides

- **Setup**: See `SETUP.md` for detailed instructions
- **Features**: See `README.md` for complete documentation
- **Technical**: See `CLAUDE.md` for architecture details

## 🎯 Key Files to Customize

| File | Purpose |
|------|---------|
| `src/lib/site-config.ts` | All text, dates, settings |
| `src/lib/sample-data.ts` | Default wishes and videos |
| `src/app/globals.css` | Colors and styling |
| `.env.local` | Database and secrets |

## 🎮 Features Overview

| Feature | Location | Status |
|---------|----------|--------|
| Countdown | `/countdown` | ✅ Ready |
| Game | `/game` | ✅ Ready |
| Wish Jar | `/wish-jar` | ✅ Ready |
| Videos | `/videos` | ✅ Ready |

## 💡 Pro Tips

1. **Test Countdown**: Set birthday date to tomorrow to test
2. **Try Passcode**: Default is "chotey"
3. **Add Content**: Edit sample-data.ts before deploying
4. **Mobile First**: Always test on phone
5. **Backup**: Export wishes before major changes

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

### Build Fails
```bash
# Clear cache
rm -rf node_modules .next
npm install
npm run build
```

### Database Issues
- Check MongoDB URI in `.env.local`
- Verify IP whitelist in MongoDB Atlas
- App works fine without database!

## 📞 Need Help?

1. Check `SETUP.md` for detailed guide
2. Check `README.md` for features
3. Check `CLAUDE.md` for technical details

## ✅ Checklist

- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env.local`
- [ ] Edit `site-config.ts` with your info
- [ ] Run `npm run dev`
- [ ] Test on `http://localhost:3000`
- [ ] Test on mobile
- [ ] Deploy to production
- [ ] Share with friends/family!

## 🎉 You're Ready!

Your birthday surprise app is ready to go. Customize it, test it, and enjoy! 💕

---

**Questions?** See the full documentation in README.md and SETUP.md
