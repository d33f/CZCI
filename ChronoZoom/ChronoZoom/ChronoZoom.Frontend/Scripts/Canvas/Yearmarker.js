Canvas.YearMarker = (function () {
    // Private fields
    var x;
    var context;
    var yearmarkerWidth = 80;
    var yearmarkerHeight = 20;
    var arrowHeight = 15;
    var fontSize = 0;

    //  -------
    //  | year|
    //    \/         <--
    function drawRectangleArrow() {
        context.beginPath();
        context.moveTo(x - 10, yearmarkerHeight - arrowHeight);
        context.lineTo(x, yearmarkerHeight);
        context.lineTo(x + 10, yearmarkerHeight - arrowHeight);
        context.fill();
        context.closePath();
    }

    //  ---------
    //  | year  |
    //  ---------
    function drawBox() {
        context.fillStyle = Canvas.Settings.getYearmarkerColor();
        context.beginPath();
        // divide bt 1/2 to get the half of the width
        context.rect(getBeginPositionOnTimeline(), 0, yearmarkerWidth, yearmarkerHeight - arrowHeight);
        context.fill();
        context.closePath();
    }

    function drawYear() {
        // Draw year in marker
        context.beginPath();

        //Get the time belonging to the mouseposition
        var timeText = Canvas.Timescale.convertTimeToString(Math.round(Canvas.Timescale.getTimeForXPosition(x)));

        //The length in pixels of the string
        var lengthOfStringInPixels = context.measureText(timeText).width;
        context.font = Canvas.Settings.getYearmarkerFont();
        context.fillStyle = Canvas.Settings.getYearmarkerFontColor();

        //Calculate the middle of the box to draw the year
        var begintext = getBeginPositionOnTimeline() + ((yearmarkerWidth - lengthOfStringInPixels) / 2);
        context.fillText(timeText, begintext + 1, calculateYPositionForText());
        context.closePath();
    }

    //Calculate the position where to draw the text in the middle of the yearmarker box
    function calculateYPositionForText() {
        // So only the box is left
        var box = yearmarkerHeight - arrowHeight;
        var middleBox = box / 2;
        var halfOfTextHeight = (fontSize / 2) / 2;
        var total = middleBox + halfOfTextHeight;
        return total;
    }

    //Determine the left side of the yearmarker box where it starts on the scale in pixels
    function getBeginPositionOnTimeline() {
        return (x) - yearmarkerWidth / 2;
    }

    // Needs to get called by the timescale. With this height the yearmarker is able to be the same height as the timescale
    var setHeight = function (height) {
        yearmarkerHeight = height;
    }

    var update = function () {
        fontSize = Canvas.Settings.getYearmarkerFontSize();
        x = Canvas.Mousepointer.position.x;
    }

    var draw = function () {
        context = Canvas.context;
        drawBox();
        drawRectangleArrow();
        drawYear();
    }

    // Public methods
    return {
        draw: draw,
        update: update,
        setHeight: setHeight
    };
})();