var Canvas;
(function (Canvas) {
    (function (PanelManager) {
        // Public methods
        PanelManager.handleTestPanel = handleTestPanel;

        function handleTestPanel() {
            var inputPanel = document.getElementById('inputPanel');
            inputPanel.className = inputPanel.className ? '' : 'fade';
        }

    })(Canvas.PanelManager || (Canvas.PanelManager = {}));
    var PanelManager = Canvas.PanelManager;
})(Canvas || (Canvas = {}));