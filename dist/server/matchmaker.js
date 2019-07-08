"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const player_1 = require("./player");
const logger_1 = require("./logger");
class Matchmaker {
    constructor() {
        this.games = new Map();
        logger_1.logger.info('Matchmaker started');
    }
    addGame() {
        const game = new game_1.Game();
        this.games.set(game.getId(), game);
        game.play();
        return game;
    }
    joinGame(gameId, socket) {
        const game = this.games.get(gameId);
        const player = new player_1.Player(socket);
        game.addPlayer(player);
        return game;
    }
    findGame() {
        for (const game of this.games.values())
            if (!game.isPrivate() && !game.isFull())
                return game;
        return this.addGame();
    }
    findAndJoinGame(socket) {
        const game = this.findGame();
        this.joinGame(game.getId(), socket);
        return game;
    }
}
exports.Matchmaker = Matchmaker;
//# sourceMappingURL=matchmaker.js.map