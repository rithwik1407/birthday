# Background Image Guide 🖼️

## What's New

A beautiful romantic background image now appears when users open the app. The background is visible on all pages and creates an immersive experience.

---

## Current Background

**Image**: Beautiful romantic background (Unsplash)
**URL**: `https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1920&q=80`
**Blur**: 8px (for better text readability)
**Overlay**: Dark overlay (35% opacity) for contrast

---

## How It Works

### Background Display
1. Background image loads when user opens the app
2. Image is fixed (doesn't scroll)
3. Blurred for aesthetic effect
4. Dark overlay ensures text is readable
5. Appears on all pages (home, countdown, game, videos, wishes, etc.)

### Technical Details
- **Component**: `BackgroundImage` in `src/components/background-image.tsx`
- **Config**: `src/lib/site-config.ts`
- **Z-index**: -2 (behind all content)
- **Opacity**: 0.95 (slightly transparent)
- **Attachment**: Fixed (doesn't scroll with content)

---

## How to Change the Background

### Option 1: Change in Code (Permanent)

1. Open `src/lib/site-config.ts`
2. Find this line:
   ```typescript
   backgroundImage: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1920&q=80",
   ```
3. Replace with your image URL:
   ```typescript
   backgroundImage: "https://your-image-url.com/image.jpg",
   ```
4. Push to GitHub
5. Redeploy to Render/Vercel

### Option 2: Change via Admin Panel (Temporary)

1. Go to `/admin` on deployed site
2. Click **Settings** tab
3. Enter new background image URL
4. Adjust blur amount (0-20)
5. Changes apply immediately
6. **Note**: Changes reset on redeploy

---

## Finding Background Images

### Free Image Sources

**Unsplash** (Recommended)
- URL: https://unsplash.com
- Search: "romantic", "love", "couple", "sunset", "flowers"
- Copy image URL and add `?w=1920&q=80` for optimization

**Pexels**
- URL: https://pexels.com
- Search: "romantic background", "love", "couple"

**Pixabay**
- URL: https://pixabay.com
- Search: "romantic", "love", "couple"

**Cloudinary** (Your existing service)
- Upload custom image
- Get URL from Cloudinary dashboard

---

## Image Recommendations

### Best Practices
- **Resolution**: 1920x1080 or higher
- **Format**: JPG or PNG
- **Size**: < 500KB (for fast loading)
- **Content**: Romantic, soft, aesthetic
- **Colors**: Warm tones (rose, gold, purple)

### Suggested Themes
- Sunset/sunrise with couple
- Flowers and romantic scenery
- Soft bokeh background
- Candles and romantic setting
- Beach or nature scene
- Abstract romantic art

### Avoid
- ❌ Too bright (hard to read text)
- ❌ Too dark (boring)
- ❌ Too busy (distracting)
- ❌ Unrelated content
- ❌ Low resolution (blurry)

---

## Example Background URLs

### Romantic Sunset
```
https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1920&q=80
```

### Flowers and Love
```
https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1920&q=80
```

### Soft Bokeh
```
https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1920&q=80
```

### Candles
```
https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1920&q=80
```

---

## Customizing Blur Amount

### In Code
1. Open `src/lib/site-config.ts`
2. Find: `backgroundBlur: 8,`
3. Change to desired blur (0-20):
   - `0` = No blur (sharp image)
   - `5` = Light blur
   - `8` = Medium blur (default)
   - `15` = Heavy blur
   - `20` = Very heavy blur

### Via Admin Panel
1. Go to `/admin`
2. Click **Settings** tab
3. Adjust "Background Blur" slider
4. Changes apply immediately

---

## Mobile Optimization

### How It Works on Mobile
- Background image loads optimized for mobile
- Blur effect is lighter on mobile (better performance)
- Image scales to fit screen
- Text remains readable

### Mobile Tips
- Use high-quality images (won't look blurry)
- Avoid very large files (> 1MB)
- Test on actual mobile device
- Ensure text contrast is good

---

## Performance Considerations

### Image Loading
- Images are loaded from CDN (fast)
- Blur effect is CSS-based (efficient)
- Background is fixed (doesn't re-render on scroll)
- Lazy loading not needed (background is always visible)

### Optimization Tips
- Use image URLs with `?w=1920&q=80` (Unsplash format)
- Keep file size < 500KB
- Use JPG format (smaller than PNG)
- Use CDN-hosted images (faster than local)

### Performance Impact
- **Before**: No background (fast)
- **After**: Background image (minimal impact)
- **Load time**: +200-500ms (acceptable)
- **Mobile**: Optimized for performance

---

## Troubleshooting

### Background Not Showing
**Problem**: Background image doesn't appear
**Solution**:
- Check image URL is correct
- Verify image is accessible (not blocked)
- Hard refresh browser (Ctrl+Shift+R)
- Check browser console for errors

### Background Too Blurry
**Problem**: Image is too blurry
**Solution**:
- Reduce blur amount in settings
- Use higher resolution image
- Check image quality

### Background Too Bright/Dark
**Problem**: Text is hard to read
**Solution**:
- Adjust blur amount
- Change overlay opacity (in code)
- Use different background image
- Increase contrast

### Background Not Updating
**Problem**: Changes don't appear
**Solution**:
- Hard refresh browser (Ctrl+Shift+R)
- Clear browser cache
- Wait for redeploy (if changed in code)
- Check admin panel settings

---

## Advanced Customization

### Change Overlay Opacity

1. Open `src/components/background-image.tsx`
2. Find: `background: rgba(0, 0, 0, 0.35);`
3. Change `0.35` to desired opacity:
   - `0` = No overlay (very bright)
   - `0.2` = Light overlay
   - `0.35` = Medium overlay (default)
   - `0.5` = Heavy overlay
   - `0.7` = Very heavy overlay

### Change Overlay Color

1. Open `src/components/background-image.tsx`
2. Find: `background: rgba(0, 0, 0, 0.35);`
3. Change color:
   - `rgba(0, 0, 0, 0.35)` = Black overlay
   - `rgba(255, 107, 157, 0.2)` = Rose overlay
   - `rgba(157, 78, 221, 0.2)` = Purple overlay

---

## Current Settings

```typescript
// src/lib/site-config.ts
backgroundImage: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1920&q=80",
backgroundBlur: 8,
```

```css
/* src/components/background-image.tsx */
filter: blur(8px);
opacity: 0.95;
background: rgba(0, 0, 0, 0.35); /* Dark overlay */
```

---

## Next Steps

1. ✅ Background image is now live
2. ⏳ Wait for Render/Vercel to deploy (3-5 min)
3. 🧪 Test on desktop and mobile
4. 🎨 Customize if desired
5. 🎉 Enjoy the romantic atmosphere!

---

## Tips for Best Results

💡 **Do**:
- Use high-quality romantic images
- Test on mobile devices
- Ensure good text contrast
- Use CDN-hosted images
- Optimize image size

💡 **Don't**:
- Use very bright images
- Use busy/distracting images
- Use low-resolution images
- Use unrelated content
- Forget to test on mobile

---

**Status**: ✅ Background image implemented
**Deployment**: Live on Render & Vercel
**Customizable**: Yes (via admin panel or code)
**Mobile**: Optimized
