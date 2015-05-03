var Canvas;
(function (Canvas) {
    (function (Mousepointer) {
        // Public methods
        Mousepointer.getPosition = getPosition;
        Mousepointer.start = start;

        // Private fields
        var _position = { x: 0, y: 0 };

        // Start capturing the mouse position
        function start() {
            // Add event listeners
            Canvas.getContainer().addEventListener("mousemove", updateMousePosition, false);
            Canvas.getContainer().addEventListener("click", clickedOnTimeline, false);

            // Check user agent and add event listener
            if (navigator.userAgent.toLocaleLowerCase().indexOf('firefox') > 1) {
                Canvas.getContainer().addEventListener("DOMMouseScroll", zoomCanvasFirefox, false);
            } else {
                Canvas.getContainer().addEventListener("mousewheel", zoomCanvas, false);
            }
        }

        // Get current position
        function getPosition() {
            return _position;
        }

        // Update mouse position
        function updateMousePosition(e) {
            if ("offsetX" in e) { // Opera, ie
                _position.x = e.offsetX;
                _position.y = e.offsetY;
            } else if ("pageX" in e) { // Firefox
                _position.x = e.pageX;
                _position.y = e.pageY;
            } else {
                _position.x = 0;
                _position.y = 0;
            }
        }

        // Handle click on time event
        function clickedOnTimeline(e) {
            Canvas.Timeline.handleClickOnTimeline(e);
        }

        // Handle zoom on canvas
        function zoomCanvas(e) {
            var range = Canvas.Timescale.getRange();
            if (e.wheelDelta > 0) {
                begin = range.begin + 2;
                end = range.end - 2;
                Canvas.Timescale.setRange(begin,end);
            } else {
                begin = range.begin - 2;
                end = range.end + 2;
                Canvas.Timescale.setRange(begin, end);
            }   
        }

        // Handle zoom on canvas for firefox
        function zoomCanvasFirefox(e) {
            var range = Canvas.Timescale.getRange();
            if (e.detail > 0) {
                begin = range.begin + 2;
                end = range.end - 2;
                Canvas.Timescale.setRange(begin, end);
            } else {
                begin = range.begin - 2;
                end = range.end + 2;
                Canvas.Timescale.setRange(begin, end);
            }
        }
    })(Canvas.Mousepointer || (Canvas.Mousepointer = {}));
    var Mousepointer = Canvas.Mousepointer;
})(Canvas || (Canvas = {}));