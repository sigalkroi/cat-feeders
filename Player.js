export default class Player {
  constructor(canvas, velocity, bulletController) {
    this.canvas = canvas;
    this.velocity = velocity;
    this.bulletController = bulletController;

    this.initializeProperties();
    this.loadImage();
    this.addEventListeners();
  }

  initializeProperties() {
    this.rightPressed = false;
    this.leftPressed = false;
    this.shootPressed = false;

    this.x = this.canvas.width / 2;
    this.y = this.canvas.height - 75;
    this.width = 65;
    this.height = 48;
  }

  loadImage() {
    this.image = new Image();
    this.image.src = "images/kid.png";
  }

  addEventListeners() {
    document.addEventListener("keydown", this.handleKeyDown);
    document.addEventListener("keyup", this.handleKeyUp);
  }

  draw(ctx) {
    if (this.shootPressed) {
      this.shootBullet();
    }
    this.move();
    this.checkWallCollisions();
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  checkWallCollisions() {
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > this.canvas.width - this.width) {
      this.x = this.canvas.width - this.width;
    }
  }

  move() {
    if (this.rightPressed) {
      this.x += this.velocity;
    } else if (this.leftPressed) {
      this.x -= this.velocity;
    }
  }

  shootBullet() {
    this.bulletController.shoot(this.x + this.width / 2, this.y, 4, 10);
  }

  handleKeyDown = (event) => {
    switch (event.code) {
      case "ArrowRight":
        this.rightPressed = true;
        break;
      case "ArrowLeft":
        this.leftPressed = true;
        break;
      case "Space":
        this.shootPressed = true;
        break;
      default:
        break;
    }
  };

  handleKeyUp = (event) => {
    switch (event.code) {
      case "ArrowRight":
        this.rightPressed = false;
        break;
      case "ArrowLeft":
        this.leftPressed = false;
        break;
      case "Space":
        this.shootPressed = false;
        break;
      default:
        break;
    }
  };

  reset() {
    this.initializeProperties();
  }
}
