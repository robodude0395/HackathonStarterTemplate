var socket;

var size = 10;

var pen_colour;

function setup() {
  createCanvas(400, 400);
  background(220);
  pen_colour = color(random(255), random(255), random(255));
  socket = io.connect('http://localhost:3000');

  socket.on('mouse', newDrawing);

}

function newDrawing(data) {
  noStroke();
  fill(data.pen_colour_r, data.pen_colour_g, data.pen_colour_b);
  ellipse(data.x, data.y, data.sizeX, data.sizeY);
}

function mouseDragged(){
  noStroke();
  fill(pen_colour);
  ellipse(mouseX, mouseY, size, size);

  var data = {
    x: mouseX,
    y: mouseY,
    sizeX : size,
    sizeY : size,
    pen_colour_r : red(pen_colour),
    pen_colour_b : blue(pen_colour),
    pen_colour_g : green(pen_colour)
  }

  socket.emit('mouse', data);
}

function draw() {
}
