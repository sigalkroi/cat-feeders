// Description: This file contains the functions for the menu page.

const nameDisplay = document.getElementById("nameDisplay");
const nameDisplayHebrew = document.getElementById("nameDisplayHebrew");
const playerName = localStorage.getItem("currentUsername");

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

// Get the modal and the close button
var modal = document.getElementById("instructionsModal");
var closeButton = document.getElementsByClassName("close")[0];

// Show the modal
function showInstructions() {
  modal.style.display = "block";
}

// Hide the modal when the close button is clicked
closeButton.onclick = function() {
  modal.style.display = "none";
}

// Hide the modal when anywhere outside of the modal is clicked
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function switchLanguage(lang) {
    // Set the direction
    if (lang === 'he') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  
    // Translate the text
    for (let key in translations[lang]) {
      const elements = document.querySelectorAll(`[data-translate="${key}"]`);
      elements.forEach(element => {
        if (element.tagName === 'BUTTON') {
          element.innerHTML = translations[lang][key];
        } else {
          element.textContent = translations[lang][key];
        }
      });
    }
  }
  