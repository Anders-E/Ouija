"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express_1.default.static('src/client'));
io.on('connection', function (socket) {
    console.log('a user connected');
    // whenever we receive a 'message' we log it out
    socket.on('message', function (message) {
        console.log(message);
    });
});
const server = http.listen(3000, () => console.log('Ouija listening on port 3000'));
//# sourceMappingURL=server.js.map