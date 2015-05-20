var Canvas;
(function (Canvas) {
    (function (WindowManager) {
        // Public methods
        WindowManager.setTitle = setTitle;
        WindowManager.setTimeRange = setTimeRange;


        function setTitle(timelineTitle) {
            var title = document.getElementById("title");
            title.innerHTML = ""+timelineTitle;
        }

        function setTimeRange(timelineTimeRange) {
            var timerange = document.getElementById("timerange");
            timerange.innerHTML = timelineTimeRange;
        }


    })(Canvas.WindowManager || (Canvas.WindowManager = {}));
    var WindowManager = Canvas.WindowManager;
})(Canvas || (Canvas = {}));