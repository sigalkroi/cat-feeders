import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";

class EnemyController {
  constructor(canvas, enemyBulletController, playerBulletController) {
    this.canvas = canvas;
    this.enemyBulletController = enemyBulletController;
    this.playerBulletController = playerBulletController;

    this.enemyDeathSound = new Audio("sounds/meow.mp3");
    this.enemyDeathSound.volume = 0.1;

    this.initializeProperties();
    this.createEnemies();
  }

  initializeProperties() {
    this.cartMap = this.generateRandomMap(4, 4, [1, 2, 3]);
    this.catRows = [];
    this.currentDirection = MovingDirection.right;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.defaultXVelocity = 1;
    this.defaultYVelocity = 1;
    this.moveDownTimerDefault = 30;
    this.moveDownTimer = this.moveDownTimerDefault;
    this.fireBulletTimerDefault = 100;
    this.fireBulletTimer = this.fireBulletTimerDefault;
  }

  generateRandomMap(rows, cols, values) {
    return Array.from({ length: rows }, () => 
      Array.from({ length: cols }, () => 
        values[Math.floor(Math.random() * values.length)]
      )
    );
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
    let enemiesHit = 0;
    this.catRows.forEach((enemyRow) => {
      enemyRow.forEach((enemy, enemyIndex) => {
        if (this.playerBulletController.collideWith(enemy)) {
          this.playEnemyDeathSound();
          enemyRow.splice(enemyIndex, 1);
          enemiesHit++;
        }
      });
    });
    this.catRows = this.catRows.filter(row => row.length > 0);
    return enemiesHit;
  }

  playEnemyDeathSound() {
    this.enemyDeathSound.currentTime = 0;
    this.enemyDeathSound.play();
  }

  resetEnemies(fireRate, speedMultiplier, rows, cols) {
    this.cartMap = this.generateRandomMap(rows, cols, [1, 2, 3]);
    this.catRows = [];
    this.createEnemies();
    this.fireBulletTimerDefault = fireRate;
    this.fireBulletTimer = this.fireBulletTimerDefault;
    this.defaultXVelocity *= speedMultiplier;
    this.defaultYVelocity *= speedMultiplier;
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

  createEnemies() {
    this.cartMap.forEach((row, rowIndex) => {
      this.catRows[rowIndex] = row
        .map((enemyNumber, enemyIndex) => 
          enemyNumber > 0 ? new Enemy(enemyIndex * 50, rowIndex * 35, enemyNumber) : null
        )
        .filter(enemy => enemy !== null);
    });
  }

  collideWith(sprite) {
    return this.catRows.flat().some((enemy) => enemy.collideWith(sprite));
  }
}

export default EnemyController;
