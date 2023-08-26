// Description: This file contains the functions for the menu page.

document.addEventListener('DOMContentLoaded', function() {
    const username = localStorage.getItem("currentUsername");
    if (username) {
        const nameDisplay = document.getElementById("nameDisplay");
        nameDisplay.textContent = username;
    }
});

function logout() {
    // Clear the current user's session data
    localStorage.removeItem("currentUsername");
    // Redirect to the start page
    window.location.href = "index.html";
}
