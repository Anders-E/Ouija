import { Vector2 } from "./vector2";
import { Socket } from "socket.io";

export class Player {
    socket: Socket;
    pos: Vector2;

    constructor(socket: Socket) {
        this.socket = socket;
        this.pos = new Vector2();
    }
}
