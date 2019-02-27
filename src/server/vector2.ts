export class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    normalize() {
        return new Vector2(this.x / this.magnitude(), this.y / this.magnitude());
    }

    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    dir(other : Vector2) {
        return new Vector2(other.x - this.x, other.y - this.y);
    }

    dist(other : Vector2) {
        return Math.sqrt((other.x - this.x) ** 2 + (other.y - this.y) ** 2);
    }

    moveToward(pos : Vector2, dist : number) {
        const movement = this.dir(pos).normalize();
        return new Vector2(this.x + movement.x * dist, this.y + movement.y * dist);
    }
}
