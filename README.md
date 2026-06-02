# Simple Draw App

A simple, lightweight HTML5 canvas-based drawing application that can be hosted on GitHub Pages.

## Features

- **Draw freely** with your mouse or touch on any device
- **Color picker** to choose any color
- **Adjustable brush size** (1-50px)
- **Clear canvas** button to start over
- **Download** your drawings as PNG files
- **Responsive design** that works on desktop and mobile

## How to Use

1. Open `index.html` in your web browser
2. Select a color using the color picker
3. Adjust the brush size using the slider
4. Click and drag on the canvas to draw
5. Use "Clear Canvas" to erase everything
6. Use "Download Drawing" to save your artwork

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
