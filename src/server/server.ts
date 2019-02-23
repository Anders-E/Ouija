import express from 'express';

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => res.sendFile(__dirname + '/client/index.html'));
app.get('/client/stylesheet.css', (req, res) => res.sendFile(__dirname + '/client/stylesheet.css'));
app.get('/client/main.mjs', (req, res) => res.sendFile(__dirname + '/client/main.mjs'));
app.get('/client/vector2.mjs', (req, res) => res.sendFile(__dirname + '/client/vector2.mjs'));
app.get('/client/marker.mjs', (req, res) => res.sendFile(__dirname + '/client/marker.mjs'));
app.get('/client/res/board.svg', (req, res) => res.sendFile(__dirname + '/client/res/board.svg'));
app.get('/client/res/marker.svg', (req, res) => res.sendFile(__dirname + '/client/res/marker.svg'));


io.on('connection', function(socket: any){
    console.log('a user connected');
    // whenever we receive a 'message' we log it out
    socket.on('message', function(message: any){
        console.log(message);
    });
});

const server = http.listen(3000, () => console.log('Ouija listening on port 3000'));
