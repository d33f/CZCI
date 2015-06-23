Canvas.Tooltip = (function () {
    // Private fields
    var tooltipX;
    var tooltipY;
    var tooltipWidth;
    var tooltipHeight = 40;
    var tooltipMarginRight = 5;

    var triangle = {
        x1: 0, 
        y1: 0, 
        x2: 0, 
        y2: 0, 
        x3: 0,
        y3: 0
    };
    var triangleWidth = 10;

    var contentItemPosition;
    var contentItemSize;

    var contentItemTitle;
    var contentItemHasChildren;

    // Update the tooltip
    function update(contentItem) {
        contentItemPosition = contentItem.getPosition();
        contentItemSize = contentItem.getSize();
        contentItemTitle = contentItem.getTitle();
        contentItemHasChildren = contentItem.hasChildren();
        tooltipWidth = getTextWidth(contentItemTitle, 18);
        updatePosition();
    }

    function updatePosition() {
        var canvasWidth = Canvas.canvasContainer.width;

        if (contentItemHasChildren) {
            if ((contentItemPosition.x + contentItemSize.width + tooltipWidth) < canvasWidth) {
                positionsRightSideRectangle();
            } else if (contentItemPosition.x - tooltipWidth > 0) {
                positionsLeftSideRectangle();
            } else {
                positionsBottomRectangle();
            }
        } else {
            if ((contentItemPosition.x + (contentItemSize.radius * 2) + tooltipWidth) < canvasWidth) {
                positionsRightSideCircle();
            } else if (contentItemPosition.x - tooltipWidth > 0) {
                positionsLeftSideCircle();
            }
            else {
                positionsBottomCircle();
            }
        }
    }

    function positionsRightSideRectangle() {
        //Rectangle
        tooltipX = contentItemSize.width + contentItemPosition.x + triangleWidth + contentItemSize.linewidth;
        tooltipY = (contentItemSize.height * 0.5) - (tooltipHeight * 0.5) + contentItemPosition.y;
        tooltipWidth = tooltipWidth + tooltipMarginRight;

        //Triangle
        setTriangle((tooltipX - triangleWidth), (tooltipY + (tooltipHeight * 0.5)), tooltipX, tooltipY, tooltipX, (tooltipY + tooltipHeight));
    }

    function positionsLeftSideRectangle() {
        tooltipX = (contentItemPosition.x - triangleWidth) - (tooltipWidth - contentItemSize.linewidth);
        tooltipY = (contentItemSize.height * 0.5) - (tooltipHeight * 0.5) + contentItemPosition.y;

        //Triangle
        setTriangle((tooltipX + tooltipWidth + triangleWidth), (tooltipY + (tooltipHeight * 0.5)), (tooltipX + tooltipWidth), tooltipY, (tooltipX + tooltipWidth), (tooltipY + tooltipHeight));
    }

    function positionsBottomRectangle() {
        var triangleHeight = 10;

        tooltipX = contentItemPosition.x + (0.5 * contentItemSize.width) - (0.5 * tooltipWidth);
        tooltipY = contentItemPosition.y + contentItemSize.height + triangleHeight + contentItemSize.linewidth;
        tooltipWidth += tooltipMarginRight;

        //Triangle
        setTriangle((tooltipX + (0.5 * tooltipWidth)), (tooltipY - triangleHeight), (tooltipX + (tooltipWidth * 0.33)), tooltipY, (tooltipX + (tooltipWidth * 0.66)), tooltipY);
    }

    function positionsRightSideCircle() {
        triangleWidth = 10;

        //Rectangle
        tooltipX = (contentItemPosition.x + triangleWidth) + (contentItemSize.radius * 2) + contentItemSize.linewidth;
        tooltipY = (contentItemPosition.y + contentItemSize.radius) - (0.5 * tooltipHeight);
        tooltipWidth += tooltipMarginRight;

        //Triangle
        setTriangle((tooltipX - triangleWidth), (tooltipY + (tooltipHeight * 0.5)), tooltipX, tooltipY, tooltipX, (tooltipY + tooltipHeight));
    }

    function positionsLeftSideCircle() {
        tooltipX = contentItemPosition.x - (triangleWidth + tooltipWidth + contentItemSize.linewidth);
        tooltipY = contentItemPosition.y + (contentItemSize.radius - tooltipHeight * 0.5);

        //Triangle
        setTriangle((tooltipX + tooltipWidth + triangleWidth), (tooltipY + (tooltipHeight * 0.5)), (tooltipX + tooltipWidth), tooltipY, (tooltipX + tooltipWidth), (tooltipY + tooltipHeight));
    }

    function positionsBottomCircle() {
        var triangleHeight = 10;

        tooltipX = contentItemPosition.x + (contentItemSize.radius) - (0.5 * tooltipWidth);
        tooltipY = contentItemPosition.y + contentItemSize.height + triangleHeight + contentItemSize.linewidth;
        tooltipWidth += tooltipMarginRight;

        //Triangle
        setTriangle(tooltipX + (0.5 * tooltipWidth)),(tooltipY - triangleHeight),(tooltipX + (tooltipWidth * 0.33)),tooltipY, (tooltipX + (tooltipWidth * 0.66), tooltipY);
    }

    function setTriangle(x1, y1, x2, y2, x3, y3) {
        triangle = {
            x1: x1, 
            y1: y1, 
            x2: x2, 
            y2: y2, 
            x3: x3,
            y3: y3
        };
    }

    // Draw the tooltip
    function draw() {
        var context = Canvas.context;
        //Save and restore used so the globalAlpha isn't applied to the whole Canvas
        context.save();
        context.fillStyle = 'rgb(72,77,73)';

        context.beginPath();
        //Draw the triangle
        context.moveTo(triangle.x1, triangle.y1);
        context.lineTo(triangle.x2, triangle.y2);
        context.lineTo(triangle.x3, triangle.y3);

        //Draw the rectangle
        context.rect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
        context.fill();
        context.closePath();

        //Draw the text
        context.fillStyle = "white";
        context.fillText(contentItemTitle, (tooltipX + 2), (tooltipY + tooltipHeight / 2) + 4);
        context.restore();
    }

    // Calculate and get text width for given text and font
    function getTextWidth(text, font) {
        var context = Canvas.context;
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    };

    // Public methods
    return {
        update: update,
        draw: draw
    };
})();