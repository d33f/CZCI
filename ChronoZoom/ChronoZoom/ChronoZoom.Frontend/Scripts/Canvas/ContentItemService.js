var Canvas;
(function (Canvas) {
    (function (ContentItemService) {
        // Public methods
        ContentItemService.getContentItems = getContentItems;
        ContentItemService.isContentItemsChanged = isContentItemsChanged;
        ContentItemService.findContentItemsByParentContentID = findContentItemsByParentContentID;

        // Private fields
        var _contentItems = [];
        var _isChanged = false;

        // Get content items
        function getContentItems() {
            _isChanged = false; // remove changed flag
            return _contentItems;
        }

        // Content items changed?!
        function isContentItemsChanged() {
            return _isChanged;
        }

        // Set content items
        function setContentItems(contentItems) {
            _contentItems = contentItems;
            _isChanged = true;
        }

        // Find content items by parent content id
        function findContentItemsByParentContentID(parentContentItemID) {
            // Get from backend service 
            // TODO: Cache in HTML5 local storage and get from cache OR backend service
            Canvas.BackendService.getContentItems(parentContentItemID).then(function (contentItems) {
                setContentItems(contentItems);
            }, function (error) {
                console.log("ERROR!!", error);
            });
        }

        // Find timeline
        function findTimeline() {
            // Get from backend service
            Canvas.BackendService.getTimeline().then(function (timeline) {
                // Set timeline range
                Canvas.Timescale.setRange(timeline.beginDate, timeline.endDate);

                // Set content items
                setContentItems(timeline.contentItems);
            }, function (error) {
                console.log("ERROR!!", error);
            });
        }

        // Initialize content item service
        function init() {
            findTimeline();
        }

        init();

    })(Canvas.ContentItemService || (Canvas.ContentItemService = {}));
    var ContentItemService = Canvas.ContentItemService;
})(Canvas || (Canvas = {}));