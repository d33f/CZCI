var Canvas;
(function (Canvas) {
    (function (ContentItemService) {
        // Public methods
        ContentItemService.addListener = addListener;
        ContentItemService.getContentItems = getContentItems;
        ContentItemService.findContentItemsByParentContent = findContentItemsByParentContent;

        // Private fields
        var _contentItems = [];
        var _contentItemChangedEvent;
        var _cache = undefined;

        // Constructor
        function initialize() {
            // Create the content item changed event.
            _contentItemChangedEvent = document.createEvent('Event');
            _contentItemChangedEvent.initEvent('contentItemChanged', true, true);

            if (typeof(Storage) !== "undefined") {
                _cache = window.sessionStorage;
            }

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
            document.dispatchEvent(_contentItemChangedEvent);
        }

        // Find content items by parent content
        function findContentItemsByParentContent(parentContentItem) {
            // Add breadcrumb
            Canvas.Breadcrumbs.addContentItem(parentContentItem);
            
            if (_cache !== undefined && _cache.getItem(parentContentItem.getId()) !== null) {
                // Get content items from cache
                setContentItems(getContentItemsFromCache(parentContentItem.getId()));
            } else {
                // Get from backend service 
                Canvas.BackendService.getContentItems(parentContentItem, function (contentItems) {
                    setContentItems(contentItems);
                    addContentItemsToCache(parentContentItem.getId(), contentItems);
                }, function (error) {
                    console.log("No content items for parent content id found!!!", error);
                });
            }
        }

        // Get content items from cache with given parent content id
        function getContentItemsFromCache(parentContentItemID) {
            var contentItems = [];

            // Check for caching
            if (_cache !== undefined) {
                // Get from cache
                var items = JSON.parse(_cache.getItem(parentContentItemID));
                var length = items.length;
                for (var i = 0; i < length; i++) {
                    contentItems.push(new ContentItem(items[i]));
                }
            }

            return contentItems;
        }

        function addContentItemsToCache(parentContentItemID, contentItems) {
            // Check for caching
            if (_cache !== undefined) {
                // Get data from all content items
                var items = [];
                var length = contentItems.length;
                for (var i = 0; i < length; i++) {
                    items.push(contentItems[i].getData());
                }

                // Store in cache as json
                _cache.setItem(parentContentItemID, JSON.stringify(items));
            }
        }

        // Find timeline
        function findTimeline() {
            // Get from backend service
            Canvas.BackendService.getTimeline(function (timeline) {
                // Set timeline range
                Canvas.Timescale.setRange(timeline.beginDate, timeline.endDate);

                // Add breadcrumb
                var parentContentItem = timeline.contentItems[0].getParentContentItem();
                Canvas.Breadcrumbs.addContentItem(parentContentItem);
               
                // Set content items
                setContentItems(timeline.contentItems);

                // Add content items to cache
                addContentItemsToCache(parentContentItem.getId(), timeline.contentItems);
            }, function (error) {
                console.log("No timeline data found!!!", error);
            });
        }

        initialize();
    })(Canvas.ContentItemService || (Canvas.ContentItemService = {}));
    var ContentItemService = Canvas.ContentItemService;
})(Canvas || (Canvas = {}));