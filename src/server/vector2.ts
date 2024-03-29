export class Vector2 {
    public x: number;
    public y: number;

    public constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public normalize(): Vector2 {
        return new Vector2(this.x / this.magnitude(), this.y / this.magnitude());
    }

    public magnitude(): number {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    public dir(other: Vector2): Vector2 {
        return new Vector2(other.x - this.x, other.y - this.y);
    }

    public dist(other: Vector2): number {
        return Math.sqrt((other.x - this.x) ** 2 + (other.y - this.y) ** 2);
    }

    public scale(other: number): Vector2 {
        return new Vector2(this.x * other, this.y * other);
    }

    public moveToward(pos: Vector2, dist: number): Vector2 {
        const movement = this.dir(pos).normalize();
        return new Vector2(this.x + movement.x * dist, this.y + movement.y * dist);
    }

    public sub(other: Vector2): Vector2 {
        return new Vector2(this.x - other.x, this.y - other.y);
    }

    public add(other: Vector2): Vector2 {
        return new Vector2(this.x + other.x, this.y + other.y);
    }
}
