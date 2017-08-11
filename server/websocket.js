var WebSocketServer = require('ws').Server,
    app = require('express')(),
    bodyparser = require('body-parser'),
    cors = require('cors'),
    socket = require('socket.io');

app.use(bodyparser.urlencoded({
    extended: false
}));

app.use(bodyparser.json());

app.use(cors());

var port = 4444;

//method 1
var server = app.listen(port, function () {
    console.log("Server is listening on port: ", port);
});

var io = socket(server);

//method 2
//OR
/* 
var io = socket();
io.listen(port, function () {
    console.log("Server is listening on port: ", port);
}));
*/

io.on('connection', function (client) {
    debugger;
    console.log("Client connected.");

    client.on('event', function (data) {
        debugger;
    });

    client.on('disconnect', function (data) {
        debugger;
        console.log("Client disconnected.");
    });
});

//var ws = new WebSocket('ws://localhost:4445');
/* var wss = new WebSocketServer({
    port: 4445
});

wss.on('connection', function (ws) {
    console.log('Connection opened.');
    ws.send('Connection opened.');
});

wss.on('message', function (incomingData) {
    console.log('Incoming data: ', incomingData);
}); */