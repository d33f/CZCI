var Canvas;
(function (Canvas) {
    // Public methods
    Canvas.getContext = getContext;
    Canvas.getContainer = getContainer;
    Canvas.getCanvasContainer = getCanvasContainer;

    // Private fields
    var _container;
    var _canvasContainer;
    var _lastTime;
    var _requiredElapsed = 1000 / 600; //is 60fps
    var _context;

    // Constructor
    function initialize() {
        // Get the container element
        _container = document.getElementById('canvasContainer');

        // Get canvas container element and update it's width and height
        _canvasContainer = document.getElementById('canvas');
        _canvasContainer.width = window.innerWidth;
        _canvasContainer.height = window.innerHeight;

        // Get the canvas context
        _context = _canvasContainer.getContext("2d");

        // Set the timescale range with some default data
        Canvas.Timescale.setRange(-2000, 2000);

        // Start the mouse pointer and draw process loop
        Canvas.Mousepointer.start();
        canvasDrawProcessLoop();
    }

    // Get the (canvas) context 
    function getContext() {
        return _context;
    }

    // Get the container element
    function getContainer() {
        return _container;
    }

    // Get the canvas container element
    function getCanvasContainer() {
        return _canvasContainer;
    }

    // Update the canvas
    function update() {
        Canvas.Timescale.update();
        Canvas.Timeline.update();
    }

    // Draw the canvas
    function draw() {
        // Clear the canvas
        getContext().clearRect(0, 0, _canvasContainer.width, _canvasContainer.height);

        // Draw all components
        Canvas.Timescale.draw();
        Canvas.Timeline.draw();
    }

    // Continuous (canvas) draw loop 
    function canvasDrawProcessLoop() {
        if (_lastTime == undefined) {
            _lastTime = Date.now();
        };
        var elapsed = Date.now() - _lastTime;

        if (elapsed > _requiredElapsed) {
            update();
            draw();
            _lastTime = Date.now();
        }
        requestAnimationFrame(canvasDrawProcessLoop);
    }

    initialize();
})(Canvas || (Canvas = {}));