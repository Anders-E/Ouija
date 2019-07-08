"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const logger_1 = require("./logger");
const matchmaker_1 = require("./matchmaker");
// Express, HTTP, and Socket.IO setup
const app = express_1.default();
const httpServer = new http_1.default.Server(app);
exports.io = socket_io_1.default(httpServer);
// Serve client
app.use(express_1.default.static('public'));
const mm = new matchmaker_1.Matchmaker();
exports.io.on('connection', (playerSocket) => {
    logger_1.logger.info({
        message: 'A user connected',
        event: 'connection',
        socketId: playerSocket.id
    });
    // game.addPlayer(new Player(playerSocket));
    playerSocket.on('findGame', () => {
        logger_1.logger.info({
            message: 'Socket has requested to find game',
            event: 'findGame',
            socketId: playerSocket.id
        });
        mm.findAndJoinGame(playerSocket);
    });
    playerSocket.on('joinGame', (gameId) => {
        mm.joinGame(gameId, playerSocket);
    });
    playerSocket.on('disconnect', () => {
        logger_1.logger.info({
            message: 'A user disconnected',
            event: 'disconnect',
            socketId: playerSocket.id
        });
    });
});
const port = process.env.port || 3000;
httpServer.listen(port, () => logger_1.logger.info({ message: `Ouija listening on port ${port}` }));
//# sourceMappingURL=server.js.map