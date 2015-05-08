function ContentItem(data, parentContentItem) {
    // Public properties
    this.getId = getId;
    this.getBeginDate = getBeginDate;
    this.getEndDate = getEndDate;
    this.getParentContentItem = getParentContentItem;
    this.getData = getData;

    // Public methods
    this.update = update;
    this.draw = draw;
    this.collides = collides;
    this.getPosition = getPosition;

    // Private fields
    var _id = data.id;
    var _beginDate = data.beginDate;
    var _endDate = data.endDate;
    var _title = data.title;
    var _depth = data.depth;
    var _hasChildren = data.hasChildren;
    var _sourceURL = data.sourceURL;

    var _data = data;
    var _parentContentItem = parentContentItem;

    var _image = new Image();
    var _x = 0;
    var _y = 100;
    var _width = 0;
    var _height = 0;
    var _isHovered = false;
    var tooltipShow = false;

    // Constructor
    function initialize() {
        _image.onload = function () { };
        _image.src = 'http://www.in5d.com/images/maya46.jpg';
    }

    // Get begin date property
    function getBeginDate() {
        return _beginDate;
    }

    // Get end date property
    function getEndDate() {
        return _beginDate;
    }

    // Get id
    function getId() {
        return _id;
    }

    // Get parentContentItem
    function getParentContentItem() {
        return _parentContentItem;
    }

    // Get current position
    function getPosition() {
        return { x: _x, y: _y };
    }

    // Get (all) data as object
    function getData() {
        return _data;
    }

    // Update this content item
    function update(contentItems) {
        _x = Canvas.Timescale.getXPositionForTime(_beginDate);
        _width = Canvas.Timescale.getXPositionForTime(_endDate) - _x;

        var position = Canvas.Mousepointer.getPosition();
        _isHovered = collides(position.x, position.y);
        //setYPosition(contentItems);
        

        // TODO: Do real logic here
        _height = _width * .75;
    };

    // Draw this content item
    function draw() {
        // TODO: Below is example code, fancy styling is required :)
        var context = Canvas.getContext();
       // if (_height > 100) {
            /*
            if (_image !== undefined) {
                context.beginPath();
                context.drawImage(_image, _x, _y, _width, _height);
                context.closePath();
            }*/
        showTooltip();
        

        //draw circle otherwise draw rectangle
        if (_hasChildren) {
            context.beginPath();
            context.rect(_x, _y, _width, _height);
            context.fillStyle = 'rgba(0,0,0,0.6)';
            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = 'white';
            context.stroke();
            context.closePath();

            context.beginPath();
            context.fillStyle = _isHovered ? "blue" : "white";
            context.fillText(_title, _x + 5, (_y + (_height - 50)) + 16);
            context.closePath();

        } else {
            context.beginPath();
            context.arc(_x, _y, 20, 0, 2 * Math.PI);
            context.lineWidth = 1;
            context.strokeStyle = 'white';
            context.stroke();
        }
    };

    function setYPosition(contentItems) {
        for (var i = 0; i < contentItems.length; i++) {
            if (contentItems[i].getId() !== _id) {
                var position = contentItems[i].getPosition();

                while (collides(position.x, position.y)) {
                    _y += 10;
                }
            }
        }

    }

    function showTooltip() {
        if (_isHovered) {
            console.log(_x, _y);
            tooltip.pop(_parentContentItem, _title, { offsetY: _y, offsetX: (_x + _width) - 20 });
            tooltipShow = true;
        } else if (tooltipShow === true) {
            tooltip.hide();
            tooltipShow = false;
        }
    }


    // Check if content item collides given position
    function collides(x, y) {
        if (_hasChildren) {
            return collidesRectangle(x, y);
        } else {
            return collidesCircle(x, y);
        }
    }

// Check if content item displayed as a rectangle collides with the given position
    function collidesRectangle(x, y) {
        if (x >= _x && x <= (_x + _width) && y >= _y && y <= (_y + _height)) {
            return true;
        }
        return false;
    }

    // Check if content item displayed as a circle collides with the given position
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