const canvas = document.createElement('canvas');
const width = 400;
const height = 600;
canvas.width = width;
canvas.height = height;
const context = canvas.getContext('2d');

// Specifies to the browser that you want to perform an animation and how many requests the browser should make before resetting (repainting) the animation.
const animate = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                function(callback) {
                    window.setTimeout(callback, 1000/60);
                }

const step = () => {
    update();
    render();
    animate(step);
}

const update = () => {
    player.update();
    ball.update(player.paddle, computer.paddle);
}

const Paddle = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

const Ball = function(x, y) {
    this.x = x;
    this.y = y;
    this.x_speed = 0;
    this.y_speed = 3;
    this.radius = 5;
}

const Player = function() {
    this.paddle = new Paddle(175, 580, 50, 10);
}

const Computer = function() {
    this.paddle = new Paddle(175, 10, 50, 10);
}

Paddle.prototype.render = function() {
    context.fillStyle = '#0031F7';
    context.fillRect(this.x, this.y, this.width, this.height);
}

Paddle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if(this.x < 0) { // all the way to the left
      this.x = 0;
      this.x_speed = 0;
    } else if (this.x + this.width > 400) { // all the way to the right
      this.x = 400 - this.width;
      this.x_speed = 0;
    }
}

Ball.prototype.render = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = '#0031F7';
    context.fill();
}

Player.prototype.render = function() {
    this.paddle.render();
}

Player.prototype.update = function() {
    for (let key in keysDown) {
        let value = Number(key);
        if (value == 39) {
            this.paddle.move(4, 0); //move right
        } else if (value == 37) {
            this.paddle.move(-4,0) //move left
        } else {
            this.paddle.move(0,0)
        }
    }
}

Computer.prototype.render = function() {
    this.paddle.render();
}

Ball.prototype.update = function(paddle1, paddle2) {
    this.x += this.x_speed;
    this.x += this.y_speed;

    const top_x = this.x - 5;
    const top_y = this.y - 5;
    const bottom_x = this.x + 5;
    const bottom_y = this.y + 5;

    
    if(this.x - 5 < 0) { // hitting the left wall
        this.x = 5;
        this.x_speed = -this.x_speed;
      } else if(this.x + 5 > 400) { // hitting the right wall
        this.x = 395;
        this.x_speed = -this.x_speed;
      }

    if (this.x < 0 || this.y > 600) {
        this.x_speed = 0;
        this.y_speed = 3;
        this.x = 200;
        this.y = 300;
    }
    
    if (top_y > 300) {
        if (top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
            this.y_speed = -3;
            this.x_speed += (paddle1.x_speed /2);
            this.y += this.y_speed;
        }
    } else { 
        if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
            this.y_speed = 3;
            this.x_speed += (paddle2.x_speed /2);
            this.y += this.y_speed;
        }
    }
}

const player = new Player();
const computer = new Computer();
const ball = new Ball(300, 200);

const render = () => {
    context.fillStyle = '#89FC00';
    context.fillRect(0, 0, width, height);
    player.render();
    computer.render();
    ball.render();
}


let keysDown = {};

window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
    delete keysDown[event.keyCode];
});

window.onload = () => {
    document.body.appendChild(canvas)
    animate(step);
}