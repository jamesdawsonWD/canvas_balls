function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Returns a color from an array of colours
 * @param {*} colors array of Colours
 */
function randomColorFromArray(colors) {
    return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Returns a random HSLA colour from the range parameters below 
 * @param {*} hueRange [lowRange, highRange]
 * @param {*} satRange [lowRange, highRange]
 * @param {*} lightRange [lowRange, highRange]
 * @param {*} alphaRange [lowRange, highRange]
 */
function randomColorFromRanges(hueRange, satRange, lightRange, alphaRange) {
    return new HSLA(
                randomIntFromRange(hueRange[0], hueRange[1]),
                randomIntFromRange(satRange[0], satRange[1]),
                randomIntFromRange(lightRange[0], lightRange[1]),
                alphaRange
            );
}

function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1
    const yDist = y2 - y1

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2))
}

/**
 * creates a new HSLA colour object with a to string prototype
 * @param {*} h hue
 * @param {*} s saturation
 * @param {*} l light
 * @param {*} a alpha
 */
function HSLA(h, s, l, a) {
    this.h = h || 0;
    this.s = s || 0;
    this.l = l || 0;
    this.a = a || 0;
}

HSLA.prototype.toString = function() {
    return 'hsla(' + this.h + ',' + (this.s ) + '%,' + (this.l ) + '%,' + this.a + ')';
}
module.exports = { randomIntFromRange, randomColorFromArray, randomColorFromRanges, distance }
