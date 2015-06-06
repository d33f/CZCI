var Canvas;
(function (Canvas) {
    (function (PanelManager) {
        // Public methods
        PanelManager.showTimelinePanel = showTimelinePanel;
        PanelManager.showImportPanel = showImportPanel;
        PanelManager.hideBothPanels = hideBothPanels;
        PanelManager.handleImportPanelInput = handleImportPanelInput;
        PanelManager.handleTimelineBtnClick = handleTimelineBtnClick;
        PanelManager.handleImportBtnClick = handleImportBtnClick;
        PanelManager.addTimelines = addTimelines;

        //Show the timeline panel on the left side of the screen
        function showTimelinePanel(showPanel) {
            var inputPanel = document.getElementById('timelinePanel');
            inputPanel.className = showPanel ? 'timelinePanelShow' : 'timelinePanelHidden';
        }

        //Show the import panel on the right side of the screen
        function showImportPanel(showPanel) {
            var inputPanel = document.getElementById('importPanel');
            inputPanel.className = showPanel ? 'importPanelShow' : 'importPanelHidden';
        }

        function hideBothPanels() {
            showTimelinePanel(false);
            showImportPanel(false);
        }

        function handleImportBtnClick() {
            var inputPanel = document.getElementById('importPanel');
            if (inputPanel.className === 'importPanelHidden') {
                showImportPanel(true);
            }
            else{
                showImportPanel(false);
            }

        }

        function handleTimelineBtnClick() {
            var inputPanel = document.getElementById('timelinePanel');
            if (inputPanel.className === 'timelinePanelShow') {
                showTimelinePanel(false);
            }

            else {
                showTimelinePanel(true);
            }
        }


        //Handle the input of the timeline import panel
        function handleImportPanelInput() {
            var title = document.getElementById("titleInput").value;
            var startDate = document.getElementById("startDateInput").value;
            var endDate = document.getElementById("endDateInput").value;
            var description = document.getElementById("descriptionInput").value;

            Canvas.BackendService.createPersonalTimeLine(title, startDate, endDate, description);

            // write output to panel
            var output = document.getElementById("importOutput");
            if (output.textContent !== undefined) {
                // Input validation

                if (title == "" || startDate == "" || endDate == "") {
                    output.textContent = "Please check your input! Input is not correct.";
                }
                else {
                    // Refresh timeline panel
                    addTimelines();
                    showImportPanel(false);
                    showTimelinePanel(true);
                }
            }
        }

        function addTimelines() {
            Canvas.BackendService.getAllTimelines(function (timelines) {

                // Clear existing content
                var node = document.getElementById('timelineList');
                while (node.hasChildNodes()) {
                    node.removeChild(node.firstChild);
                }
                // Generate new content for timeline displaying
                document.getElementById('timelineList').appendChild(makeUnorderedList(timelines));
            }, function (error) {
                console.log("Error getting all timelines");
            });
        }

        // Create UL from all the timelines
        function makeUnorderedList(array) {

            // Create div element
            var divElement = document.createElement('div');
            divElement.setAttribute('class','ui divided list inverted');

            for (var i = 0; i < array.length; i++) {

                //console.log(array[i].)
                array[i].description = "<Description goes here>"

                // Create item
                var item = document.createElement('div');
                item.setAttribute('class', 'item');
                // Create icon
                var icon = document.createElement('i');
                icon.setAttribute('class', 'list layout icon');

                // Combine icon with item
                item.appendChild(icon);

                // Setup structure and set contents

                // Set div for each content item
                var divContentElement = document.createElement('div');
                divContentElement.setAttribute('class', 'content');

                // Set A class
                var newLink = document.createElement('a');
                newLink.setAttribute('class', 'header');
                newLink.setAttribute('onclick', 'Canvas.setTimeline(' + array[i].id + '); Canvas.PanelManager.hideBothPanels();');

                // Get and set the text of the item and append the text content to the A class
                var caption = document.createTextNode(array[i].title);
                newLink.appendChild(caption);

                var description = document.createTextNode(array[i].description);

                // Add item to divContentElement
                divContentElement.appendChild(newLink);
                divContentElement.appendChild(description);
                item.appendChild(divContentElement);

                // Add it to the top level div element
                divElement.appendChild(item);
            }

            return divElement;
        }

    })(Canvas.PanelManager || (Canvas.PanelManager = {}));
    var PanelManager = Canvas.PanelManager;
})(Canvas || (Canvas = {}));