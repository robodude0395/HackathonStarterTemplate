var player_blob;

var blobs = [];

function setup() {
  createCanvas(800, 800);
  player_blob = new AgarBlob(width/2, height/2, 10, color(255, 0, 0));
  for(var i = 0; i < 500; i++){
    var x = random(-width, width*2)
    var y = random(-height, height*2)

    blobs[i] = new AgarBlob(x, y, random(5, 20), color(random(255),random(255),random(255)));
  }
}

function draw() {
  //UPDATE
  player_blob.update();
  translate((width/2)-player_blob.pos.x, (height/2)-player_blob.pos.y)

  //DRAW
  background(0);
  player_blob.show();

  for (var i = blobs.length-1; i >= 0; i--){
    blobs[i].show();
    if(player_blob.eats(blobs[i])){
      blobs.splice(i, 1); //Remove eaten blob
    }
  }
}