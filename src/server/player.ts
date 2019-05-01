import { Vector2 } from './vector2';
import { Socket } from 'socket.io';

export class Player {
    public socket: Socket;
    public pos: Vector2;

    public constructor(socket: Socket) {
        this.socket = socket;
        this.pos = new Vector2();
    }
}
