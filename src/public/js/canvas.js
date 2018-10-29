import utils from './utils';
require('./vector');
/**
 * requestAnimationFrame
 */
window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

/**
 * Vector
 */
function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

function ToVector(magnitude, angle) {
  
    this.magnitudeX = magnitude * Math.cos(angle);
    this.magnitudeY = magnitude * Math.sin(angle);
  }

Vector.add = function(a, b) {
    return new Vector(a.x + b.x, a.y + b.y);
};

Vector.sub = function(a, b) {
    return new Vector(a.x - b.x, a.y - b.y);
};

Vector.scale = function(v, s) {
    return v.clone().scale(s);
};

Vector.random = function() {
    return new Vector(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
    );
};

Vector.prototype = {
    set: function(x, y) {
        if (typeof x === 'object') {
            y = x.y;
            x = x.x;
        }
        this.x = x || 0;
        this.y = y || 0;
        return this;
    },

    add: function(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    },

    sub: function(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    },

    scale: function(s) {
        this.x *= s;
        this.y *= s;
        return this;
    },

    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    lengthSq: function() {
        return this.x * this.x + this.y * this.y;
    },

    normalize: function() {
        var m = Math.sqrt(this.x * this.x + this.y * this.y);
        if (m) {
            this.x /= m;
            this.y /= m;
        }
        return this;
    },

    angle: function() {
        return Math.atan2(this.y, this.x);
    },

    angleTo: function(v) {
        var dx = v.x - this.x,
            dy = v.y - this.y;
        return Math.atan2(dy, dx);
    },

    distanceTo: function(v) {
        var dx = v.x - this.x,
            dy = v.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    distanceToSq: function(v) {
        var dx = v.x - this.x,
            dy = v.y - this.y;
        return dx * dx + dy * dy;
    },

    lerp: function(v, t) {
        this.x += (v.x - this.x) * t;
        this.y += (v.y - this.y) * t;
        return this;
    },

    clone: function() {
        return new Vector(this.x, this.y);
    },

    toString: function() {
        return '(x:' + this.x + ', y:' + this.y + ')';
    }
};

const background = '#E8EBF7';

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

let hippoPositionX = canvas.width/2-200;
let hippoPositionY = canvas.height-300;
let img;

make_base();
function make_base()
{
    img = new Image();
    img.src = '../img/hippo.png';
}


const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2,
    vector: {}
}

const Configs = {
    steps: 3,
    numOfParticles: 20,
    lastStep: 0
};

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
    mouse.vector = new Vector(mouse.x, mouse.y);
})

document.addEventListener('keypress', (event) => {
    switch(event.key) {
        case 'd':
            if (hippoPositionX < canvas.width + 100) hippoPositionX += 100;
            if (hippoPositionX > canvas.width) hippoPositionX = -400;
            break;
        case 'a':
            if (hippoPositionX > -500) hippoPositionX -= 100;
            if (hippoPositionX < -300) hippoPositionX = canvas.width+100;

            break;
        case 'w':
            if (hippoPositionY > canvas.height-500) hippoPositionY -= 200;
            break;
    }
});

document.addEventListener("keyup", (event) => {
    switch(event.key) {
        case 'w':
            console.log(event);
             hippoPositionY += 200;
            break;
    }
});

let origin = new Vector; 
addEventListener('click', event => {

        const dest = mouse.vector;
        const origin = new Vector(utils.randomIntFromRange(canvas.width/2 - 100,canvas.width/2 + 100), 0 );
        const vector = new Firework(
                            origin,
                            dest,
                            utils.randomIntFromRange(10,10), 
                            utils.randomColorFromRanges([0,360], [60,80], [50,60],1),
                        )
        fireworks.push(
            vector
        )
    
})

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
})

function distanceToAndAngle(a, b) {
    return {
        distance: a.distanceTo(b),
        angle: a.angleTo(b)
    };
}

// Firework
function Firework(origin, dest, radius, color) {
    this.origin = origin;
    this.dest = dest;
    this.radius = radius;
    this.color = color;
    this.station = false;
    this.particles = [];
}

Firework.prototype.draw = function(milliseconds) {

    const data = distanceToAndAngle(this.origin, this.dest);
    const velocity = data.distance / 0.5;
    const toMouseVector = new ToVector(velocity, data.angle);
    const elapsedSeconds = milliseconds / 1000;
		
    drawParticles();
    
    this.origin.x += toMouseVector.magnitudeX * elapsedSeconds;
    this.origin.y += toMouseVector.magnitudeY * elapsedSeconds;
    

    if (velocity > 7) {
        
    } else {
        this.station = true;
            ctx.strokeStyle = background;
            ctx.fillStyle = background;
            ctx.stroke();  
    }
}

Firework.prototype.update = function(elapsed) {
    clearCanvas();
    this.draw(elapsed)
}

function drawParticles() {
    for (let i = 0; i < fireworks.length; i++) {
        
        ctx.save();
        ctx.beginPath();
        ctx.drawImage(img, hippoPositionX, hippoPositionY);
        ctx.translate(fireworks[i].origin.x, fireworks[i].origin.y);
        ctx.arc(0, 0, fireworks[i].radius, 0, 2 * Math.PI);
        ctx.fillStyle = fireworks[i].color;
        ctx.fill();
        ctx.restore();

    }
}

function clearCanvas() {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
  }

// Implementation
let fireworks
function init() {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    fireworks = []

}

// Animation Loop
function animate(milliseconds) {
    var elapsed = milliseconds - Configs.lastStep;
    Configs.lastStep = milliseconds;

    for (let i = 0; i < fireworks.length; i++) {
        
        fireworks[i].update(elapsed);
        if(fireworks[i].station ) {
            fireworks[i].dest = new Vector(canvas.width/2-100, canvas.height);
            if (fireworks[i].origin == fireworks[fireworks.length - 1].origin && fireworks.length > 20) {
                fireworks.splice(0, 20);
                console.log(fireworks);
            }
   }
    }
    if(!fireworks.length) {
        ctx.fillStyle = background;
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fill();
    }
    requestAnimationFrame(animate)
}

init()
animate()
