function ContentItem() {
    // Public fields
    this.id;
    this.beginDate;
    this.endDate;
    this.title;
    this.depth;
    this.hasChildren;
    this.sourceURL;

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

    // Constructor
    function initialize() {
        _image.onload = function () { };
        _image.src = 'http://www.in5d.com/images/maya46.jpg';
    }

    // Update this content item
    function update() {
        _x = Canvas.Timescale.getXPositionForTime(this.beginDate);
        _width = Canvas.Timescale.getXPositionForTime(this.endDate) - _x;

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
            context.fillStyle = "white";
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
        return false;
    }

    //// OLD CODE

    // Anthony aan alle : Waarom een intersects methode EN collides?!?! als collides object retouneert intersect ie dus
    // Richard added: Intersects is used to know if two rectangles intersect with eachother, colides is used with arcs
    //function intersects(rectangle) {
    //    for (var i = 0; i < _contentItems.length; i++) {
    //        var item = _contentItems[i];
    //        if (item.id !== rectangle.id) {
    //            var AT = rectangle.y;
    //            var AR = rectangle.x + rectangle.width;
    //            var AB = rectangle.y + rectangle.height;
    //            var AL = rectangle.x;

    //            var BT = item.y;
    //            var BR = item.x + item.width;
    //            var BB = item.y + item.height;
    //            var BL = item.x;

    //            if (AL <= BR &&
    //                BL <= AR &&
    //                AT <= BB &&
    //                BT <= AB) {
    //                console.log("intercept");
    //                return true;
    //            }
    //        }
    //    }
    //}

    //function collides() {
    //    var clickedContentItem = undefined;
    //    var position = Canvas.Mousepointer.getPosition();
    //    var length = _contentItems.length;

    //    for (var i = 0; i < length; i++) {

    //        var radiusCircle = _contentItems[i].width;
    //        var centerpointX = (_contentItems[i].x + (_contentItems[i].width / 2));
    //        var centerpointY = _contentItems[i].y;
    //        var mousePointX = position.x;
    //        var mousePointY = position.y;

    //        // distance between centerpointX and mousepointX
    //        var deltaX;
    //        if (centerpointX >= mousePointX) {
    //            deltaX = centerpointX - mousePointX;
    //        } else {
    //            deltaX = mousePointX - centerpointX;
    //        }

    //        // distance between centerpointY and mousepointY
    //        var deltaY;
    //        if (centerpointY >= mousePointY) {
    //            deltaY = centerpointY - mousePointY;
    //        } else {
    //            deltaY = mousePointY - centerpointY;
    //        }

    //        // angle between centerpoint and mousepoint (in radial)
    //        var angle = Math.atan(deltaY / deltaX);

    //        // sinus value of angle
    //        var sinangle = Math.sin(angle);

    //        // distance between centerpoint and mousepoint
    //        var distance = deltaY / sinangle;

    //        // is mousepoint in circle
    //        var inCircle = (radiusCircle) > distance;

    //        if (inCircle) {
    //            clickedContentItem = _contentItems[i];
    //            break;
    //        }
    //    }
    //    return clickedContentItem;
    //}

    //// END OLD CODE

    // Return object instance
    initialize();
    return this;
}