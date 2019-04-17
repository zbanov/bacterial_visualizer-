var canvasSizeX = 1500;
var canvasSizeY = 800;
var backSound;
var firmSound;
var actSound;
var tenSound;
var verrSound;
var proSound;
var cyanSound;
var allSounds = [];
var heartBeat;
var exampleSocket = new WebSocket("ws://localhost:7474");

backFlock = new Flock();
firmFlock = new Flock();
actFlock = new Flock();
tenFlock = new Flock();
verrFlock = new Flock();
proFlock = new Flock();
cyanFlock = new Flock();
allFlocks = [backFlock, firmFlock, actFlock, tenFlock, verrFlock, proFlock, cyanFlock];

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
	 heartBeart = e.value_8;
	 allSounds = [backSound, firmSound, actSound, tenSound, verrSound, proSound, cyanSound];
};

function setup() {

createCanvas(canvasSizeX, canvasSizeY);
background(0);

}


function draw() {
  noStroke();
  fill(0, 20);
  rect(0, 0, width, height);
	soundCheck();
	runFlocks();
	}

function soundCheck() {
	for (var i = 0; i < allSounds.length; i++){
		if (allSounds[i] > -50 && allSounds[i] != 0 && allFlocks[i].play == false){
			allFlocks[i].play = true;
			var width = Math.floor((Math.random() * canvasSizeX) + 1);
			var height = Math.floor((Math.random() * canvasSizeY) + 1);
			for (var y = 0; y < allSounds[i] + 50; y++) {
				var b = new Boid(width / 2, height / 2, createVector(random(-1.5,1.5),random(-1.5,)), i, 100);
				allFlocks[i].addBoid(b);
		  	}
			}
		else if (allFlocks[i].play == true && allSounds[i] < -50){
			for (var y = 0; y < allFlocks[i].boids.length; y++){
					allFlocks[i].removeBoid(y);
					console.log("removing");
				}
				allFlocks[i].play = false;
		}
	}
}

/*function soundCheck(){
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
*/
function runFlocks(){
	for (var i = 0; i < allSounds.length; i++){
		allFlocks[i].run();
			}
		}

function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
	this.play = false;
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
	 this.boids = this.boids.slice(x-1,x+1);
}


function Boid(x,y,r,c, l) {

  this.acceleration = createVector(random(-this.maxspeed, this.maxspeed), 0);
  this.r = 3;
  this.velocity = r;
  this.lifespan = l;
  this.mass = random(2, 2.5);
	this.position = createVector(x,y);

	if (c == 0) {
		this.color = color(102,0,102);
	}
	else if (c == 1) {
		this.color = color(0,153,0);
	}
	else if (c == 2) {
		this.color = color(255,128,0);
	}
	else if (c == 3) {
		this.color = color(255,255,0);
	}
	else if (c == 4) {
		this.color = color(255,0,0);
	}
	else if (c == 5) {
		this.color = color(153,76,0);
	}
	else if (c == 6) {
		this.color = color(100,128,255);
	}
	else this.color = color(0,0,0);
}

Boid.prototype.run = function(boids) {

    this.update();
    //this.borders();
    this.display();
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


Boid.prototype.display = function() {

  fill(this.color,this.lifespan);
  ellipse(this.position.x, this.position.y,10,10);

}
