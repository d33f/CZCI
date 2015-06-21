var Canvas;
(function (Canvas) {
    (function (Breadcrumbs) {
        // Public methods
        Breadcrumbs.setContentItem = setContentItem;
        Breadcrumbs.decreaseDepthAndGetTheNewContentItem = decreaseDepthAndGetTheNewContentItem;
        Breadcrumbs.redirect = redirect;
        Breadcrumbs.getRootItem = getRootItem;
        Breadcrumbs.getCurrentItem = getCurrentItem;
        var rootItem;
        var currentItem;

        // Private fields
        var _stack = [];
        var _container = null;

        function getCurrentItem() {
            return currentItem;
        }

        function setCurrentItem(item) {
            currentItem = item;
        }

        function getRootItem() {
            return rootItem;
        }

        function setRootItem(item) {
            rootItem = item;

        }

        // Constructor
        function initialize() {
            // Get breadcrumbs element
            var breadcrumbs = document.getElementById('breadcrumbs');

            // Create new breadcrumbs element if it doesn't exist
            if (breadcrumbs == null) {
                breadcrumbs = document.createElement('div');
                breadcrumbs.id = 'breadcrumbs';

                var container = document.getElementById('canvasContainer');
                container.appendChild(breadcrumbs);
            }

            // Store element as container
            _container = breadcrumbs;
        }

        // set the new content item
        function setContentItem(contentItem) {
            if (contentItem instanceof ContentItem) {
                // Reset the stack
                _stack = [];

                // Check if top value is item without children
                if (!contentItem.hasChildren()) {
                    contentItem.setIsFullScreen(true);
                }

                while (contentItem !== undefined)
                {
                    if(contentItem.getId() !== 0)
                        _stack.unshift(contentItem);
                    contentItem = contentItem.getParentContentItem();
                }

                // Display the new breadcrumbs
                display();
            }
        }

        // Decrease depth by removing the last content item at top of the stack and return the new last content item
        function decreaseDepthAndGetTheNewContentItem() {
            if (_stack.length === 1) {
                return _stack[0]; // root
            } else {
                removeLastContentItem();
                display();
                return _stack[_stack.length - 1];
            }
        }

        // Remove the last content item at top of the stack
        function removeLastContentItem() {
            // Remove the first item of the stack
            var contentItem = _stack.pop();

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
            // Clear bread crumbs
            while (_container.firstChild) {
                // Faster then updating the innerHTML to nothing
                _container.removeChild(_container.firstChild);
            }
        }

        // Display new bread crumbs
        function displayNew() {
            setRootItem(_stack[0]);
            // Add crumbs
            var length = _stack.length;
            for (var i = 0; i < length; i++) {
                var breadcrumb = i === length-1 ? document.createElement("div") : document.createElement("a");
                breadcrumb.className = i === length - 1 ? "active section" : "section";
                setCurrentItem(_stack[i]);
                breadcrumb.appendChild(document.createTextNode(_stack[i].getTitle()));
                breadcrumb.title = _stack[i].getTitle();
                breadcrumb.href = "javascript:Canvas.Breadcrumbs.redirect(" + i + ")";
                
                var divider = document.createElement("i");
                divider.className = "right chevron icon divider";
                _container.appendChild(divider);
                _container.appendChild(breadcrumb);
            }
        }

        // Redirect to given breadcrumb
        function redirect(i) {
            // Don't redirect to your self
            var length = _stack.length;
            if (i !== length - 1) {
                if (i < length && !_stack[length - 1].hasChildren()) {
                    _stack[length - 1].setIsFullScreen(false);
                    _stack[length - 1] = undefined;
                }

                var contentItem = _stack[i];
                var rangeItem = contentItem.getEndDate() - contentItem.getBeginDate();
                var rangeBegin = contentItem.getBeginDate() - (rangeItem / 20);
                var rangeEnd = contentItem.getEndDate() + (rangeItem / 20);
                Canvas.Timescale.setRange(rangeBegin, rangeEnd);
                Canvas.ContentItemService.findContentItemsByParentContent(contentItem);
            }
        }

        initialize();
    })(Canvas.Breadcrumbs || (Canvas.Breadcrumbs = {}));
    var Breadcrumbs = Canvas.Breadcrumbs;
})(Canvas || (Canvas = {}));