/**
 * The Mousepointer is responsible for keeping track on the mouse input.
 * The changes of input that will be tracked are, click and drag events
 */
Canvas.Mousepointer = (function () {
    var position = new Position();
    var preventClick = false;
    var drag = false;
    var startPosition = new Position();
    var lastPosition = new Position();

    function start() {
        var container = Canvas.canvasContainer;
        container.addEventListener("mousemove", updateMousePosition, false);
        container.addEventListener("click", clickedOnTimeline, false);
        container.addEventListener("mousedown", startDrag, false);
        container.addEventListener("mouseup", endDrag, false);

        // Check user agent and add event listener
        if (navigator.userAgent.toLocaleLowerCase().indexOf('firefox') > 1) {
            container.addEventListener("DOMMouseScroll", scrollTimelineFirefox, false);
        } else {
            container.addEventListener("mousewheel", scrollTimelineOthers, false);
        }
    }

    function getOffset() {
        console.log(lastPosition.y, position.y);
        return -(lastPosition.y - position.y);
    }

    function updateMousePosition(e) {
        // Opera, ie
        if ("offsetX" in e) {
            position.x = e.offsetX;
            position.y = e.offsetY;
            // Firefox
        } else if ("pageX" in e) {
            position.x = e.pageX;
            position.y = e.pageY;
        } else {
            position.x = 0;
            position.y = 0;
        }

        if (drag) {
            Canvas.Timeline.updateOffsetY(-(lastPosition.y - position.y));
            lastPosition.x = position.x;
            lastPosition.y = position.y;
        }
    }

    function startDrag(e) {
        drag = true;
        startPosition.x = position.x;
        startPosition.y = position.y;
        lastPosition.x = position.x;
        lastPosition.y = position.y;
    }

    function endDrag(e) {
        drag = false;
        if (startPosition.x !== position.x || startPosition.y !== position.y)
            preventClick = true;
    }

    function clickedOnTimeline(e) {
        if (!preventClick) {
            Canvas.Timeline.handleClickOnTimeline(e);
        } else {
            preventClick = false;
        }
    }

    function scrollTimelineOthers(e) {
        scrollTimeline(e.wheelDelta);
    }

    function scrollTimelineFirefox(e) {
        scrollTimeline(e.detail);
    }

    // Handle scroll on canvas 
    function scrollTimeline(wheelDelta) {
        Canvas.Timeline.updateOffsetY(wheelDelta < 0 ? 20 : -20);
    }

    return {
        position: position,
        start: start,
        getOffset: getOffset
    }
})();