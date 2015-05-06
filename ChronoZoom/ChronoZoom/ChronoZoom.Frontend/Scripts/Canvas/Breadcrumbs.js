var Canvas;
(function (Canvas) {
    (function (Breadcrumbs) {
        // Public methods
        Breadcrumbs.addContentItem = addContentItem;
        Breadcrumbs.decreaseDepthAndGetTheNewContentItem = decreaseDepthAndGetTheNewContentItem;
        Breadcrumbs.getDepth = getDepth;

        // Private fields
        var _stack = [];

        // Add the clicked content item as new breadcrumb at top of the stack
        function addContentItem(contentItem) {
            if (contentItem instanceof ContentItem) {
                // Check if not already on top of the stack
                if (_stack.length == 0 || _stack[_stack.length - 1].getId() != contentItem.getId()) {
                    _stack.push(contentItem);
                }
            }
        }

        // Decrease depth by removing the last content item at top of the stack and return the new last content item
        function decreaseDepthAndGetTheNewContentItem() {
            _stack.pop();
            if (_stack.length == 0) {
                return undefined; // root reached
            } else {
                return _stack[_stack.length - 1];
            }
        }

        // Get current depth
        function getDepth() {
            return _stack.length;
        }

    })(Canvas.Breadcrumbs || (Canvas.Breadcrumbs = {}));
    var Breadcrumbs = Canvas.Breadcrumbs;
})(Canvas || (Canvas = {}));