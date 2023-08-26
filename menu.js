document.addEventListener('DOMContentLoaded', initPage);

function initPage() {
    updateUsernameDisplay();
    setupModalEvents();
}

function updateUsernameDisplay() {
    const nameDisplay = document.getElementById("nameDisplay");
    const playerName = localStorage.getItem("currentUsername");
    if (playerName) {
        nameDisplay.textContent = playerName;
    }
}

function logout() {
    localStorage.removeItem("currentUsername");
    navigateTo("index.html");
}

function navigateTo(page) {
    window.location.href = page;
}

function setupModalEvents() {
    const modal = document.getElementById("instructionsModal");
    const closeButton = document.querySelector(".close");

    closeButton.addEventListener("click", closeModal);

    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.getElementById("instructionsModal");
    modal.style.display = "none";
}

function showInstructions() {
    const modal = document.getElementById("instructionsModal");
    modal.style.display = "block";
}

function switchLanguage(lang) {
    setDirection(lang);
    translateText(lang);
}

function setDirection(lang) {
    if (lang === 'he') {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }
}

function translateText(lang) {
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
