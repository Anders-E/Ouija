/** GLOBALS */
let mouseDown = false;
let mouseX = 0;
let mouseY = 0;

function onMouseDown(): void {
    mouseDown = true;
}

function onMouseUp(): void {
    mouseDown = false;
}

export function getMouseDown(): boolean {
    return mouseDown;
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

function onTouchStart(): void {
    mouseDown = true;
}

function onTouchEnd(): void {
    mouseDown = false;
}

function onTouchMove(e: TouchEvent): void {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
}

export function initialize(): void {
    // Mouse
    mouseDown = false;
    window.addEventListener('mousemove', setMousePosition, false);
    window.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mouseup', onMouseUp, true);

    // Touch
    window.addEventListener('touchstart', onTouchStart, false);
    window.addEventListener('touchend', onTouchEnd, false);
    window.addEventListener('touchmove', onTouchMove, false);
}
