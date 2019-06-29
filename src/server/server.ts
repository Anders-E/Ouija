import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import { Logger } from 'winston';

import { logger } from './logger';
import { Player } from './player';
import { Game } from './game';

// Express, HTTP, and Socket.IO setup
const app: express.Express = express();
const httpServer: http.Server = new http.Server(app);
const io: socketio.Server = socketio(httpServer);

// Serve client
app.use(express.static('src/client'));

let game = new Game();

io.on(
    'connection',
    (playerSocket: socketio.Socket): void => {
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
const port = process.env.port || 3000;
httpServer.listen(port, (): Logger => logger.info({ message: `Ouija listening on port ${port}` }));
