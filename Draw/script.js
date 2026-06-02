const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const sizeDisplay = document.getElementById('sizeDisplay');
const brushGrid = document.getElementById('brushGrid');
const eraserBtn = document.getElementById('eraserBtn');
const floatTools = document.getElementById('floatTools');
const canvasArea = document.querySelector('.canvas-area');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let rainbowHue = 0;
let currentBrush = 'pen';

// Brushes as icon buttons (the eraser lives in the floating panel instead)
const BRUSHES = [
    { id: 'pen', icon: '🖊️', name: 'Pen' },
    { id: 'pencil', icon: '✏️', name: 'Pencil' },
    { id: 'sketch', icon: '✍️', name: 'Sketch' },
    { id: 'charcoal', icon: '🪨', name: 'Charcoal' },
    { id: 'marker', icon: '🟡', name: 'Marker' },
    { id: 'crayon', icon: '🖍️', name: 'Crayon' },
    { id: 'oil', icon: '🛢️', name: 'Oil paint' },
    { id: 'watercolor', icon: '💧', name: 'Watercolor' },
    { id: 'calligraphy', icon: '🖌️', name: 'Calligraphy' },
    { id: 'spray', icon: '💨', name: 'Spray' },
    { id: 'neon', icon: '💡', name: 'Neon' },
    { id: 'rainbow', icon: '🌈', name: 'Rainbow' },
    { id: 'dashed', icon: '〰️', name: 'Dashed' }
];

// Select a tool, syncing the active highlight across brushes + eraser
function setBrush(id) {
    currentBrush = id;
    brushGrid.querySelectorAll('.brush-btn').forEach((el) =>
        el.classList.toggle('active', el.dataset.brush === id));
    eraserBtn.classList.toggle('active', id === 'eraser');
}

BRUSHES.forEach((b) => {
    const btn = document.createElement('button');
    btn.className = 'brush-btn' + (b.id === currentBrush ? ' active' : '');
    btn.textContent = b.icon;
    btn.title = b.name;
    btn.dataset.brush = b.id;
    btn.addEventListener('click', () => setBrush(b.id));
    brushGrid.appendChild(btn);
});

eraserBtn.addEventListener('click', () => setBrush('eraser'));

// ---- Make the floating tool panel draggable (default bottom-right) ----
let panelDragging = false, panelOffX = 0, panelOffY = 0;
floatTools.addEventListener('pointerdown', (e) => {
    if (e.target.closest('input, button')) return; // let the controls work
    panelDragging = true;
    const r = floatTools.getBoundingClientRect();
    panelOffX = e.clientX - r.left;
    panelOffY = e.clientY - r.top;
    floatTools.classList.add('dragging');
    floatTools.setPointerCapture(e.pointerId);
});
floatTools.addEventListener('pointermove', (e) => {
    if (!panelDragging) return;
    const a = canvasArea.getBoundingClientRect();
    const w = floatTools.offsetWidth, h = floatTools.offsetHeight;
    const x = Math.max(6, Math.min(a.width - w - 6, e.clientX - panelOffX - a.left));
    const y = Math.max(6, Math.min(a.height - h - 6, e.clientY - panelOffY - a.top));
    floatTools.style.left = x + 'px';
    floatTools.style.top = y + 'px';
    floatTools.style.right = 'auto';
    floatTools.style.bottom = 'auto';
    floatTools.style.transform = 'none'; // default uses translateY(-50%); clear it once dragged
});
const endPanelDrag = () => { panelDragging = false; floatTools.classList.remove('dragging'); };
floatTools.addEventListener('pointerup', endPanelDrag);
floatTools.addEventListener('pointercancel', endPanelDrag);

// Keep the panel inside the canvas after a resize / orientation change
window.addEventListener('resize', () => {
    if (!floatTools.style.left) return;
    const a = canvasArea.getBoundingClientRect();
    const w = floatTools.offsetWidth, h = floatTools.offsetHeight;
    floatTools.style.left = Math.max(6, Math.min(a.width - w - 6, parseFloat(floatTools.style.left))) + 'px';
    floatTools.style.top = Math.max(6, Math.min(a.height - h - 6, parseFloat(floatTools.style.top))) + 'px';
});

// Set canvas size based on container
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

// Initialize canvas
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

// Brush size readout — only visible while the slider is being moved
let sizeHideTimer;
const showSize = () => sizeDisplay.classList.add('show');
const hideSize = () => sizeDisplay.classList.remove('show');
brushSize.addEventListener('input', (e) => {
    sizeDisplay.textContent = e.target.value + ' px';
    showSize();
    clearTimeout(sizeHideTimer);
    sizeHideTimer = setTimeout(hideSize, 600); // fallback for keyboard changes
});
brushSize.addEventListener('pointerdown', showSize);
brushSize.addEventListener('pointerup', hideSize);
brushSize.addEventListener('pointercancel', hideSize);
brushSize.addEventListener('blur', hideSize);

// Clear canvas
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Download drawing
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `drawing-${Date.now()}.png`;
    link.click();
});

// Draw a stroke segment from (x0,y0) to (x1,y1) using the selected brush
function drawStroke(x0, y0, x1, y1) {
    const size = parseInt(brushSize.value, 10);
    const color = colorPicker.value;
    const type = currentBrush;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    switch (type) {
        case 'marker':
            ctx.globalAlpha = 0.4;
            ctx.lineWidth = size * 1.5;
            ctx.strokeStyle = color;
            strokeLine(x0, y0, x1, y1);
            break;

        case 'pencil':
            ctx.globalAlpha = 0.7;
            ctx.lineWidth = Math.max(1, size * 0.6);
            ctx.strokeStyle = color;
            // jitter each segment slightly for a grainy look
            for (let i = 0; i < 3; i++) {
                const j = () => (Math.random() - 0.5) * size * 0.4;
                strokeLine(x0 + j(), y0 + j(), x1 + j(), y1 + j());
            }
            break;

        case 'sketch':
            // loose graphite sketch: several light, jittery overlapping lines
            ctx.strokeStyle = color;
            ctx.globalAlpha = 0.45;
            ctx.lineWidth = Math.max(1, size * 0.35);
            for (let i = 0; i < 4; i++) {
                const j = () => (Math.random() - 0.5) * size * 0.9;
                strokeLine(x0 + j(), y0 + j(), x1 + j(), y1 + j());
            }
            break;

        case 'charcoal': {
            // soft broad stroke + grainy specks
            ctx.strokeStyle = color;
            ctx.globalAlpha = 0.5;
            ctx.lineWidth = size * 1.1;
            strokeLine(x0, y0, x1, y1);
            ctx.fillStyle = color;
            const grains = Math.round(size * 1.6);
            for (let i = 0; i < grains; i++) {
                const t = Math.random();
                const gx = x0 + (x1 - x0) * t + (Math.random() - 0.5) * size * 1.7;
                const gy = y0 + (y1 - y0) * t + (Math.random() - 0.5) * size * 1.7;
                ctx.globalAlpha = Math.random() * 0.5;
                ctx.fillRect(gx, gy, 1.6, 1.6);
            }
            break;
        }

        case 'crayon': {
            // waxy stroke with grainy deposits
            ctx.strokeStyle = color;
            ctx.globalAlpha = 0.85;
            ctx.lineWidth = size * 1.1;
            strokeLine(x0, y0, x1, y1);
            ctx.fillStyle = color;
            const flecks = Math.round(size * 1.4);
            for (let i = 0; i < flecks; i++) {
                const t = Math.random();
                const gx = x0 + (x1 - x0) * t + (Math.random() - 0.5) * size;
                const gy = y0 + (y1 - y0) * t + (Math.random() - 0.5) * size;
                ctx.globalAlpha = Math.random() * 0.35;
                ctx.fillRect(gx, gy, 2, 2);
            }
            break;
        }

        case 'oil': {
            // thick impasto: parallel bristle streaks with slight colour variation
            ctx.globalAlpha = 0.92;
            ctx.lineWidth = Math.max(1.5, size * 0.45);
            const dx = x1 - x0, dy = y1 - y0;
            const len = Math.hypot(dx, dy) || 1;
            const px = -dy / len, py = dx / len; // perpendicular unit
            const bristles = Math.max(3, Math.round(size / 2.5));
            for (let i = 0; i < bristles; i++) {
                const o = (i / (bristles - 1) - 0.5) * size;
                ctx.strokeStyle = shadeColor(color, (Math.random() - 0.5) * 36);
                strokeLine(x0 + px * o, y0 + py * o, x1 + px * o, y1 + py * o);
            }
            break;
        }

        case 'watercolor': {
            // soft translucent dabs that build up colour
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.06;
            ctx.shadowColor = color;
            ctx.shadowBlur = size * 0.8;
            for (let i = 0; i < 3; i++) {
                const t = (i + 0.5) / 3;
                const cx = x0 + (x1 - x0) * t + (Math.random() - 0.5) * size * 0.3;
                const cy = y0 + (y1 - y0) * t + (Math.random() - 0.5) * size * 0.3;
                ctx.beginPath();
                ctx.arc(cx, cy, size * (0.8 + Math.random() * 0.5), 0, Math.PI * 2);
                ctx.fill();
            }
            break;
        }

        case 'calligraphy':
            ctx.strokeStyle = color;
            ctx.lineCap = 'butt';
            ctx.lineWidth = size;
            // angled nib: offset endpoints to vary thickness with direction
            const off = size * 0.5;
            ctx.beginPath();
            ctx.moveTo(x0 - off, y0 - off);
            ctx.lineTo(x1 - off, y1 - off);
            ctx.lineTo(x1 + off, y1 + off);
            ctx.lineTo(x0 + off, y0 + off);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
            break;

        case 'spray':
            ctx.fillStyle = color;
            const density = size * 2;
            const radius = size;
            for (let i = 0; i < density; i++) {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * radius;
                const sx = x1 + Math.cos(angle) * r;
                const sy = y1 + Math.sin(angle) * r;
                ctx.fillRect(sx, sy, 1, 1);
            }
            break;

        case 'neon':
            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            ctx.shadowColor = color;
            ctx.shadowBlur = size * 2;
            strokeLine(x0, y0, x1, y1);
            strokeLine(x0, y0, x1, y1);
            break;

        case 'rainbow':
            rainbowHue = (rainbowHue + 6) % 360;
            ctx.strokeStyle = `hsl(${rainbowHue}, 100%, 50%)`;
            ctx.lineWidth = size;
            strokeLine(x0, y0, x1, y1);
            break;

        case 'dashed':
            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            ctx.setLineDash([size * 2, size]);
            strokeLine(x0, y0, x1, y1);
            break;

        case 'eraser':
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = size * 2;
            ctx.strokeStyle = 'rgba(0,0,0,1)';
            strokeLine(x0, y0, x1, y1);
            break;

        case 'pen':
        default:
            ctx.strokeStyle = color;
            ctx.lineWidth = size;
            strokeLine(x0, y0, x1, y1);
            break;
    }

    ctx.restore();
}

function strokeLine(x0, y0, x1, y1) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

// Lighten/darken a #rrggbb colour by `amt` (-255..255) → "rgb(r,g,b)"
function shadeColor(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
    const r = clamp(((n >> 16) & 255) + amt);
    const g = clamp(((n >> 8) & 255) + amt);
    const b = clamp((n & 255) + amt);
    return `rgb(${r},${g},${b})`;
}

// Mouse events
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    drawStroke(lastX, lastY, lastX, lastY);
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    drawStroke(lastX, lastY, currentX, currentY);

    lastX = currentX;
    lastY = currentY;
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

canvas.addEventListener('mouseleave', () => {
    isDrawing = false;
});

// Touch events for mobile support
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;
    drawStroke(lastX, lastY, lastX, lastY);
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;

    drawStroke(lastX, lastY, currentX, currentY);

    lastX = currentX;
    lastY = currentY;
});

canvas.addEventListener('touchend', () => {
    isDrawing = false;
});
