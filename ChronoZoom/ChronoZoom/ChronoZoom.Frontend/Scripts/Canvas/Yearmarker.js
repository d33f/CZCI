var Canvas;
(function (Canvas) {
    (function (YearMarker) {
        // Public methods
        YearMarker.draw = draw;
        YearMarker.update = update;
        YearMarker.setHeight = setHeight;

        // Private fields
        var x;
        var y;
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
            context.moveTo(x - 10, yearmarkerHeight-arrowHeight);
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
            context.rect(getBeginPositionOnTimeline(), 0, yearmarkerWidth, yearmarkerHeight-arrowHeight); // divide bt 1/2 to get the half of the width
            context.fill();
            context.closePath();
        }

        function drawYear() {
            // Draw year in marker
            context.beginPath();
            var timeText = Canvas.Timescale.convertTimeToString(Canvas.Timescale.getTimeForXPosition(x));   //Get the time belonging to the mouseposition
            var lengthOfStringInPixels = context.measureText(timeText).width;                               //The length in pixels of the string
            context.font = Canvas.Settings.getYearmarkerFont();
            context.fillStyle = Canvas.Settings.getYearmarkerFontColor();
            var begintext = getBeginPositionOnTimeline() + ((yearmarkerWidth-lengthOfStringInPixels)/2);    //Calculate the middle of the box to draw the year
            context.fillText(timeText, begintext + 1, calculateYPositionForText());
            context.closePath();
        }

        //Calculate the position where to draw the text in the middle of the yearmarker box
        function calculateYPositionForText() {
            var box = yearmarkerHeight - arrowHeight; // So only the box is left
            var middleBox = box / 2;
            var halfOfTextHeight = (fontSize / 2)/2;
            var total = middleBox+halfOfTextHeight;
            return total;
        }

        //Determine the left side of the yearmarker box where it starts on the scale in pixels
        function getBeginPositionOnTimeline() {
            return (x) - yearmarkerWidth / 2;
        }

        // Needs to get called by the timescale. With this height the yearmarker is able to be the same height as the timescale
        function setHeight(height) {
            yearmarkerHeight = height;
        }

        function update() {
            fontSize = Canvas.Settings.getYearmarkerFontSize();
            x = Canvas.Mousepointer.getPosition().x;
            y = Canvas.Mousepointer.getPosition().y;
        }
        function draw() {
            context = Canvas.getContext();
            drawBox();
            drawRectangleArrow();
            drawYear(); // Must be the last call to draw ontop of the other items
        }

    })(Canvas.YearMarker || (Canvas.YearMarker = {}));
    var YearMarker = Canvas.YearMarker;
})(Canvas || (Canvas = {}));