import { Vector2 } from './vector2';
import { Socket } from 'socket.io';
import { Coords } from './interfaces/coords';
import { logger } from './logger';

export class Player {
    public id: string;
    public socket: Socket;
    public pos: Vector2;
    public input: Coords;

    public constructor(socket: Socket) {
        this.id = socket.id;
        this.socket = socket;
        this.pos = new Vector2();

        this.socket.on(
            'player_marker_pos',
            (pos: Coords): void => {
                this.input = pos;
                logger.debug({
                    message: 'Input received from player',
                    event: 'player_marker_pos',
                    id: this.id,
                    input: pos
                });
            }
        );
    }
}
