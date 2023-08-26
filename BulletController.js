import Bullet from "./Bullet.js";

export default class BulletController {
  constructor(canvas, maxBulletsAtATime, bulletColor, soundEnabled) {
    this.canvas = canvas;
    this.maxBulletsAtATime = maxBulletsAtATime;
    this.bulletColor = bulletColor;
    this.soundEnabled = soundEnabled;

    this.initializeProperties();
    this.loadShootSound();
  }

  initializeProperties() {
    this.bullets = [];
    this.timeTillNextBulletAllowed = 0;
  }

  loadShootSound() {
    this.shootSound = new Audio("sounds/psst.mp3");
    this.shootSound.volume = 0.2;
  }

  draw(ctx) {
    this.removeOutOfBoundsBullets();
    this.bullets.forEach((bullet) => bullet.draw(ctx));
    this.decrementBulletCooldown();
  }

  removeOutOfBoundsBullets() {
    this.bullets = this.bullets.filter(
      (bullet) => bullet.y + bullet.width > 0 && bullet.y <= this.canvas.height
    );
  }

  decrementBulletCooldown() {
    if (this.timeTillNextBulletAllowed > 0) {
      this.timeTillNextBulletAllowed--;
    }
  }

  collideWith(sprite) {
    const bulletThatHitSpriteIndex = this.bullets.findIndex((bullet) =>
      bullet.collideWith(sprite)
    );

    if (bulletThatHitSpriteIndex >= 0) {
      this.bullets.splice(bulletThatHitSpriteIndex, 1);
      return true;
    }

    return false;
  }

  shoot(x, y, velocity, timeTillNextBulletAllowed = 0) {
    if (this.canShootBullet()) {
      this.addBullet(x, y, velocity);
      this.playShootSound();
      this.timeTillNextBulletAllowed = timeTillNextBulletAllowed;
    }
  }

  canShootBullet() {
    return (
      this.timeTillNextBulletAllowed <= 0 &&
      this.bullets.length < this.maxBulletsAtATime
    );
  }

  addBullet(x, y, velocity) {
    const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletColor);
    this.bullets.push(bullet);
  }

  playShootSound() {
    if (this.soundEnabled) {
      this.shootSound.currentTime = 0;
      this.shootSound.play();
    }
  }

  reset() {
    this.initializeProperties();
  }
}
