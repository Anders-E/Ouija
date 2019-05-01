import { Board } from "./board";
import { Vector2 } from "./vector2";
import { Player } from "./player";

export class Game {
    players: Map<String, Player>;
    board: Board;
    marker: Vector2;

    constructor() {
        this.players = new Map<String, Player>();
        this.board = new Board(100, 100);
        this.marker = new Vector2();
    }

    addPlayer(player: Player) {
        this.players.set(player.socket.id, player);
    }
}