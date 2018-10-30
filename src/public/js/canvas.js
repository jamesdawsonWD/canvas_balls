import utils from './utils';
require('./vector');
/**
 * requestAnimationFrame
 */
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
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

Vector.add = function (a, b) {
    return new Vector(a.x + b.x, a.y + b.y);
};

Vector.sub = function (a, b) {
    return new Vector(a.x - b.x, a.y - b.y);
};

Vector.scale = function (v, s) {
    return v.clone().scale(s);
};

Vector.random = function () {
    return new Vector(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
    );
};

Vector.prototype = {
    set: function (x, y) {
        if (typeof x === 'object') {
            y = x.y;
            x = x.x;
        }
        this.x = x || 0;
        this.y = y || 0;
        return this;
    },

    add: function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    },

    sub: function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    },

    scale: function (s) {
        this.x *= s;
        this.y *= s;
        return this;
    },

    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    lengthSq: function () {
        return this.x * this.x + this.y * this.y;
    },

    normalize: function () {
        var m = Math.sqrt(this.x * this.x + this.y * this.y);
        if (m) {
            this.x /= m;
            this.y /= m;
        }
        return this;
    },

    angle: function () {
        return Math.atan2(this.y, this.x);
    },

    angleTo: function (v) {
        var dx = v.x - this.x,
            dy = v.y - this.y;
        return Math.atan2(dy, dx);
    },

    distanceTo: function (v) {
        var dx = v.x - this.x,
            dy = v.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    distanceToSq: function (v) {
        var dx = v.x - this.x,
            dy = v.y - this.y;
        return dx * dx + dy * dy;
    },

    lerp: function (v, t) {
        this.x += (v.x - this.x) * t;
        this.y += (v.y - this.y) * t;
        return this;
    },

    clone: function () {
        return new Vector(this.x, this.y);
    },

    toString: function () {
        return '(x:' + this.x + ', y:' + this.y + ')';
    }
};

const background = ' #0C949E';

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const score = document.getElementById('score')
const scorectx = score.getContext('2d');

canvas.width = innerWidth
canvas.height = innerHeight

let hippoPositionX = canvas.width / 2 - 200;
let hippoPositionY = canvas.height - 300;
let mouthOpen = false;
let img, imgmain, imgforward;
let points = 0;
make_base();

function make_base() {
    img = new Image();
    img.src = '../img/whale-closed.png';
    // imgforward = new Image();
    // imgforward.src = '../img/whale-open.png';
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

const colors = ['#85FF9E', '#F6F7F8', '#FCFF4B', '#FF7F66', '#00F2F2']


document.addEventListener('keypress', (event) => {
    switch (event.key) {
        case 'd':
            if (hippoPositionX < canvas.width + 100) hippoPositionX += 100;
            if (hippoPositionX > canvas.width) hippoPositionX = -400;
            break;
        case 'a':
            if (hippoPositionX > -500) hippoPositionX -= 100;
            if (hippoPositionX < -300) hippoPositionX = canvas.width + 100;

            break;
        case 'w':
            if (hippoPositionY > canvas.height - 500) hippoPositionY -= 200;
            img.src = '../img/whale-open.png';
            mouthOpen = true;
            break;
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.key) {
        case 'w':
            img.src = '../img/whale-closed.png';
            hippoPositionY += 200;
            mouthOpen = false;
            break;
    }
});

addEventListener('click', event => {

    createRandomFireworks(1);

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

function createRandomFireworks(number) {

    for (let i = 0; i < number; i++) {
        const dest = new Vector(utils.randomIntFromRange(0, canvas.width), utils.randomIntFromRange(0, canvas.height - 300));
        const origin = new Vector(utils.randomIntFromRange(canvas.width / 2 - 100, canvas.width / 2 + 100), 0);
        const vector = new Firework(
            origin,
            dest,
            20,
            utils.randomColorFromArray(colors),
        )
        fireworks.push(
            vector
        )
    }

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

Firework.prototype.draw = function (milliseconds) {

    const data = distanceToAndAngle(this.origin, this.dest);
    const velocity = data.distance / 0.5;
    const toMouseVector = new ToVector(velocity, data.angle);
    const elapsedSeconds = milliseconds / 1000;

    drawParticles();

    this.origin.x += toMouseVector.magnitudeX * elapsedSeconds;
    this.origin.y += toMouseVector.magnitudeY * elapsedSeconds;


    if (velocity < 7) {

        this.station = true;
        ctx.strokeStyle = 'black';
        ctx.fillStyle = background;
        ctx.stroke();
    }
}

Firework.prototype.update = function (elapsed) {
    clearCanvas();
    this.draw(elapsed);
    
}

function drawScore() {
    scorectx.save();
    scorectx.beginPath();
    scorectx.globalCompositeOperation = "source-over";
    scorectx.fillStyle = "white";
    scorectx.font = "45pt Verdana";
    scorectx.fillText(points,50,100);
}
function drawParticles() {
    ctx.drawImage(img, hippoPositionX, hippoPositionY);
    drawScore();
    for (let i = 0; i < fireworks.length; i++) {
        ctx.save();
        ctx.beginPath();
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
    drawScore();
    for (let i = 0; i < fireworks.length; i++) {
        if (mouthOpen && fireworks[i].origin.x >= hippoPositionX && fireworks[i].origin.x <= hippoPositionX + 400 &&
            fireworks[i].origin.y >= hippoPositionY+50 && fireworks[i].origin.y <= hippoPositionY + 200) {
            console.log(fireworks);
            fireworks.splice(i, 1);
            points += 1;
            if(fireworks.length < 2) {
                createRandomFireworks(utils.randomIntFromRange(7,10));
            }
        } else {
            if (fireworks[i].origin.x >= hippoPositionX && fireworks[i].origin.x <= hippoPositionX + 400 &&
                fireworks[i].origin.y >= hippoPositionY && fireworks[i].origin.y <= hippoPositionY + 600) {
                fireworks[i].dest = new Vector(utils.randomIntFromRange(0, canvas.width), utils.randomIntFromRange(0, canvas.height - 300));
            }
            if (fireworks[i].station) {
                fireworks[i].dest = new Vector(utils.randomIntFromRange(0, canvas.width), utils.randomIntFromRange(0, canvas.height - 300));
                fireworks[i].station = false;
                if (fireworks.length > 20) {
                    fireworks = fireworks.slice(1, 21);
                }
            }
            fireworks[i].update(elapsed);
        }

    }

    requestAnimationFrame(animate)
}

init()
animate()