var Canvas;
(function (Canvas) {
    (function (Timeline) {
        // Public methods
        Timeline.draw = draw;
        Timeline.update = update;
        Timeline.handleClickOnTimeline = handleClickOnTimeline;

        // Private fields
        var _contentItems = [];

        // Constructor
        function initialize() {
            Canvas.ContentItemService.addListener(onContentItemsChanged);
        }

        // Handle on content item changed event
        function onContentItemsChanged() {
            // Get content items
            _contentItems = Canvas.ContentItemService.getContentItems();

            // Hide loader
            Canvas.WindowManager.showLoader(false);
        }

        // Update the timeline
        function update() {
            // Update all content items
            var length = _contentItems.length;
            for (var i = 0; i < length; i++) {
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

            // Draw all content items that has childeren first
            drawContentItemsLoop(range, true);
            drawContentItemsLoop(range, false);
        }

        // Draw content item loop
        function drawContentItemsLoop(range, hasChildren) {
            // Check all content items
            var length = _contentItems.length;
            for (var i = 0; i < length; i++) {
                if (_contentItems[i].hasChildren() === hasChildren) {
                    // Draw content item
                    drawContentItem(range, _contentItems[i]);
                }
            }
        }

        // Draw given content item on canvas if in (current) range
        function drawContentItem(range, contentItem) {
            // Check if content item visible in current range
            if (contentItem.getBeginDate() >= range.begin && contentItem.getEndDate() <= range.end) {
                contentItem.draw();
            }
        }

        function drawToolTip() {
            var _contentItemOnMousePosition = getContentItemOnMousePosition();

            if (_contentItemOnMousePosition !== undefined) {
                if (!_contentItemOnMousePosition.getFullScreen()) {
                Canvas.Tooltip.update(_contentItemOnMousePosition);
                Canvas.Tooltip.draw();
            }
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
            // Update timescale and content item service
            var rangeItem = clickedContentItem.getEndDate() - clickedContentItem.getBeginDate();
            var rangeBegin = clickedContentItem.getBeginDate() - (rangeItem / 20);
            var rangeEnd = clickedContentItem.getEndDate() + (rangeItem / 20);
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