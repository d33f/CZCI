var Canvas;
(function (Canvas) {
    (function (ContentItemService) {
        // Public methods
        ContentItemService.addListener = addListener;
        ContentItemService.getContentItems = getContentItems;
        ContentItemService.findContentItemsByParentContentID = findContentItemsByParentContentID;

        // Private fields
        var _contentItems = [];
        var _contentItemChangedEvent;

        // Constructor
        function initialize() {
            // Create the content item changed event.
            _contentItemChangedEvent = document.createEvent('Event');
            _contentItemChangedEvent.initEvent('contentItemChanged', true, true);

            // Find timeline
            findTimeline();
        }

        // Add listener
        function addListener(onContentItemChanged) {
            document.addEventListener('contentItemChanged', onContentItemChanged, false);
        }

        // Get content items
        function getContentItems() {
            return _contentItems;
        }

        // Set content items
        function setContentItems(contentItems) {
            _contentItems = contentItems;
            document.dispatchEvent(_contentItemChangedEvent)
        }

        // Find content items by parent content id
        function findContentItemsByParentContentID(parentContentItemID) {
            // Get from backend service 
            // TODO: Cache in HTML5 local storage and get from cache OR backend service
            Canvas.BackendService.getContentItems(parentContentItemID, function (contentItems) {
                setContentItems(contentItems);
            }, function (error) {
                console.log("No content items for parent content id found!!!", error);
            });
        }

        // Find timeline
        function findTimeline() {
            // Get from backend service
            Canvas.BackendService.getTimeline(function (timeline) {
                // Set timeline range
                Canvas.Timescale.setRange(timeline.beginDate, timeline.endDate);

                // Set content items
                setContentItems(timeline.contentItems);
            }, function (error) {
                console.log("No timeline data found!!!", error);
            });
        }

        initialize();
    })(Canvas.ContentItemService || (Canvas.ContentItemService = {}));
    var ContentItemService = Canvas.ContentItemService;
})(Canvas || (Canvas = {}));