var Canvas;
(function (Canvas) {
    (function (PanelManager) {
        // Public methods
        PanelManager.showTimelinePanel = showTimelinePanel;
        PanelManager.handleAddTimelineInput = handleAddTimelineInput;
        PanelManager.addTimelines = addTimelines;
        PanelManager.imageUrlFieldHide = imageUrlFieldHide;
        PanelManager.updateAddItemPanel = updateAddItemPanel;
        PanelManager.showAddTimelinePanel = showAddTimelinePanel;
        PanelManager.showAddItemPanel = showAddItemPanel;
        PanelManager.handleAddContentItemInput = handleAddContentItemInput;
        PanelManager.clearAddItemPanel = clearAddItemPanel;

        var rootItem;
        var currentItem;
        var itemPanelShown;
        var addItemPanelcorrectValues;

        //Show the timeline panel on the left side of the screen
        function showTimelinePanel() {
            var inputPanel = document.getElementById('timelinePanel');
            if (inputPanel.className == 'timelinePanelShow') {
                inputPanel.className = 'timelinePanelHidden';
            }
            else if (inputPanel.className = 'timelinePanelHidden') {
                inputPanel.className = 'timelinePanelShow';
                if (itemPanelShown == true) {
                    showAddItemPanel();
                }
            }
            //inputPanel.className = showPanel ? 'timelinePanelShow' : 'timelinePanelHidden';   
        }

        //Show the panel for adding new timelines on the left side of the screen
        function showAddTimelinePanel(showPanel) {
            var panel = document.getElementById('addTimelinePanel');
            if (panel.className == 'addTimelinePanelShow') {
                panel.className = 'addTimelinePanelHidden';
            }
            else if (panel.className == 'addTimelinePanelHidden') {
                panel.className = 'addTimelinePanelShow';
            }
        }

        //Show the panel for adding new items on the left side of the screen
        function showAddItemPanel(button) {
            updateAddItemPanel();
            var addItemPanel = document.getElementById('addItemPanel');

            //Add entry button is clicked, panel needs to be hidden and cleared if the correct values are entered.
            if (button === 'addEntry') {
                if (addItemPanelcorrectValues !== false) {
                    addItemPanel.className = 'addItemPanelHidden';
                    itemPanelShown = false;
                    clearAddItemPanel();
                }
            }
            else {
                if (addItemPanel.className == 'addItemPanelShow') {
                    addItemPanel.className = 'addItemPanelHidden';
                    itemPanelShown = false;
                    clearAddItemPanel();
                }
                else if (addItemPanel.className == 'addItemPanelHidden') {
                    addItemPanel.className = 'addItemPanelShow';
                    itemPanelShown = true;
                }
            }
        }

        function clearAddItemPanel() {
            document.getElementById("importOutputAddItem").innerHTML = "";
            document.getElementById("titleInputContentItem").value = "";
            document.getElementById("startDateInputContentItem").value = "";
            document.getElementById("endDateInputContentItem").value = "";
            document.getElementById("descriptionInputContentItem").value = "";
            document.getElementById("imageUrlContentItem").value = "";
            imageUrlFieldHide(false);
            var radios = document.getElementsByName('select')
            radios[0].checked = false;
            radios[1].checked = false;
        }

        function updateAddItemPanel() {
            var timelineLabel = document.getElementById('timelineName');
            var itemLabel = document.getElementById('itemName');
            getCurrentItems();
            itemLabel.innerHTML = currentItem.getTitle() + " ( " + currentItem.getBeginDate() + " - " + currentItem.getEndDate() + " )";
        }

        function getCurrentItems() {
            rootItem = Canvas.Breadcrumbs.getRootItem();
            currentItem = Canvas.Breadcrumbs.getCurrentItem();
        }
        /*
        function handleTimelineBtnClick() {
            var inputPanel = document.getElementById('timelinePanel');
            if (inputPanel.className === 'timelinePanelShow') {
                showTimelinePanel(false);
            }
            else {
                showTimelinePanel(true);
            }
        }*/

        function imageUrlFieldHide(hideField) {
            var imageUrlField = document.getElementById('imageUrlContentItem');
            imageUrlField.disabled = hideField;
        }

        //Handle the input of the timeline import panel
        function handleAddTimelineInput() {
            var title = document.getElementById("titleInput").value;
            var startDate = document.getElementById("startDateInput").value;
            var endDate = document.getElementById("endDateInput").value;
            var description = document.getElementById("descriptionInput").value;
            var imageUrl = document.getElementById("imageUrlInput").value;
            var isPublic = document.getElementById("isPublicInput").checked;

            Canvas.BackendService.createPersonalTimeLine(title, startDate, endDate, description, imageUrl, isPublic);

            // write output to panel
            var output = document.getElementById("importOutput");
            if (output.textContent !== undefined) {
                // Input validation

                if (title == "" || startDate == "" || endDate == "" || description == "" || imageUrl == "") {
                    output.textContent = "Please check your input! Input is not correct.";
                }
                else {
                    // Refresh timeline panel
                    addTimelines();
                    alert('Timeline added');
                    showAddTimelinePanel(false);
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
            divElement.setAttribute('class', 'ui divided list inverted');

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
                newLink.setAttribute('onclick', 'Canvas.setTimeline(' + array[i].id + ');');
                //newLink.setAttribute('onclick', 'Canvas.setTimeline(' + array[i].id + '); Canvas.PanelManager.hideBothPanels();');

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

        function handleAddContentItemInput() {
            var hasChildren;
            var radios = document.getElementsByName('select');
            if (radios[0].checked) {
                hasChildren = false;
            }
            else if (radios[1].checked) {
                hasChildren = true;
            }

            var title = document.getElementById("titleInputContentItem").value;
            var startDate = document.getElementById("startDateInputContentItem").value;
            var endDate = document.getElementById("endDateInputContentItem").value;
            var description = document.getElementById("descriptionInputContentItem").value;
            var imageUrl = document.getElementById("imageUrlContentItem").value;
            var pictureURLs = new Array();
            pictureURLs.push(imageUrl)
            var parentId = currentItem.getId();
            var parentIdBeginDate = currentItem.getBeginDate();
            var parentIdEndDate = currentItem.getEndDate();

            var output = document.getElementById("importOutputAddItem");
            var errorMessage = "Error message";

            var correctValues;

            if (hasChildren === "" || hasChildren === undefined) {
                errorMessage = errorMessage + "<li>Use the radio button to select an item type! </li>";
                correctValues = false;
            }
            if (title === "") {
                errorMessage = errorMessage + "<li>Enter a title!</li>";
                correctValues = false;
            }
            if (startDate < parentIdBeginDate || endDate > parentIdEndDate || startDate === "" || endDate === "") {
                errorMessage = errorMessage + "<li>Begin and enddate not between " + parentIdBeginDate + " and " + parentIdEndDate + "</li>";
                correctValues = false;
            }

            if (startDate > endDate) {
                errorMessage = errorMessage + "<li> Start date bigger then end date</li>";
                correctValues = false;
            }

            if (parentId === "" || parentId === null) {
                errorMessage = errorMessage + "<li>" + "Cannot find parentId, cannot add this item! </li>";
                correctValues = false;
            }
            if (parentId === 0) {
                errorMessage = errorMessage + "<li>Parentid is 0 </li>";
                correctValues = false;
            }

            addItemPanelcorrectValues = correctValues;

            if (addItemPanelcorrectValues !== false) {
                errorMessage = "";
                Canvas.BackendService.createPersonalContentItem(startDate, endDate, title, description, hasChildren, currentItem, pictureURLs);
            }

            output.innerHTML = errorMessage;
        }
    })(Canvas.PanelManager || (Canvas.PanelManager = {}));
    var PanelManager = Canvas.PanelManager;
})(Canvas || (Canvas = {}));