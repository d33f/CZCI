var Canvas;
(function (Canvas) {
    (function (Settings) {
        // Color getters
        Settings.getYearmarkerColor =               getYearmarkerColor;
        Settings.getTimescaleBackgroundColor =      getTimescaleBackgroundColor;
        Settings.getTimescaleTickColor =            getTimescaleTickColor;
        Settings.getTimescaleTickLabelColor =       getTimescaleTickLabelColor;
        Settings.getYearmarkerFont =                getYearmarkerFont;
        Settings.getYearmarkerFontColor =           getYearmarkerFontColor;

        // Font getters
        Settings.getTimescaleTickLabelFont = getTimescaleTickLabelFont;

        // Fontsize getters
        Settings.getYearmarkerFontSize = getYearmarkerFontSize;

        // Size getters
        Settings.getTimescaleHeight = getTimescaleHeight;

        // Color fields
        var yearmarkerColor =               "rgb(0,83,141)";
        var timescaleBackgroundColor =      "rgb(3,136,229)";
        var timescaleTickColor =            "white";
        var timescaleTickLabelColor =       "white";
        var yearmarkerFontColor =           "white";

        // Font fields
        var timescaleTickLabelFont =        "18px Tahoma";
        var yearmarkerFont =                "Consolas";

        // Font size 
        var yearmarkerFontSize = 16;

        // Size fields
        var timescaleHeight = 50;

        //Color getters
        function getYearmarkerColor() {
            return yearmarkerColor;
        }
        function getTimescaleBackgroundColor() {
            return timescaleBackgroundColor;
        }

        function getTimescaleTickColor() {
            return timescaleTickColor;
        }

        function getTimescaleTickLabelColor() {
            return timescaleTickLabelColor;
        }

        function getYearmarkerFontColor() {
            return yearmarkerFontColor;
        }


        //Font getters
        function getTimescaleTickLabelFont() {
            return timescaleTickLabelFont;
        }

        function getYearmarkerFont() {
            return "bold "+yearmarkerFontSize+"px "+ yearmarkerFont;
        }

        //Font size getters
        function getYearmarkerFontSize() {
            return yearmarkerFontSize;
        }

        //Size getters
        function getTimescaleHeight() {
            return timescaleHeight;
        }
    })(Canvas.Settings || (Canvas.Settings = {}));
    var Settings = Canvas.Settings;
})(Canvas || (Canvas = {}));