"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = __importStar(require("uuid"));
const vector2_1 = require("./vector2");
const logger_1 = require("./logger");
const server_1 = require("./server");
const MAX_PLAYERS = 5;
class Game {
    constructor() {
        this.markerVelocity = 0.25;
        this.deltaTime = 60 / 1000;
        this.id = uuid.v4();
        this.players = new Map();
        this.marker = new vector2_1.Vector2(0, 0);
        this.private = false;
        logger_1.logger.info({ message: 'Game created', gameId: this.id });
    }
    play() {
        setInterval(() => {
            let inputSum = new vector2_1.Vector2();
            let numInput = 0;
            for (const player of this.players.values()) {
                if (player.didSendInput) {
                    numInput++;
                    inputSum = inputSum.add(new vector2_1.Vector2(player.input.x, player.input.y));
                    player.didSendInput = false;
                }
            }
            if (numInput > 0) {
                inputSum = inputSum.scale(1 / numInput);
                //find direction vector
                let dir = this.marker.dir(inputSum);
                let distance = dir.magnitude();
                this.marker = this.marker.add(dir
                    .normalize()
                    .scale(this.markerVelocity * Math.sqrt(distance) * this.deltaTime));
            }
            server_1.io.to(this.id).emit('game_marker_pos', this.marker);
        }, this.deltaTime);
    }
    addPlayer(player) {
        if (this.players.size >= MAX_PLAYERS) {
            logger_1.logger.error({
                message: 'Player tried to join full game',
                playerId: player.id,
                gameId: this.id
            });
            return;
        }
        //Signal to players that a new player has joined
        for (const player of this.players.values()) {
            player.socket.emit('playerJoined', player.id);
        }
        this.players.set(player.id, player);
        player.socket.join(this.id);
        logger_1.logger.info({
            message: 'Player added to game',
            playerId: player.id,
            gameId: this.id
        });
    }
    getId() {
        return this.id;
    }
    isFull() {
        return this.players.size >= MAX_PLAYERS;
    }
    isPrivate() {
        return this.private;
    }
}
exports.Game = Game;
//# sourceMappingURL=game.js.map