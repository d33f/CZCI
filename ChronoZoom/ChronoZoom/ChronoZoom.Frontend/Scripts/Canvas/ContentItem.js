function ContentItem(data, parentContentItem) {
    // Public properties
    this.getId = getId;
    this.getBeginDate = getBeginDate;
    this.getEndDate = getEndDate;
    this.getTitle = getTitle;
    this.getParentContentItem = getParentContentItem;
    this.getSource = getSource;
    this.getData = getData;
    this.getSize = getSize;
    this.getChildren = getChildren;
    this.hasChildren = hasChildren;
    this.getHovered = getHovered;
    this.getFullScreen = getFullScreen;

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
    this.clearChildren = clearChildren;
    this.destructor = destructor;

    // Private fields
    var _id = data.id;
    var _beginDate = data.beginDate;
    var _endDate = data.endDate;
    var _title = data.title;
    var _hasChildren = data.hasChildren;
    var _sourceURL = data.sourceURL;
    var _sourceRef = data.sourceRef;
    var _pictureURLs = data.pictureURLs;

    var _data = data;
    var _parentContentItem = parentContentItem;
    var _children = [];

    var _image = new Image();
    var _x = data.x !== undefined ? data.x : 0;
    var _y = data.y !== undefined ? data.y : 100;
    var _width = data.width !== undefined ? data.width : 0;
    var _height = data.height !== undefined ? data.height : 0;
    var _radius = data.radius !== undefined ? data.radius : 0;
    var _isHovered = false;
    var _isFullScreen = false;
    var _linewidth;

    // HTML container
    var _container;

    // Constructor
    function initialize(instance) {
        // Set image
        _image.src = 'resources/no_image.jpg';
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
            _width = (_radius * 2);
            _height = (_radius * 2);
        }
    }

    // Destructor
    function destructor() {
        removeDOMElement();
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

    function getSource() {
        return _sourceURL;
    }

    // Get has childeren property
    function hasChildren() {
        return _hasChildren;
    }

    // Get if content item is hovered
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

    // Clear children
    function clearChildren() {
        var length = _children.length;
        for (var i = 0; i < length; i++) {
            _children[i].destructor();
        }
        _children = [];
    }

    // Set is fullscreen
    function setIsFullScreen(isFullScreen) {
        _isFullScreen = isFullScreen;
        if (!_isFullScreen) {
            removeDOMElement();
        }
    }

    function getFullScreen() {
        return _isFullScreen;
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

    // Update the position of the content item
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
        return { height: _height, width: _width, radius: _radius, linewidth: _linewidth };
    }

    // Update this content item
    function update(contentItems) {
        _x = Canvas.Timescale.getXPositionForTime(_beginDate);
        _width = Canvas.Timescale.getXPositionForTime(_endDate) - _x;
        /*
        var parentWidth = _parentContentItem.getSize().width;
        var radius = (parentWidth - (parentWidth / 40)) / 4;
        _radius = radius < 50 ? radius : 50;
        */

        if (_isFullScreen) {
            updateFullScreenContentItem();
        } else {
            if (_parentContentItem !== undefined) {
                checkSpacing();
            }

            updateYPosition(contentItems);

            _height = 100;

            updateChildren();
        }

        var position = Canvas.Mousepointer.getPosition();
        _isHovered = (collides(position.x, position.y) && !collidesInChildren(position.x, position.y));
    }

    // Check spacing
    function checkSpacing() {
        // Get position of the parent
        var positionParent = _parentContentItem.getPosition();
        
        // ContentItem with children spacing, the check exclude the root content item
        if (positionParent.x !== 0 && positionParent.y !== 0) {
            updateHorizontalSpacing(positionParent);
        }
    }

    // Update current content item spacing 
    function updateHorizontalSpacing(positionParent) {
        var sizeParent = _parentContentItem.getSize();
        var spacing = sizeParent.width / 80;

        _x = (_x >= positionParent.x + spacing) ? _x : (positionParent.x + spacing);

        var parentRightX = positionParent.x + sizeParent.width;

        if (_hasChildren) {
            var rightX = _x + _width;
            var deltaRight = parentRightX - rightX;

            if (deltaRight < 0) {
                _width += deltaRight;
            }

            _width = (rightX <= parentRightX - spacing) ? _width : (_width - spacing);

        } else {
            var radius = (_radius * 2);
            var rightX = _x + radius;

            _x = (rightX <= parentRightX - spacing) ? _x : (parentRightX - spacing - radius);
        }
    }


    // Create (DOM) element with class
    function createElementWithClass(element, classname) {
        var domElement = document.createElement(element);
        domElement.classList.add(classname);
        return domElement;
    }

    // Create DOM element for fullscreen content item
    function createDOMElementForFullscreenContentItem() {
        var element = document.getElementById('contentItem_' + _id);

        // Create new content item element if it doesn't exist
        if (element == null) {
            // Create content item element
            element = createElementWithClass('div', 'contentItem');
            element.id = 'contentItem_' + _id;

            // Create wrapper with title
            var wrapper = createElementWithClass('div', 'wrapper');
            wrapper.appendChild(createElementWithClass('div', 'title'))

            // Create image wrapper
            var images = createElementWithClass('div', 'images');
            var image = document.createElement('img');
            image.setAttribute('name', 'largeImage');
            image.setAttribute('src', _pictureURLs[0]);
            image.setAttribute('width', '100%');
            image.setAttribute('height', '60%');
            images.appendChild(image);
            wrapper.appendChild(images);

            var thumbnails = createElementWithClass('div', 'thumbnails');

            var length = _pictureURLs.length;
            for (var i = 0; i < length; i++) {
                var smallImages = document.createElement('img');
                smallImages.setAttribute('src', _pictureURLs[i]);
                smallImages.setAttribute('name', 'smallImage' + i);
                smallImages.setAttribute('height', '100%');
                smallImages.setAttribute('onmouseover', 'largeImage.src=smallImage' + i + '.src');
                thumbnails.appendChild(smallImages);
            }

            images.appendChild(thumbnails);
        
            // Create text wrapper
            var textWrapper = createElementWithClass('div', 'content');
            textWrapper.appendChild(createElementWithClass('div', 'text'));
            wrapper.appendChild(textWrapper);

            // Add wrapper to element
            element.appendChild(wrapper);

            // Get the canvas container element and add the child
            var container = document.getElementById('canvasContainer');
            container.appendChild(element);
        }

        // Store element as container
        _container = element;
    }

    // Remove the dom element
    function removeDOMElement() {
        // Get content item element
        var element = document.getElementById('contentItem_' + _id);
        if (element !== null) {
            // Get the canvas container element and remove this content item container
            var container = document.getElementById('canvasContainer');
            container.removeChild(element);
        }
    }

    // Update full screen content item
    function updateFullScreenContentItem() {
        // Make sure dom element is available
        createDOMElementForFullscreenContentItem();

        var canvasContainer = Canvas.getCanvasContainer();
        var canvasHeight = canvasContainer.height - 100;

        _radius = (canvasContainer.width * 0.4);
        _width = (_radius * 2);
        _height = (_radius * 2);

        _x = (canvasContainer.width / 2) - _radius;
        _y = (canvasContainer.height / 2) - _radius;

        updateDOMElement(canvasHeight);

        _container.getElementsByClassName("title")[0].innerHTML = _title;
        _container.getElementsByClassName("text")[0].innerHTML = _data.description == "" ? "Nvt" : _data.description;
    }

    // Update (DOM) container element
    function updateDOMElement(canvasHeight) {
        _container.style.top = "110px";
        _container.style.left = _x + "px";
        _container.style.width = (_radius * 2) + "px";
        _container.style.height = canvasHeight + "px";
        //_container.style.display = "block";
        //_container.style.pointerEvents = "none";
    }

    // Update it's children and calculate height
    function updateChildren() {
        // Update all children en let them not collide with each other
        var length = _children.length;
        for (var i = 0; i < length; i++) {
            // Update child
            _children[i].update(_children);

            // Check height
            var newHeight = _children[i].getPosition().y + _children[i].getSize().height - _y;

            if (newHeight > _height) {
                _height = newHeight + 10;
            }
        }
    }

    // Update y position
    function updateYPosition(contentItems) {
        // Start at y position of parent if set
        if (_parentContentItem !== undefined) {
            _y = _parentContentItem.getPosition().y + 30;
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
        var context = Canvas.getContext();

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
            gradient.addColorStop(1, "rgba(0,0,0,0.55)");
            context.fillStyle = gradient;
        } else {
            context.fillStyle = 'rgba(0,0,0,0.6)';
        }

        context.fill();
        _linewidth = _isHovered ? 3 : 1;
        context.lineWidth = _linewidth;
        context.strokeStyle = 'white';
        context.stroke();
        context.closePath();

        context.beginPath();
        context.fillStyle = _isHovered ? "white" : "#C0C0C0";
        context.font = "12px Arial";

        if (context.measureText(_title).width < _width - 2) {
            context.fillText(_title, _x + 5, (_y + 5) + 12);
        }
        context.closePath();
    }

    // Draw content item without childeren
    function drawContentItemWithoutChildren(context) {
        _width = _width > 0 ? -_width : 50;
        
        if (_isFullScreen) {
            context.beginPath();
            context.fillStyle = 'rgba(0, 0, 0, 0.8)';
            context.arc(_x + _radius, _y + _radius, _radius, 0, 2 * Math.PI);
            context.fill();
            _linewidth = _isHovered ? 3 : 1;
            context.lineWidth = _linewidth;
            context.strokeStyle = 'white';
            context.stroke();
            context.closePath();

            context.beginPath();
            //var centerPointX = _x + _radius;
            //var centerPointY = _y + _radius;
            ////var rectX = centerPointX - ((_radius * 0.9) * Math.cos(0.7853981634));
            //var rectY = centerPointY - ((_radius * 0.9) * Math.sin(0.7853981634));
            //var rectWidth = (centerPointX - rectX) * 2;
            //var rectHeight = (centerPointY - rectY) * 1.2;
            //drawImage(context, (_x + (_radius * 0.5)), 120, _radius, _radius * 0.8);

            context.strokeStyle = 'white';
            context.stroke();
            context.closePath();

        } else {
            context.save();
            context.beginPath();
            context.arc(_x + _radius, _y + _radius, _radius, 0, 2 * Math.PI);
            _linewidth = _isHovered ? 3 : 1;
            context.lineWidth = _linewidth;
            context.strokeStyle = 'white';
            context.stroke();
            context.closePath();
            context.clip();
            drawImage(context, _x, _y, _radius * 2, _radius * 2);
            context.beginPath();
            context.arc(_x, _y, _radius, 0, 2 * Math.PI);
            context.clip();
            context.closePath();
            context.restore();
        }
    };

    // Draw the image, if it fails display no image found
    function drawImage(context, x, y, width, height) {
        try {
            context.drawImage(_image, x, y, width, height);
        }
        catch(ex) {
            _image.src = 'resources/no_image.jpg';
            context.drawImage(_image, x, y, width, height);
        }
    }
    
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

    // Check if given x and y collides with the child content items
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
        var centerpointX = _x + _radius;
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
        var aX2;
        var aY2;
        var bX2;
        var bY2;

        var position = contentItem.getPosition();
        var size = contentItem.getSize();

        if (!_hasChildren && contentItem.hasChildren()) {
            aX2 = _x + (_radius * 2);
            aY2 = _y + (_radius * 2);
            
            bX2 = position.x + size.width;
            bY2 = position.y + size.height;
        } else if (_hasChildren && !contentItem.hasChildren()) {
            aX2 = _x + _width;
            aY2 = _y + _height;

            bX2 = position.x + (size.radius * 2);
            bY2 = position.y + (size.radius * 2);
        } else {
            aX2 = _x + _width;
            aY2 = _y + _height;

            bX2 = position.x + size.width;
            bY2 = position.y + size.height;
        }

        return !(aY2 < position.y || _y > bY2 || aX2 < position.x || _x > bX2);
    }

    // Check if current content item collides given content item
    function collidesContentItemCircle(contentItem) {
        var centerpointAX = _x + _radius;
        var centerpointAY = _y + _radius;

        var position = contentItem.getPosition();
        var size = contentItem.getSize();

        var centerpointBX = position.x + size.radius;
        var centerpointBY = position.y + size.radius;
        var bRadius = size.radius;

        // distance between centerpointX and x
        var deltaX = centerpointAX >= centerpointBX ? centerpointAX - centerpointBX : centerpointBX - centerpointAX;

        // distance between centerpointY and y
        var deltaY = centerpointAY >= centerpointBY ? centerpointAY - centerpointBY : centerpointBY - centerpointAY;


        // angle between centerpoint and given position (in radial)
        var angle = Math.atan(deltaY / deltaX);

        // sinus value of angle
        var sinangle = Math.sin(angle);

        // distance between centerpoint and given position
        var distance = deltaY / sinangle;

        // is mousepoint in circle
        distance = (deltaX === 0 && deltaY === 0) ? 0 : distance;
        return ((_radius + bRadius) >= distance);
    }

    // Return object instance
    initialize(this);
    return this;
}