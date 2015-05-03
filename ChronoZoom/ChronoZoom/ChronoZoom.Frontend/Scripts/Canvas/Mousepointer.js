﻿var Canvas;
(function (Canvas) {
    (function (Mousepointer) {
        // Public methods
        Mousepointer.getPosition = getPosition;
        Mousepointer.init = init;

        // Private fields
        var x = 0;
        var y = 0;
        var begin = 0;
        var end = 0;

        // Update mouse position
        function updateMousePosition(e) {
            if ("offsetX" in e) { // Opera, ie
            x = e.offsetX;
                y = e.offsetY;
            } else if ("pageX" in e) { // Firefox
                x = e.pageX;
                y = e.pageY;
            } else {
                x = 0;
                y = 0;
            }
            

            var time = Canvas.Timescale.getTimeForXPosition(x);
        }

        function clickedOnTimeline(e) {
            Canvas.Timeline.handleClickOnTimeline(e);
        }

        function getPosition() {
            return { x: x, y: y };
        }

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
     
        function init() {
            Canvas.getContainer().addEventListener("mousemove", updateMousePosition, false);
            Canvas.getContainer().addEventListener("click", clickedOnTimeline, false);
            if (navigator.userAgent.toLocaleLowerCase().indexOf('firefox') > 1) {
                Canvas.getContainer().addEventListener("DOMMouseScroll", zoomCanvasFirefox, false);
            } else {
                Canvas.getContainer().addEventListener("mousewheel", zoomCanvas, false);
            }
            
        }

    })(Canvas.Mousepointer || (Canvas.Mousepointer = {}));
    var Mousepointer = Canvas.Mousepointer;
})(Canvas || (Canvas = {}));