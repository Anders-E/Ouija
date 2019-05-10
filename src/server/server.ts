import express from 'express';
import { Socket } from 'socket.io';

import { logger } from './logger';
import { Player } from './player';
import { Game } from './game';
import winston = require('winston');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('src/client'));

let game = new Game();

io.on(
    'connection',
    (playerSocket: Socket): void => {
        logger.info({
            message: 'A player connected',
            socketId: playerSocket.id
        });
        game.addPlayer(new Player(playerSocket));

        playerSocket.on(
            'disconnect',
            (): void => {
                logger.info({
                    message: 'A user disconnected',
                    socketId: playerSocket.id
                });
            }
        );
    }
);

game.play();

// const server: Server =
http.listen(3000, (): winston.Logger => logger.info({ mesage: 'Ouija listening on port 3000' }));
