var Canvas;
(function (Canvas) {
    (function (WindowManager) {
        // Public methods
        WindowManager.setTitle = setTitle;
        WindowManager.setTimeRange = setTimeRange;
        WindowManager.showLoader = showLoader;

        // Set the title (top of screen)
        function setTitle(timelineTitle) {
            var title = document.getElementById("title");
            title.innerHTML = ""+timelineTitle;
        }

        // Set the time range of the timeline
        function setTimeRange(timelineTimeRange) {
            var timerange = document.getElementById("timerange");
            timerange.innerHTML = timelineTimeRange;
        }

        // Show or hide the loader 
        function showLoader(isVisible) {
            document.getElementById('loader').style.visibility = isVisible ? 'visible' : 'hidden';
        }

        window.onresize = function(e) {
            Canvas.resetWindowWidthAndHeight();
        }
    })(Canvas.WindowManager || (Canvas.WindowManager = {}));
    var WindowManager = Canvas.WindowManager;
})(Canvas || (Canvas = {}));