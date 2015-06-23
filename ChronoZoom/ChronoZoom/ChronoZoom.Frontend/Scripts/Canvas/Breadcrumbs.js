Canvas.Breadcrumbs = (function () {
    // Private fields
    var stack = [];
    var container = null;
    var currentContentItem;

    var getCurrentItem = function () {
        return currentContentItem;
    }

    function setCurrentItem(contentItem) {
        currentContentItem = contentItem;
    }

    var getRootItem = function () {
        return stack[0];
    }

    // Constructor
    function initialize() {
        // Get breadcrumbs element
        var breadcrumbs = document.getElementById('breadcrumbs');

        // Create new breadcrumbs element if it doesn't exist
        if (breadcrumbs == null) {
            breadcrumbs = document.createElement('div');
            breadcrumbs.id = 'breadcrumbs';

            container = document.getElementById('canvasContainer');
            container.appendChild(breadcrumbs);
        }

        // Store element as container
        container = breadcrumbs;
    }

    // set the new content item
    var setContentItem = function (contentItem) {
        if (contentItem instanceof ContentItem) {
            // Reset the stack
            stack = [];

            // Check if top value is item without children
            if (!contentItem.hasChildren()) {
                contentItem.setIsFullScreen(true);
            }

            while (contentItem !== undefined) {
                if (contentItem.id !== 0) {
                    stack.unshift(contentItem);
                }
                contentItem = contentItem.getParentContentItem();
            }

            // Display the new breadcrumbs
            display();
        }
    }

    // Decrease depth by removing the last content item at top of the stack and return the new last content item
    var decreaseDepthAndGetTheNewContentItem = function () {
        if (stack.length === 1) {
            return stack[0]; // root
        } else {
            removeLastContentItem();
            display();
            return stack[stack.length - 1];
        }
    }

    // Remove the last content item at top of the stack
    function removeLastContentItem() {
        // Remove the first item of the stack
        var contentItem = stack.pop();

        // if content item has no children, make sure it is not in fullscreen mode anymore
        if (!contentItem.hasChildren()) {
            contentItem.setIsFullScreen(false);
        }
    }

    // Display bread crumbs
    function display() {
        clearDisplay();
        displayNew();
    }

    // Clear (current) display
    function clearDisplay() {
        while (container.firstChild) {
            // Faster then updating the innerHTML to nothing
            container.removeChild(container.firstChild);
        }
    }

    // Display new bread crumbs
    function displayNew() {
        // Add crumbs
        var length = stack.length;
        for (var i = 0; i < length; i++) {
            var breadcrumb = i === length - 1 ? document.createElement("div") : document.createElement("a");
            breadcrumb.className = i === length - 1 ? "active section" : "section";
            setCurrentItem(stack[i]);
            Canvas.PanelManager.updateAddItemPanel();
            breadcrumb.appendChild(document.createTextNode(stack[i].getTitle()));
            breadcrumb.title = stack[i].getTitle();
            breadcrumb.href = "javascript:Canvas.Breadcrumbs.redirect(" + i + ")";

            var divider = document.createElement("i");
            divider.className = "right chevron icon divider";
            container.appendChild(divider);
            container.appendChild(breadcrumb);
        }
    }

    // Redirect to given breadcrumb
    var redirect = function (i) {
        // Don't redirect to your self
        var length = stack.length;
        if (i !== length - 1) {
            if (i < length && !stack[length - 1].hasChildren()) {
                stack[length - 1].setIsFullScreen(false);
                stack[length - 1] = undefined;
            }

            var contentItem = stack[i];
            var rangeItem = contentItem.getEndDate() - contentItem.getBeginDate();
            var rangeBegin = contentItem.getBeginDate() - (rangeItem / 20);
            var rangeEnd = contentItem.getEndDate() + (rangeItem / 20);

            document.getElementById("addButton").style.display = "inline-block";
            document.getElementById("editButton").style.display = "none"

            Canvas.Timescale.setRange(rangeBegin, rangeEnd);
            Canvas.ContentItemService.findContentItemsByParentContent(contentItem);
        }
    }

    initialize();

    // Public methods
    return {
        setContentItem: setContentItem,
        decreaseDepthAndGetTheNewContentItem: decreaseDepthAndGetTheNewContentItem,
        redirect: redirect,
        getRootItem: getRootItem,
        getCurrentItem: getCurrentItem
    }
})();