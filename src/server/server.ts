import express from 'express';
import { Player } from './player';
import { Vector2 } from './vector2';
import { Socket } from 'socket.io';
import { PosMsg } from './interfaces/posmsg';
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

        playerSocket.on(
            'player_marker_pos',
            (pos: PosMsg): void => {
                let markerPos = new Vector2(pos.x, pos.y);
                playerSocket.emit('game_marker_pos', markerPos);
                console.log(pos);
            },
        );
    },
);

// const server: Server =
http.listen(3000, (): void => console.log('Ouija listening on port 3000'));
