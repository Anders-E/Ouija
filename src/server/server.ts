import express from 'express';
import * as fs from 'fs';
import { createLogger, format, transports } from 'winston';

import { Player } from './player';
import { Socket } from 'socket.io';
import { Game } from './game';
import winston = require('winston');

const logDir = './logs';
if (!fs.existsSync) {
    fs.mkdirSync(logDir);
}

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'ouija' },
    transports: [
        new transports.File({ filename: logDir + '/error.log', level: 'error' }),
        new transports.File({ filename: logDir + '/all.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({ format: format.combine(format.colorize(), format.simple()) }));
}

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
