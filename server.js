var players = {};  // Changed from array to object/dictionary

function getUrl() {
  return `http://localhost:5000/`
}

function BlobData(id, x, y, r, name, color, timestamp){
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
    this.name = name || 'Anonymous';
    this.color = color || 'red';
    this.timestamp = timestamp;
}

//Express is essentially Flask for JS
var express = require('express'); //Import express module
var app = express();
var server = app.listen(8000);

app.use(express.static('./public/frontpage')); //Return public files users are meant to see
app.use('/agario', express.static('./public/agario'));
var socket = require('socket.io');

var io = socket(server);

setInterval(heartbeat, 33);

function heartbeat(){
    io.sockets.emit('heartbeat', players);
}


async function postPlayer(playerId, playerName, color) {

  let url = `${getUrl()}players/add`

  console.log(`Players POST url: ${url}`)
  
  const rawRes = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        "id":playerId,
        "name":playerName,
        "colour":color
    }),
    credentials: 'include'
  })

  const data = await rawRes.json()

  console.log(data)
}

async function deletePlayer(playerId) {

  let url = `${getUrl()}players/${playerId}/update`

  console.log(`Players DELETE url: ${url}`)
  
  const rawRes = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  })

  const data = await rawRes.json()

  console.log(data)
}

async function updatePlayer(playerId, playerScore, updateTimestamp) {

  let url = `${getUrl()}players/${playerId}/update`

  console.log(`Players PATCH url: ${url}`)
  
  const rawRes = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        "score":playerScore,
        "updated_at":updateTimestamp
    }),
    credentials: 'include'
  })

  const data = await rawRes.json()

  console.log(data)
}

io.sockets.on('connection', newConnection);

function newConnection(socket){
    socket.on('start', function(data){
        var player = new BlobData(socket.id, data.x, data.y, data.r, data.name, data.color, data.timestamp);
        console.log('New player:', player);
        players[socket.id] = player;

        // add new player
        postPlayer(player.id, player.name, player.color)

    });

    socket.on('update', function(data){
        var blob = players[socket.id];  // Direct dictionary lookup by ID
        console.log(socket.id);
        if(blob){  // Check if blob exists
            const prevScore = blob.r
            blob.x = data.x;
            blob.y = data.y;
            blob.r = data.r;
            if (blob.r > prevScore) {
                const score = blob.r - prevScore
                updatePlayer(socket.id, score, Date.now())
            }
        }
    });

    socket.on('disconnect', function(){  // Added: Clean up when player disconnects
        delete players[socket.id];
        console.log('Player disconnected: ' + socket.id);
        deletePlayer(socket.id)
    });

    console.log('New connection from: ' + socket.id);
}