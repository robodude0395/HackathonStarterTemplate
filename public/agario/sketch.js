var socket;
var player_blob;
var players = [];
var padding = 100;
var zoom = 1;
var starting_radius = 64;

// Make these global so they can be used in draw()
var playerName;
var playerColor;
var food = [];
var isDead = false;

function getUrlParameter(name){
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

function parseColorString(colorStr) {
  // Remove parentheses and split by comma
  const parts = colorStr.replace(/[()]/g, '').split(',');
  return parts.map(part => parseInt(part.trim()));
}

function drawDeathScreen() {
  // Reset transformations
  resetMatrix();

  // Grey overlay
  background(0, 0, 0, 200);

  // Death message
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("You Were Eaten!", width/2, height/2 - 50);

  textSize(24);
  text("Click to return to menu", width/2, height/2 + 50);
}

function mousePressed() {
  if (isDead) {
    // Redirect back to frontpage
    window.location.href = '/';
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Get player info from URL - now storing in global variables
  playerName = getUrlParameter('name') || 'Anonymous';
  playerColor = parseColorString(getUrlParameter('color') || 'red');
  const timestamp = getUrlParameter('timestamp');

  console.log(playerColor[0] + " " + playerColor[1] + " " + playerColor[2]);

  const blobColor = color(playerColor[0], playerColor[1], playerColor[2]) || color(255, 0, 0);
  player_blob = new AgarBlob(random(-3200, 3200), random(-3200, 3200), starting_radius, blobColor);

  socket = io.connect('http://hackathon-team-6-lb-706940063.eu-west-2.elb.amazonaws.com:80/');
  //socket = io.connect('http://localhost:8000/');

  var data = {
    x: player_blob.pos.x,
    y: player_blob.pos.y,
    r: player_blob.r,
    name: playerName,
    color: playerColor,
    timestamp: timestamp
  };

  socket.emit('start', data);

  socket.on('heartbeat',
    function(data){
      players = data.players;
      food = data.food;
    }
  )
}

function calculateScore(radius) {
  return Math.round(PI * Math.pow(radius, 2));
}

function draw() {
  // If dead, show death screen
  if (isDead) {
    drawDeathScreen();
    return;  // Stop the rest of draw from executing
  }

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
    r: player_blob.r,
    name: playerName,
    color: playerColor
  };

  socket.emit('update', data);

   // Update score display
  const playerScore = calculateScore(player_blob.r);
  document.getElementById('score-value').textContent = playerScore;

  //DRAW
  background(0);
  stroke(255);  // White border
  strokeWeight(5);  // Border thickness
  noFill();  // No fill, just outline
  rect(-3200-padding, -3200-padding, 6400 + padding*2, 6400 + padding*2);  // Border rectangle

  player_blob.constrain();
  player_blob.show();

  fill(255);
  textAlign(CENTER);
  strokeWeight(1);
  textSize(16 / zoom);  // Adjust text size inversely to zoom
  text(playerName, player_blob.pos.x, player_blob.pos.y + player_blob.r+25);

  // Iterate through players object/dictionary
  for (var id in players){
    if(id == socket.id){
      continue;
    }
    var other_player = players[id];

    // Use the color array directly
    fill(other_player.color[0], other_player.color[1], other_player.color[2]);
    strokeWeight(5);
    ellipse(other_player.x, other_player.y, other_player.r*2, other_player.r*2);

    fill(255);
    textAlign(CENTER);
    strokeWeight(1);
    textSize(16 / zoom);  // Adjust text size inversely to zoom
    text(other_player.name || other_player.id, other_player.x, other_player.y + other_player.r+25);

    // Check collision with other players (only if not already dead)
    if (!isDead) {
      var other_pos = createVector(other_player.x, other_player.y);
      var d = p5.Vector.dist(player_blob.pos, other_pos);

      if (d < player_blob.r + other_player.r) {
        // If player is bigger, eat the other player
        if (player_blob.r > other_player.r) {
          player_blob.area += PI * pow(other_player.r, 2);
          player_blob.r = player_blob.get_radius_from_volume();
          player_blob.current_speed = player_blob.max_speed * pow(player_blob.min_radius / player_blob.r, 2) + player_blob.min_speed;

          // Notify server that this player was eaten
          socket.emit('player_eaten', { eatenId: id });
        }
        // If other player is bigger, you got eaten
        else if (other_player.r > player_blob.r) {
          isDead = true;
          socket.emit('i_was_eaten', { killerId: id, killerName: other_player.name });
        }
      }
    }
  }

  // Draw and check collision with food pellets
  for (var i = 0; i < food.length; i++){
    var foodItem = food[i];

    // Draw food - foodItem.color is already an array [r, g, b]
    fill(foodItem.color[0], foodItem.color[1], foodItem.color[2]);
    noStroke();
    ellipse(foodItem.x, foodItem.y, foodItem.r*2, foodItem.r*2);

    // Check if player can eat this food
    if (!isDead) {
      var foodPos = createVector(foodItem.x, foodItem.y);
      var d = p5.Vector.dist(player_blob.pos, foodPos);

      if (d < player_blob.r + foodItem.r) {
        // Eat the food
        player_blob.area += PI * pow(foodItem.r, 2);
        player_blob.r = player_blob.get_radius_from_volume();
        player_blob.current_speed = player_blob.max_speed * pow(player_blob.min_radius / player_blob.r, 2) + player_blob.min_speed;

        // Notify server
        socket.emit('food_eaten', { foodId: foodItem.id });
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Update leaderboard on client side
function updateLeaderboard(leaderboardData) {
  const listItems = document.querySelectorAll('#leaderboard-list li');

  leaderboardData.forEach((player, index) => {
    if (index < 10) {
      const rankSpan = listItems[index].querySelector('.rank');
      const nameSpan = listItems[index].querySelector('.player-name');
      const scoreSpan = listItems[index].querySelector('.score');

      rankSpan.textContent = index + 1;
      nameSpan.textContent = player.name || '---';

      // Calculate area from radius: area = π * r², rounded
      const area = calculateScore(player.score);
      scoreSpan.textContent = area;
    }
  });
}

// Fetch leaderboard from API and update
async function fetchLeaderboard() {
  try {
    const response = await fetch('http://localhost:5000/players/leaderboard');
    const leaderboard = await response.json();
    updateLeaderboard(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
}

// Update leaderboard every 5 seconds
setInterval(fetchLeaderboard, 5000);
fetchLeaderboard(); // Initial load