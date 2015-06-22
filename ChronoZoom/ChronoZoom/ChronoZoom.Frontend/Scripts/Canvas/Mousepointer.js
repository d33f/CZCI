var Canvas;
(function (Canvas) {
    (function (Mousepointer) {
        // Public methods
        Mousepointer.getPosition = getPosition;
        Mousepointer.start = start;

        // Private fields
        var _position = { x: 0, y: 0 };
        var _preventClick = false;

        // Start capturing the mouse position
        function start() {
            // Get container
            var container = Canvas.getCanvasContainer();

            // Add event listeners
            container.addEventListener("mousemove", updateMousePosition, false);
            container.addEventListener("click", clickedOnTimeline, false);
        
            // Check user agent and add event listener
            if (navigator.userAgent.toLocaleLowerCase().indexOf('firefox') > 1) {
                container.addEventListener("DOMMouseScroll", scrollTimelineFirefox, false);
            } else {
                container.addEventListener("mousewheel", scrollTimelineOthers, false);
            }
        }

        // Get current position
        function getPosition() {
            return _position;
        }

        // Update mouse position
        function updateMousePosition(e) {
            // Opera, ie
            if ("offsetX" in e) {
                _position.x = e.offsetX;
                _position.y = e.offsetY;
            // Firefox
            } else if ("pageX" in e) {
                _position.x = e.pageX;
                _position.y = e.pageY;
            } else {
                _position.x = 0;
                _position.y = 0;
            }
        }

        // Handle click on time event
        function clickedOnTimeline(e) {
            if (!_preventClick) {
                Canvas.Timeline.handleClickOnTimeline(e);
            } else {
                _preventClick = false;
            }
        }

        // Handle scroll on canvas for all browsers
        function scrollTimelineOthers(e) {
            scrollTimeline(e.wheelDelta);
        }

        // Handle scroll on canvas firefox
        function scrollTimelineFirefox(e) {
            scrollTimeline(e.detail);
        }

        // Handle scroll on canvas 
        function scrollTimeline(wheelDelta) {
            Canvas.Timeline.updateOffsetY(wheelDelta < 0 ? 5 : -5);
        }
    })(Canvas.Mousepointer || (Canvas.Mousepointer = {}));
    var Mousepointer = Canvas.Mousepointer;
})(Canvas || (Canvas = {}));