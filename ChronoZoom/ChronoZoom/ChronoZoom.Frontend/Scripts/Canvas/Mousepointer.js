var Canvas;
(function (Canvas) {
    (function (Mousepointer) {
        // Public methods
        Mousepointer.getPosition = getPosition;
        Mousepointer.start = start;
        Mousepointer.getDrag = getDrag;

        // Private fields
        var _position = { x: 0, y: 0 };

        // Drag Variables
        var _drag = false;
        var _startPosition = { x: 0, y: 0 };
        var _lastPosition = { x: 0, y: 0 };
        var _preventClick = false;

        // Start capturing the mouse position
        function start() {
            // Get container
            var container = Canvas.getCanvasContainer();

            // Add event listeners
            container.addEventListener("mousemove", updateMousePosition, false);
            container.addEventListener("click", clickedOnTimeline, false);
            container.addEventListener("mousedown", startDrag, false);
            container.addEventListener("mouseup", endDrag, false);

            // Check user agent and add event listener
            if (navigator.userAgent.toLocaleLowerCase().indexOf('firefox') > 1) {
                container.addEventListener("DOMMouseScroll", zoomCanvasFirefox, false);
            } else {
                container.addEventListener("mousewheel", zoomCanvas, false);
            }
        }

        // Get current position
        function getPosition() {
            return _position;
        }

        // Check if drag
        function getDrag() {
            return _drag;
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
            if (_drag) {
                Canvas.Timeline.dragTimeline(_lastPosition.y - _position.y);
                _lastPosition.x = _position.x;
                _lastPosition.y = _position.y;
            }
        }

        function startDrag(e) {
            _drag = true;
            _startPosition.x = _position.x;
            _startPosition.y = _position.y;
            _lastPosition.x = _position.x;
            _lastPosition.y = _position.y;
        }

        function endDrag(e) {
            _drag = false;
            if (_startPosition.x !== _position.x || _startPosition.y !== _position.y)
                _preventClick = true; 
        }

        // Handle click on time event
        function clickedOnTimeline(e) {
            if (!_preventClick)
                Canvas.Timeline.handleClickOnTimeline(e);
            else
                _preventClick = false;
        }

        // Handle zoom on canvas
        function zoomCanvas(e) {
            var range = Canvas.Timescale.getRange();
            var begin, end;
            if (e.wheelDelta > 0) {
                begin = range.begin + 2;
                end = range.end - 2;
            } else {
                begin = range.begin - 2;
                end = range.end + 2;
            }
            Canvas.Timescale.setRange(begin, end);
        }

        // Handle zoom on canvas for firefox
        function zoomCanvasFirefox(e) {
            var range = Canvas.Timescale.getRange();
            var begin, end;
            if (e.detail > 0) {
                begin = range.begin + 2;
                end = range.end - 2;
            } else {
                begin = range.begin - 2;
                end = range.end + 2;
            }
            Canvas.Timescale.setRange(begin, end);
        }
    })(Canvas.Mousepointer || (Canvas.Mousepointer = {}));
    var Mousepointer = Canvas.Mousepointer;
})(Canvas || (Canvas = {}));