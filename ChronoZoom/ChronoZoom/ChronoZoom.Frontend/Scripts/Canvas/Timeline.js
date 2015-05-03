var Canvas;
(function (Canvas) {
    (function (Timeline) {
        // Public methods
        Timeline.draw = draw;
        Timeline.update = update;
        Timeline.handleClickOnTimeline = handleClickOnTimeline;

        // Private fields
        var _contentItems = [];
        var _isLoading = true;
        var _isChanged = false;

        // Constructor
        function initialize() {
            Canvas.ContentItemService.addListener(onContentItemsChanged);
        }

        // Handle on content item changed event
        function onContentItemsChanged(e) {
            // Get content items
            _contentItems = Canvas.ContentItemService.getContentItems();

            // Update flags
            _isLoading = false;
            _isChanged = true;
        }

        // Update the timeline
        function update() {
            // Check if changed
            if(_isChanged) {
                // Update all content items
                var length = _contentItems.length;
                for (var i = 0; i < length; i++) {
                    _contentItems[i].update();
                }

                // Remove change flag
                _isChanged = false;
            }
        }

        // Draw the timeline
        function draw() {
            if (_isLoading) {
                drawLoader();
            } else {
                drawContentItems();
            }
        }

        // Draw loader 
        function drawLoader() {
            var context = Canvas.getContext();
            context.font = Canvas.Settings.getTimescaleTickLabelFont();
            context.fillStyle = Canvas.Settings.getTimescaleTickLabelColor();
            context.fillText("LOADING...", 100, 100);
        }

        // Draw (visible) content items
        function drawContentItems() {
            // Get current range
            var range = Canvas.Timescale.getRange();

            // Draw all content items
            var length = _contentItems.length;
            for (var i = 0; i < length; i++) {
                // Get current content item
                var contentItem = _contentItems[i];

                // Check if content item visible in current range
                if (contentItem.beginDate >= range.begin && contentItem.endDate <= range.end) {
                    contentItem.draw();
                }
            }
        }

        function handleClickOnTimeline(eventArgs) {
            var clickedContentItem = getContentItemOnMousePosition();
            console.log('Clicked', clickedContentItem);
            if (clickedContentItem !== undefined) {
                Canvas.Timescale.setRange(clickedContentItem.beginDate-1, clickedContentItem.endDate+1);
                Canvas.ContentItemService.findContentItemsByParentContentID(clickedContentItem.id);
                _isLoading = true;
            } else {
                // TODO: Zoom out
                //Canvas.Timescale.setRange(500, 3000);
            }
        }

        // Get content item on mouse position
        function getContentItemOnMousePosition() {
            var position = Canvas.Mousepointer.getPosition();

            // Search through all content items
            var length = _contentItems.length;
            for (var i = 0; i < length; i++) {
                // Check if content item collides
                if(_contentItems[i].collides(position.x, position.y)) {
                    return _contentItems[i];
                }
            }

            // Nothing collides
            return undefined;
        }

        initialize();
    })(Canvas.Timeline || (Canvas.Timeline = {}));
    var Timeline = Canvas.Timeline;
})(Canvas || (Canvas = {}));