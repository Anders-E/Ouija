class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Marker {
    constructor(x, y) {
        this.pos = new Vector2(x, y);
        this.img = new Image();
        this.img.src = "res/marker.png";
        this.w = this.img.width;
        this.h = this.img.height;
    }

    update(dt) {
        if (mouseDown) {
            this.pos = new Vector2(mouse.x - this.w / 2, mouse.y - this.h / 2);
        }
    }

    render(ctx) {
        ctx.drawImage(this.img, this.pos.x, this.pos.y);
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
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mouseup", mouseUp, false);
    //canvas.addEventListener("mouseleave", mouseUp, false);
    window.mouse = new Vector2(0, 0);
    window.mouseDown = false;
    window.marker = new Marker(0, 0);
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
    marker.update(dt);
}

function render(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    marker.render(ctx);
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
