var socket;

var player_blob;

var players = [];

var padding = 100;

var zoom = 1;

var starting_radius = 64;

function setup() {
  createCanvas(800, 800);
  player_blob = new AgarBlob(random(width), random(height) , starting_radius, color(255, 0, 0));

  socket = io.connect('http://localhost:3000');

  var data = {
    x: player_blob.pos.x,
    y: player_blob.pos.y,
    r : player_blob.r
  };

  socket.emit('start', data);

  socket.on('heartbeat',
    function(data){
      players = data;
    }
  )
}

function draw() {
  //UPDATE
  player_blob.update();
  //Translate origin so that camera stays fixed to player blob
  translate(width/2, height/2);

  newzoom = starting_radius/player_blob.r;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-player_blob.pos.x, -player_blob.pos.y);

  var data = {
    x: player_blob.pos.x,
    y: player_blob.pos.y,
    r : player_blob.r
  };

  socket.emit('update', data);

  //DRAW
  background(0);
  stroke(255);  // White border
  strokeWeight(5);  // Border thickness
  noFill();  // No fill, just outline
  rect(-(width*4)-padding, -(height*4)-padding, (width*8) + padding, (height*8) + padding);  // Border rectangle

  player_blob.constrain();
  player_blob.show();

  console.log(players);

  fill(255);
  textAlign(CENTER);
  strokeWeight(1);  // Border thickness
  text(socket.id, player_blob.pos.x, player_blob.pos.y + player_blob.r+15);  // Fixed: was just 'r'

  // Iterate through players object/dictionary
  for (var id in players){
    if(id == socket.id){
      continue;
    }
    var other_player = players[id];  // Get the player object by key
    console.log(other_player);
    fill(0, 0, 255);
    strokeWeight(5);  // Border thickness
    ellipse(other_player.x, other_player.y, other_player.r*2, other_player.r*2);

    fill(255);
    textAlign(CENTER);
    strokeWeight(1);  // Border thickness
    text(other_player.id, other_player.x, other_player.y + other_player.r+15);  // Fixed: was just 'r'
  }
}