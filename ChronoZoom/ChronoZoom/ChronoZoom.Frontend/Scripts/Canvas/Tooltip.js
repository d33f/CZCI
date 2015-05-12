var Canvas;
(function (Canvas) {
    (function (Tooltip) {
        Tooltip.update = update;
        Tooltip.draw = draw;

        var _contentItem;

        var _toolTipShow = false;

        function update(contentItem) {
            _contentItem = contentItem;
        }

        function draw() {
            showTooltip();
        }

        //Show the tooltip with the title which belongs to the content item
        function showTooltip() {
            var context = Canvas.getContext();
            var _width = _contentItem.getWidth();
            var _x = _contentItem.getX();
            var _y = _contentItem.getY();
            var _title = _contentItem.getTitle();
            var _height = _contentItem.getHeight();

            console.log(_width, _x, _y, _title, _height);

            //On mouseover on a content item

            if (_contentItem.getHovered()) {
                var _textWidth = getTextWidth(_title, 18);
                var _tooltipHeight = 30;

                //If there's enough space on the right side of the item
                if ((_textWidth + _x + _width < screen.width)) {
                    console.log("rechterkant");

                    var _tooltipX = (_width + _x);
                    var _tooltipY = _y;

                    context.rect(_tooltipX, _tooltipY, _textWidth, _tooltipHeight);
                    context.fillStyle = 'rgb(49,79,79)';
                    context.fill();
                    context.lineWidth = 1;

                    context.fillStyle = "white";
                    context.fillText(_title, _tooltipX, (_y + _tooltipHeight / 2));
                    _toolTipShow = true;
                }

                    //Otherwise pick other position
                else {
                    //Left side
                    if (_x - _textWidth > _textWidth) {
                        console.log("linkerkant");
                        var _tooltipX = (_x - _textWidth);
                        var _tooltipY = _y;

                        context.rect(_tooltipX, _tooltipY, _textWidth, _tooltipHeight);
                        context.fillStyle = 'rgb(49,79,79)';
                        context.fill();

                        context.fillStyle = "white";
                        context.fillText(_title, _tooltipX, (_y + _tooltipHeight / 2));
                    }
                        //Middle bottom side
                    else {
                        console.log("onderkant");
                        var _tooltipX = _x + (0.5 * _width);
                        var _tooltipY = _y + _height;

                        context.rect(_tooltipX, _tooltipY, _textWidth, _tooltipHeight);
                        context.fillStyle = 'rgb(49,79,79)';
                        context.fill();

                        context.fillStyle = "white";
                        context.fillText(_title, _tooltipX, (_y + _tooltipHeight / 2));
                    }
                }
            } else if (_toolTipShow === true) {
                context.clearRect(_x, _y, _width, _height);
                _toolTipShow = false;
            }
        }

        function drawToolTip(x, y, width, height) {
            context.fillStyle = 'rgb(49,79,79)';
            context.fill();

            context.fillStyle = "white";
            context.fillText(_title, _tooltipX, (_y + _tooltipHeight / 2));

        }

        function getTextWidth(text, font) {
            var context = Canvas.getContext();
            context.font = font;
            var metrics = context.measureText(text);
            return metrics.width;
        };

    }
(Canvas.Tooltip || (Canvas.Tooltip = {})));
    var Tooltip = Canvas.Tooltip;
})(Canvas || (Canvas = {}));