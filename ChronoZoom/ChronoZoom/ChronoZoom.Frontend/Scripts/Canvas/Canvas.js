var Canvas;
(function (Canvas) {
    // Public methods
    Canvas.context;
    Canvas.canvasContainer;
    Canvas.setTimeline = setTimeline;
    Canvas.resetWindowWidthAndHeight = resetWindowWidthAndHeight;
    Canvas.setOffsetY = setOffsetY;
    var _lastTime = Date.now();;

    var timeline = undefined;

    // 1000 divided by 60 gives 60fps
    var requiredElapsed = 1000 / 35;

    function setOffsetY(offset) {
        timeline.setOffsetY(offset);
    }

    function clickOnCanvasHandler(point) {
        timeline.selectedContentItem(point);
    }

    function getTimelineCallback(tl) {
        timeline = tl;
        Canvas.WindowManager.showLoader(false);
        canvasDrawProcessLoop();
        Canvas.Timescale.setRange(timeline.beginDate, timeline.endDate);
        Canvas.Mousepointer.registerclickOnCanvasHandler(clickOnCanvasHandler);
    }

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
        setTimeline(2);

    }
    // Set the new timeline
    function setTimeline(timelineId) {
        Canvas.BackendService.getTimelineByIdAsync(timelineId, getTimelineCallback);
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
        timeline.update();
    }

    // Draw the canvas
    function draw() {
        // Clear the canvas
        Canvas.context.clearRect(0, 0, Canvas.canvasContainer.width, Canvas.canvasContainer.height);

        // Draw all components
        timeline.draw(Canvas.context);
        Canvas.Timescale.draw();
    }

    // The canvas draw loop
    // The draw loop will call the update and draw method each given frames per second
    // This means that if the fps is on 60, it will call draw and update 60 times.
    function canvasDrawProcessLoop() {
        if (timeline == undefined) return;
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
