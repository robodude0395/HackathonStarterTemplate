var player_blob;

var blobs = [];

var padding = 100;

var zoom = 1;

var starting_radius = 64;

function setup() {
  createCanvas(800, 800);
  player_blob = new AgarBlob(0, 0 , starting_radius, color(255, 0, 0));
  for(var i = 0; i < 5000; i++){
    var x = random(-width*4, width*4);
    var y = random(-height*4, height*4);
    var blob_color = color(random(255),random(255),random(255));

    blobs[i] = new AgarBlob(x, y, random(5, 20), blob_color);
  }
}

function draw() {
  //UPDATE
  player_blob.update();
  //Translate origin so that camera stays fixed to player blob
  translate(width/2, height/2);

  newzoom = starting_radius/player_blob.r;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-player_blob.pos.x, -player_blob.pos.y)

  //DRAW
  background(0);
  stroke(255);  // White border
  strokeWeight(5);  // Border thickness
  noFill();  // No fill, just outline
  rect(-(width*4)-padding, -(height*4)-padding, (width*8) + padding, (height*8) + padding);  // Border rectangle

  player_blob.show();

  for (var i = blobs.length-1; i >= 0; i--){
    blobs[i].show();
    if(player_blob.eats(blobs[i])){
      blobs.splice(i, 1); //Remove eaten blob
    }
  }
}