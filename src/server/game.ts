import { Board } from './board';
import { Vector2 } from './vector2';
import { Player } from './player';

export class Game {
    private players: Map<string, Player>;
    private board: Board;
    private marker: Vector2;

    public constructor() {
        this.players = new Map<string, Player>();
        this.board = new Board(100, 100);
        this.marker = new Vector2();
    }

    public addPlayer(player: Player): void {
        this.players.set(player.socket.id, player);
    }
}
