import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";

const restartGameButton = document.getElementById("restartGameButton");

restartGameButton.addEventListener("click", restartGame);

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const GAME_TICK_RATE = 1000 / 60;

const canvas = initializeCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
const ctx = canvas.getContext("2d");
const background = loadBackgroundImage("images/background.avif");

const levelMap = initializeLevelMap();

const playerBulletController = new BulletController(canvas, 10, "blue", true);
const enemyBulletController = new BulletController(canvas, 4, "black", false);
const enemyController = new EnemyController(canvas, enemyBulletController, playerBulletController);
const player = new Player(canvas, 3, playerBulletController);

let gameState = {
    playerName: localStorage.getItem("currentUsername"),
    isGameOver: false,
    didWin: false,
    score: 0,
    level: 1
};

function initializeCanvas(width, height) {
    const canvas = document.getElementById("game");
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function loadBackgroundImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}

function initializeLevelMap() {
    return {
        1: { rows: 4, cols: 4, fireRate: 100, speedMultiplier: 1 },
        2: { rows: Math.round(4 * 1.2), cols: Math.round(4 * 1.5), fireRate: 75, speedMultiplier: 1.2 },
        3: { rows: Math.round(4 * 1.44), cols: Math.round(4 * 2.25), fireRate: 50, speedMultiplier: 1.5 }
    };
}

function restartGame() {
    // Reset game state
    gameState.isGameOver = false;
    gameState.didWin = false;
    gameState.score = 0;
    gameState.level = 1;

    // Reset player state (assuming you have a reset method in the Player class)
    player.reset();

    // Reset enemy state
    const levelConfig = levelMap[gameState.level];
    if (levelConfig) {
        enemyController.resetEnemies(levelConfig.fireRate, levelConfig.speedMultiplier, levelConfig.rows, levelConfig.cols);
    }

    // Reset bullet controllers if needed
    playerBulletController.reset();
    enemyBulletController.reset();
}


function gameLoop() {
  if (gameState.isGameOver) {
      displayGameOver();
      displayPlayerInfo();
      return; // Exit the game loop if the game is over
  }

  checkGameOver();
  renderGame();
  updateGame();
}

function renderGame() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    displayGameOver();
    displayPlayerInfo();
    enemyController.draw(ctx);
    player.draw(ctx);
    playerBulletController.draw(ctx);
    enemyBulletController.draw(ctx);
}

function updateGame() {
    gameState.score += enemyController.collisionDetection() * 10;
}

function displayGameOver() {
    if (gameState.isGameOver) {
        const text = gameState.didWin ? "You Win" : "Game Over";
        const textOffset = gameState.didWin ? 3.5 : 5;
        ctx.fillStyle = "blue";
        ctx.font = "70px Arial";
        ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);
    }
}

function displayPlayerInfo() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Name: ${gameState.playerName}`, 10, 25);
    ctx.fillText(`Score: ${gameState.score}`, 10, 50);
    ctx.fillText(`Level: ${gameState.level}`, 10, 75);
}

function checkGameOver() {
    if (gameState.isGameOver) return;

    if (enemyBulletController.collideWith(player) || enemyController.collideWith(player)) {
        gameState.isGameOver = true;
    }

    if (enemyController.catRows.length === 0) {
        gameState.level++;
        nextLevel();
    }

    if (gameState.isGameOver) {
        saveScore(gameState.playerName, gameState.score);
        updateLeaderboard();
    }
}

function nextLevel() {
    if (gameState.level > 3) {
        gameState.isGameOver = true;
        gameState.didWin = true;
    } else {
        const levelConfig = levelMap[gameState.level];
        if (levelConfig) {
            enemyController.resetEnemies(levelConfig.fireRate, levelConfig.speedMultiplier, levelConfig.rows, levelConfig.cols);
            gameState.score += 50 * gameState.level;
        }
    }
}

function saveScore(username, score) {
    const userData = JSON.parse(localStorage.getItem(username) || '{"currentScore":0,"topScore":0,"scoreHistory":[]}');
    userData.currentScore = score;
    userData.scoreHistory.push(score);
    if (score > userData.topScore) userData.topScore = score;
    localStorage.setItem(username, JSON.stringify(userData));
}

function updateLeaderboard() {
    const leaderboardData = Object.keys(localStorage)
        .map(key => {
            try {
                const userData = JSON.parse(localStorage.getItem(key));
                return userData && userData.topScore !== undefined ? { name: key, score: userData.topScore } : null;
            } catch (e) {
                console.warn(`Error parsing data for key "${key}": ${e.message}`);
                return null;
            }
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
}

setInterval(gameLoop, GAME_TICK_RATE);
 