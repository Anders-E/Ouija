import { Marker } from '/marker.mjs';
import { Vector2 } from '/vector2.mjs';

function setCanvasSize(canvas) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    console.log(canvas.width, canvas.height);
}

function setMousePosition(e) {
    window.mouse = new Vector2(e.clientX - canvasPos.x, e.clientY - canvasPos.y);
}

function mouseDown() {
    window.mouseDown = true;
}

function mouseUp() {
    window.mouseDown = false;
}

function init(canvas) {
    window.addEventListener('resize', () => setCanvasSize(canvas), false);
    setCanvasSize(canvas);
    canvas.addEventListener('mousemove', setMousePosition, false);
    canvas.addEventListener('mousedown', mouseDown, false);
    canvas.addEventListener('mouseup', mouseUp, false);
    // canvas.addEventListener('mouseleave', mouseUp, false);
    window.mouse = new Vector2(0, 0);
    window.mouseDown = false;
    window.marker = new Marker(0, 0);
    window.canvasPos = canvas.getBoundingClientRect();
}

function update() {
    if (window.mouseDown) {
        const canvas = document.getElementById('ouijaCanvas');
        const w = canvas.width;
        const h = canvas.height;
        const normalizedCoords = new Vector2(mouse.x / w, mouse.y / h);
        socket.emit('player_marker_pos', normalizedCoords);
    }
}

function render(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    marker.render(ctx);
}

function gameLoop(ts, canvas, ctx) {
    update();
    render(canvas, ctx);
    requestAnimationFrame(newTs => gameLoop(newTs, canvas, ctx));
}

function main() {
    window.socket = io();
    const canvas = document.getElementById('ouijaCanvas');
    init(canvas);
    const ctx = canvas.getContext('2d');

    socket.on('connect', () => {
        console.log('connected to server');
        console.log(socket);

        socket.on('game_marker_pos', pos => {
            const w = canvas.width;
            const h = canvas.height;
            marker.pos = new Vector2(pos.x * w, pos.y * h);
        });
    });

    requestAnimationFrame(timestamp => gameLoop(timestamp, canvas, ctx));
}

main();
