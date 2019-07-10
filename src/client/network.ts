import io from 'socket.io-client';

import { MarkerPositionMsg } from '../shared/messages';

export class Network {
    private static instance: Network;

    private socket: SocketIOClient.Socket;
    private markerPosition: MarkerPositionMsg = { x: 0, y: 0 };

    public constructor() {
        this.socket = io();
        this.socket.on('connect', (): void => {
            this.socket.on('game_marker_pos', this.onGameMarkerPosition.bind(this));
            this.socket.on('playerJoined', this.onPlayerJoined.bind(this));
            this.socket.on('playerLeft', this.onPlayerLeft.bind(this));

            console.log('connected to server');
            console.log(this.socket);
        });
    }

    public static getInstance(): Network {
        if (this.instance == null) {
            this.instance = new Network();
        }
        return this.instance;
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

    private onGameMarkerPosition(position: MarkerPositionMsg): void {
        this.markerPosition = position;
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
