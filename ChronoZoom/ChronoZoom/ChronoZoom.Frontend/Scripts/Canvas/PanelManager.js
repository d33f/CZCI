var Canvas;
(function (Canvas) {
    (function (PanelManager) {
        // Public methods
        PanelManager.handleTestPanel = handleTestPanel;

        function handleTestPanel() {
            var inputPanel = document.getElementById('inputPanel');
           // inputPanel.style.width = inputPanel.style.width === '0px' ? '0px' : '300px';
           // inputPanel.style.left = inputPanel.style.left === '-300px' ? '0px' : '-300px';
            // inputPanel.style.visibility = inputPanel.style.visibility === 'hidden' ? 'hidden' : 'visible';
            inputPanel.className = inputPanel.className === 'inputPanelHidden' ? 'inputPanelShow' : 'inputPanelHidden';
        }

    })(Canvas.PanelManager || (Canvas.PanelManager = {}));
    var PanelManager = Canvas.PanelManager;
})(Canvas || (Canvas = {}));