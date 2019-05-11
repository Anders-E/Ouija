import * as uuid from 'uuid';

import { Vector2 } from './vector2';
import { Player } from './player';
import { Coords } from './interfaces/coords';
import { logger } from './logger';

export class Game {
    private id: string;
    private players: Map<string, Player>;
    private playerInputs: Map<string, Coords>;
    private marker: Vector2;

    public constructor() {
        this.id = uuid.v4();
        this.players = new Map<string, Player>();
        this.playerInputs = new Map<string, Coords>();
        this.marker = new Vector2(0.5, 0.5);
        logger.info({ message: 'Game created', gameId: this.id });
    }

    public play(): void {
        setInterval((): void => {
            let inputSum = { x: this.marker.x, y: this.marker.y };
            for (const player of this.players.values()) {
                if (player.input != null) {
                    inputSum.x += player.input.x;
                    inputSum.y += player.input.y;
                    this.marker = new Vector2(player.input.x, player.input.y);
                    player.input = null;
                }
            }
            // TODO fix proper broadcast
            for (const player of this.players.values()) {
                player.socket.emit('game_marker_pos', this.marker);
            }
            this.playerInputs.clear();
        }, 1000 / 60);
    }

    public addPlayer(player: Player): void {
        logger.info({ message: 'Player added to game', id: player.id });
        this.players.set(player.id, player);
    }
}
