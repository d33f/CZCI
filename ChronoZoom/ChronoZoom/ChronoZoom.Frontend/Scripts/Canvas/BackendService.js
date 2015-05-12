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
        function createContentItemObject(json, parentContentItem) {
            return new ContentItem({
                id: json.Id,
                beginDate: json.BeginDate,
                endDate: json.EndDate,
                title: json.Title,
                depth: json.Depth,
                hasChildren: json.HasChildren,
                sourceURL: json.Source
            }, parentContentItem);
        }

        // Get timeline
        function getTimeline(resolve, reject) {
            getJSON('timeline', function (json) {
                // Create a timeline object
                var timeline = createTimelineObject(json);

                var parentContentItem = new ContentItem({
                    id: 0,
                    beginDate: timeline.beginDate,
                    endDate: timeline.endDate,
                    title: timeline.title,
                }, undefined);

                // Convert all content items
                for (var i = 0; i < json.ContentItems.length; i++) {
                    // Create and add content item object
                    var contentItem = createContentItemObject(json.ContentItems[i], parentContentItem);
                    timeline.contentItems.push(contentItem);
                }

                // Resolve result
                resolve(timeline);
            }, function (error) {
                reject(error);
            });
        }

        // Get content items for parent content item 
        function getContentItems(parentContentItem, resolve, reject) {
            getJSON('contentitem/' + parentContentItem.getId(), function (json) {
                // Create empty array
                var contentItems = [];

                // Convert all content items
                for (var i = 0; i < json.length; i++) {
                    // Create and add content item object
                    var contentItem = createContentItemObject(json[i], parentContentItem);
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