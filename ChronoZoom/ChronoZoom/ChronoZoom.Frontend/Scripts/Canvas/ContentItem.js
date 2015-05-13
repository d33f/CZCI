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
    this.getWidth = getWidth;
    this.getHeight = getHeight;
    this.getX = getX;
    this.getY = getY;
    this.getHovered = getHovered;

    // Public methods
    this.update = update;
    this.draw = draw;
    this.collides = collides;
    this.getPosition = getPosition;
    this.addChild = addChild;

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
    var _children = [];

    var _image = new Image();
    var _x = 0;
    var _y = 100;
    var _width = 0;
    var _height = 0;
    var _radius = 0;
    var _isHovered = false;

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

    function getWidth() {
        return _width;
    }

    function getHeight() {
        return _height;
    }

    function getX() {
        return _x;
    }

    function getY(){
        return _y;
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

    // Get current position
    function getPosition() {
        return { x: _x, y: _y };
    }

    // Get (all) data as object
    function getData() {
        return _data;
    }

    // Get size
    function getSize() {
        return { height: _height, width: _width };
    }

    // Update this content item
    function update(contentItems) {
        _x = Canvas.Timescale.getXPositionForTime(_beginDate);
        _width = Canvas.Timescale.getXPositionForTime(_endDate) - _x;

        var position = Canvas.Mousepointer.getPosition();
        _isHovered = collides(position.x, position.y);

        updateYPosition(contentItems);

        _height = 100;

        updateChildren();

        updateContainer();
    }

    // Update (DOM) container element
    function updateContainer() {
        if (!_hasChildren && _container != undefined) {
            _container.style.top = _y + "px";
            _container.style.right = _x + "px";
            _container.style.width = _radius + "px";
            _container.style.height = _radius + "px";
            console.log(_container.style);
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
            var childHeight = _children[i].getSize().height;
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

        for (var i = 0; i < contentItems.length; i++) {
            // Don't collide on your self!
            if (contentItems[i].getId() !== _id) {
                var position = contentItems[i].getPosition();
                //while (collides(position.x, position.y)) {
                //    _y += contentItems[i].getSize().height + 10;
                //}
            }
        }
    }

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
        
        if (_hasChildren) {
            drawContentItemWithChildren(context);
            drawChildren();
        }else{
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
        _radius = _width > 0 ? _width : 50;
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

    // Check if content item displayed as a circle collides with the given position
    function collidesCircle(x, y) {
        var centerpointX = _x; //(_x + (_width / 2));
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
        return _radius > distance;
    }

    // Return object instance
    initialize(this);
    return this;
}