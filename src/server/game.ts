import * as uuid from 'uuid';

import { Board } from './board';
import { Vector2 } from './vector2';
import { Player } from './player';
import { Coords } from './interfaces/coords';
import { logger } from './logger';

export class Game {
    private id: string;
    private players: Map<string, Player>;
    private playerInputs: Map<string, Coords>;
    private board: Board;
    private marker: Vector2;

    public constructor() {
        this.id = uuid.v4();
        this.players = new Map<string, Player>();
        this.playerInputs = new Map<string, Coords>();
        this.board = new Board(100, 100);
        this.marker = new Vector2(1, 1);
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
        player.socket.on(
            'player_marker_pos',
            (pos: Coords): void => {
                this.playerInputs.set(player.id, pos);
                logger.debug({
                    message: 'Input received from player',
                    event: 'player_marker_pos',
                    id: player.socket.id,
                    input: pos
                });
            }
        );
        logger.info({ message: 'Player added to game', id: player.id });
        this.players.set(player.id, player);
    }
}
