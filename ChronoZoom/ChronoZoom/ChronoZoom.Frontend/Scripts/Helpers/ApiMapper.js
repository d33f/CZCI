/**
 * This object is responsible for translating objects from API format to CZ javasctipt objects
 * ans vice versa.
 */
Canvas.Mapper = (function () {

    /**
     * Returns a Timeline translated from API
     * @param {json} data 
     * @returns {} 
     */
    var toTimeline = function (data) {
        var timeline = new Timeline(
            data.Id,
            data.Title,
            data.Description,
            data.BeginDate,
            data.EndDate,
            data.Timestamp,
            data.IsPublic,
            data.RootContentItemId,
            null,
            data.BackgroundUrl
        );
        timeline.children = toContentItemList(data.RootContentItem.Children);
        return timeline;
    };

    /**
     * Returns a ContentItem translated from API
     * @param {} data 
     * @returns {} 
     */
    var toContentItem = function (data) {
        return new ContentItem(
            data.Id,
            data.Title,
            data.Description,
            data.BeginDate,
            data.EndDate,
            data.Children,
            data.HasChildren,
            data.PictureURLs,
            data.ParentId,
            data.SourceUrl,
            data.SourceRef,
            data.Timestamp,
            data.ParentContentItem
        );
    };

    var toContentItemList = function (data) {
        var list = [];
        var length = data.length;
        for (var i = 0; i < length; i++) {
            var row = data[i];
            var item = toContentItem(row);
            list.push(item);
        }
        return list;
    }
    return {
        toTimeline: toTimeline,
        toContentItem: toContentItem
    }
})();
