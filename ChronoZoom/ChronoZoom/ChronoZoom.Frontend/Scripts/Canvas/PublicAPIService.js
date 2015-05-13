var Canvas;
(function (Canvas) {
    (function (PublicAPIService) {
        // Public methods
        PublicAPIService.getInformation = getInformation;

        // Private fields
        // ..

        function getJSON(url, resolve, reject) {
            // Create new instance of XMLHttpRequest and open requested path (async)
            var xmlHttpRequest = new XMLHttpRequest();
            xmlHttpRequest.open("GET", url, true);

            // Ready event
            xmlHttpRequest.onload = function () {
                // Check http status code and resolve the promise with the response text when valid
                if (xmlHttpRequest.status === 200) {
                    resolve(JSON.parse(xmlHttpRequest.response));
                }
                    // Otherwise reject with the status text
                else {
                    reject(Error(xmlHttpRequest.statusText));
                }
            }

            // Handle network errors
            xmlHttpRequest.onerror = function () {
                reject(Error("Network Error"));
            };

            // Make the request
            xmlHttpRequest.send();
        }

        // Get information
        function getInformation(url, callback) {
            callback('Test description obtained from the public API service!');

            //getJSON(url, function (json) {
            //    // TODO: Get domain from url, switch result format for found domain
            //    console.log(json);

            //    // Return result
            //    callback('Test description obtained from the public API service!');
            //}, function (error) {
            //    console.log('Failed getting information from source url ' + url);
            //});
        }
    })(Canvas.PublicAPIService || (Canvas.PublicAPIService = {}));
    var PublicAPIService = Canvas.PublicAPIService;
})(Canvas || (Canvas = {}));