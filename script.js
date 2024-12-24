const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let paths = [], redoStack = [];
let drawing = false;
let currentTool = 'pencil';
let currentColor = "#000000";
let brushSize = 5;

function setupCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpi = window.devicePixelRatio;
    canvas.width = rect.width * dpi;
    canvas.height = rect.height * dpi;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.scale(dpi, dpi);
}

document.addEventListener('DOMContentLoaded', () => {
    setupCanvas();

    document.getElementById('pencilButton').addEventListener('click', () => setActiveTool('pencil'));
    document.getElementById('eraserButton').addEventListener('click', () => setActiveTool('eraser'));
    document.getElementById('undoButton').addEventListener('click', undoLastAction);
    document.getElementById('redoButton').addEventListener('click', redoLastAction);
    document.getElementById('clearButton').addEventListener('click', clearCanvas);
    document.getElementById('colorPicker').addEventListener('change', (e) => {
        currentColor = e.target.value;
        setActiveTool('pencil');
    });
    document.getElementById('brushSize').addEventListener('input', (e) => {
        brushSize = parseInt(e.target.value, 10);
    });

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('mousemove', draw);

    setActiveTool('pencil');
});

function draw(e) {
    if (!drawing) return;
    const mousePos = getMousePos(e);
    const currentPath = paths[paths.length - 1];
    currentPath.points.push(mousePos);
    redrawCanvas();
}

function undoLastAction() {
    if (paths.length > 0) {
        redoStack.push(paths.pop());
        redrawCanvas();
    }
}

function redoLastAction() {
    if (redoStack.length > 0) {
        paths.push(redoStack.pop());
        redrawCanvas();
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paths = [];
    redoStack = [];
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paths.forEach(drawPath);
}

function drawPath(path) {
    if (path.points.length === 0) return;

    ctx.beginPath();
    ctx.moveTo(path.points[0].x, path.points[0].y);
    path.points.forEach(point => {
        ctx.lineTo(point.x, point.y);
    });
    ctx.strokeStyle = path.color;
    ctx.lineWidth = path.width;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.stroke();
}

function startDrawing(e) {
    drawing = true;
    const mousePos = getMousePos(e);
    paths.push({
        color: currentTool === 'eraser' ? '#FFFFFF' : currentColor,
        points: [mousePos],
        width: brushSize,
    });
    redoStack = [];
}

function stopDrawing() {
    drawing = false;
}

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const dpi = window.devicePixelRatio;
    const x = (e.clientX - rect.left) * (canvas.width / (rect.width * dpi));
    const y = (e.clientY - rect.top) * (canvas.height / (rect.height * dpi));
    return { x, y };
}

function setActiveTool(tool) {
    currentTool = tool;
    document.querySelectorAll('.toolItem').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${tool}Button`).classList.add('active');
}
