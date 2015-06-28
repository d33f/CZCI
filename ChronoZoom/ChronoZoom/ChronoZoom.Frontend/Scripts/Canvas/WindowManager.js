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
            document.getElementById("loader").style.visibility = isVisible ? "visible" : "hidden";
        }

        function showImageModal(image) {
            // Create modal
            // Append to body
            // jQuery show
            var modal = "<div id=\"dialog-confirm\">".concat("<img width=100% src=\"".concat(image).concat("\">"))
.concat("</div>");
            document.body.insertAdjacentHTML("afterbegin", modal);

            
            $("#dialog-confirm").dialog({
                modal: true,
                maxWidth: '90%',
                width:'auto',
                    buttons: {
                        Ok: function () {
                            $(this).dialog("close");
                           $(this).remove();
                        }
                    }
                });

                //$("#standard.test.modal").modal("attach events", ".largeImage", "show");

            

        }

        // Resize listener
        window.onresize = function (e) {
            Canvas.resetWindowWidthAndHeight();
        }

    })(Canvas.WindowManager || (Canvas.WindowManager = {}));
    var WindowManager = Canvas.WindowManager;
})(Canvas || (Canvas = {}));