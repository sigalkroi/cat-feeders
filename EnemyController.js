import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";

function generateRandomMap(rows, cols, values) {
  let map = [];
  for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
          row.push(values[Math.floor(Math.random() * values.length)]);
      }
      map.push(row);
  }
  return map;
}

export default class EnemyController {
  cartMap = generateRandomMap(2, 4, [1, 2, 3]);
  catRows = [];

  currentDirection = MovingDirection.right;
  xVelocity = 0;
  yVelocity = 0;
  defaultXVelocity = 1;
  defaultYVelocity = 1;
  moveDownTimerDefault = 30;
  moveDownTimer = this.moveDownTimerDefault;
  fireBulletTimerDefault = 100;
  fireBulletTimer = this.fireBulletTimerDefault;

  constructor(canvas, enemyBulletController, playerBulletController) {
    this.canvas = canvas;
    this.enemyBulletController = enemyBulletController;
    this.playerBulletController = playerBulletController;

    this.enemyDeathSound = new Audio("sounds/meow.mp3");
    this.enemyDeathSound.volume = 0.1;

    this.createEnemies();
  }

  draw(ctx) {
    this.decrementMoveDownTimer();
    this.updateVelocityAndDirection();
    this.collisionDetection();
    this.drawEnemies(ctx);
    this.resetMoveDownTimer();
    this.fireBullet();
  }

  collisionDetection() {
    let enemiesHit = 0; // Initialize a counter for enemies hit

    this.catRows.forEach((enemyRow) => {
        enemyRow.forEach((enemy, enemyIndex) => {
            if (this.playerBulletController.collideWith(enemy)) {
                this.enemyDeathSound.currentTime = 0;
                this.enemyDeathSound.play();
                enemyRow.splice(enemyIndex, 1);
                enemiesHit++; // Increment the counter when an enemy is hit
            }
        });
    });

    this.catRows = this.catRows.filter((enemyRow) => enemyRow.length > 0);

    return enemiesHit; // Return the number of enemies hit
}
resetEnemies(fireRate, speedMultiplier, rows, cols) {
  // Regenerate the cartMap for the new level
  this.cartMap = generateRandomMap(rows, cols, [1, 2, 3]);
  // Clear the existing enemies
  this.catRows = [];
  
  // Create new enemies for the new level
  this.createEnemies();
  
  // Adjust the fire rate for the new level
  this.fireBulletTimerDefault = fireRate;
  this.fireBulletTimer = this.fireBulletTimerDefault;
  
  // Adjust the speed of the enemies based on the speedMultiplier
  this.defaultXVelocity *= speedMultiplier;
  this.defaultYVelocity *= speedMultiplier;
  
  // Reset the movement properties
  this.currentDirection = MovingDirection.right;
  this.xVelocity = 0;
  this.yVelocity = 0;
  this.moveDownTimer = this.moveDownTimerDefault;
}


  fireBullet() {
    this.fireBulletTimer--;
    if (this.fireBulletTimer <= 0) {
      this.fireBulletTimer = this.fireBulletTimerDefault;
      const allEnemies = this.catRows.flat();
      const enemyIndex = Math.floor(Math.random() * allEnemies.length);
      const enemy = allEnemies[enemyIndex];
      this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3);
    }
  }

  resetMoveDownTimer() {
    if (this.moveDownTimer <= 0) {
      this.moveDownTimer = this.moveDownTimerDefault;
    }
  }

  decrementMoveDownTimer() {
    if (
      this.currentDirection === MovingDirection.downLeft ||
      this.currentDirection === MovingDirection.downRight
    ) {
      this.moveDownTimer--;
    }
  }

  updateVelocityAndDirection() {
    for (const enemyRow of this.catRows) {
      if (this.currentDirection == MovingDirection.right) {
        this.xVelocity = this.defaultXVelocity;
        this.yVelocity = 0;
        const rightMostEnemy = enemyRow[enemyRow.length - 1];
        if (rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width) {
          this.currentDirection = MovingDirection.downLeft;
          break;
        }
      } else if (this.currentDirection === MovingDirection.downLeft) {
        if (this.moveDown(MovingDirection.left)) {
          break;
        }
      } else if (this.currentDirection === MovingDirection.left) {
        this.xVelocity = -this.defaultXVelocity;
        this.yVelocity = 0;
        const leftMostEnemy = enemyRow[0];
        if (leftMostEnemy.x <= 0) {
          this.currentDirection = MovingDirection.downRight;
          break;
        }
      } else if (this.currentDirection === MovingDirection.downRight) {
        if (this.moveDown(MovingDirection.right)) {
          break;
        }
      }
    }
  }

  moveDown(newDirection) {
    this.xVelocity = 0;
    this.yVelocity = this.defaultYVelocity;
    if (this.moveDownTimer <= 0) {
      this.currentDirection = newDirection;
      return true;
    }
    return false;
  }

  drawEnemies(ctx) {
    this.catRows.flat().forEach((enemy) => {
      enemy.move(this.xVelocity, this.yVelocity);
      enemy.draw(ctx);
    });
  }

  happy = () => {};

  createEnemies() {
    this.cartMap.forEach((row, rowIndex) => {
      this.catRows[rowIndex] = [];
      row.forEach((enemyNubmer, enemyIndex) => {
        if (enemyNubmer > 0) {
          this.catRows[rowIndex].push(
            new Enemy(enemyIndex * 50, rowIndex * 35, enemyNubmer)
          );
        }
      });
    });
  }

  collideWith(sprite) {
    return this.catRows.flat().some((enemy) => enemy.collideWith(sprite));
  }
}
