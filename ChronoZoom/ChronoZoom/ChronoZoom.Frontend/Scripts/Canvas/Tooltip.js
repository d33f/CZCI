var Canvas;
(function (Canvas) {
    (function (Tooltip) {
        Tooltip.update = update;
        Tooltip.draw = draw;

        var _contentItem;
        

        function update(contentItem) {
            _contentItem = contentItem;
        }

        function draw() {
            var _width = _contentItem.getWidth();
            var _x = _contentItem.getX();
            var _y = _contentItem.getY();
            var _title = _contentItem.getTitle();
            var _contentItemHeight = _contentItem.getHeight();
            var _tooltipHeight = 40;
            var _textWidth = getTextWidth(_title, 18);
            

            //If there's enough space on the right side of the item
            if ((_textWidth + _x + _width < screen.width)) {
                var _tooltipX = (_width + _x);
                var _tooltipY = _y;
                drawToolTip(_tooltipX, _tooltipY, _textWidth, _tooltipHeight, _title);
            }
            else {
                //Left side
                if (_x - _textWidth > _textWidth) {
                    var _tooltipX = (_x - _textWidth);
                    var _tooltipY = _y;
                    drawToolTip(_tooltipX, _tooltipY, _textWidth, _tooltipHeight, _title);
                }
                //Middle bottom side
                else {
                    var _tooltipX = _x + (0.5 * _width);
                    var _tooltipY = _y + _contentItemHeight;
                    drawToolTip(_tooltipX, _tooltipY, _textWidth, _tooltipHeight, _title);
                }
            }
        }

        function drawToolTip(x, y, width, height, _title) {
            var context = Canvas.getContext();
            context.rect(x, y, width, height);
            context.fillStyle = 'rgb(49,79,79)';
            context.fill();

            context.fillStyle = "white";
            context.fillText(_title, x, (y + height / 2));
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