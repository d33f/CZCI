var Canvas;
(function (Canvas) {
    // Public methods
    Canvas.getContext = getContext;
    Canvas.getContainer = getContainer;
    Canvas.getCanvasContainer = getCanvasContainer;
    Canvas.getFPS = getFPS;
    Canvas.setTimeline = setTimeline;
    Canvas.resetWindowWidthAndHeight = resetWindowWidthAndHeight;

    // Private fields
    var _container;
    var _canvasContainer;
    var _lastTime;

    // 1000 divided by 150 gives 15fps, 1000 dived by 1 given 1fps
    var _requiredElapsed = 1000 / 150;
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

        // Start the mouse pointer and draw process loop
        Canvas.Mousepointer.start();
        Canvas.WindowManager.showLoader(false);
        canvasDrawProcessLoop();

        //Add timelines to Panel
        Canvas.PanelManager.addTimelines();

        // Select default timeline
        Canvas.Timeline.setTimeline(2);
    }

    // Set the new timeline
    function setTimeline(timelineId) {
        Canvas.Timeline.setTimeline(timelineId);
        Canvas.PanelManager.showTimelinePanel(false);
    }

    // Reset window width and height after window resize
    function resetWindowWidthAndHeight() {
        _canvasContainer.width = window.innerWidth;
        _canvasContainer.height = window.innerHeight;
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

    function getFPS() {
        return _requiredElapsed;
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
        Canvas.Timeline.draw();
        Canvas.Timescale.draw();
    }

    // The canvas draw loop
    // The draw loop will call the update and draw method each given frames per second
    // This means that if the fps is on 60, it will call draw and update 60 times.
    function canvasDrawProcessLoop() {
        if (_lastTime === undefined) {
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