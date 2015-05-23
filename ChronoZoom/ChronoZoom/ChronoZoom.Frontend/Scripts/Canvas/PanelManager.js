var Canvas;
(function (Canvas) {
    (function (PanelManager) {
        // Public methods
        PanelManager.handleTestPanel = handleTestPanel;
        PanelManager.handleImportPanel = handleImportPanel;
        PanelManager.handleImportPanelInput = handleImportPanelInput;

        function handleTestPanel() {
            var inputPanel = document.getElementById('inputPanel');
           // inputPanel.style.width = inputPanel.style.width === '0px' ? '0px' : '300px';
           // inputPanel.style.left = inputPanel.style.left === '-300px' ? '0px' : '-300px';
            // inputPanel.style.visibility = inputPanel.style.visibility === 'hidden' ? 'hidden' : 'visible';
            inputPanel.className = inputPanel.className === 'inputPanelHidden' ? 'inputPanelShow' : 'inputPanelHidden';
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