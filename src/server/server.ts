import express from 'express';

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('src/client'));

io.on('connection', function(socket: any){
    console.log('a user connected');
    // whenever we receive a 'message' we log it out
    socket.on('message', function(message: any){
        console.log(message);
    });
});

const server = http.listen(3000, () => console.log('Ouija listening on port 3000'));
