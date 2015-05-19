var Canvas;
(function (Canvas) {
    (function (Tooltip) {
        Tooltip.update = update;
        Tooltip.draw = draw;
        Tooltip.setFadeOut = setFadeOut;

        var _contentItem;
        var _globalAlpha = 0.0;
        var _globalAlphaIncreaser = 0.05;

        

        function update(contentItem) {
            _contentItem = contentItem;
        }

        function setFadeOut() {
            _fadeout = true;
        }

        function draw() {
            var position = _contentItem.getPosition();
            var size = _contentItem.getSize();
            var _tooltipHeight = 40;
            var _title = _contentItem.getTitle();
            var _textWidth = getTextWidth(_title, 18);
            var _tooltipX;
            var _tooltipY;
            

            //If the tooltip needs to be drawn next to a rectangle
            if (_contentItem.hasChildren()) {
                if ((_textWidth + position.x + size.width < screen.width)) { //If there's enough space on the right side of the item
                    _tooltipX = (size.width + position.x);
                    _tooltipY = (size.height * 0.5) - (_tooltipHeight * 0.5) + position.y;
                } else if (position.x - _textWidth > _textWidth) { //Left side
                    _tooltipX = (position.x - _textWidth);


                    _tooltipY = (size.height * 0.5) - (_tooltipHeight * 0.5) + position.y;
                } else { //Middle bottom side
                    _tooltipX = position.x + (0.5 * size.width);
                    _tooltipY = position.y + size.height;
                }
            //Else if the tooltip needs to be drawn next to a circle
            } else {
                _tooltipX = (size.radius *2 ) + position.x;
                _tooltipY = (size.radius * 0.5) + position.y;
            }

            drawToolTip(_tooltipX, _tooltipY, _textWidth, _tooltipHeight, _title);


        }

        function drawToolTip(x, y, width, height, _title) {
            if (_globalAlpha < 1.1) {
                fadeIn();
            }

            var context = Canvas.getContext();
            context.save();
            context.rect(x, y, width, height);
            context.fillStyle = 'rgb(49,79,79)';
            context.globalAlpha = _globalAlpha;
            context.fill();

            context.fillStyle = "white";
            context.fillText(_title, x, (y + height / 2));
            context.restore();
        }

        function fadeIn() {
            _globalAlpha = _globalAlpha + _globalAlphaIncreaser;
        }

        function getTextWidth(text, font) {
            var context = Canvas.getContext();
            context.font = font;
            var metrics = context.measureText(text);
            return metrics.width;
        };

    }(Canvas.Tooltip || (Canvas.Tooltip = {})));
    var Tooltip = Canvas.Tooltip;
})(Canvas || (Canvas = {}));