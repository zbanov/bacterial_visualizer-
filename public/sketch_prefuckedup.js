var flock;
var canvasSizeX = 750;
var canvasSizeY = 500;
var backSound;


var firmSound;
var actSound;
var tenSound;
var verrSound;
var proSound;
var cyanSound;
var allSounds = [];
var exampleSocket = new WebSocket("ws://localhost:7474");

exampleSocket.onopen = function (event) {
	console.log("sending data...");
	exampleSocket.send("Ready, willing and able!");
};

exampleSocket.onmessage = function (event) {
	 let e = JSON.parse(event.data);
	 backSound = e.value_1;
	 firmSound = e.value_2;
	 actSound = e.value_3;
	 tenSound = e.value_4
	 verrSound = e.value_5;
	 proSound = e.value_6;
	 cyanSound = e.value_7;
	 allSounds = [backSound, firmSound, actSound, tenSound, verrSound, proSound, cyanSound];
};

function setup() {

createCanvas(canvasSizeX, canvasSizeY);
background(0);
//timeOfSwitch = millis();
flock = new Flock();
for (var i = 0; i < 10; i++) {
	console.log("explosion");
	var b = new Boid(width / 2, height / 2, createVector(random(-1.5,1.5),random(-1.5,)), 1);
	flock.addBoid(b);
  }
}


function draw() {
	noStroke();
  fill(0, 20);
  rect(0, 0, width, height);
	if (flock != undefined) {
		flock.run();
	}
	else soundCheck();
}

function soundCheck(){
	flock = new Flock();
	for (var i = 0; i < allSounds.length; i++){
			if (allSounds[i] > -25){
			console.log("explosion");
			var width = Math.floor((Math.random() * canvasSizeX) + 1);
			var height = Math.floor((Math.random() * canvasSizeY) + 1);
			for (var y = 0; y < 10; y++){
				var b = new Boid(width, height, createVector(random(-1.5,1.5),random(-1.5,)), i);
				flock.addBoid(b);
			  }
			}
		}
	}

function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}


Flock.prototype.run = function() {
  for (var i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids); // Passing the entire list of boids to each boid individually
    //this.boids[i].lineCheck();
    //this.boids[i].visualResponse();
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

Flock.prototype.removeBoid = function(x) {
  this.boids = this.boids.slice(x,1);
}


function Boid(x,y,r,c) {

  this.acceleration = createVector(random(-this.maxspeed, this.maxspeed), 0);
  this.r = 3;
  this.velocity = r;
  this.lifespan = 100;
  this.mass = random(2, 2.5);
	this.position = createVector(x,y);

	if (c == 1) {
		this.color = color(100,0,0);
	}
	else if (c == 2) {
		this.color = color(0,100,0);
	}
	else if (c == 3) {
		this.color = color(100,100,100);
	}
	else if (c == 4) {
		this.color = color(100,100,100);
	}
	else if (c == 5) {
		this.color = color(200,100,0);
	}
	else if (c == 6) {
		this.color = color(100,200,0);
	}
	else if (c == 7) {
		this.color = color(0,200,0);
	}
	else this.color = color(0,0,0);

}

Boid.prototype.run = function(boids) {

    this.update();
    //this.borders();
    this.display();
		this.timeout();
}


Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.velocity.add(force);
}

// Method to update location
Boid.prototype.update = function() {

  this.applyForce(p5.Vector.random2D());
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.acceleration.mult(0);
  this.lifespan--;

}
// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target, this.position); // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce); // Limit to maximum steering force
  return steer;
}


/*Boid.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
  var theta = this.velocity.heading() + radians(90);
  push();
  translate(this.position.x, this.position.y);
  rotate(theta);
  pop();
}*/

// Wraparound
Boid.prototype.borders = function() {

  if (this.position.x < -this.r){
		flock.removeBoid(this.boid);
  }
  if (this.position.y < -this.r){
    flock.removeBoid(this.boid);
  }
  if (this.position.x > width + this.r){
    flock.removeBoid(this.boid);

  }
  if (this.position.y > height + this.r){
    flock.removeBoid(this.boid);
  }

}

Boid.prototype.display = function() {

  fill(this.color,this.lifespan);
  ellipse(this.position.x, this.position.y,10,10);
}

Boid.prototype.timeout = function() {
	if (this.lifespan < 0){
	    flock = flock.removeBoid(this.boid);
	  }
	}
