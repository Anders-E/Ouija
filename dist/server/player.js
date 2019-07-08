"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector2_1 = require("./vector2");
const logger_1 = require("./logger");
class Player {
    constructor(socket) {
        this.didSendInput = false;
        this.id = socket.id;
        this.socket = socket;
        this.pos = new vector2_1.Vector2();
        this.socket.on('player_marker_pos', (pos) => {
            this.input = pos;
            this.didSendInput = true;
            logger_1.logger.debug({
                message: 'Input received from player',
                event: 'player_marker_pos',
                id: this.id,
                input: pos
            });
        });
    }
}
exports.Player = Player;
//# sourceMappingURL=player.js.map