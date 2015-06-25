/**
 * This functionClass creates a timeline
 * @param {} id 
 * @param {} title 
 * @param {} description 
 * @param {} beginDate 
 * @param {} endDate 
 * @param {} timestamp 
 * @param {} isPublic 
 * @param {} rootContentItemId 
 * @param {} rootContentItem 
 * @param {} backgroundUrl 
 * @returns {} 
 */
function Timeline(id, title, description, beginDate, endDate, timestamp, isPublic, rootContentItemId, children, backgroundUrl) {
    this.id = id || 0;
    this.title = title || "";
    this.description = description || "";
    this.beginDate = beginDate || 0;
    this.endDate = endDate || 0;
    this.timestamp = timestamp || [];
    this.isPublic = isPublic || false;
    this.rootContentItemId = rootContentItemId || undefined;
    this.children = children;
    this.backgroundUrl = backgroundUrl || undefined;
    var offsetY = 0;


    Timeline.prototype.update = function () {
        var length = this.children.length;
        for (var i = 0; i < length; i++) {
            var child = this.children[i];
            var begin = Canvas.Timescale.getXPositionForTime(child.beginDate);
            var end = Canvas.Timescale.getXPositionForTime(child.endDate);

            child.size.width = end - begin;
            child.size.height = 100;
            child.point.x = begin;
            child.point.y = (i * 105) + offsetY;
            child.update();
        }
    }

    Timeline.prototype.draw = function (context) {
        var length = this.children.length;
        for (var i = 0; i < length; i++) {
            var child = this.children[i];
            child.draw(context);
        }
    }

    Timeline.prototype.setOffsetY = function(offset) {
        offsetY = offsetY + offset;
    }

   Timeline.prototype.selectedContentItem = function (point) {
        var foundContentItem = undefined;
        var length = this.children.length;
        for (var i = 0; i < length; i++) {
            var child = this.children[i];
            if (child.children.length > 0) {
                selectedContentItem(point);
            }

            var xbegin = child.point.x;
            var xwidth = child.size.width;
            var xend = xbegin + xwidth;
            var ybegin = child.point.y;
            var yend = ybegin + child.size.height;
            console.log("x :" + point.x + " y :" + point.y+ " xb:"+xbegin+" xe:"+xend);
            if (xbegin <= point.x && xend >= point.x && ybegin <= point.y && yend >= point.y) {
                foundContentItem = child;
                break;
            }
        }
        console.log(foundContentItem);
        return foundContentItem;
    }

}

function BoundingBox(x,y,width,height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}