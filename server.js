var players = {};  // Changed from array to object/dictionary

function BlobData(id, x, y, r){
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
}

//Express is essentially Flask for JS
var express = require('express'); //Import express module
var app = express();
var server = app.listen(8000);

app.use(express.static('./public/agario')); //Return public files users are meant to see

var socket = require('socket.io');

var io = socket(server);

setInterval(heartbeat, 33);

function heartbeat(){
    io.sockets.emit('heartbeat', players);
}

io.sockets.on('connection', newConnection);

function newConnection(socket){
    socket.on('start', function(data){
        var player = new BlobData(socket.id, data.x, data.y, data.r);  // Fixed: was creating string instead of object, added 'var'
        console.log(player);
        players[socket.id] = player;  // Dictionary lookup by ID
    });

    socket.on('update', function(data){
        var blob = players[socket.id];  // Direct dictionary lookup by ID
        console.log(socket.id);
        if(blob){  // Check if blob exists
            blob.x = data.x;
            blob.y = data.y;
            blob.r = data.r;
        }
    });

    socket.on('disconnect', function(){  // Added: Clean up when player disconnects
        delete players[socket.id];
        console.log('Player disconnected: ' + socket.id);
    });

    console.log('New connection from: ' + socket.id);
}