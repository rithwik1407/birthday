# Video Wall Refresh Button Guide 🔄

## Location

The refresh button appears in the **Video Wall** section at the top, next to the progress percentage.

```
┌─────────────────────────────────────────────────────────┐
│                    Video Wall                           │
│              Guess who recorded each message 🎬         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  3 / 7 memories unlocked 💖    [75%]  [🔄 Refresh]    │
│                                                         │
│  ████████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [Video 1]  [Video 2]  [Video 3]                       │
│  [Video 4]  [Video 5]  [Video 6]                       │
│  [Video 7]  [Special]                                  │
└─────────────────────────────────────────────────────────┘
```

## When Does It Appear?

✅ **Shows when**: At least 1 video has been guessed correctly
❌ **Hidden when**: No videos have been guessed yet

## What It Does

### Before Clicking
- All guessed videos show as "Watched" with green badge
- Videos are unlocked and playable
- Progress shows completed guesses

### After Clicking

1. **Confirmation Dialog**
   ```
   "Reset all videos to locked state? You'll need to guess again."
   [Cancel]  [Confirm]
   ```

2. **If You Confirm**
   - All videos lock again 🔒
   - Guesses are cleared
   - Progress resets to 0%
   - Videos ask to guess again
   - Emoji changes from 📭 (opened) back to 💌 (unopened)

3. **If You Cancel**
   - Nothing changes
   - Videos stay as they are

## Example Workflow

### Step 1: Initial State
```
0 / 7 memories unlocked 💖    [0%]
(No refresh button - nothing to refresh)
```

### Step 2: After Guessing 3 Videos
```
3 / 7 memories unlocked 💖    [43%]  [🔄 Refresh]
(Refresh button appears!)
```

### Step 3: Click Refresh
```
Confirmation: "Reset all videos to locked state? You'll need to guess again."
```

### Step 4: After Confirming
```
0 / 7 memories unlocked 💖    [0%]
(Back to initial state - all videos locked!)
```

## Mobile Experience

On mobile devices:
- Refresh button is smaller but still visible
- Same functionality as desktop
- Responsive design adapts to screen size

```
Mobile View:
┌──────────────────────────────┐
│  3/7 💖  [43%]  [🔄]        │
│  ████████░░░░░░░░░░░░░░░░░  │
└──────────────────────────────┘
```

## Comparison with Wish Jar

### Wish Jar Refresh
- **Location**: Top-right corner (fixed position)
- **Function**: Resets all wishes to unopened
- **Emoji**: 💌 → 📭 → 💌

### Video Wall Refresh
- **Location**: Top-right of progress section
- **Function**: Resets all videos to locked
- **Emoji**: 🎬 → 🔒 → 🎬

---

## Technical Details

### What Gets Reset
- ✅ All `guessedBy` fields cleared in MongoDB
- ✅ Local state cleared (watchedVideos, guesses)
- ✅ Progress counter reset to 0%
- ✅ All videos return to locked state

### What Stays the Same
- ✅ Video URLs and content
- ✅ Video titles and hints
- ✅ Game completion video
- ✅ Special video unlock requirement

### API Call
```javascript
PATCH /api/videos/[id]
{
  "guessedBy": null
}
```

---

## Troubleshooting

### Refresh Button Not Showing
- **Reason**: No videos have been guessed yet
- **Solution**: Guess at least 1 video first

### Refresh Button Not Working
- **Reason**: Network error or MongoDB connection issue
- **Solution**: 
  - Check internet connection
  - Verify MongoDB is running
  - Try again in a few seconds

### Videos Still Locked After Refresh
- **Reason**: Page not refreshed
- **Solution**: 
  - Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
  - Wait 2-3 seconds for state to update

---

## Tips

💡 **Use refresh to**:
- Play the guessing game again
- Test the game with friends
- Reset progress if you want to start over
- Practice guessing different videos

💡 **Don't worry about**:
- Losing data - videos are safe in MongoDB
- Breaking anything - refresh is reversible
- Accidental clicks - confirmation dialog prevents mistakes

---

## Visual Comparison

### Wish Jar (Similar Feature)
```
┌─────────────────────────────────┐
│  Wish Jar                       │
│  ┌─────────────────────────────┐│
│  │ 5/8 wishes opened 💖  [🔄] ││
│  │ ████████████░░░░░░░░░░░░░░ ││
│  └─────────────────────────────┘│
│  [💌] [💌] [📭] [📭] [💌]      │
│  [📭] [💌] [📭]                │
└─────────────────────────────────┘
```

### Video Wall (New Feature)
```
┌─────────────────────────────────┐
│  Video Wall                     │
│  ┌─────────────────────────────┐│
│  │ 3/7 memories unlocked 💖    ││
│  │ [43%]  [🔄 Refresh]         ││
│  │ ████████████░░░░░░░░░░░░░░ ││
│  └─────────────────────────────┘│
│  [🎬] [🎬] [🎬]                │
│  [🎬] [🎬] [🎬]                │
│  [🎬] [✨]                     │
└─────────────────────────────────┘
```

---

**Status**: ✅ Refresh button implemented and working
**Deployment**: Live on Render and Vercel
**Mobile**: Fully responsive
