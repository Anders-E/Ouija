class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function main() {
    var canvas = document.getElementById("ouijaCanvas");
    init(canvas);
    var ctx = canvas.getContext("2d");
    requestAnimationFrame(function(timestamp) {
        gameLoop(timestamp, 0, canvas, ctx);
    });
}

function init(canvas) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    canvas.addEventListener("mousemove", setMousePosition, false);
    window.mouse = new Vector2(0, 0);
    window.canvasPos = getElementPosition(canvas);
}

function gameLoop(ts, prevTs, canvas, ctx) {
    var dt = ts - prevTs;
    update(dt);
    render(canvas, ctx);
    requestAnimationFrame(function(timestamp) {
        gameLoop(timestamp, ts, canvas, ctx);
    });
}

function update(dt) {

}

function render(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var marker = new Image();
    marker.src = "res/marker.png";
    ctx.drawImage(marker, window.mouse.x - marker.width / 2, window.mouse.y - marker.height / 2);
}

function setMousePosition(e) {
    window.mouse = new Vector2(e.clientX - canvasPos.x, e.clientY - canvasPos.y);
}

function getElementPosition(el) {
    var x = 0;
    var y = 0;
    while (el) {
        x += el.offsetLeft - el.scrollLeft + el.clientLeft;
        y += el.offsetTop - el.scrollTop + el.clientTop;
        el = el.offsetParent;
    }
    return new Vector2(x, y);
}
