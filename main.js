// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;
let double = false;

//resise on the fly
window.addEventListener('resize', function() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

Ball.prototype.draw = function() {
  ctx.beginPath();
  if (pixelate) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(canvas, 0, 0, width, height, 0, 0, width/10, height/10);
    ctx.drawImage(canvas, 0, 0, width/10, height/10, 0, 0, width, height);
  }
  ctx.fillStyle = this.color;
  if (!noir) {
    ctx.fillStyle = 'rgb(200, 200, 200)';
  }
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;

  
}

let crash = false;

Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
        balls[j].velX = -balls[j].velX;
        balls[j].velY = -balls[j].velY;
        if (crash){
        let size = random(10,20);
        let ball = new Ball(
          random(0 + size,width - size),
          random(0 + size,height - size),
          random(-7,7),
          random(-7,7),
          'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
          size
        );
        balls.push(ball);
      }
    }
  }
}
}

let balls = [];

while (balls.length < 25) {
  let size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    size
    
  );

  balls.push(ball);
}
let noir = true

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
    
  }
  if (noir){
    document.getElementById('noir').style.display = 'none';
  }
  else {
    document.getElementById('noir').style.display = 'block';
  }

  requestAnimationFrame(loop);
}

window.onload = function() {
  loop();
}

let pixelate = false




document.getElementById('double').addEventListener('click', function() {
  //double the velocity
  for (let i = 0; i < balls.length; i++) {
    balls[i].velX *= 2;
    balls[i].velY *= 2;
  }
});

document.getElementById('concat').addEventListener('click', function() {
  balls = balls.concat(balls);
});