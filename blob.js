function AgarBlob(x, y, radius, colour){
    this.pos = createVector(x, y);
    this.r = radius;
    this.area = PI*pow(this.r, 2);
    this.c = colour;

    //player blob parameters
    this.max_speed = 5
    this.min_speed = 0.3
    this.min_radius = radius
    this.current_speed = this.max_speed
    this.growth_slow_down_rate = 0.5

    //Velocity stuff
    this.vel = createVector(0, 0);

    this.update = function(){
    //Get mouse coords
    var newVel = createVector(mouseX-(width/2), mouseY-(height/2));

    //Set mouse vector magnitude to 3
    newVel.setMag(this.current_speed);
    this.vel.lerp(newVel, 0.2);
    this.pos.add(this.vel);
    }

    this.show = function() {
        fill(this.c);
        ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2)
    }

    this.eats = function (other){
        var d = p5.Vector.dist(this.pos, other.pos)
        if (d < this.r + other.r){
            this.area += other.area;
            this.r = this.get_radius_from_volume()
            var normalized_size = (this.r/this.min_radius)-1
            this.current_speed = this.max_speed * (1/(this.growth_slow_down_rate*(normalized_size) + 1)) + this.min_speed;
            return true;
        }
        else{
            return false;
        }
    }

    this.get_radius_from_volume = function(){
        return pow(this.area/PI, 0.5);
    }
}