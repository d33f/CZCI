var Canvas;
(function (Canvas) {
    (function (Timescale) {
        // Public methods
        Timescale.draw = draw;
        Timescale.update = update;
        Timescale.setRange = setRange;
        Timescale.convertTimeToString = convertTimeToString;
        Timescale.getTimeForXPosition = getTimeForXPosition;
        Timescale.getXPositionForTime = getXPositionForTime;
        Timescale.getRange = getRange;

        // Private fields
        var _range = { begin: 0, end: 0 };
        var _height = Canvas.Settings.getTimescaleHeight();
        var _width = 0;

        // Constructor
        function initialize() {
            Canvas.YearMarker.setHeight(_height);
        }

        // Set new range of yearscale
        function setRange(begin, end) {
            var span = end - begin;
            _range = { begin: begin, end: end };
        }

        // Get the current range
        function getRange() {
            return _range;
        }

        // Convert time to string
        function convertTimeToString(time) {
            // Check if before christ
            if (time < 0) {
                return String(time * -1) + " BC";
            }

            // Check if not rounded time and if period span is smaller then the amount of ticks
            if (time !== Math.round(time) && (_range.end - _range.begin) < getTicks()) {
                var date = convertTimeToDate(time);

                var monthNames = [
                    "January", "February", "March",
                    "April", "May", "June", "July",
                    "August", "September", "October",
                    "November", "December"
                ];

                return monthNames[date.getMonth()] + ", " + date.getFullYear();
            }
            return String(time);
        }

        // Convert given time to date
        function convertTimeToDate(time) {
            var year = Math.floor(time);
            var date = new Date(year, 0, 1);
            var daysInYear = isLeapYear(year) ? 365 : 366;
            var days = (time - year) * daysInYear;
            return new Date(date.setDate(date.getDate() + days));
        }

        // Check if it is a leap year
        function isLeapYear(year) {
            return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
        }

        // Get year for given x-axis position
        function getTimeForXPosition(x) {
            // Get canvas width and time per pixel
            var timePerPixel = (_range.end - _range.begin) / _width;

            // Return time
            return Math.floor(_range.begin + (timePerPixel * x));
        }

        // Get x-axis position for given time
        function getXPositionForTime(time) {
            // Get canvas width and time per pixel
            var timePerPixel = _width / (_range.end - _range.begin);

            // Return position
            return (time - _range.begin) * timePerPixel;
        }

        // Update the state of timescale and the yearscale
        function update() {
            // Update timescale
            _width = Canvas.getCanvasContainer().width;
            
            // Update year marker
            Canvas.YearMarker.update();
        }

        // Draw the current yearscale state
        function draw() {
            // Get (canvas) context and canvas width
            var context = Canvas.getContext();
            
            // Draw layers
            drawBaseLayer(context);
            drawTimescaleLayer(context);
            Canvas.YearMarker.draw();
        }

        // Draw the base layer of the yearscale
        function drawBaseLayer(context) {
            context.fillStyle = Canvas.Settings.getTimescaleBackgroundColor();
            context.fillRect(0, 0, _width, _height);
        }

        // Draw the yearscale layer
        function drawTimescaleLayer(context) {
            // Get ticks and define amount of small ticks per tick
            var ticks = getTicks();
            var amountOfSmallTicksPerTick = 5;

            // Draw ticks, tick labels and bottom line
            drawTicks(context, ticks, amountOfSmallTicksPerTick);
            drawTickLabels(context, ticks, amountOfSmallTicksPerTick);
            drawBottomLine(context);
        }

        // Draw (yearscale) ticks
        function drawTicks(context, ticks, amountOfSmallTicksPerTick) {
            // Set total ticks, define line width and set tick width
            var totalTicks = ticks * amountOfSmallTicksPerTick;
            var lineWidth = 2;
            var tickWidth = _width / totalTicks; //Math.round(canvasWidth / totalTicks);
            //console.log(tickWidth, getTimeForXPosition(tickWidth * 5));

            // Set style
            context.lineWidth = lineWidth;
            context.strokeStyle = Canvas.Settings.getTimescaleTickColor();
            
            // Draw all ticks
            context.beginPath();
            for (var i = 0; i <= totalTicks; i++) {
                context.moveTo((i * tickWidth), _height - ((i % amountOfSmallTicksPerTick === 0) ? 20 : 10));
                context.lineTo((i * tickWidth), _height);
            }
            context.stroke();
            context.closePath();
        }

        // Draw tick labels
        function drawTickLabels(context, ticks, amountOfSmallTicksPerTick) {
            // Set tick width and tick year
            var tickWidth = _width / ticks; // = Math.round(canvasWidth / (ticks * amountOfSmallTicksPerTick)) * amountOfSmallTicksPerTick;
            var tickTime = (_range.end - _range.begin) / ticks; //Math.round((_range.end - _range.begin) / ticks);

            // Set style
            context.font = Canvas.Settings.getTimescaleTickLabelFont();
            context.fillStyle = Canvas.Settings.getTimescaleTickLabelColor();

            // Draw all ticks
            for (var i = 0; i <= ticks; i++) {
                // Set year and convert year to string
                var year = _range.begin + (i * tickTime);
                var yearString = convertTimeToString(year);
                
                // Draw text centered above tick
                context.fillText(yearString, (i * tickWidth) - (yearString.length * 5), _height - 30);
            }
        }

        // Draw bottom line
        function drawBottomLine(context) {
            context.lineWidth = 1.5;
            context.moveTo(0, _height);
            context.lineTo(_width, _height);
            context.stroke();
            context.closePath();
        }

        // Calculate ticks for current range and given canvas width
        function getTicks() {
            // Calculate span
            var span = _range.end - _range.begin;

            // Less ticks for (realy) small screen
            if (_width < 500) {
                return 4;
            }

            // Less ticks for small year range or smaller screen
            if (span < 10 || _width < 1000) {
                return 8;
            }

            // Default
            return 10;
        }

        initialize();
    })(Canvas.Timescale || (Canvas.Timescale = {}));
    var Timescale = Canvas.Timescale;
})(Canvas || (Canvas = {}));