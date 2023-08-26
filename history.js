document.addEventListener('DOMContentLoaded', function() {
    displayScoreHistory();
});

function displayScoreHistory() {
    let username = localStorage.getItem("currentUsername");
    if (username) {
        let userData = JSON.parse(localStorage.getItem(username));
        let scoreHistory = userData.scoreHistory;

        // Get the table body element
        let tableBody = document.getElementById("scoreHistoryTable").getElementsByTagName("tbody")[0];
        
        // Clear any existing rows
        tableBody.innerHTML = "";

        // Populate the table with score history data
        for (let i = 0; i < scoreHistory.length; i++) {
            let newRow = tableBody.insertRow();
            let attemptCell = newRow.insertCell(0);
            let scoreCell = newRow.insertCell(1);

            attemptCell.textContent = i + 1; // Attempt number
            scoreCell.textContent = scoreHistory[i]; // Score for that attempt
        }
    }
}
