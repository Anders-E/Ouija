import express from 'express';
import { Player } from './player';
import { Socket } from 'socket.io';
import { Game } from './game';

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('src/client'));

let game = new Game();

io.on(
    'connection',
    (playerSocket: Socket): void => {
        console.log('a player connected');
        game.addPlayer(new Player(playerSocket));

        playerSocket.on(
            'disconnect',
            (): void => {
                console.log('a user disconnected');
            },
        );
    },
);

game.play();

// const server: Server =
http.listen(3000, (): void => console.log('Ouija listening on port 3000'));
