var Canvas;
(function (Canvas) {
    (function (PanelManager) {
        // Public methods
        PanelManager.handleAddTimelineInput = handleAddTimelineInput;
        PanelManager.addTimelines = addTimelines;
        PanelManager.imageUrlFieldHide = imageUrlFieldHide;
        PanelManager.updateAddItemPanel = updateAddItemPanel;
        PanelManager.showAddTimelinePanel = showAddTimelinePanel;
        PanelManager.showAddItemPanel = showAddItemPanel;
        PanelManager.toggleEditPanel = toggleEditPanel;
        PanelManager.handleAddContentItemInput = handleAddContentItemInput;
        PanelManager.clearAddItemPanel = clearAddItemPanel;
        PanelManager.hideAllPanels = hideAllPanels;
        PanelManager.showTimelinePanel = showTimelinePanel;
        PanelManager.submitPanel = submitPanel;

        var rootItem;
        var currentItem;

        var addItemPanelShown = false;
        var timelinePanelShown = false;
        var addTimelinePanelShown = false;

        var addItemPanelcorrectValues;

        // Private fields
        var _currentPanel = undefined;

        //Show the timeline panel on the left side of the screen
        function showTimelinePanel(buttonType) {
            var timelinePanel = document.getElementById('timelinePanel');

            if (timelinePanelShown) {
                timelinePanelShown = false
            }
            else {
                timelinePanelShown = true;
                timelinePanel.className = 'timelinePanelShow';
                addItemPanelShown = false;
                addTimelinePanelShown = false;
                clearAddItemPanel();
            }
        }

        //Show the panel for adding new timelines on the left side of the screen
        function showAddTimelinePanel(close) {
            var addTimelinePanel = document.getElementById('addTimelinePanel');
            var timelinePanel = document.getElementById('timelinePanel');

            if (close) {
                addTimelinePanelShown = false;
                timelinePanelShown = false;
                timelinePanel.className = 'timelinePanelHidden';
            }
            else if (addTimelinePanelShown) {
                timelinePanel.className = 'timelinePanelShow';
                addTimelinePanelShown = false;
                timelinePanelShown = true;
            }
            else {
                addTimelinePanelShown = true;
                addTimelinePanel.className = 'addTimelinePanelShow';
                addItemPanelShown = false;
                timelinePanelShown = false;
            }
        }

        //Show the panel for adding new items on the left side of the screen
        function showAddItemPanel(buttonType) {
            var addItemPanel = document.getElementById('addItemPanel');
            updateAddItemPanel();
            //Add entry button is clicked, panel needs to be hidden and cleared if the correct values are entered.
            if (buttonType === 'addEntry') {
                if (addItemPanelcorrectValues !== false) {
                    addItemPanel.className = 'addItemPanelHidden';
                    addItemPanelShown = false;
                    clearAddItemPanel();
                }
            }
            else if (addItemPanelShown) {
                addItemPanelShown = false;
                clearAddItemPanel();
            }
            else {
                hideErrorMessageArea();
                addItemPanelShown = true;
                addItemPanel.className = 'addItemPanelShow';
                timelinePanelShown = false;
                addTimelinePanelShown = false;
            }
        }


        function hideAllPanels() {
            var timelinePanel = document.getElementById('timelinePanel');
            var panel = document.getElementById('addTimelinePanel');
            var addItemPanel = document.getElementById('addItemPanel');

            if (timelinePanel.className == 'timelinePanelShow') {
                timelinePanel.className = 'timelinePanelHidden';
            }
            if (panel.className == 'addTimelinePanelShow') {
                panel.className = 'addTimelinePanelHidden';
            }
            if (addItemPanel.className == 'addItemPanelShow') {
                addItemPanel.className = 'addItemPanelHidden';
                clearAddItemPanel();
            }
        }

        //Clears the add content item values
        function clearAddItemPanel() {
            var titleInput = document.getElementById("titleInputContentItem");
            var startDate = document.getElementById("startDateInputContentItem");
            var endDate = document.getElementById("endDateInputContentItem");
            var description = document.getElementById("descriptionInputContentItem");
            var imageUrl = document.getElementById("imageUrlContentItem");

            //Clear inputfields
            titleInput.innerHTML = "";
            startDate.innerHTML = "";
            endDate.innerHTML = "";
            description.innerHTML = "";

            //Do not hide the imageURLField
            imageUrlFieldHide(false);

            removeErrorClasses();
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
                    hideAllPanels();
                    //showTimelinePanel(true);
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

        //Handles the data inserted in add contentitem panel
        function handleAddContentItemInput() {
            var hasChildren;
            var radios = document.getElementsByName('select');
            if (radios[0].checked) {
                hasChildren = false;
            }
            else if (radios[1].checked) {
                hasChildren = true;
            }

            var title = document.getElementById("titleInputContentItem");
            var titleArea = document.getElementById('titleAreaAddItem');
            var startDate = document.getElementById("startDateInputContentItem");
            var endDate = document.getElementById("endDateInputContentItem");
            var beginDateArea = document.getElementById('beginDateAddItem');
            var endDateArea = document.getElementById('endDateAddItem');
            var description = document.getElementById("descriptionInputContentItem");
            var imageUrl = document.getElementById("imageUrlContentItem");
            var pictureURLs = new Array();
            pictureURLs.push(imageUrl.value)
            var parentId = currentItem.Id;
            var parentIdBeginDate = currentItem.getBeginDate();
            var parentIdEndDate = currentItem.getEndDate();


            var errorMessage = "Error message";

            var correctValues;

            if (hasChildren === "" || hasChildren === undefined) {
                errorMessage = errorMessage + "<li>Use the radio button to select an item type! </li>";

                correctValues = false;
            }
            if (title.value === "") {;
                errorMessage = errorMessage + "<li>Enter a title!</li>";
                addErrorClass(titleArea);
                correctValues = false;
            }
            if (startDate.value < parentIdBeginDate || endDate.value > parentIdEndDate || startDate.value === "" || endDate.value === "") {
                addErrorClass(beginDateArea);
                addErrorClass(endDateArea);
                errorMessage = errorMessage + "<li>Begin and enddate not between " + parentIdBeginDate + " and " + parentIdEndDate + "</li>";
                correctValues = false;
            }

            if (startDate.value > endDate.value) {
                addErrorClass(beginDateArea);
                addErrorClass(endDateArea);
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
                hideErrorMessageArea();
                removeErrorClasses();
                Canvas.BackendService.createPersonalContentItem(startDate.value, endDate.value, title.value, description.value, hasChildren, currentItem, pictureURLs);
            }

            else {
                showErrorMessageArea(errorMessage);
            }
        }

        //Hides the error message on top of the edit panel
        function hideErrorMessageArea() {
            var errorMessage = "";
            var errorArea = document.getElementById('errorArea');
            errorArea.innerHTML = errorMessage;
            errorArea.className = 'ui hidden error message';
        }

        //Shows the error message on top of the edit panel
        function showErrorMessageArea(errorMessage) {
            var errorArea = document.getElementById('errorArea');
            errorArea.innerHTML = errorMessage;
            errorArea.className = 'ui error message';
        }

        //Adds error class to specific element
        function addErrorClass(element) {
            element.className = 'field error';
        }

        //Sets the classnames of input fields back to normal
        function removeErrorClasses() {
            var titleArea = document.getElementById('titleAreaAddItem');
            var beginDateArea = document.getElementById('beginDateAddItem');
            var endDateArea = document.getElementById('endDateAddItem');
            titleArea.className = 'field';
            beginDateArea.className = 'field';
            endDateArea.className = 'field';
        }

        /// EDIT PANEL

        function toggleEditPanel() {
            var panel = document.getElementById('editItemPanel');
            if (togglePanelAndReturnIfShown(panel)) {
                var data = Canvas.Breadcrumbs.getCurrentItem().getData();

                data.pictureURLs = JSON.stringify(data.pictureURLs);
                setPanelData(panel, data);
            } else {
                clearPanel(panel);
            }
        }

        function togglePanelAndReturnIfShown(panel) {
            if (panel.className.indexOf("hidePanel") !== -1) {
                if (_currentPanel !== undefined && _currentPanel.className.indexOf("hidePanel") === -1) {
                    _currentPanel.className.replace("showPanel", "hidePanel");
                }
                _currentPanel = panel;

                panel.className = panel.className.replace("hidePanel", "showPanel");
                return true;
            } else {
                panel.className = panel.className.replace("showPanel", "hidePanel");
                return false;
            }
        }

        function clearPanel(panel) {
            clearPanelElements(panel, "input");
            clearPanelElements(panel, "textarea");
        }

        function clearPanelElements(panel, tagName) {
            var elements = panel.getElementsByTagName(tagName);
            for (var i = 0; i < elements.length; i++) {
                elements[i].value = "";
            }
        }

        function getPanelData(panel) {
            data = {};
            getPanelElements(panel, "textarea", data);
            getPanelElements(panel, "input", data);
            return data;
        }
        
        function getPanelElements(panel, tagName, data) {
            var elements = panel.getElementsByTagName(tagName);
            for (var i = 0; i < elements.length; i++) {
                data[elements[i].getAttribute("name")] = elements[i].value;
            }
        }

        function setPanelData(panel, data) {
            setPanelElements(panel, "textarea", data);
            setPanelElements(panel, "input", data);
        }

        function setPanelElements(panel, tagName, data) {
            var elements = panel.getElementsByTagName(tagName);
            for (var i = 0; i < elements.length; i++) {
                var name = elements[i].getAttribute("name");
                if (data.hasOwnProperty(name)) {
                    elements[i].value = data[name];
                }
            }
        }

        function submitPanel() {
            var data = getPanelData(_currentPanel);

            if (_currentPanel.getAttribute("id") === "editItemPanel") {
                data.pictureURLs = JSON.parse(data.pictureURLs);
                Canvas.BackendService.editContentItem(data);
                Canvas.Breadcrumbs.getCurrentItem().setData(data);
            }

            _currentPanel.className = _currentPanel.className.replace("showPanel", "hidePanel");
        }

    })(Canvas.PanelManager || (Canvas.PanelManager = {}));
    var PanelManager = Canvas.PanelManager;
})(Canvas || (Canvas = {}));