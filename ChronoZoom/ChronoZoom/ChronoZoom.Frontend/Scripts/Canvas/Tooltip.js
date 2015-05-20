var Canvas;
(function (Canvas) {
    (function (Tooltip) {
        // Public methods
        Tooltip.update = update;
        Tooltip.draw = draw;

        // Private fields
        var _rectangleX = 0;
        var _rectangleY = 0;
        var _rectangleMarginRight = 10;

        var _triangleX1 = 0;
        var _triangleX2 = 0;
        var _triangleX3 = 0;
        var _triangleY1 = 0;
        var _triangleY2 = 0;
        var _triangleY3 = 0;
        var _triangleWidth = 10;

        var _positions;
        var _size;
        var _width = 0;
        var _height = 40;
        var _title;

        // Update the tooltip
        function update(contentItem) {
            var position = contentItem.getPosition();
            var size = contentItem.getSize();
            _title = contentItem.getTitle();
            _width = getTextWidth(_title, 18);
            updatePosition(contentItem, position, size);
        }

        function updatePosition(contentItem, position, size) {
            var canvasContainer = Canvas.getCanvasContainer();
            _positions = position;
            _size = size;

            if (contentItem.hasChildren()) {
                if ((_width + _positions.x + _size.width) < canvasContainer.width) {
                    positionsRightSideRectangle();
                } else if ((position.x - _width) > _width) {
                    positionsLeftSideRectangle();
                } else {
                    positionsBottomRectangle();
                }
            } else {
                positionsRightSideCircle();
            }
        }

        function positionsRightSideRectangle() {
            //Rectangle
            _rectangleX = (_size.width + _positions.x + _triangleWidth);
            _rectangleY = (_size.height * 0.5) - (_height * 0.5) + _positions.y;

            //Triangle
            _triangleX1 = _rectangleX - _triangleWidth;
            _triangleY1 = _rectangleY + (_height * 0.5);

            _triangleX2 = _rectangleX;
            _triangleY2 = _rectangleY;

            _triangleX3 = _rectangleX;
            _triangleY3 = _rectangleY + _height;
        }

        function positionsLeftSideRectangle() {
            _rectangleX = (_positions.x - _width);
            _rectangleY = (_size.height * 0.5) - (_height * 0.5) + _positions.y;
        }

        function positionsBottomRectangle() {
            _rectangleX = _positions.x + (0.5 * _size.width);
            _rectangleY = _positions.y + _size.height;
        }

        function positionsRightSideCircle() {
            _rectangleMarginRight = 5;
            _triangleWidth = 10;

            //Rectangle
            _rectangleX = (_size.radius * 2) + _positions.x + _triangleWidth;
            _rectangleY = (_size.radius * 0.5) + _positions.y;

            //Triangle
            _triangleX1 = _rectangleX - _triangleWidth;
            _triangleY1 = _rectangleY + (_height * 0.5);

            _triangleX2 = _rectangleX;
            _triangleY2 = _rectangleY;

            _triangleX3 = _rectangleX;
            _triangleY3 = _rectangleY + _height;
        }

        // Draw the tooltip
        function draw() {
            var context = Canvas.getContext();
            //Save and restore used so the globalAlpha isn't applied to the whole Canvas
            context.save();
            context.fillStyle = 'rgb(49,79,79)';

            context.beginPath();
            //Draw the triangle
            context.moveTo(_triangleX1, _triangleY1);
            context.lineTo(_triangleX2, _triangleY2);
            context.lineTo(_triangleX3, _triangleY3);
            //Draw the rectangle
            context.rect(_rectangleX, _rectangleY, (_width + _rectangleMarginRight), _height);
            context.fill();
            context.closePath();

            //Draw the text
            context.fillStyle = "white";
            context.fillText(_title, _rectangleX, (_rectangleY + _height / 2));
            context.restore();
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