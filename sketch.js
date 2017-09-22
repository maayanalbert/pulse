// Mutual repulsion, with optional gravity

var myParticles = [];
var nParticles = 300; 
var maxRadius = 100
 
//==========================================================



function setup() {
    createCanvas(1000, 600);
    noStroke()
 
    for (var i = 0; i < nParticles; i++) {
        var radius = random(0, maxRadius)
        var angle = random(0, TWO_PI)
        var rx = cos(angle)* radius + width/2
        var ry = sin(angle) * radius + height/2
        // var rx = random(width/2 - radius, width/2 + radius);
        // var ry = random(height/2 - radius, height/2 + radius);
        myParticles[i] = new Particle(random(5, 7));
        myParticles[i].set(rx, ry);
    }
}
 
 
function keyPressed() {
    for (var i = 0; i < myParticles.length; i++) {
        myParticles[i].px = random(width);
        myParticles[i].py = random(height);
    }
}

 
//==========================================================
function draw() {
    background(255);
 
    var gravityForcex = 0;
    var gravityForcey = 0.05;
    var mutualRepulsionAmount = .5;
    var mouseMutualRepulsionAmount = 500;
 
 
    for (var i = 0; i < myParticles.length; i++) {
        var ithParticle = myParticles[i];
        var px = ithParticle.px;
        var py = ithParticle.py;
 
 
        for (var j = 0; j < i; j++) {
            var jthParticle = myParticles[j];
            var qx = jthParticle.px;
            var qy = jthParticle.py;
 
            var dx = px - qx;
            var dy = py - qy;
            var dh = sqrt(dx*dx + dy*dy);
            if (dh > 1.0) {
                 
                var componentInX = dx/dh;
                var componentInY = dy/dh;
                var proportionToDistanceSquared = 1.0/(dh*dh);
                 
                var repulsionForcex = mutualRepulsionAmount * componentInX * proportionToDistanceSquared;
                var repulsionForcey = mutualRepulsionAmount * componentInY * proportionToDistanceSquared;
 
                ithParticle.addForce( repulsionForcex,  repulsionForcey); // add in forces
                jthParticle.addForce(-repulsionForcex, -repulsionForcey); // add in forces
            }
        }

        var dMouseX = px - mouseX
        var dMouseY = py - mouseY
        var dMouse = sqrt(dMouseX**2 + dMouseY**2);

        if (dMouse < 400 && dMouse > 8) {

          var mouseComponentInX = dMouseX/dMouse;
          var mouseComponentInY = dMouseY/dMouse;
          var mouseProportionToDistanceSquared = 1.0/(dMouse**2);
                 
          var mouseRepulsionForcex = (mouseMutualRepulsionAmount) * mouseComponentInX * mouseProportionToDistanceSquared;
          var mouseRepulsionForcey = (mouseMutualRepulsionAmount) * mouseComponentInY * mouseProportionToDistanceSquared;
 
          ithParticle.addForce(-mouseRepulsionForcex, -mouseRepulsionForcey); // add in forces
        }else{
          // ithParticle.addForce(-mouseRepulsionForcex, -mouseRepulsionForcey);
          // ithParticle.px = ithParticle.px *.99 + mouseX *.01
          // ithParticle.py = ithParticle.py *.99 + mouseY* .01
        }


    }
 
    for (var i = 0; i < myParticles.length; i++) {
        myParticles[i].bPeriodicBoundaries = false;
        myParticles[i].bElasticBoundaries = true;
        myParticles[i].update(); // update all locations
    }
 
    for (var i = 0; i < myParticles.length; i++) {
        myParticles[i].render(); // draw all particles
    }
}

 
//==========================================================
//========================================================== 
function Particle(size){
  this.px=0;
  this.py=0;
  this.vx=0;
  this.vy=0;
  this.damping=0.96;
  this.mass=1.0;
  this.bLimitVelocities=true;
  this.bPeriodicBoundaries=false;
  this.bElasticBoundaries=false;
  this.size = size


  this.set=function(x,y){
    this.px=x;
    this.py=y;
    this.vx=0;
    this.vy=0;
    this.damping=0.96;
    this.mass=1.0;
  }
  
  this.addForce=function(fx,fy){
    ax=fx/this.mass;
    ay=fy/this.mass;
    this.vx+=ax;
    this.vy+=ay;
  }

  this.update=function(){
    this.vx*=this.damping;
    this.vy*=this.damping;
    this.limitVelocities();
    this.handleBoundaries();
    this.px+=this.vx;this.py+=this.vy;
  }

  this.limitVelocities=function(){
    if(this.bLimitVelocities){
      var speed=sqrt(this.vx*this.vx+this.vy*this.vy);
      var maxSpeed=10;
      if(speed>maxSpeed){
        this.vx*=maxSpeed/speed;this.vy*=maxSpeed/speed;
      }
    }
  }

  this.inBounds=function(){
    return(this.px<width&&this.px>0&&this.py<height&&this.py>0);
  }

  this.handleBoundaries=function(){
    if(this.bPeriodicBoundaries){
      if(this.px>width)this.px-=width;
      if(this.px<0)this.px+=width;
      if(this.py>height)this.py-=height;
      if(this.py<0)this.py+=height;
    }else if(this.bElasticBoundaries){
      if(this.px>width)this.vx=-this.vx;
      if(this.px<0)this.vx=-this.vx;
      if(this.py>height)this.vy=-this.vy;
      if(this.py<0)this.vy=-this.vy;
    }
  }
  this.render=function(size){
    var distance = getDistance(mouseX, mouseY, this.px, this.py)
    var factor = map(distance, 0, 75, 3, 1)
    print(this.vx)
    if(distance >= 75){
      var size = this.size + log(abs(this.vx) * 50)
    }else{
      var size = (this.size + log(abs(this.vx) * 50)) * factor
    }
    var opacity = map(size, 0, 40, 0, 255)

    // var opacity = map(size, 0, 100, 3, 1)
    fill(111, 0, 251)

    ellipse(this.px,this.py,size,size);
  }
}

function getDistance(x1, y1, x2, y2){
  return sqrt((x1 - x2)**2 + (y1 - y2)**2)
}




