class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const canvasPos = getPosition(document.getElementById("ouijaCanvas"));
var mouse = new Vector2(0, 0);


function main() {
    init();
    update();
}

function init() {
    var canvas = document.getElementById("ouijaCanvas");
    canvas.width = 960;
    canvas.height = 640;
    canvas.addEventListener("mousemove", setMousePosition, false);
}

function update() {
    var canvas = document.getElementById("ouijaCanvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    var marker = new Image();
    marker.src = "res/marker.png";
    context.drawImage(marker, mouse.x - marker.width / 2, mouse.y - marker.height / 2);
    //context.arc(mouseX, mouseY, 50, 0, 2 * Math.PI, true);
    context.fillStyle = "#FF6A6A";
    context.fill();
    requestAnimationFrame(update);
}

function setMousePosition(e) {
    mouse = new Vector2(e.clientX - canvasPos.x, e.clientY - canvasPos.y);
}

function getPosition(el) {
    var x = 0;
    var y = 0;
    while (el) {
        x += el.offsetLeft - el.scrollLeft + el.clientLeft;
        y += el.offsetTop - el.scrollTop + el.clientTop;
        el = el.offsetParent;
    }
    return new Vector2(x, y);
}


