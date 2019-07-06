import io from 'socket.io-client';

import { MarkerPositionMsg } from '../shared/messages';

export class Network {
    private socket: SocketIOClient.Socket;
    private markerPosition: MarkerPositionMsg;

    public constructor() {
        this.socket = io();
        console.log(this.socket);
        this.socket.on('connect', (): void => {
            this.socket.on('game_marker_pos', (position: MarkerPositionMsg): void => {
                this.markerPosition = position;
            });
            this.socket.on('playerJoined', this.onPlayerJoined);
            this.socket.on('playerLeft', this.onPlayerLeft);

            console.log('connected to server');
            console.log(this.socket);
        });
    }

    public findGame(): void {
        this.socket.emit('findGame');
    }

    public getMarkerPosition(): MarkerPositionMsg {
        return this.markerPosition;
    }

    public getSocket(): SocketIOClient.Socket {
        return this.socket;
    }

    private onPlayerJoined(id: string): void {
        console.log('Player ' + id + ' connected');
        // onPlayerJoined();
    }

    private onPlayerLeft(id: string): void {
        console.log('Player ' + id + ' left');
        // onPlayerLeft();
    }
}
