class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    normalize() {
        return new Vector2(this.x / this.magnitude(), this.y / this.magnitude());
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    dir(other) {
        return new Vector2(other.x - this.x, other.y - this.y);
    }

    moveToward(pos, dist) {
        const movement = this.dir(pos).normalize();
        return new Vector2(this.x + movement.x * dist, this.y + movement.y * dist);
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
            this.pos = this.pos.moveToward(new Vector2(mouse.x - this.w / 2, mouse.y - this.h / 2), dt * 0.2);
        }
    }

    render(ctx) {
        ctx.drawImage(this.img, this.pos.x, this.pos.y);
    }
}

function main() {
    const canvas = document.getElementById("ouijaCanvas");
    init(canvas);
    const ctx = canvas.getContext("2d");
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
    window.canvasPos = canvas.getBoundingClientRect();
}

function gameLoop(ts, prevTs, canvas, ctx) {
    const dt = ts - prevTs;
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
