var Canvas;
(function (Canvas) {
    (function (PublicAPIService) {
        // Public methods
        PublicAPIService.getInformation = getInformation;

        // Private fields
        // ..

        // Get information
        function getInformation(url, callback) {
            callback('Test description obtained from the public API service!');
        }
    })(Canvas.PublicAPIService || (Canvas.PublicAPIService = {}));
    var PublicAPIService = Canvas.PublicAPIService;
})(Canvas || (Canvas = {}));