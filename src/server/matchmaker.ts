import { Socket } from 'socket.io';

import { Game } from './game';
import { Player } from './player';
import { logger } from './logger';

export class Matchmaker {
    private games: Map<string, Game>;

    public constructor() {
        this.games = new Map();
        logger.info('Matchmaker starter');
    }

    public addGame(): Game {
        const game = new Game();
        this.games.set(game.getId(), game);
        game.play();
        logger.info('New game started', game);
        return game;
    }

    public joinGame(gameId: string, socket: Socket): Game {
        const game = this.games.get(gameId);
        const player = new Player(socket);
        game.addPlayer(player);
        return game;
    }

    public findGame(): Game {
        for (const game of this.games.values()) if (!game.isPrivate && !game.isFull) return game;
        return this.addGame();
    }

    public findAndJoinGame(socket: Socket): Game {
        const game = this.findGame();
        this.joinGame(game.getId(), socket);
        return game;
    }
}
