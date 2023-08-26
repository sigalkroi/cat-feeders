document.addEventListener('DOMContentLoaded', function() {
    displayLeaderboard();
});

function displayLeaderboard() {
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    const leaderboardTable = document.getElementById('leaderboardData');
  
    leaderboardTable.innerHTML = ''; // Clear any existing data
  
    leaderboardData.forEach((entry, index) => {
      let row = leaderboardTable.insertRow();
      let rankCell = row.insertCell(0);
      let nameCell = row.insertCell(1);
      let scoreCell = row.insertCell(2);
  
      rankCell.textContent = index + 1;
      nameCell.textContent = entry.name;
      scoreCell.textContent = entry.score;
    });
  }
