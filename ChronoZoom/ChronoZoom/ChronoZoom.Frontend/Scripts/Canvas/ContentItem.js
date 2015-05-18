function ContentItem(data, parentContentItem) {
    // Public properties
    this.getId = getId;
    this.getBeginDate = getBeginDate;
    this.getEndDate = getEndDate;
    this.getTitle = getTitle;
    this.getParentContentItem = getParentContentItem;
    this.getData = getData;
    this.getSize = getSize;
    this.getChildren = getChildren;
    this.hasChildren = hasChildren;
    this.getRadius = getRadius;
    this.getHovered = getHovered;

    // Public methods
    this.update = update;
    this.draw = draw;
    this.collides = collides;
    this.collidesContentItem = collidesContentItem;
    this.getPosition = getPosition;
    this.setPosition = setPosition;
    this.updatePosition = updatePosition;
    this.addChild = addChild;
    this.setIsFullScreen = setIsFullScreen;
    
    // Private fields
    var _id = data.id;
    var _beginDate = data.beginDate;
    var _endDate = data.endDate;
    var _title = data.title;
    var _hasChildren = data.hasChildren;
    var _sourceURL = data.sourceURL;

    var _data = data;
    var _parentContentItem = parentContentItem;
    var _children = [];

    var _image = new Image();
    var _x = 0;
    var _y = 100;
    var _width = 0;
    var _height = 0;
    var _radius = 0;
    var _isHovered = false;
    var _isFullScreen = false;

    // HTML container
    var _container;

    // Constructor
    function initialize(instance) {
        // Set image
        _image.onload = function () { };
        if (_sourceURL !== undefined) {
            _image.src = _sourceURL;
        }

        // Add child to parent
        if (_parentContentItem !== undefined) {
            _parentContentItem.addChild(instance);
        }

        // Check if it has no children
        if (!_hasChildren) {
            // Get content item element
            _radius = 50;
            var element = document.getElementById('contentItem_' + _id);

            // Create new content item element if it doesn't exist
            if (element == null) {
                // Create element
                element = document.createElement('div');
                element.id = 'contentItem_' + _id;
                element.style.position = "absolute";

                // Get the canvas container element and add the child
                var container = document.getElementById('canvasContainer');
                container.appendChild(element);
            }

            // Store element as container
            _container = element;
        } 
    }

    // Get id property
    function getId() {
        return _id;
    }

    // Get begin date property
    function getBeginDate() {
        return _beginDate;
    }

    // Get end date property
    function getEndDate() {
        return _endDate;
    }

    // Get title property
    function getTitle() {
        return _title;
    }

    // Get parentContentItem
    function getParentContentItem() {
        return _parentContentItem;
    }

    // Get has childeren property
    function hasChildren() {
        return _hasChildren;
    }

    function getRadius() {
        return _radius;
    }

    function getHovered() {
        return _isHovered;
    }

    // Get childeren
    function getChildren() {
        return _children;
    }

    // Add child
    function addChild(contentItem) {
        // Check if it is an content item
        if (contentItem instanceof ContentItem) {
            _children.push(contentItem);
        }
    }

    // Set is fullscreen
    function setIsFullScreen(isFullScreen) {
        _isFullScreen = isFullScreen;
    }

    // Get current position
    function getPosition() {
        return { x: _x, y: _y };
    }

    // Set new position
    function setPosition(x, y) {
        _x = x;
        _y = y;
    }

    function updatePosition() {
        _x = Canvas.Timescale.getXPositionForTime(_beginDate);
        _width = Canvas.Timescale.getXPositionForTime(_endDate) - _x;
    }

    // Get (all) data as object
    function getData() {
        return _data;
    }

    // Get size
    function getSize() {
        return { height: _height, width: _width, radius: _radius };
    }

    // Update this content item
    function update(contentItems) {
        _x = Canvas.Timescale.getXPositionForTime(_beginDate);
        _width = Canvas.Timescale.getXPositionForTime(_endDate) - _x;

        var position = Canvas.Mousepointer.getPosition();
        _isHovered = (collides(position.x, position.y) && !collidesInChildren(position.x, position.y));

        if (_isFullScreen) {
            var canvasContainer = Canvas.getCanvasContainer();
            var canvasHeight = canvasContainer.height - 100;;

            _width = ((canvasContainer.width > canvasHeight ? canvasHeight : canvasContainer.width) / 2) - 10;
            _x = (canvasContainer.width / 2) - _width;
            _y = 100; // Reset

            updateContainer();

            _container.innerHTML = "test";

        } else {
            updateYPosition(contentItems);

            _height = 100;

            updateChildren();

            updateContainer();
        }
    }

    // Update (DOM) container element
    function updateContainer() {
        if (!_hasChildren && _container !== undefined) {
            _container.style.top = _y + "px";
            _container.style.left = _x + "px";
            _container.style.width = (_radius * 2) + "px";
            _container.style.height = (_radius * 2) + "px";
            _container.style.borderRadius = "50%";
        }
    }

    // Update it's children and calculate height
    function updateChildren() {
        // Update all children en let them not collide with each other
        var length = _children.length;
        for (var i = 0; i < length; i++) {
            // Update child
            _children[i].update(_children);

            // Check height
            var childHeight = _children[i].getPosition().y + _children[i].getSize().height;

            if (childHeight > _height) {
                _height = childHeight;
            }
        }
    }

    // Update y position
    function updateYPosition(contentItems) {
        // Start at y position of parent if set
        if (_parentContentItem !== undefined) {
            _y = _parentContentItem.getPosition().y + 20;
        }

        var length = contentItems.length;
        for (var i = 0; i < length; i++) {
            // Don't collide on your self!
            if (contentItems[i].getId() !== _id) {
                while (collidesContentItem(contentItems[i])) {
                    _y += contentItems[i].getSize().height + 10;
                }
            }
        }
    }

    // Draw this content item
    function draw() {
        // TODO: Below is example code, fancy styling is required :)
        var context = Canvas.getContext();
        
        if (_image.src !== "http://localhost:20000/null") {
            context.beginPath();
            context.drawImage(_image, _x, _y, _width, _height);
            context.closePath();
        }

        if (_hasChildren) {
            drawContentItemWithChildren(context);
            drawChildren();
        } else {
            drawContentItemWithoutChildren(context);
        }
    }

    // Draw content item with childeren
    function drawContentItemWithChildren(context) {
        context.beginPath();

        context.rect(_x, _y, _width, _height);

        if (_isHovered) {
            var gradient = context.createLinearGradient(0, 0, _width, 0);
            gradient.addColorStop(0, "gray");
            gradient.addColorStop(1, "black");
            context.fillStyle = gradient;
        } else {
            context.fillStyle = 'rgba(0,0,0,0.6)';
        }

        context.fill();
        context.lineWidth = _isHovered ? 3 : 1;
        context.strokeStyle = 'white';
        context.stroke();
        context.closePath();

        context.beginPath();
        context.fillStyle = _isHovered ? "white" : "#C0C0C0";
        context.font = "12px Arial";
        context.fillText(_title, _x + 5, (_y + 5) + 12);
        context.closePath();
    }

    // Draw content item without childeren
    function drawContentItemWithoutChildren(context) {
        context.beginPath();

        _width = _width > 0 ? _width : 50;
        _radius = _width;
        context.arc(_x + _radius, _y + _radius, _radius, 0, 2 * Math.PI);
        context.lineWidth = _isHovered ? 3 : 1;
        context.strokeStyle = 'white';
        context.stroke();
    };

    // Draw child content items
    function drawChildren() {
        var length = _children.length;
        for (var i = 0; i < length; i++) {
            _children[i].draw();
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
        return (x >= _x && x <= (_x + _width) && y >= _y && y <= (_y + _height));
    }

    function collidesInChildren(x, y) {
        var length = _children.length;
        for (var i = 0; i < length; i++) {
            if (_children[i].collides(x, y)) {
                return true;
            }
        }
        return false;
    }

    // Check if content item displayed as a circle collides with the given position
    function collidesCircle(x, y) {
        var centerpointX = _x + _radius
        var centerpointY = _y + _radius;

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
        return _radius > distance;
    }

    // Check if current content item collides given content item
    function collidesContentItem(contentItem) {
        if (_hasChildren && contentItem.hasChildren() || (_hasChildren && !contentItem.hasChildren()) || (!_hasChildren && contentItem.hasChildren())) {
            return collidesContentItemRectangle(contentItem);
        } else {
            return collidesContentItemCircle(contentItem);
        }
    }

    // Check if current content item collides given content item
    function collidesContentItemRectangle(contentItem) {
        var aX1;
        var aY1;
        var aX2;
        var aY2;
        var bX1;
        var bY1;
        var bX2;
        var bY2;

        var position = contentItem.getPosition();
        var size = contentItem.getSize();

        if (!_hasChildren && contentItem.hasChildren()) {
            aX1 = _x; 
            aY1 = _y;
            aX2 = _x + (_radius * 2);
            aY2 = _y + (_radius * 2);

            bX1 = position.x;
            bY1 = position.y;
            bX2 = position.x + size.width;
            bY2 = position.y + size.height;
        } else if(_hasChildren && !contentItem.hasChildren()) {
            aX1 = _x;
            aY1 = _y;
            aX2 = _x + _width;
            aY2 = _y + _height;

            bX1 = position.x;
            bY1 = position.y;
            bX2 = position.x + (size.radius * 2);
            bY2 = position.y + (size.radius * 2);
        } else {
            aX1 = _x;
            aY1 = _y;
            aX2 = _x + _width;
            aY2 = _y + _height;

            bX1 = position.x;
            bY1 = position.y;
            bX2 = position.x + size.width;
            bY2 = position.y + size.height;
        }
        
        return !(aY2 < bY1 || aY1 > bY2 || aX2 < bX1 || aX1 > bX2);
    }

    // Check if current content item collides given content item
    function collidesContentItemCircle(contentItem) {
        var aX = _x; //(_x + (_width / 2));
        var aY = _y;
        var aRadius = _radius;

        var position = contentItem.getPosition();
        var size = contentItem.getSize();

        var bX = position.x;
        var bY = position.y;
        var bRadius = size.radius;

        // distance between centerpointX and x
        var deltaX;
        if (aX >= bX) {
            deltaX = aX - bX;
        } else {
            deltaX = bX - aX;
        }

        // distance between centerpointY and y
        var deltaY;
        if (aY >= bY) {
            deltaY = aY - bY;
        } else {
            deltaY = bY - aY;
        }

        // angle between centerpoint and given position (in radial)
        var angle = Math.atan(deltaY / deltaX);

        // sinus value of angle
        var sinangle = Math.sin(angle);

        // distance between centerpoint and given position
        var distance = deltaY / sinangle;

        // is mousepoint in circle
        
        (deltaX === 0 && deltaY === 0) ? distance = 0 : distance = distance;
        return (aRadius + bRadius) >= distance;
    }

    // Return object instance
    initialize(this);
    return this;
}