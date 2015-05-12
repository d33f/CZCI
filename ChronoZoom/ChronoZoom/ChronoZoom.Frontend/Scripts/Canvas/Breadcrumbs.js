var Canvas;
(function (Canvas) {
    (function (Breadcrumbs) {
        // Public methods
        Breadcrumbs.setContentItem = setContentItem;
        Breadcrumbs.decreaseDepthAndGetTheNewContentItem = decreaseDepthAndGetTheNewContentItem;
        Breadcrumbs.redirect = redirect;

        // Private fields
        var _stack = [];
        var _container = null;

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
                _stack = [];

                while (contentItem !== undefined)
                {
                    _stack.unshift(contentItem);
                    contentItem = contentItem.getParentContentItem();
                }

                // Display the new breadcrumbs
                display();
            }
        }

        // Decrease depth by removing the last content item at top of the stack and return the new last content item
        function decreaseDepthAndGetTheNewContentItem() {
            if (_stack.length == 1) {
                return _stack[0]; // root
            } else {
                // Remove last content item at top of the stack
                _stack.pop();

                // Display the new breadcrumbs
                display();

                return _stack[_stack.length - 1];
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
                _container.removeChild(_container.firstChild); // Faster then _container.innerHTML = '';
            }
        }

        // Display new bread crumbs
        function displayNew() {
            // Add crumbs
            var length = _stack.length;
            for (var i = 0; i < length; i++) {
                var breadcrumb = document.createElement('a');
                breadcrumb.appendChild(document.createTextNode(_stack[i].getTitle()));
                breadcrumb.title = _stack[i].getTitle();
                breadcrumb.href = 'javascript:Canvas.Breadcrumbs.redirect(' + i + ')';
                _container.appendChild(document.createTextNode(' » '));
                _container.appendChild(breadcrumb);
            }
        }

        function redirect(i) {
            var contentItem = _stack[i];
            Canvas.Timescale.setRange(contentItem.getBeginDate(), contentItem.getEndDate());
            Canvas.ContentItemService.findContentItemsByParentContent(contentItem);
        }

        initialize();
    })(Canvas.Breadcrumbs || (Canvas.Breadcrumbs = {}));
    var Breadcrumbs = Canvas.Breadcrumbs;
})(Canvas || (Canvas = {}));