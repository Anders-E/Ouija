/** GLOBALS */
var isMouseDown: boolean = false;
var mouseX : number = 0;
var mouseY : number = 0;

export function initialize() : void {
    isMouseDown = false;
    window.addEventListener('mousemove', setMousePosition, false);
    window.addEventListener('mousedown',  mouseDown, false);
    window.addEventListener('mouseup',  mouseUp, true);
}

function mouseDown() : void {
    isMouseDown = true;
}

function mouseUp() : void {
    isMouseDown = false;
}

export function getMouseDown() : boolean {
    return isMouseDown;
}

function setMousePosition(e: MouseEvent): void {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

export function getMousePositionX(): number {
    return mouseX;
}

export function getMousePositionY(): number {
    return mouseY;
}