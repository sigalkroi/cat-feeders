function submitUsername() {
    let usernameInput = document.getElementById("username");
    let username = usernameInput.value.charAt(0).toUpperCase() + usernameInput.value.slice(1).toLowerCase();
    if (!localStorage.getItem(username)) {
        localStorage.setItem(username, JSON.stringify({ currentScore: 0, topScore:0, scoreHistory: [] }));
    }
    localStorage.setItem("currentUsername", username);
    window.location.href = "menu.html";
}
