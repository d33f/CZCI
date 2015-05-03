var Canvas;
(function (Canvas) {
    (function (BackendService) {
        // Public methods
        BackendService.getTimeline = getTimeline;
        BackendService.getContentItems = getContentItems;
        
        // Private fields
        var _baseUrl = "http://localhost:40000/api/";

        // Get json data from path, execute callback resolve when succesfull and reject if failed. 
        function getJSON(path, resolve, reject) {
            // For debugging usage
            console.log('getJSON(' + path +')');

            // Create new instance of XMLHttpRequest and open requested path (async)
            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.open("GET", _baseUrl + path, true);

            // Ready event
            xmlHttpRequest.onload = function() {
                // Check http status code and resolve the promise with the response text when valid
                if (xmlHttpRequest.status == 200) {
                    resolve(JSON.parse(xmlHttpRequest.response));
                }
                // Otherwise reject with the status text
                else {
                    reject(Error(xmlHttpRequest.statusText));
                }
            }

            // Handle network errors
            xmlHttpRequest.onerror = function () {
                reject(Error("Network Error"));
            };

            // Make the request
            xmlHttpRequest.send();
        }

        // Create a timeline object of given json input (convert it to our internal structure)
        function createTimelineObject(json) {
            return {
                beginDate: json.BeginDate,
                endDate: json.EndDate,
                title: json.Title,
                contentItems: []
            }
        }

        // Create a timeline object of given json input (convert it to our internal structure)
        function createContentItemObject(json) {
            var item = new ContentItem();
            item.id= json.Id;
            item.beginDate = json.BeginDate;
            item.endDate = json.EndDate;
            item.title = json.Title;
            item.depth = json.Depth;
            item.hasChildren = json.HasChildren;
            item.sourceURL = json.Source;
            return item;
        }

        // Get timeline
        function getTimeline(resolve, reject) {
            getJSON('timeline', function (json) {
                // Create a timeline object
                var timeline = createTimelineObject(json);

                // Convert all content items
                for (var i = 0; i < json.ContentItems.length; i++) {
                    // Create and add content item object
                    var contentItem = createContentItemObject(json.ContentItems[i]);
                    timeline.contentItems.push(contentItem);
                }

                // Resolve result
                resolve(timeline);
            }, function (error) {
                reject(error);
            });
        }

        // Get content items for parent content item (promise) TODO : Check compatibility
        function getContentItems(parentContentItemID, resolve, reject) {
            getJSON('contentitem/' + parentContentItemID, function (json) {
                // Create empty array
                var contentItems = [];

                // Convert all content items
                for (var i = 0; i < json.length; i++) {
                    // Create and add content item object
                    var contentItem = createContentItemObject(json[i]);
                    contentItems.push(contentItem);
                }

                // Resolve result
                resolve(contentItems);
            }, function (error) {
                reject(error);
            });
        }
    })(Canvas.BackendService || (Canvas.BackendService = {}));
    var BackendService = Canvas.BackendService;
})(Canvas || (Canvas = {}));