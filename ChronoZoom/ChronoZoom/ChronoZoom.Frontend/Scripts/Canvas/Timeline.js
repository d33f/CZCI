var Canvas;
(function (Canvas) {
    (function (Timeline) {
        // Public methods
        Timeline.draw = draw;
        Timeline.update = update;
        Timeline.handleClickOnTimeline = handleClickOnTimeline;
        Timeline.setTimeline = setTimeline;
        Timeline.stopFullScreenContentItemMode = stopFullScreenContentItemMode;

        // Private fields
        var _contentItems = [];
        var _oldContentItems = [];
        var _oldRange = [];
        var _newRange = [];
        var _fullscreenContentItem;

        // Animation Variables
        var _animationTime = 1;
        var _clickedContentItem;
        var _position;
        var _size;
        var _deltaLeft;
        var _deltaRight;
        var _deltaTop;
        var _deltaBottom;
        var _maxAnimationSteps;
        var _currentAnimationStep = 0;
        var _fps;

        // Constructor
        function initialize() {
            Canvas.ContentItemService.addListener(onContentItemsChanged);
        }

        function setTimeline(timelineId) {
            _contentItems = [];
            Canvas.ContentItemService.findTimeline(timelineId);       
        }

        // Handle on content item changed event
        function onContentItemsChanged() {
            // Set old content items with the current content items
            _oldContentItems = _contentItems;
            /*
            if (_contentItems.length > 0) {
                _oldContentItems = Canvas.ContentItemService.deepCopy(_contentItems);
                var length = _oldContentItems.length;
                var index;
                for (var i = 0; i < length; i++) {
                    if (_oldContentItems[i].getId() === _clickedContentItem.getId())
                        index = i;
                }
                _oldContentItems.splice(index, 1);
            }
            */

            _contentItems = Canvas.ContentItemService.getContentItems();
             
            // Destruct old content items
            var length = _oldContentItems.length;
            for (var i = 0; i < length; i++) {
                _oldContentItems[i].destructor();
            }

            // Hide loader
            Canvas.WindowManager.showLoader(false);
        }

        // Update the timeline
        function update() {
            // Update all content items
            //var ocLength = _oldContentItems.length;
            var ciLength = _contentItems.length;
            /*
            for (var i = 0; i < ocLength; i++) {
                _oldContentItems[i].update(_oldContentItems);
            }
            */

            for (var i = 0; i < ciLength; i++) {
                _contentItems[i].update(_contentItems);
            }
        }

        // Draw the timeline
        function draw() {
            drawContentItems();
            drawToolTip();
        }

        // Draw (visible) content items
        function drawContentItems() {
            // Get current range
            var range = Canvas.Timescale.getRange();
            

            // Check for animation
            if (_oldContentItems.length > 0) {
                // Update current animation step
                _currentAnimationStep++;

                // Draw all old content items that has childeren first
                drawContentItemsLoop(_oldContentItems, range, true);
                drawContentItemsLoop(_oldContentItems, range, false);

                _fps = Canvas.getFPS();
                _maxAnimationSteps = _fps * _animationTime;


                // Update timescale
                /*
                _position = _clickedContentItem.getPosition();
                _size = _clickedContentItem.getSize();

                if (_currentAnimationStep == 1) {
                    _fps = Canvas.getFPS();
                    _maxAnimationSteps = _fps * _animationTime;
                    _deltaLeft = Canvas.Timescale.getTimeForXPosition(_position.x) - Canvas.Timescale.getTimeForXPosition(0);
                    _deltaRight = Canvas.Timescale.getTimeForXPosition(Canvas.getCanvasContainer().width) - Canvas.Timescale.getTimeForXPosition(_position.x + _size.width);
                }
                */
                var timeElapsed = _currentAnimationStep / _fps;
                
                if (timeElapsed >= _animationTime) {
                    _oldContentItems = [];
                } else {
                    //var range = Canvas.Timescale.getRange();
                    //Canvas.Timescale.setRange(range.begin + (_deltaLeft/_maxAnimationSteps), range.end - (_deltaRight/_maxAnimationSteps));
                }
                
            }
            
            // Draw all content items that has childeren first
            //drawContentItemsLoop(_oldContentItems, range, true);
            //drawContentItemsLoop(_oldContentItems, range, false);
            drawContentItemsLoop(_contentItems, range, true);
            drawContentItemsLoop(_contentItems, range, false);

        }

        // Draw content item loop
        function drawContentItemsLoop(contentItems, range, hasChildren) {
            // Check all content items
            var length = contentItems.length;
            for (var i = 0; i < length; i++) {
                if (contentItems[i].hasChildren() === hasChildren) {
                    // Draw content item
                    drawContentItem(range, contentItems[i]);
                }
            }
        }

        // Draw given content item on canvas if in (current) range
        function drawContentItem(range, contentItem) {
            // Check if content item visible in current range
            if (contentItem.getBeginDate() >= range.begin || contentItem.getEndDate() <= range.end) {
                contentItem.draw();
            }
        }

        function drawToolTip() {
            var _contentItemOnMousePosition = getContentItemOnMousePosition();

            if (_contentItemOnMousePosition !== undefined && !_contentItemOnMousePosition.getFullScreen()) {
                Canvas.Tooltip.update(_contentItemOnMousePosition);
                Canvas.Tooltip.draw();
            }

            var container = Canvas.getCanvasContainer();
            var cursor = _contentItemOnMousePosition !== undefined ? 'pointer' : 'default';
            
            if (container.style.cursor !== cursor) {
                container.style.cursor = cursor;
            }
        }

        // Handle the click on timeline event
        function handleClickOnTimeline() {
            // Find clicked item
            var clickedContentItem = getContentItemOnMousePosition();

            // If no item found zoom out
            if (clickedContentItem === undefined) {
                clickedContentItem = Canvas.Breadcrumbs.decreaseDepthAndGetTheNewContentItem();
            }

            // Make sure root is not reached
            if (clickedContentItem !== undefined) {
                handleClickOnContentItem(clickedContentItem);
            }
        }

        // Handle click on given content item
        function handleClickOnContentItem(clickedContentItem) {
            // Calculate new range
            var rangeItem = clickedContentItem.getEndDate() - clickedContentItem.getBeginDate();
            var rangeBegin = clickedContentItem.getBeginDate() - (rangeItem / 20);
            var rangeEnd = clickedContentItem.getEndDate() + (rangeItem / 20);

            // Set old and new range
            _oldRange = Canvas.Timescale.getRange();            
            _newRange = { begin: rangeBegin, end: rangeEnd };

            // Update timescale
            Canvas.Timescale.setRange(rangeBegin, rangeEnd);

            // Handle event
            if (clickedContentItem.hasChildren()) {
                handleClickOnContentItemWithChildren(clickedContentItem);
            } else {
                handleClickOnContentItemWithoutChildren(clickedContentItem);
            }
        }

        // Handle click on content item without children
        function handleClickOnContentItemWithoutChildren(contentItem) {
            // Update bread crumbs
            Canvas.Breadcrumbs.setContentItem(contentItem);

            // Update content items array
            _contentItems = [contentItem];

            // Mark content item as fullscreen mode
            contentItem.setIsFullScreen(true);
            _fullscreenContentItem = contentItem;
        }

        function stopFullScreenContentItemMode() {
            if(_fullscreenContentItem !== undefined) _fullscreenContentItem.setIsFullScreen(false);
        }

        // Handle click on content item with children
        function handleClickOnContentItemWithChildren(contentItem) {
            // Show loader
            Canvas.WindowManager.showLoader(true);

            // Get children
            Canvas.ContentItemService.findContentItemsByParentContent(contentItem);
        }

        // Get content item on mouse position
        function getContentItemOnMousePosition() {
            // Search through all content items
            var length = _contentItems.length;
            for (var i = 0; i < length; i++) {
                // Check if content item collides
                _collidedContentItem = checkCollision(_contentItems[i]);
                if (_collidedContentItem !== undefined) {
                    _clickedContentItem = _collidedContentItem;
                    return _collidedContentItem;
                }
            }

            // Nothing collides
            return undefined;
        }

        // Check if current content item collides given content item
        function checkCollision(contentItem) {
            var position = Canvas.Mousepointer.getPosition();
            if (contentItem.collides(position.x, position.y)) {
                var children = contentItem.getChildren();
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    if (checkCollision(children[i]) !== undefined) {
                        return children[i];
                    }
                }
                return contentItem;
            }
            return undefined;
        }

        initialize();
    })(Canvas.Timeline || (Canvas.Timeline = {}));
    var Timeline = Canvas.Timeline;
})(Canvas || (Canvas = {}));
