import * as uuid from 'uuid';

import { Vector2 } from './vector2';
import { Player } from './player';
import { Coords } from './interfaces/coords';
import { logger } from './logger';

export class Game {
    private id: string;
    private players: Map<string, Player>;
    private marker: Vector2;
    private markerVelocity: number = 0.5;
    private deltaTime: number = 60 / 1000;

    public constructor() {
        this.id = uuid.v4();
        this.players = new Map<string, Player>();
        this.marker = new Vector2(0, 0);
        logger.info({ message: 'Game created', gameId: this.id });
    }

    public play(): void {
        setInterval((): void => {
            logger.info({ message: 'Marker position (server)', markerPos: this.marker});

            // let inputSum = { x: this.marker.x, y: this.marker.y };
            let inputSum = new Vector2();
            let noInput = true;

            let numInput = 0;

            for(const player of this.players.values()) {
              if(player.didSendInput) {
                numInput ++;
                inputSum = inputSum.add(new Vector2(player.input.x, player.input.y));
                player.didSendInput = false;
              }
            }

            if(numInput > 0) {
              inputSum = inputSum.scale(1 / numInput);
              // inputSum = new Vector2(0, 0);
              //find direction vector
              let dir = this.marker.dir(inputSum);
              let distance = dir.magnitude();
              // let dir = inputSum.dir(this.marker);

              // this.marker = this.marker.moveToward(inputSum, this.markerVelocity);
              this.marker = this.marker.add(dir.normalize().scale((this.markerVelocity * distance) * this.deltaTime));
            }

            for (const player of this.players.values()) {
                player.socket.emit('game_marker_pos', this.marker);
            }
        }, this.deltaTime);
    }

    public addPlayer(player: Player): void {
        logger.info({ message: 'Player added to game', id: player.id });
        this.players.set(player.id, player);
    }
}
