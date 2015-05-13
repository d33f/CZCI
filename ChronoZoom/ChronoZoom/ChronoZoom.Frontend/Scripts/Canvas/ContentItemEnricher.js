var Canvas;
(function (Canvas) {
    (function (ContentItemEnricher) {
        // Public methods
        // ..

        // Private fields
        // ..

        // Constructor
        function initialize() {
            Canvas.ContentItemService.addListener(onContentItemsChanged);
        }

        // Handle on content item changed event
        function onContentItemsChanged() {
            // Get content items
            var contentItems = Canvas.ContentItemService.getContentItems();

            // Update all content items
            var length = contentItems.length;
            for (var i = 0; i < length; i++) {
                // Enrich content item with information from public api
                Canvas.PublicAPIService.getInformation(contentItems[i].sourceURL, function (description) {
                    contentItems[i].description = description;
                });
            }
        }

        initialize();
    })(Canvas.ContentItemEnricher || (Canvas.ContentItemEnricher = {}));
    var ContentItemEnricher = Canvas.ContentItemEnricher;
})(Canvas || (Canvas = {}));