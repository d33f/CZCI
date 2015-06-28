var Canvas;
(function (Canvas) {
    (function (WindowManager) {
        // Public methods
        WindowManager.setTitle = setTitle;
        WindowManager.setTimeRange = setTimeRange;
        WindowManager.showLoader = showLoader;
        WindowManager.showImageModal = showImageModal;

        // Set the title (top of screen)
        function setTitle(timelineTitle) {
            var title = document.getElementById("title");
            title.innerHTML = "" + timelineTitle;
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

        // Resize listener
        window.onresize = function (e) {
            Canvas.resetWindowWidthAndHeight();
        }

        function showImageModal(image) {
            var modal = "<div id=\"dialog-confirm\">".concat("<img class=\"dialogImage\" width=90% src=\"".concat(image).concat("\">"))
.concat("</div>");
            document.body.insertAdjacentHTML("afterbegin", modal);

            $("#dialog-confirm").dialog({
                modal: true,
                width: '90%',
                maxWidth: '90%',
                maxHeight: '80%',
                buttons: {
                    Ok: function () {
                        $(this).dialog("close");
                        $(this).remove();
                    }
                }
            });
        }



    })(Canvas.WindowManager || (Canvas.WindowManager = {}));
    var WindowManager = Canvas.WindowManager;
})(Canvas || (Canvas = {}));