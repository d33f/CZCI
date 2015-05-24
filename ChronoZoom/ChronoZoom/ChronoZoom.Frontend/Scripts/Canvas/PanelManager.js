var Canvas;
(function (Canvas) {
    (function (PanelManager) {
        // Public methods
        PanelManager.showTimelinePanel = showTimelinePanel;
        PanelManager.handleImportPanel = handleImportPanel;
        PanelManager.handleImportPanelInput = handleImportPanelInput;

        function showTimelinePanel(showPanel) {
            var inputPanel = document.getElementById('inputPanel');
            inputPanel.className = showPanel ? 'inputPanelShow' : 'inputPanelHidden';
        }

        function handleImportPanel() {
            var importPanel = document.getElementById('importPanel');
            importPanel.className = importPanel.className === 'importPanelHidden' ? 'importPanelShow' : 'importPanelHidden';
        }

        function handleImportPanelInput() {
            var title = document.getElementById("titleInput").value;
            var startDate = document.getElementById("startDateInput").value;
            var endDate = document.getElementById("endDateInput").value;

            // write output to panel
            var output = document.getElementById("importOutput")
            if (output.textContent !== undefined) {
                output.textContent = "Input received: " + title + " " + startDate + " " + endDate;
            }
        }

    })(Canvas.PanelManager || (Canvas.PanelManager = {}));
    var PanelManager = Canvas.PanelManager;
})(Canvas || (Canvas = {}));