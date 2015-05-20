var Canvas;
(function (Canvas) {
    (function (Tooltip) {
        // Public methods
        Tooltip.update = update;
        Tooltip.draw = draw;
        Tooltip.setFadeOut = setFadeOut;

        // Private fields
        var _x = 0;
        var _y = 0;
        var _width = 0;
        var _height = 40;
        var _title;
        var _fadeout = false;
        var _globalAlpha = 0.0;
        var _globalAlphaIncreaser = 0.04;

        // Set fade out to true
        function setFadeOut() {
            _fadeout = true;
        }

        // Update the tooltip
        function update(contentItem) {
            var position = contentItem.getPosition();
            var size = contentItem.getSize();

            _title = contentItem.getTitle();
            _width = getTextWidth(_title, 18);

            //If the tooltip needs to be drawn next to a rectangle
            if (contentItem.hasChildren()) {
                updatePosition(contentItem, position, size);
                
                //Else if the tooltip needs to be drawn next to a circle
            } else {
                _x = (size.radius * 2) + position.x;
                _y = (size.radius * 0.5) + position.y;
            }
        }

        // Update position
        function updatePosition(contentItem, position, size) {
            var canvasContainer = Canvas.getCanvasContainer();

            if ((_width + position.x + size.width) < canvasContainer.width) { //If there's enough space on the right side of the item
                _x = (size.width + position.x);
                _y = (size.height * 0.5) - (_height * 0.5) + position.y;
            } else if ((position.x - _width) > _width) { //Left side
                _x = (position.x - _width);
                _y = (size.height * 0.5) - (_height * 0.5) + position.y;
            } else { //Middle bottom side
                _x = position.x + (0.5 * size.width);
                _y = position.y + size.height;
            }
        }

        // Draw the tooltip
        function draw() {
            if (_globalAlpha < 1.1) {
                fadeIn();
            }

            var context = Canvas.getContext();
            context.save();
            context.rect(_x, _y, _width, _height);
            context.fillStyle = 'rgb(49,79,79)';
            context.globalAlpha = _globalAlpha;
            context.fill();

            context.fillStyle = "white";
            context.fillText(_title, _x, (_y + _height / 2));
            context.restore();
        }

        // Fade in
        function fadeIn() {
            _globalAlpha = _globalAlpha + _globalAlphaIncreaser;
        }

        // Calculate and get text width for given text and font
        function getTextWidth(text, font) {
            var context = Canvas.getContext();
            context.font = font;
            var metrics = context.measureText(text);
            return metrics.width;
        };

    }(Canvas.Tooltip || (Canvas.Tooltip = {})));
    var Tooltip = Canvas.Tooltip;
})(Canvas || (Canvas = {}));