var Canvas;
(function (Canvas) {
    (function (Tooltip) {
        // Public methods
        Tooltip.update = update;
        Tooltip.draw = draw;

        // Private fields
        var _tooltipX;
        var _tooltipY;
        var _tooltipWidth;
        var _tooltipHeight = 40;
        var _tooltipMarginRight = 5;

        var _triangleX1;
        var _triangleX2;
        var _triangleX3;
        var _triangleY1;
        var _triangleY2;
        var _triangleY3;
        var _triangleWidth = 10;

        var _contentItemPosition;
        var _contentItemSize;

        var _contentItemTitle;
        var _contentItemHasChildren;

        // Update the tooltip
        function update(contentItem) {
            _contentItemPosition = contentItem.getPosition();
            _contentItemSize = contentItem.getSize();
            _contentItemTitle = contentItem.getTitle();
            _contentItemHasChildren = contentItem.hasChildren();
            _tooltipWidth = getTextWidth(_contentItemTitle, 18);
            updatePosition();
        }

        function updatePosition() {
            var canvasWidth = Canvas.canvasContainer.width;

            if (_contentItemHasChildren) {
                if ((_contentItemPosition.x + _contentItemSize.width + _tooltipWidth) < canvasWidth) {
                    positionsRightSideRectangle();
                } else if (_contentItemPosition.x - _tooltipWidth > 0) {
                    positionsLeftSideRectangle();
                } else {
                    positionsBottomRectangle();
                }
            } else {
                if ((_contentItemPosition.x + (_contentItemSize.radius * 2) + _tooltipWidth) < canvasWidth) {
                    positionsRightSideCircle();
                } else if(_contentItemPosition.x - _tooltipWidth > 0) {
                    positionsLeftSideCircle();
                }
                else {
                    positionsBottomCircle();
                }
            }
        }

        function positionsRightSideRectangle() {
            //Rectangle
            _tooltipX = _contentItemSize.width + _contentItemPosition.x + _triangleWidth + _contentItemSize.linewidth;
            _tooltipY = (_contentItemSize.height * 0.5) - (_tooltipHeight * 0.5) + _contentItemPosition.y;
            _tooltipWidth = _tooltipWidth + _tooltipMarginRight;

            //Triangle
            _triangleX1 = _tooltipX - _triangleWidth;
            _triangleY1 = _tooltipY + (_tooltipHeight * 0.5);

            _triangleX2 = _tooltipX;
            _triangleY2 = _tooltipY;

            _triangleX3 = _tooltipX;
            _triangleY3 = _tooltipY + _tooltipHeight;
        }

        function positionsLeftSideRectangle() {
            _tooltipX = (_contentItemPosition.x - _triangleWidth) - (_tooltipWidth - _contentItemSize.linewidth);
            _tooltipY = (_contentItemSize.height * 0.5) - (_tooltipHeight * 0.5) + _contentItemPosition.y;

            //Triangle
            _triangleX1 = _tooltipX + _tooltipWidth + _triangleWidth;
            _triangleY1 = _tooltipY + (_tooltipHeight * 0.5);

            _triangleX2 = _tooltipX + _tooltipWidth;
            _triangleY2 = _tooltipY;

            _triangleX3 = _tooltipX + _tooltipWidth;
            _triangleY3 = _tooltipY + _tooltipHeight;
        }

        function positionsBottomRectangle() {
            var triangleHeight = 10;

            _tooltipX = _contentItemPosition.x + (0.5 * _contentItemSize.width) - (0.5 * _tooltipWidth);
            _tooltipY = _contentItemPosition.y + _contentItemSize.height + triangleHeight + _contentItemSize.linewidth;
            _tooltipWidth += _tooltipMarginRight;

            //Triangle
            _triangleX1 = _tooltipX + (0.5 * _tooltipWidth);
            _triangleY1 = _tooltipY - triangleHeight;

            _triangleX2 = _tooltipX + (_tooltipWidth * 0.33);
            _triangleY2 = _tooltipY;

            _triangleX3 = _tooltipX + (_tooltipWidth * 0.66);
            _triangleY3 = _tooltipY;
        }

        function positionsRightSideCircle() {
            _triangleWidth = 10;

            //Rectangle
            _tooltipX = (_contentItemPosition.x + _triangleWidth) + (_contentItemSize.radius * 2) + _contentItemSize.linewidth;
            _tooltipY = (_contentItemPosition.y + _contentItemSize.radius) - (0.5 * _tooltipHeight);
            _tooltipWidth += _tooltipMarginRight;

            //Triangle
            _triangleX1 = _tooltipX - _triangleWidth;
            _triangleY1 = _tooltipY + (_tooltipHeight * 0.5);

            _triangleX2 = _tooltipX;
            _triangleY2 = _tooltipY;

            _triangleX3 = _tooltipX;
            _triangleY3 = _tooltipY + _tooltipHeight;
        }

        function positionsLeftSideCircle() {
            _tooltipX = _contentItemPosition.x - (_triangleWidth + _tooltipWidth + _contentItemSize.linewidth);
            _tooltipY = _contentItemPosition.y + (_contentItemSize.radius - _tooltipHeight * 0.5);

            //Triangle
            _triangleX1 = _tooltipX + _tooltipWidth + _triangleWidth;
            _triangleY1 = _tooltipY + (_tooltipHeight * 0.5);

            _triangleX2 = _tooltipX + _tooltipWidth;
            _triangleY2 = _tooltipY;

            _triangleX3 = _tooltipX + _tooltipWidth;
            _triangleY3 = _tooltipY + _tooltipHeight;
        }

        function positionsBottomCircle() {
            var triangleHeight = 10;
            
            _tooltipX = _contentItemPosition.x + (_contentItemSize.radius) - (0.5 * _tooltipWidth);
            _tooltipY = _contentItemPosition.y + _contentItemSize.height + triangleHeight + _contentItemSize.linewidth;
            _tooltipWidth += _tooltipMarginRight;

            //Triangle
            _triangleX1 = _tooltipX + (0.5 * _tooltipWidth);
            _triangleY1 = _tooltipY - triangleHeight;

            _triangleX2 = _tooltipX + (_tooltipWidth * 0.33);
            _triangleY2 = _tooltipY;

            _triangleX3 = _tooltipX + (_tooltipWidth * 0.66);
            _triangleY3 = _tooltipY;
            
        }


        // Draw the tooltip
        function draw() {
            var context = Canvas.context;
            //Save and restore used so the globalAlpha isn't applied to the whole Canvas
            context.save();
            context.fillStyle = 'rgb(72,77,73)';

            context.beginPath();
            //Draw the triangle
            context.moveTo(_triangleX1, _triangleY1);
            context.lineTo(_triangleX2, _triangleY2);
            context.lineTo(_triangleX3, _triangleY3);
            //Draw the rectangle
            context.rect(_tooltipX, _tooltipY, _tooltipWidth, _tooltipHeight);
            context.fill();
            context.closePath();

            //Draw the text
            context.fillStyle = "white";
            context.fillText(_contentItemTitle, (_tooltipX + 2), (_tooltipY + _tooltipHeight / 2) + 4);
            context.restore();
        }

        // Calculate and get text width for given text and font
        function getTextWidth(text, font) {
            var context = Canvas.context;
            context.font = font;
            var metrics = context.measureText(text);
            return metrics.width;
        };

    }(Canvas.Tooltip || (Canvas.Tooltip = {})));
    var Tooltip = Canvas.Tooltip;
})(Canvas || (Canvas = {}));