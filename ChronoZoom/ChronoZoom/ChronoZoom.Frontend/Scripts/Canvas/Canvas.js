var Canvas;
(function (Canvas) {
    // Public methods
    Canvas.context;
    Canvas.canvasContainer;
    Canvas.setTimeline = setTimeline;
    Canvas.resetWindowWidthAndHeight = resetWindowWidthAndHeight;
    var _lastTime = Date.now();;

    // 1000 divided by 60 gives 60fps
    var requiredElapsed = 1000 / 35;

    // Constructor
    function initialize() {
        Canvas.WindowManager.showLoader(true);
        // Get canvas container element and update it's width and height
        Canvas.canvasContainer = document.getElementById("canvas");
        Canvas.canvasContainer.width = window.innerWidth;
        Canvas.canvasContainer.height = window.innerHeight;

        // Get the canvas context
        Canvas.context = Canvas.canvasContainer.getContext("2d");

        // Update timescale width
        Canvas.Timescale.updateWidth(Canvas.canvasContainer.width);

        // Start the mouse pointer and draw process loop
        Canvas.Mousepointer.start();
        canvasDrawProcessLoop();

        //Add timelines to Panel
        Canvas.PanelManager.addTimelines();

        // Select default timeline
        Canvas.Timeline.setTimeline(2);
        Canvas.WindowManager.showLoader(false);
    }

    // Set the new timeline
    function setTimeline(timelineId) {
        Canvas.Timeline.setTimeline(timelineId);
        Canvas.PanelManager.showTimelinePanel(false);
        Canvas.PanelManager.hideAllPanels();
    }

    // Reset window width and height after window resize
    function resetWindowWidthAndHeight() {
        Canvas.canvasContainer.width = window.innerWidth;
        Canvas.canvasContainer.height = window.innerHeight;

        Canvas.Timescale.updateWidth(Canvas.canvasContainer.width);
    }

    // Update the canvas
    function update() {
        Canvas.Timescale.update();
        Canvas.Timeline.update();
    }

    // Draw the canvas
    function draw() {
        // Clear the canvas
        Canvas.context.clearRect(0, 0, Canvas.canvasContainer.width, Canvas.canvasContainer.height);

        // Draw all components
        Canvas.Timeline.draw();
        Canvas.Timescale.draw();
    }

    // The canvas draw loop
    // The draw loop will call the update and draw method each given frames per second
    // This means that if the fps is on 60, it will call draw and update 60 times.
    function canvasDrawProcessLoop() {
        var elapsed = Date.now() - _lastTime;

        if (elapsed > requiredElapsed) {
            update();
            draw();
            _lastTime = Date.now();
        }
        requestAnimationFrame(canvasDrawProcessLoop);
    }

    initialize();
})(Canvas || (Canvas = {}));
