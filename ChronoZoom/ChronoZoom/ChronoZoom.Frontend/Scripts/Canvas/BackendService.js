var Canvas;
(function (Canvas) {
    (function (BackendService) {
        // Public methods
        BackendService.getTimeline = getTimeline;
        BackendService.getContentItems = getContentItems;
        BackendService.createPersonalTimeLine = createPersonalTimeLine;
        BackendService.createPersonalContentItem = createPersonalContentItem;

        BackendService.getAllTimelines = getAllTimelines;

        // Private fields
        //var _baseUrl = "http://www.kompili.nl/chronozoomApi/api/";
        var _baseUrl = "http://localhost:40001/api/";

        // Get json data from path, execute callback resolve when succesfull and reject if failed. 
        function getJSON(id, path, resolve, reject) {
            // Create new instance of XMLHttpRequest and open requested path (async)
            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.open("GET", _baseUrl + path + '/' + id, true);
            xmlHttpRequest.setRequestHeader("Content-Type", "application/json");

            // Ready event
            xmlHttpRequest.onload = function () {
                // Check http status code and resolve the promise with the response text when valid
                if (xmlHttpRequest.status === 200) {
                    resolve(JSON.parse(xmlHttpRequest.response));
                }
                    // Otherwise reject with the status text
                else {
                    reject(Error(xmlHttpRequest.statusText));
                }
            };

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
                id: json.Id,
                beginDate: json.BeginDate,
                endDate: json.EndDate,
                title: json.Title,
                contentItems: [],
                description: json.Description,
                backgroundURL: json.BackgroundURL,
                isPublic: json.IsPublic
            };
        }

        // Create a timeline object of given json input (convert it to our internal structure)
        function createContentItemObject(json, parentContentItem) {
            var contentItem = new ContentItem({
                id: json.Id,
                beginDate: json.BeginDate,
                endDate: json.EndDate,
                title: json.Title,
                description: json.Description,
                hasChildren: json.HasChildren,
                sourceURL: json.SourceURL,
                sourceRef: json.SourceRef,
                pictureURLs: json.PictureURLs,
            }, parentContentItem);

            // Convert all content items
            for (var i = 0; i < json.Children.length; i++) {
                createContentItemObject(json.Children[i], contentItem);
            }

            return contentItem;
        };

        // Create a timeline object of given json input (convert it to our internal structure)
        function createAddedContentItem(json, parentContentItem) {
            var contentItem = new ContentItem({
                id: json.Id,
                beginDate: json.BeginDate,
                endDate: json.EndDate,
                title: json.Title,
                children: 0,
                description: json.Description,
                hasChildren: json.HasChildren,
                sourceURL: json.SourceURL,
                sourceRef: json.SourceRef,
                pictureURLs: json.PictureURLs,
            }, parentContentItem);

            return contentItem;
        };


        // Get timeline
        function getTimeline(timelineId, resolve, reject) {
            getJSON(timelineId, 'timeline', function (json) {
                // Create a timeline object
                var timeline = createTimelineObject(json);

                var parentContentItem = new ContentItem({
                    id: 0,
                    beginDate: timeline.beginDate,
                    endDate: timeline.endDate,
                    title: timeline.title,
                    hasChildren: true
                }, undefined);

                var contentItem = createContentItemObject(json.RootContentItem, parentContentItem);
                timeline.contentItems.push(contentItem);

                // Resolve result
                resolve(timeline);
            }, function (error) {
                reject(error);
            });
        }

        // Get timeline
        function getAllTimelines(resolve, reject) {
            getJSON('', 'timeline', function (json) {
                // Create a timeline object
                var timelines = [];

                for (var i = 0; i < json.length; i++) {
                    var timeline = createTimelineObject(json[i]);
                    timelines.push(timeline);
                }

                // Resolve result
                resolve(timelines);
            }, function (error) {
                reject(error);
            });
        }

        // Get content items for parent content item 
        function getContentItems(parentContentItem, resolve, reject) {
            getJSON(parentContentItem.getId(), 'contentitem', function (json) {
                // Create empty array
                var contentItems = [];

                // Convert all content items
                for (var i = 0; i < json.Children.length; i++) {
                    contentItems.push(createContentItemObject(json.Children[i], parentContentItem));
                }

                // Resolve result
                resolve(contentItems);
            }, function (error) {
                reject(error);
            });
        }


        function createPersonalTimeLine(title, beginDate, endDate, description, imageUrl, isPublic) {
            var xmlHttpRequest = new XMLHttpRequest();
            var url = _baseUrl + "timeline";
            var object = createTimelineObjectFormFields(title, beginDate, endDate, description, imageUrl, isPublic);
            xmlHttpRequest.open("POST", url, false);

            //Send the proper header information along with the request
            xmlHttpRequest.setRequestHeader("Content-type", "application/json");
            xmlHttpRequest.onreadystatechange = function () {//Call a function when the state changes.
                if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                    return true;
                }
            }
            xmlHttpRequest.send(JSON.stringify(object));
        }

        function createTimelineObjectFormFields(title, beginDate, endDate, description, imageUrl, isPublic) {
            return {
                Title: title,
                BeginDate: beginDate,
                EndDate: endDate,
                Description: description,
                BackgroundUrl: imageUrl,
                IsPublic: isPublic
            }
        }

        function createPersonalContentItem(beginDate, endDate, title, description, hasChildren, parentContentItem, pictureURLs) {
            var xmlHttpRequest = new XMLHttpRequest();
            var url = _baseUrl + "contentitem";
            var parentContentItemId = parentContentItem.getId();
            console.log("create" + parentContentItemId);
            var object = createContentItemObjectFormField(beginDate, endDate, title, description, hasChildren, parentContentItemId, pictureURLs);
            xmlHttpRequest.open("POST", url, false);

            //Send the proper header information along with the request
            xmlHttpRequest.setRequestHeader("Content-type", "application/json");
            xmlHttpRequest.onreadystatechange = function () {//Call a function when the state changes.
                if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200) {
                    var contentItem = createAddedContentItem(JSON.parse(xmlHttpRequest.response));
                    parentContentItem.addChild(contentItem);
                    Canvas.ContentItemService.contentItemChanged();
                    return true;
                }
            }
            xmlHttpRequest.send(JSON.stringify(object));
        }

        function createContentItemObjectFormField(beginDate, endDate, title, description, hasChildren, parentContentItemId, pictureURLs) {
            return {
                beginDate: beginDate,
                endDate: endDate,
                title: title,
                description: description,
                hasChildren: hasChildren,
                parentId: parentContentItemId,
                pictureURLs: pictureURLs,
            }
        }


    })(Canvas.BackendService || (Canvas.BackendService = {}));
    var BackendService = Canvas.BackendService;
})(Canvas || (Canvas = {}));