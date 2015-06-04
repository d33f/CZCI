var Canvas;
(function (Canvas) {
    (function (PanelManager) {
        // Public methods
        PanelManager.showTimelinePanel = showTimelinePanel;
        PanelManager.handleImportPanel = handleImportPanel;
        PanelManager.handleImportPanelInput = handleImportPanelInput;
        PanelManager.handleAddTimelineClick = handleAddTimelineClick;
        PanelManager.addTimelines = addTimelines;

        var showTimeLineImport;

        function showTimelinePanel(showPanel) {
            var inputPanel = document.getElementById('timelinePanel');
            inputPanel.className = showPanel ? 'timelinePanelShow' : 'timelinePanelHidden';
        }

        function handleImportPanel() {
            var importPanel = document.getElementById('importPanel');
            importPanel.className = importPanel.className === 'importPanelHidden' ? 'importPanelShow' : 'importPanelHidden';
        }

        function handleImportPanelInput() {
            var title = document.getElementById("titleInput").value;
            var startDate = document.getElementById("startDateInput").value;
            var endDate = document.getElementById("endDateInput").value;
            var description = document.getElementById("descriptionInput").value;

            Canvas.BackendService.createPersonalTimeLine(title, startDate, endDate);

            // write output to panel
            var output = document.getElementById("importOutput");
            if (output.textContent !== undefined) {
                // Input validation
                console.log('startdate value: ' + startDate);
                console.log('enddate value:' + endDate);


                if (title == "" || startDate == "" || endDate == "") {
                    output.textContent = "Please check your input! Input is not correct.";
                }
                else {
                    output.textContent = "Input received: " + title + " " + startDate + " " + endDate + " " + description;
                    // Refresh timeline panel
                    addTimelines();
                }
            }
        }

        function addTimelines() {
            Canvas.BackendService.getAllTimelines(function (timelines) {
                for (var i = 0; i < timelines.length; i++) {
                    console.log(timelines[i].title);
                }

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
                newLink.setAttribute('onclick', 'Canvas.setTimeline('+array[i].id +')');

                // Get and set the text of the item and append the text content to the A class
                var caption = document.createTextNode(array[i].title);
                newLink.appendChild(caption);

                // Add item to divContentElement
                divContentElement.appendChild(newLink);
                item.appendChild(divContentElement);

                // Add it to the top level div element
                divElement.appendChild(item);

            }
            return divElement;
        }

        function handleAddTimelineClick(showImportPanel) {
            var importPanel = document.getElementById('importPanel');

            if (importPanel.className = 'importPanelHidden') {
                importPanel.className = 'importPanelShow';
            }
            else {
                console.log('show');
                importPanel.className = 'importPanelShow';
            }

            //importPanel.className = showImportPanel ? 'importPanelShow' : 'importPanelHidden';
        }

    })(Canvas.PanelManager || (Canvas.PanelManager = {}));
    var PanelManager = Canvas.PanelManager;
})(Canvas || (Canvas = {}));