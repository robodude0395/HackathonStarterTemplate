var players = {};  // Changed from array to object/dictionary
var food = [];

function BlobData(id, x, y, r, name, color, timestamp){
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
    this.name = name || 'Anonymous';
    this.color = color || 'red';
    this.timestamp = timestamp;
}

function FoodData(id, x, y, r, color){
    this.id = id;
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color;
}

// Generate initial food
for(var i = 0; i < 1500; i++){
    var x = Math.random() * 6400 - 3200;  // -3200 to 3200
    var y = Math.random() * 6400 - 3200;
    var r = Math.random() * 15 + 5;  // 5 to 20
    var color = [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)
    ];
    food.push(new FoodData(i, x, y, r, color));
}

// Backend functions
function getUrl() { // stem for backend host - need to run api.py and node server together!
  return `http://localhost:5000/`
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
    io.sockets.emit('heartbeat', { players: players, food: food });

    //DEV CODE BELOW
    //Loop through players
    //Send API REQUESTS TO THE LEADERBOARD for each player to change scores
    // DEV Question: do we need to loop through all players, or update as done below only when individual players change size?
}

io.sockets.on('connection', newConnection);

function newConnection(socket){
    socket.on('start', function(data){
        var player = new BlobData(socket.id, data.x, data.y, data.r, data.name, data.color, data.timestamp);
        console.log('New player:', player);
        players[socket.id] = player;

        //DEV DEV CODE - Add new player to leaderboard BELOW
        // add new player
        postPlayer(player.id, player.name, player.color)
    });

    socket.on('update', function(data){
        var blob = players[socket.id];  // Direct dictionary lookup by ID
        console.log(players);
        if(blob){  // Check if blob exists
            const prevScore = blob.r;
            blob.x = data.x;
            blob.y = data.y;
            blob.r = data.r;
            if (blob.r > prevScore) {
                const score = ((blob.r - prevScore) * 100).toFixed(0)
                updatePlayer(socket.id, score, Date.now())
            }
        }
    });

    socket.on('food_eaten', function(data){
        // Find and remove the food
        var foodIndex = food.findIndex(f => f.id === data.foodId);
        if(foodIndex !== -1){
            food.splice(foodIndex, 1);

            // Respawn new food
            var x = Math.random() * 6400 - 3200;
            var y = Math.random() * 6400 - 3200;
            var r = Math.random() * 15 + 5;
            var color = [
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255)
            ];
            var newId = Date.now() + Math.random();  // Unique ID
            food.push(new FoodData(newId, x, y, r, color));
        }
    });

    socket.on('disconnect', function(){  // Added: Clean up when player disconnects
        delete players[socket.id];
        console.log('Player disconnected: ' + socket.id);

        //DEV LEADERBOARD DISCONNECT CODE BELOW  
        // Maybe not on disconnect (record all time top score?)

    });

    socket.on('player_eaten', function(data) {
    // Remove the eaten player
    delete players[data.eatenId];
    console.log('Player eaten: ' + data.eatenId);
    });

    socket.on('i_was_eaten', function(data) {
        
    deletePlayer(socket.id) // remove from leaderboard if eaten
        
    // Remove this player from the game
    delete players[socket.id];
    console.log(socket.id + ' was eaten by ' + data.killerId);
    });

    console.log('New connection from: ' + socket.id);
}