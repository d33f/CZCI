var Canvas;
(function (Canvas) {
    (function (Timeline) {
        // Public methods
        Timeline.draw = draw;
        Timeline.update = update;
        Timeline.handleClickOnTimeline = handleClickOnTimeline;

        // Private fields
        var _contentItems = [];
        var _isChanged = false;
        var _isLoading = true;

        // Update the timeline
        function update() {
            // Check if content item service has changed
            if (Canvas.ContentItemService.isContentItemsChanged()) {
                _contentItems = Canvas.ContentItemService.getContentItems();
                _isChanged = true;
                _isLoading = false;
            }
            _isChanged = true; //TODO change to be able to use mouse scroll right now is just a quick and dirty fix for demo
            // Check if timeline has changed 
            if(_isChanged) {
                // Update all content items
                var length = _contentItems.length;
                for (var i = 0; i < length; i++) {
                    //    _contentItems[i].y = 50;
                    //    if (intersects(_contentItems[i])) {
                    //        _contentItems[i].y = 180 + (i * 100);
                    //    }
                    _contentItems[i].y = 100 + (i * 50);
                    _contentItems[i].update();
                }
                //console.log("UPDATED CONTENTITEMS :", _contentItems);
               // console.log("ITEM 0: ", _contentItems[0].x, _contentItems[0].width);

                // Remove change flag
                _isChanged = false;
            }
        }

        // Draw the timeline
        function draw() {
            // Check if loading
            if (_isLoading) {
                var context = Canvas.getContext();
                context.font = Canvas.Settings.getTimescaleTickLabelFont();
                context.fillStyle = Canvas.Settings.getTimescaleTickLabelColor();
                context.fillText("LOADING...", 100, 100);
            }

            // Draw all content items
            var length = _contentItems.length;
            for (var i = 0; i < length; i++) {
                var item = _contentItems[i];
                if (item.beginDate >= Canvas.Timescale.getRange().begin) {
                    item.draw();
                }
            }
        }

        function handleClickOnTimeline(eventArgs) {
            var clickedContentItem = getContentItemOnMousePosition();// collides();
            if (clickedContentItem !== undefined) {
                Canvas.Timescale.setRange(clickedContentItem.beginDate-1, clickedContentItem.endDate+1);
                Canvas.ContentItemService.findContentItemsByParentContentID(clickedContentItem.id);
                _isLoading = true;
            } else {
                // TODO: Zoom out
                Canvas.Timescale.setRange(500, 3000);
            }
            
        }

        // Anthony aan alle : Waarom een intersects methode EN collides?!?! als collides object retouneert intersect ie dus
        // Richard added: Intersects is used to know if two rectangles intersect with eachother, colides is used with arcs
        //function intersects(rectangle) {
        //    for (var i = 0; i < _contentItems.length; i++) {
        //        var item = _contentItems[i];
        //        if (item.id !== rectangle.id) {
        //            var AT = rectangle.y;
        //            var AR = rectangle.x + rectangle.width;
        //            var AB = rectangle.y + rectangle.height;
        //            var AL = rectangle.x;

        //            var BT = item.y;
        //            var BR = item.x + item.width;
        //            var BB = item.y + item.height;
        //            var BL = item.x;

        //            if (AL <= BR &&
        //                BL <= AR &&
        //                AT <= BB &&
        //                BT <= AB) {
        //                console.log("intercept");
        //                return true;
        //            }
        //        }
        //    }
        //}

        function getContentItemOnMousePosition() {
            for (var i = 0; i < _contentItems.length; i++) {
                var item = _contentItems[i];
                var position = Canvas.Mousepointer.getPosition();
                if (item.x < position.x && item.x + item.width > position.x && item.y < position.y && item.y + item.height > position.y) {
                    return item;
                }
            }
            return undefined;
        }

        function collides() {
            var clickedContentItem = undefined;
            var position = Canvas.Mousepointer.getPosition();
            var length = _contentItems.length;

            for (var i = 0; i < length; i++) {

                var radiusCircle = _contentItems[i].width;
                var centerpointX = (_contentItems[i].x + (_contentItems[i].width / 2));
                var centerpointY = _contentItems[i].y;
                var mousePointX = position.x;
                var mousePointY = position.y;

                // distance between centerpointX and mousepointX
                var deltaX;
                if (centerpointX >= mousePointX) {
                    deltaX = centerpointX - mousePointX;
                } else {
                    deltaX = mousePointX - centerpointX;
                }

                // distance between centerpointY and mousepointY
                var deltaY;
                if (centerpointY >= mousePointY) {
                    deltaY = centerpointY - mousePointY;
                } else {
                    deltaY = mousePointY - centerpointY;
                }

                // angle between centerpoint and mousepoint (in radial)
                var angle = Math.atan(deltaY / deltaX);

                // sinus value of angle
                var sinangle = Math.sin(angle);

                // distance between centerpoint and mousepoint
                var distance = deltaY / sinangle;

                // is mousepoint in circle
                var inCircle = (radiusCircle) > distance;

                if (inCircle) {
                    clickedContentItem = _contentItems[i];
                    break;
                }
            }
            return clickedContentItem;
        }

    })(Canvas.Timeline || (Canvas.Timeline = {}));
    var Timeline = Canvas.Timeline;
})(Canvas || (Canvas = {}));