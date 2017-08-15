var WebSocketServer = require('ws').Server,
    app = require('express')(),
    bodyparser = require('body-parser'),
    cors = require('cors'),
    io = require('socket.io');

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

io = io.listen(server);

io.on('connection', function (socket) {
    socket.on('message', function (from, message) {
        console.log('recieved message from', from, 'message', JSON.stringify(message));
        console.log('broadcasting message');
        console.log('payload is', message);
        io.sockets.emit('broadcast', {
            payload: message,
            source: from
        });
        console.log('broadcast complete');
    });
});