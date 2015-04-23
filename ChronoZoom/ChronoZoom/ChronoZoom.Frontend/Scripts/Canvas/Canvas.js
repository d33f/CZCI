var Canvas;
(function (Canvas) {

    Canvas.getContext = getContext;
    Canvas.getContainer = getContainer;
    var container;
    var lastTime;
    var requiredElapsed = 1000 / 600; //is 60fps
    var context;

    function initialize() {
        container = document.getElementById('element');
        container.width = window.innerWidth;
        container.height = window.innerHeight;
        context = container.getContext("2d");
        Canvas.Timescale.setRange(-2000, 2000);
        Canvas.Mousepointer.init(); //Start the mouse listeners
    }

    function getContext() {
        return context;
    }

    function getContainer() {
        return container;
    }

    function update() {
        Canvas.Timescale.update();
        Canvas.Timeline.update();
    }

    function draw() {
        // Clear the canvas
        getContext().clearRect(0, 0, container.width, container.height);

        // Draw all components
        Canvas.Timescale.draw();
        Canvas.Timeline.draw();
    }

    function canvasDrawProcessLoop() {
        if (lastTime == undefined) {
            lastTime = Date.now();
        };
        var elapsed = Date.now() - lastTime;

        if (elapsed > requiredElapsed) {
            update();
            draw();
        }
        requestAnimationFrame(canvasDrawProcessLoop);
    }

    initialize();
    canvasDrawProcessLoop();

})(Canvas || (Canvas = {}));