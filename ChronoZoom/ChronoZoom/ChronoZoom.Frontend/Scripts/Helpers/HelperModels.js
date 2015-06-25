/**
 * A point on a pixalted surface 
 * @param {X axis value px} x 
 * @param {Y axis value px} y 
 * @returns {Point} 
 */
function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

/**
 * A size indentified by width and height
 * @param {Width px} width 
 * @param {Height px} height 
 * @returns {Size} 
 */
function Size(width, height) {
    this.width = width || 0;
    this.height = height || 0;
}