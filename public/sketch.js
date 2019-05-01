var canvasSizeX = 1500;
var canvasSizeY = 800;
var backSound;
var firmSound;
var actSound;
var tenSound;
var verrSound;
var proSound;
var cyanSound;
var dayNum;
var exampleSocket = new WebSocket("ws://localhost:7474");
var locations;
var play = false;

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
	 dayNum = e.value_8;
};



function setup() {

createCanvas(canvasSizeX, canvasSizeY);
background(0);

}



function draw() {
  noStroke();
  fill(0, 20);
  rect(0, 0, width, height);
	allSounds = [backSound, firmSound, actSound, tenSound, verrSound, proSound, cyanSound];
	let s = 'Day ' + dayNum;
	fill(500);
	text(s, 10, 10, 70, 80);
	if (backSound != -999 && backSound != 0){
		fill(500);
		text("Bacteriodetes: Purple, Violin", 10,50);
		}
	if (firmSound != -999 && firmSound != 0){
		fill(500);
		text("Firmicutes: Green, Bassoon", 10, 70);
			}
	if (actSound != -999 && actSound != 0){
		fill(500);
		text("Actinobacteria: Orange, Oboe", 10, 90);
					}
	if (tenSound != -999 && tenSound != 0){
		fill(500);
		text("Tenericutes: Yellow, Viola", 10, 110);
		}
	if (verrSound != -999 && verrSound != 0){
		fill(500);
		text("Verrucomicrobia: Red, Flute", 10, 130);
				}
	if (proSound != -999 && proSound != 0){
		fill(500);
		text("Proteobacteria: Brown, Clarinet", 10, 150);
	}
	if (cyanSound != -999 && cyanSound != 0){
		fill(500);
		text("Cyanobacteria: Blue, Horn", 10, 170);
	}
	runFlocks();
	soundCheck();
	locations = JSON.stringify({
		"bac": (allFlocks[0].width/(canvasSizeX)*2)-1,
		"firm": (allFlocks[1].width/(canvasSizeX)*2)-1,
		"act": (allFlocks[2].width/(canvasSizeX)*2)-1,
		"ten": (allFlocks[3].width/(canvasSizeX)*2)-1,
		"verr": (allFlocks[4].width/(canvasSizeX)*2)-1,
		"pro": (allFlocks[5].width/(canvasSizeX)*2)-1,
		"cyan": (allFlocks[6].width/(canvasSizeX)*2)-1,});
}

function soundCheck() {
	for (var i = 0; i < allSounds.length; i++){
		if (allSounds[i] > -25 && allSounds[i] != 0 && allFlocks[i].play == false){
			allFlocks[i].play = true;
			allFlocks[i].width = Math.floor((Math.random() * canvasSizeX) + 1);
			allFlocks[i].height = Math.floor((Math.random() * canvasSizeY) + 1);
			allFlocks[i].playSound = allSounds[i];
			exampleSocket.send(locations);
			for (var y = 0; y < allSounds[i] + 50; y++) {
				var b = new Boid(allFlocks[i].width, allFlocks[i].height, createVector(random(-1.0,1.0),random(-1.5,)), i, 100);
				allFlocks[i].addBoid(b);
		  	}
			}
		else if (allFlocks[i].play == true && allFlocks[i].playSound < allSounds[i] + 5){
			for (var y = 0; y < allSounds[i] - allFlocks[i].playSound; y++) {
				var b = new Boid(allFlocks[i].width, allFlocks[i].height, createVector(random(-1.0,1.0),random(-1.5,)), i, 100);
				allFlocks[i].addBoid(b);
				allFlocks[i].playSound = allSounds[i];
				exampleSocket.send(locations);
		  	}
		}
		else if (allFlocks[i].play == true && allFlocks[i].playSound-10 > allSounds[i]){
			for (var y = 0; y < allFlocks[i].boids.length; y++){
					allFlocks[i].removeBoid(y);
					console.log("removing");
				}
				allFlocks[i].play = false;
				allFlocks[i].playSound = 0;
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
	this.height = 0;
	this.width = 0;
	this.playSound = 0;
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
	this.maxspeed = 1;

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
    this.borders();
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

Boid.prototype.borders = function() {
  if (this.position.x < -this.r)  this.velocity.x *= -1;
  if (this.position.y < -this.r)  this.velocity.y *= -1;
  if (this.position.x > width +this.r) this.velocity.x *= -1;
  if (this.position.y > height+this.r) this.velocity.y *= -1;
}


Boid.prototype.display = function() {

  fill(this.color,this.lifespan);
  ellipse(this.position.x, this.position.y,10,10);

}
