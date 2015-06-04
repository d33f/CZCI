var Canvas;
(function (Canvas) {
    (function (PanelManager) {
        // Public methods
        PanelManager.showTimelinePanel = showTimelinePanel;
        PanelManager.showImportPanel = showImportPanel;
        PanelManager.hideBothPanels = hideBothPanels;
        PanelManager.handleImportPanelInput = handleImportPanelInput;
        PanelManager.addTimelines = addTimelines;

        var showTimeLineImport;


        //Show the timeline panel on the left side of the screen
        function showTimelinePanel(showPanel) {
            var inputPanel = document.getElementById('timelinePanel');
            inputPanel.className = showPanel ? 'timelinePanelShow' : 'timelinePanelHidden';
        }

        //Show the import panel on the right side of the screen
        function showImportPanel(showPanel) {
            console.log(showPanel, "showpanel");
            var inputPanel = document.getElementById('importPanel');
            inputPanel.className = showPanel ? 'importPanelShow' : 'importPanelHidden';
        }

        function hideBothPanels() {
            showTimelinePanel(false);
            showImportPanel(false);
        }


        //Handle the input of the timeline import panel
        function handleImportPanelInput() {
            var title = document.getElementById("titleInput").value;
            var startDate = document.getElementById("startDateInput").value;
            var endDate = document.getElementById("endDateInput").value;
            var description = document.getElementById("descriptionInput").value;

            Canvas.BackendService.createPersonalTimeLine(title, startDate, endDate);

            // write output to panel
            var output = document.getElementById("importOutput");
            if (output.textContent !== undefined) {
                output.textContent = "Input received: " + title + " " + startDate + " " + endDate + " " + description;
            }
        }

        function addTimelines() {
            Canvas.BackendService.getAllTimelines(function (timelines) {
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

            // Create the list element
            //var list = document.createElement('ul');

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

                var newLink = document.createElement('a');
                newLink.setAttribute('class', 'header');
                newLink.setAttribute('onclick', 'Canvas.setTimeline(' + array[i].id + '); Canvas.PanelManager.hideBothPanels();');

                // Get and set the text of the item 
                var caption = document.createTextNode(array[i].title);
                newLink.appendChild(caption);

                // Add item to divContentElement
                divContentElement.appendChild(newLink);
                item.appendChild(divContentElement);


                // Add it to the list
                //list.appendChild(item);
                divElement.appendChild(item);

            }
            return divElement;
        }

    })(Canvas.PanelManager || (Canvas.PanelManager = {}));
    var PanelManager = Canvas.PanelManager;
})(Canvas || (Canvas = {}));