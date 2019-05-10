import express from 'express';
import { Socket } from 'socket.io';
import { Logger } from 'winston';

import { logger } from './logger';
import { Player } from './player';
import { Game } from './game';
import { Server } from 'http';

// TODO Convert to ES6 Module imports
const app: express.Express = express();
const http: Server = require('http').Server(app);
const io: Socket = require('socket.io')(http);

app.use(express.static('src/client'));

let game = new Game();

io.on(
    'connection',
    (playerSocket: Socket): void => {
        logger.info({
            message: 'A user connected',
            event: 'connection',
            socketId: playerSocket.id
        });

        game.addPlayer(new Player(playerSocket));

        playerSocket.on(
            'disconnect',
            (): void => {
                logger.info({
                    message: 'A user disconnected',
                    event: 'disconnect',
                    socketId: playerSocket.id
                });
            }
        );
    }
);

game.play();

// const server: Server =
http.listen(3000, (): Logger => logger.info({ message: 'Ouija listening on port 3000' }));
