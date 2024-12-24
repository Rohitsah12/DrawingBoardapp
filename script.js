const canvas=document.getElementById('drawingCanvas');
const ctx=canvas.getContext('2d');
let paths = [],redoStack = [];
let drawing=false;
let currentTool='pencil';
let currentColor="#000000";
let brushSize=5;

function setupCanvas(){
    //adjust the canvas size
    const rect = canvas.getBoundingClientRect();
    const dpi = window.devicePixelRatio;
    canvas.width = rect.width*dpi;
    canvas.height = rect.height*dpi;
}

document.addEventListener('DOMContentLoaded',(event)=>{
    document.getElementById('pencilButton').addEventListener('click',()=>setActiveTool('pencil'));
    document.getElementById('eraserButton').addEventListener('click',()=>setActiveTool('eraser'));
    document.getElementById('undoButton').addEventListener('click',()=>undoLastAction('undo'));
    document.getElementById('redoButton').addEventListener('click',()=>redoLastAction('redo'));
    document.getElementById('clearButton').addEventListener('click',()=>clearCanvas('clear'));
    document.getElementById('colorPicker').addEventListener('change',(e)=>{
        currentColor=e.target.value;
        setAciveTool('pencil');
    });
    document.getElementById('brushSize').addEventListener('input',(e)=>{
        brushSize=e.target.value;
    })
    canvas.addEventListener('mousedown',startDrawing);
    canvas.addEventListener('mouseup',stopDrawing); //releasing mouse, stop drawing
    canvas.addEventListener('mousemove',draw);

    setActiveTool('pencil');
});

function draw(e){
    if(!drawing) return;
    // get mouse position 
    //add that mouse position to the exhisting path in the paths array
}


function startDrawing(e){
    drawing=true;
    const mousePos=getMousePos(e);

    //paths -> array of object
    paths.push({
        color:currentTool==='eraser'?'white':currentColor,
        points:[mousePos],
        width:brushSize
    });

    redoStack=[];
}

function getMousePos(evt){

    const rect = canvas.getBoundingClientRect();
    const x=(evt.clientX-rect.left)*(canvas.width/rect.width);
    const y=(evt.clientY-rect.top)*(canvas.height/rect.height);

    return {x,y};
}

function setActiveTool(tool){
    currentTool=tool;
    document.querySelectorAll('.toolItem').forEach(btn=>btn.classList.remove('active'));
    document.getElementById('${tool}Button').classList.add('active')
}

function stopDrawing(){
    drawing=false;
}

function clearCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.width);
    redoStack=[];
}

