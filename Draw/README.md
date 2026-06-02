# Simple Draw App

A simple, lightweight HTML5 canvas-based drawing application that can be hosted on GitHub Pages.

## Features

- **Draw freely** with your mouse, touch, or stylus on any device
- **14 brushes** as a single-column icon toolbar on the left, including artistic media:
  pen, pencil, **sketch**, **charcoal**, marker, **crayon**, **oil paint**, **watercolor**,
  calligraphy, spray, neon, rainbow, dashed, and eraser — each with its own texture
- **Color picker** swatch and an **adjustable brush size** (the value pops up only while you drag)
- **Clear** 🗑️ and **Download** ⬇️ as icon buttons in the top-right
- Shares the look of the Math / Han apps: slim purple header, fills the viewport, and goes **edge-to-edge full screen on iPad**

## How to Use

1. Open `index.html` in your web browser
2. Pick a brush from the left toolbar, choose a color, and set the size
3. Click / drag (or draw with a finger or stylus) on the canvas
4. Use 🗑️ (top-right) to clear, ⬇️ to download your artwork as a PNG

## Hosting on GitHub Pages

### Step 1: Create a GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `your-username.github.io` (or any other name)
3. Choose "Public" repository

### Step 2: Upload Files
1. Clone the repository to your computer
2. Copy `index.html`, `styles.css`, and `script.js` to your repository folder
3. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add draw app"
   git push origin main
   ```

### Step 3: Enable GitHub Pages
1. Go to your repository settings
2. Scroll to "GitHub Pages" section
3. Under "Source", select "main" branch
4. Click "Save"

### Step 4: Access Your App
- If using `your-username.github.io`: Visit `https://your-username.github.io`
- If using a different name: Visit `https://your-username.github.io/repository-name`

## Browser Compatibility

Works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## File Structure

```
.
├── index.html      # Main HTML file with canvas
├── styles.css      # Styling
├── script.js       # Drawing logic
└── README.md       # This file
```

## License

Free to use and modify for any purpose.
