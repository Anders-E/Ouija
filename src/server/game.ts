import * as uuid from 'uuid';

import { Vector2 } from './vector2';
import { Player } from './player';
import { logger } from './logger';

const MAX_PLAYERS = 2;

export class Game {
    private id: string;
    private players: Map<string, Player>;
    private marker: Vector2;
    private private: boolean;
    private markerVelocity: number = 0.25;
    private deltaTime: number = 60 / 1000;

    public constructor() {
        this.id = uuid.v4();
        this.players = new Map<string, Player>();
        this.marker = new Vector2(0, 0);
        this.private = false;
        logger.info({ message: 'Game created', gameId: this.id });
    }

    public play(): void {
        setInterval((): void => {
            let inputSum = new Vector2();
            let numInput = 0;

            for (const player of this.players.values()) {
                if (player.didSendInput) {
                    numInput++;
                    inputSum = inputSum.add(new Vector2(player.input.x, player.input.y));
                    player.didSendInput = false;
                }
            }

            if (numInput > 0) {
                inputSum = inputSum.scale(1 / numInput);
                //find direction vector
                let dir = this.marker.dir(inputSum);
                let distance = dir.magnitude();
                this.marker = this.marker.add(
                    dir.normalize().scale(this.markerVelocity * Math.sqrt(distance) * this.deltaTime)
                );
            }

            for (const player of this.players.values()) {
                player.socket.emit('game_marker_pos', this.marker);
            }
        }, this.deltaTime);
    }

    public addPlayer(player: Player): void {
        if (this.players.size < MAX_PLAYERS) {
            logger.error('Player tried to join full game', player, this);
            return;
        }

        //Signal to players that a new player has joined
        for (const player of this.players.values()) {
            player.socket.emit('playerJoined', player.id);
        }

        this.players.set(player.id, player);
        logger.info({ message: 'Player added to game', id: player.id });
    }

    public getId(): string {
        return this.id;
    }

    public isFull(): boolean {
        return this.players.size >= MAX_PLAYERS;
    }

    public isPrivate(): boolean {
        return this.private;
    }
}
