// Description: This file is the main file for the game canvas.

import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const background = new Image();
background.src = "images/background.avif";

const levelMap = {
  1: {
    rows: 4,
    cols: 4,
    fireRate: 100,
    speedMultiplier: 1
  },
  2: {
    rows: Math.round(4 * 1.2), // 20% more rows for level 2
    cols: Math.round(4 * 1.5), // 50% more columns for level 2
    fireRate: 75,
    speedMultiplier: 1.2
  },
  3: {
    rows: Math.round(4 * 1.44), // 20% more rows than level 2
    cols: Math.round(4 * 2.25), // 50% more columns than level 2
    fireRate: 50,
    speedMultiplier: 1.5
  }
  // ... add more levels as needed
};


const playerBulletController = new BulletController(canvas, 10, "blue", true);
const enemyBulletController = new BulletController(canvas, 4, "black", false);
const enemyController = new EnemyController(
  canvas,
  enemyBulletController,
  playerBulletController
);
const player = new Player(canvas, 3, playerBulletController);

const playerName = localStorage.getItem("currentUsername");

let isGameOver = false;
let didWin = false;
let score = 0;
let level = 1;

function displayPlayerInfo() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Name: ${playerName}`, 10, 25); // Displaying name at the top-left corner
  ctx.fillText(`Score: ${score}`, 10, 50); // Displaying score just below the name
  ctx.fillText(`Level: ${level}`, 10, 75); // Displaying level just below the score
}

function game() {
  checkGameOver();
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  displayGameOver();
  displayPlayerInfo(); // Display the player's name and score
  if (!isGameOver) {
    enemyController.draw(ctx);
    player.draw(ctx);
    playerBulletController.draw(ctx);
    enemyBulletController.draw(ctx);
    // Update the score based on the number of enemies hit
    score += enemyController.collisionDetection() * 10;
  }
}


function displayGameOver() {
  if (isGameOver) {
    let text = didWin ? "You Win" : "Game Over";
    let textOffset = didWin ? 3.5 : 5;

    ctx.fillStyle = "blue";
    ctx.font = "70px Arial";
    ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);
  }
}

function saveScore(username, score) {
  // Retrieve the existing data for the user or set default structure
  let userData = JSON.parse(localStorage.getItem(username) || '{"currentScore":0,"topScore":0,"scoreHistory":[]}');
  userData.currentScore = score;
  userData.scoreHistory.push(userData.currentScore);

  // Update topScore if currentScore is higher
  if (score > userData.topScore) {
    userData.topScore = score;
  }

  localStorage.setItem(username, JSON.stringify(userData));
}

function updateLeaderboard() {
  // Retrieve all users' data from localStorage
  let keys = Object.keys(localStorage);
  let leaderboardData = [];

  keys.forEach(key => {
    try {
      let userData = JSON.parse(localStorage.getItem(key));
      if (userData && userData.topScore !== undefined) {
        leaderboardData.push({
          name: key,
          score: userData.topScore
        });
      }
    } catch (e) {
      console.warn(`Error parsing data for key "${key}": ${e.message}`);
    }
  });

  // Sort the leaderboard data by score in descending order
  leaderboardData.sort((a, b) => b.score - a.score);

  // Keep only the top 10 scores
  leaderboardData = leaderboardData.slice(0, 5);

  // Save the sorted leaderboard data to localStorage
  localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));
}

function nextLevel() {
  score += 50*level; // Bonus points for completing a level
  if (level > 3) { // Assuming 3 levels
    isGameOver = true;
    didWin = true;
  } else {
    // Reset the game state for the next level
    let levelConfig = levelMap[level];
    if (levelConfig) {
      enemyController.resetEnemies(levelConfig.fireRate, levelConfig.speedMultiplier, levelConfig.rows, levelConfig.cols);
    }
  }
}

function checkGameOver() {
  if (isGameOver) {
    return;
  }

  if (enemyBulletController.collideWith(player)) {
    isGameOver = true;
  }

  if (enemyController.collideWith(player)) {
    isGameOver = true;
  }

  if (enemyController.catRows.length === 0) {
    level++;
    nextLevel();
  }

  if (isGameOver) {
    saveScore(playerName, score); // Save the player's score
    updateLeaderboard(); // Update the leaderboard data in localStorage
  }
}

setInterval(game, 1000 / 60);
