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

        // Set new range of yearscale
        function setRange(begin, end) {
            _range = { begin: begin, end: end };
        }

        function getRange() {
            return _range;
        }

        // Convert time to string
        function convertTimeToString(time) {
            if (time < 0) {
                return String(time * -1) + " BC";
            }
            return String(time);
        }

        // Get year for given x-axis position
        function getTimeForXPosition(x) {
            // Get canvas width and time per pixel
            var canvasWidth = Canvas.getContainer().width;
            var timePerPixel = (_range.end - _range.begin) / canvasWidth;

            // Return time
            return Math.floor(_range.begin + (timePerPixel * x));
        }

        // Get x-axis position for given time
        function getXPositionForTime(time) {
            // Get canvas width and time per pixel
            var canvasWidth = Canvas.getContainer().width;
            var timePerPixel = canvasWidth / (_range.end - _range.begin);

            // Return position
            return (time - _range.begin) * timePerPixel;
        }

        // Update the state of the yearscale
        function update() {
            Canvas.YearMarker.setHeight(_height);
            Canvas.YearMarker.update();
        }

        // Draw the current yearscale state
        function draw() {
            // Get (canvas) context and canvas width
            var context = Canvas.getContext();
            var canvasWidth = Canvas.getContainer().width;

            // Draw layers
            drawBaseLayer(context, canvasWidth);
            drawTimescaleLayer(context, canvasWidth);
            Canvas.YearMarker.draw();
        }

        // Draw the base layer of the yearscale
        function drawBaseLayer(context, canvasWidth) {
            context.fillStyle = Canvas.Settings.getTimescaleBackgroundColor();
            context.fillRect(0, 0, canvasWidth, _height);
        }

        // Draw the yearscale layer
        function drawTimescaleLayer(context, canvasWidth) {
            // Get ticks and define amount of small ticks per tick
            var ticks = getTicks(canvasWidth);
            var amountOfSmallTicksPerTick = 5;

            // Draw ticks, tick labels and bottom line
            drawTicks(context, canvasWidth, ticks, amountOfSmallTicksPerTick);
            drawTickLabels(context, canvasWidth, ticks, amountOfSmallTicksPerTick);
            drawBottomLine(context, canvasWidth);
        }

        // Draw (yearscale) ticks
        function drawTicks(context, canvasWidth, ticks, amountOfSmallTicksPerTick) {
            // Set total ticks, define line width and set tick width
            var totalTicks = ticks * amountOfSmallTicksPerTick;
            var lineWidth = 2;
            var tickWidth = canvasWidth / totalTicks; //Math.round(canvasWidth / totalTicks);
            //console.log(tickWidth, getTimeForXPosition(tickWidth * 5));

            // Set style
            context.lineWidth = lineWidth;
            context.strokeStyle = Canvas.Settings.getTimescaleTickColor();
            
            // Draw all ticks
            context.beginPath();
            for (var i = 0; i <= totalTicks; i++) {
                context.moveTo((i * tickWidth), _height - ((i % amountOfSmallTicksPerTick == 0) ? 20 : 10));
                context.lineTo((i * tickWidth), _height);
            }
            context.stroke();
            context.closePath();
        }

        // Draw tick labels
        function drawTickLabels(context, canvasWidth, ticks, amountOfSmallTicksPerTick) {
            // Set tick width and tick year
            var tickWidth = canvasWidth / ticks; //Math.round(canvasWidth / (ticks * amountOfSmallTicksPerTick)) * amountOfSmallTicksPerTick;
            var tickTime = Math.round((_range.end - _range.begin) / ticks);

            // Set style
            context.font = Canvas.Settings.getTimescaleTickLabelFont();
            context.fillStyle = Canvas.Settings.getTimescaleTickLabelColor();

            // Draw all ticks
            for (var i = 0; i <= ticks; i++) {
                // Set year and convert year to string
                var year = Math.round(_range.begin + (i * tickTime));
                var yearString = convertTimeToString(year);

                // Draw text centered above tick
                context.fillText(yearString, (i * tickWidth) - (yearString.length * 5), _height - 30);
            }
        }

        // Draw bottom line
        function drawBottomLine(context, canvasWidth) {
            context.lineWidth = 1.5;
            context.moveTo(0, _height);
            context.lineTo(canvasWidth, _height);
            context.stroke();
            context.closePath();
        }

        // Get ticks for current range and given canvas width
        function getTicks(canvasWidth) {
            // Calculate span
            var span = _range.end - _range.begin;

            // Less ticks for (realy) small screen
            if (canvasWidth < 500) {
                return 4;
            }

            // Less ticks for small year range or smaller screen
            if (span < 10 || canvasWidth < 1000) {
                return 8;
            }

            // Default
            return 10;
        }
    })(Canvas.Timescale || (Canvas.Timescale = {}));
    var Timescale = Canvas.Timescale;
})(Canvas || (Canvas = {}));