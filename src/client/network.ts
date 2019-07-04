export class Network {
    private socket: SocketIOClient.Socket;
    private markerPosition: THREE.Vector2;

    public constructor() {
        this.socket = io();
        this.socket.on('connect', this.onConnect);
    }

    public getMarkerPosition(): THREE.Vector2 {
        return this.markerPosition;
    }

    private onConnect(): void {
        this.socket.on('game_marker_pos', this.onGameMarkerPosition);
        this.socket.on('playerJoined', this.onPlayerJoined);
        this.socket.on('playerLeft', this.onPlayerLeft);

        console.log('connected to server');
        console.log(this.socket);
    }

    private onGameMarkerPosition(position: THREE.Vector2): void {
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
