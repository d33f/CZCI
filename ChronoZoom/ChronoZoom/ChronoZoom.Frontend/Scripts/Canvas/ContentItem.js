function ContentItem(data, parentContentItem) {
    // Public fields
    this.id = data.id;
    this.beginDate = data.beginDate;
    this.endDate = data.endDate;
    this.title = data.title;
    this.depth = data.depth;
    this.hasChildren = data.hasChildren;
    this.sourceURL = data.sourceURL;

    this.data = data;
    this.parentContentItem = parentContentItem;

    // Public methods
    this.update = update;
    this.draw = draw;
    this.collides = collides;

    // Private fields
    var _image = new Image();
    var _x = 0;
    var _y = 0;
    var _width = 0;
    var _height = 0;
    var _isHovered = false;

    // Constructor
    function initialize() {
        _image.onload = function () { };
        _image.src = 'http://www.in5d.com/images/maya46.jpg';
    }

    // Update this content item
    function update() {
        _x = Canvas.Timescale.getXPositionForTime(this.beginDate);
        _width = Canvas.Timescale.getXPositionForTime(this.endDate) - _x;

        var position = Canvas.Mousepointer.getPosition();
        _isHovered = collides(position.x, position.y);

        // TODO: Do real logic here
        _height = _width * .75;
        _y = 100;
    };

    // Draw this content item
    function draw() {
        // TODO: Below is example code, fancy styling is required :)
        var context = Canvas.getContext();
        if (_image !== undefined) {
            context.beginPath();
            context.drawImage(_image, _x, _y, _width, _height);
            context.closePath();
        }

        if (_height > 100) {
            context.beginPath();
            context.rect(_x, _y + (_height - 50), _width, 50);
            context.fillStyle = 'rgba(0,0,0,0.6)';
            context.fill();
            context.closePath();

            context.beginPath();
            context.fillStyle = _isHovered ? "blue" : "white";
            context.fillText(this.title, _x + 5, (_y + (_height - 50)) + 16);
            context.closePath();
        }
    };

    // Check if content item collides given position
    function collides(x, y) {
        if (this.hasChildren) {
            return collidesRectangle(x, y);
        } else {
            return collidesCircle(x, y);
        }
    }

    // Check if content item displayed as a rectangle collides given position
    function collidesRectangle(x, y) {
        if (x >= _x && x <= (_x + _width) && y >= _y && y <= (_y + _height)) {
            return true;
        }
        return false;
    }

    // Check if content item displayed as a circle collides given position
    function collidesCircle(x, y) {
        var radiusCircle = _width;
        var centerpointX = (_x + (_width / 2));
        var centerpointY = _y;
        
        // distance between centerpointX and x
        var deltaX;
        if (centerpointX >= x) {
            deltaX = centerpointX - x;
        } else {
            deltaX = x - centerpointX;
        }

        // distance between centerpointY and y
        var deltaY;
        if (centerpointY >= y) {
            deltaY = centerpointY - y;
        } else {
            deltaY = y - centerpointY;
        }

        // angle between centerpoint and given position (in radial)
        var angle = Math.atan(deltaY / deltaX);

        // sinus value of angle
        var sinangle = Math.sin(angle);

        // distance between centerpoint and given position
        var distance = deltaY / sinangle;

        // is mousepoint in circle
        return radiusCircle > distance;
    }

    // Return object instance
    initialize();
    return this;
}