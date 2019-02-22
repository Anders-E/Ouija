import { Vector2 } from "./vector2.mjs";

export class Marker {
    constructor(x, y) {
        this.pos = new Vector2(x, y);
        this.img = new Image();
        this.img.src = "res/marker.svg";
        this.w = this.img.width;
        this.h = this.img.height;
    }

    update(dt, mouse) {
        const dist = this.pos.dist(new Vector2(mouse.x - this.w / 2, mouse.y - this.h / 2));
        if (mouseDown && dist > 5 ) {
            this.pos = this.pos.moveToward(new Vector2(mouse.x - this.w / 2, mouse.y - this.h / 2), dt * 0.2);
        }
    }

    render(ctx) {
        ctx.drawImage(this.img, this.pos.x, this.pos.y);
    }
}
