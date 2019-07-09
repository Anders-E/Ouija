import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import { Logger } from 'winston';

import { config } from './config';
import { logger } from './logger';
import { Matchmaker } from './matchmaker';

// Express, HTTP, and Socket.IO setup
const app: express.Express = express();
const httpServer: http.Server = new http.Server(app);
export const io: socketio.Server = socketio(httpServer);

// Serve client
app.use(express.static('public'));

const mm = new Matchmaker();

io.on('connection', (playerSocket: socketio.Socket): void => {
    logger.info({
        message: 'A user connected',
        event: 'connection',
        socketId: playerSocket.id
    });

    // game.addPlayer(new Player(playerSocket));

    playerSocket.on('findGame', (): void => {
        logger.info({
            message: 'Socket has requested to find game',
            event: 'findGame',
            socketId: playerSocket.id
        });
        mm.findAndJoinGame(playerSocket);
    });

    playerSocket.on('joinGame', (gameId: string): void => {
        mm.joinGame(gameId, playerSocket);
    });

    playerSocket.on('disconnect', (): void => {
        logger.info({
            message: 'A user disconnected',
            event: 'disconnect',
            socketId: playerSocket.id
        });
    });
});

httpServer.listen(
    config.port,
    (): Logger => logger.info({ message: `Ouija listening on port ${config.port}` })
);
