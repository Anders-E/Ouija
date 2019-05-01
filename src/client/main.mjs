import { Marker } from '/marker.mjs';
import { Vector2 } from '/vector2.mjs';

main();

function main() {
    window.socket = io();
    const canvas = document.getElementById('ouijaCanvas');
    init(canvas);
    const ctx = canvas.getContext('2d');

    socket.on('connect', () => {
        console.log('connected to server');
        console.log(socket);

        socket.on('game_marker_pos', (pos) => {
            //console.log(pos);
            marker.pos = new Vector2(pos.x, pos.y);
        });
    });

    requestAnimationFrame((timestamp) => gameLoop(timestamp, 0, canvas, ctx));
};

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

function gameLoop(ts, prevTs, canvas, ctx) {
    const dt = ts - prevTs;
    update(dt);
    render(canvas, ctx);
    requestAnimationFrame((timestamp) => gameLoop(timestamp, ts, canvas, ctx));
}

function update(dt) {
    marker.update(dt, mouse);
    socket.emit('player_marker_pos', marker.pos, (pos) => {
        marker.pos = pos;
    });
}

function render(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    marker.render(ctx);
}

function setCanvasSize(canvas) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}

function setMousePosition(e) {
    window.mouse = new Vector2(e.clientX - canvasPos.x, e.clientY - canvasPos.y);
}

function mouseDown(e) {
    window.mouseDown = true;
}

function mouseUp(e) {
    window.mouseDown = false;
}
