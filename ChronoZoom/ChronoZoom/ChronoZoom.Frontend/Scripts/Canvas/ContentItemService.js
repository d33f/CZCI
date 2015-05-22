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
            _cache.clear();
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
            // Set breadcrumb
            Canvas.Breadcrumbs.setContentItem(parentContentItem);

            if (_cache !== undefined && _cache.getItem(parentContentItem.getId()) !== null) {
                // Get content items from cache
                setContentItems(getContentItemsFromCache(parentContentItem));
            } else {
                // Get from backend service
                Canvas.BackendService.getContentItems(parentContentItem, function (contentItems) {
                    // Set content items and update cache
                    setContentItems([parentContentItem]);
                    addContentItemsToCache(parentContentItem.getId(), contentItems);
                }, function (error) {
                    console.log("No content items for parent content id found!!!", error);
                });
            }
        }

        // Get content items from cache with given parent content
        function getContentItemsFromCache(parentContentItem) {
            var contentItems = [];

            // Check for caching
            if (_cache !== undefined) {
                // Clear children
                parentContentItem.clearChildren();

                // Get from cache
                var items = JSON.parse(_cache.getItem(parentContentItem.getId()));
                var length = items.length;
                for (var i = 0; i < length; i++) {
                    contentItems.push(new ContentItem(items[i], parentContentItem));
                }
            }

            // Add to content items if not root
            if (parentContentItem.getId() !== 0) {
                contentItems.push(parentContentItem);
            }

            return contentItems;
        }

        // Add content items to cache
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

                // Set breadcrumb
                var parentContentItem = timeline.contentItems[0].getParentContentItem();
                Canvas.Breadcrumbs.setContentItem(parentContentItem);

                // Set content items
                setContentItems(timeline.contentItems);

                // Add content items to cache
                addContentItemsToCache(parentContentItem.getId(), timeline.contentItems);

                //Set title and range of the window
                Canvas.WindowManager.setTitle(timeline.title);
                Canvas.WindowManager.setTimeRange(timeline.beginDate + ' - ' + timeline.endDate);
            }, function (error) {
                console.log("No timeline data found!!!", error);
            });
        }

        initialize();
    })(Canvas.ContentItemService || (Canvas.ContentItemService = {}));
    var ContentItemService = Canvas.ContentItemService;
})(Canvas || (Canvas = {}));