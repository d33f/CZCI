Canvas.Timescale = (function() {
    // Private fields
    var range = { begin: 0, end: 0 };
    var size = { width: 0, height: Canvas.Settings.getTimescaleHeight() }
        
    var updateWidth = function(width) {
        size.width = width;
    }

    // Constructor
    function initialize() {
        Canvas.YearMarker.setHeight(size.height);
    }

    // Set new range of yearscale
    var setRange = function(begin, end) {
        range = { begin: begin, end: end };
    }

    // Get the current range
    var getRange = function() {
        return range;
    }

    // Convert time to string
    var convertTimeToString = function(time) {
        // Check if before christ
        if (time < 0) {
            return String(Math.round(time) * -1) + " BC";
        }

        // Check if not rounded time
        if (time !== Math.round(time) && (range.end - range.begin) < 10) {
            var date = convertTimeToDate(time);

            var monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];

            return monthNames[date.getMonth()] + ", " + date.getFullYear();
        }
        return String(Math.round(time));
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
    var getTimeForXPosition = function(x) {
        // Get canvas size.width and time per pixel
        var timePerPixel = (range.end - range.begin) / size.width;

        // Return time
        return Math.floor(range.begin + (timePerPixel * x));
    }

    // Get x-axis position for given time
    var getXPositionForTime = function(time) {
        // Get canvas size.width and time per pixel
        var timePerPixel = size.width / (range.end - range.begin);

        // Return position
        return (time - range.begin) * timePerPixel;
    }

    // Update the state of timescale and the yearscale
    var update = function() {
        Canvas.YearMarker.update();
    }

    // Draw the current yearscale state
    var draw = function() {
        var context = Canvas.context;
        drawBaseLayer(context);
        drawTimescaleLayer(context);

        Canvas.YearMarker.draw();
    }

    // Draw the base layer of the yearscale
    function drawBaseLayer(context) {
        context.fillStyle = Canvas.Settings.getTimescaleBackgroundColor();
        context.fillRect(0, 0, size.width, size.height);
    }

    // Draw the yearscale layer
    function drawTimescaleLayer(context) {
        // Get ticks and define amount of small ticks per tick
        var ticks = getTicks();
        var amountOfSmallTicksPerTick = 5;

        // Draw ticks, tick labels and bottom line
        var span = range.end - range.begin;
        if (span == 0) {
            drawTicks(context, 2, 1);
            drawTickLabels(context, 2);
        } else {
            drawTicks(context, ticks, amountOfSmallTicksPerTick);
            drawTickLabels(context, ticks);
        }

            
        drawBottomLine(context);
    }

    // Draw (yearscale) ticks
    function drawTicks(context, ticks, amountOfSmallTicksPerTick) {
        // Set total ticks, define line width and set tick width
        var totalTicks = ticks * amountOfSmallTicksPerTick;
        var lineWidth = 2;
        var tickWidth = size.width / totalTicks; 

        // Set style
        context.lineWidth = lineWidth;
        context.strokeStyle = Canvas.Settings.getTimescaleTickColor();

        // Draw all ticks
        context.beginPath();
        for (var i = 0; i <= totalTicks; i++) {
            context.moveTo((i * tickWidth), size.height - ((i % amountOfSmallTicksPerTick === 0) ? 20 : 10));
            context.lineTo((i * tickWidth), size.height);
        }
        context.stroke();
        context.closePath();
    }

    // Draw tick labels
    function drawTickLabels(context, ticks) {
        // Set tick width and tick year
        var tickWidth = size.width / ticks;
        var tickTime = (range.end - range.begin) / ticks;

        // Set style
        context.font = Canvas.Settings.getTimescaleTickLabelFont();
        context.fillStyle = Canvas.Settings.getTimescaleTickLabelColor();

        // Draw all ticks
        for (var i = 1; i < ticks; i++) {
            // Set year and convert year to string
            var year = range.begin + (i * tickTime);
            var yearString = convertTimeToString(year);

            // Draw text centered above tick
            context.fillText(yearString, (i * tickWidth) - (yearString.length * 5), size.height - 30);
        }
    }

    // Draw bottom line
    function drawBottomLine(context) {
        context.linewidth = 1.5;
        context.moveTo(0, size.height);
        context.lineTo(size.width, size.height);
        context.stroke();
        context.closePath();
    }

    // Calculate ticks for current range and given canvas width
    function getTicks() {
        // Calculate span
        var span = range.end - range.begin;

        // Less ticks for (realy) small screen
        if (size.width < 500) {
            return 4;
        }

        // Less ticks for small year range or smaller screen
        if (span < 10 || size.width < 1000) {
            return 8;
        }

        // Default
        return 10;
    }

    initialize();

    // Public methods
    return {
        draw: draw,
        update: update,
        setRange: setRange,
        convertTimeToString: convertTimeToString,
        getTimeForXPosition: getTimeForXPosition,
        getXPositionForTime: getXPositionForTime,
        getRange: getRange,
        updateWidth: updateWidth
    };
})();