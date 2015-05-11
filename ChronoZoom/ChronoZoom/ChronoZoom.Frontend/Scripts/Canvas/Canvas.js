var Canvas;
(function (Canvas) {
    // Public methods
    Canvas.getContext = getContext;
    Canvas.getContainer = getContainer;

    // Private fields
    var _container;
    var _lastTime;
    var _requiredElapsed = 1000 / 10; // 600; //is 60fps
    var _context;

    // Constructor
    function initialize() {
        _container = document.getElementById('element');
        _container.width = window.innerWidth;
        _container.height = window.innerHeight;
        _context = _container.getContext("2d");
        Canvas.Timescale.setRange(-2000, 2000);
        Canvas.Mousepointer.start();
        canvasDrawProcessLoop();
    }

    // Get the (canvas) context
    function getContext() {
        return _context;
    }

    // Get the (canvas) container element
    function getContainer() {
        return _container;
    }

    // Update the canvas
    function update() {
        Canvas.Timescale.update();
        Canvas.Timeline.update();
    }

    // Draw the canvas
    function draw() {
        // Clear the canvas
        getContext().clearRect(0, 0, _container.width, _container.height);

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