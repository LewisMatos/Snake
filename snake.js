'use strict';
class Snake {
  constructor(canvas, fps = 20, height = 700, width = 700, snakeLength = 5, cellSize = 20) {
    this.canvas = canvas;
    this.canvas.style.height = `${height}px`;
    this.canvas.style.width = `${width}px`;
    this.ctx = canvas.getContext('2d');

    this.highscore = 0;
    this.foodColors = ['#2D728F', '#3B8EA5', '#F5EE9E', '#F49E4C'];

    this.ateFoodSound = this.sound('./public/powerUp7.ogg');
    this.gameOverSound = this.sound('./public/twoTone2.ogg');

    this.FPS = fps;
    this.CELLSIZE = cellSize;
    this.SNAKELENGTH = snakeLength;
    this.SNAKECOLOR = '#CFDEF3';

    window.addEventListener('keydown', evt => this.keyDownEvent(evt));
  }

  /*
  Initializes the board and resets board on game loss.
  */
  init() {
    this.score = 0;
    this.randColor = this.randomFoodColor();
    this.direction = 'right';

    this.snake = [];
    this.createSnake();
    this.foodPosition = this.createFood();
  }

  /*
  Checks for collisions and updates
  */
  update() {
    if (this.checkBoundaryCollision() || this.checkSnakeCollision()) {
      if (this.score > this.highscore) {
        this.highscore = this.score;
        this.drawScore('highscore');
      }
      this.gameOverSound.play();
      this.init();
    }
    this.checkFoodCollision();
  }

  /*
  Redraws board every 20fps. Increase fps for difficulty
 */

  draw() {
    this.drawBackground();
    this.drawScore('score');
    this.drawFood();
    this.drawSnake();
    this.moveSnake();
  }

  drawBackground() {
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  createCell(x, y, fillStyle) {
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(x, y, this.CELLSIZE, this.CELLSIZE);
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(x, y, this.CELLSIZE, this.CELLSIZE);
  }

  drawScore(className) {
    document.getElementsByClassName(className)[0].innerHTML = this.score;
  }

  createFood() {
    return {
      x: Math.floor(Math.random() * (this.canvas.width / this.CELLSIZE)) * this.CELLSIZE,
      y: Math.floor(Math.random() * (this.canvas.height / this.CELLSIZE)) * this.CELLSIZE,
    };
  }

  drawFood() {
    this.createCell(this.foodPosition.x, this.foodPosition.y, this.randColor);
  }

  drawSnake() {
    let snake = this.snake;
    snake.forEach(cell => {
      this.createCell(cell.x, cell.y, this.SNAKECOLOR);
    });
  }

  createSnake() {
    for (let i = this.SNAKELENGTH; i > 0; i--) {
      this.snake.push({ x: i * this.CELLSIZE, y: 10 * this.CELLSIZE });
    }
  }

  moveSnake() {
    let direction = this.direction;
    let { x, y } = this.snake[0];
    let cellSize = this.CELLSIZE;

    switch (direction) {
      case 'right':
        x += cellSize;
        break;
      case 'left':
        x -= cellSize;
        break;
      case 'down':
        y += cellSize;
        break;
      case 'up':
        y -= cellSize;
        break;
      default:
        break;
    }
    //Remove tail, make it new head
    this.snake.pop();
    this.snake.unshift({ x, y });
  }

  checkSnakeCollision() {
    let snake = this.snake;
    let snakeHead = this.snake[0];
    //start at 1 to avoid head to collide with itself
    for (let i = 1; i < snake.length; i++) {
      if (snakeHead.x === snake[i].x && snakeHead.y === snake[i].y) {
        return true;
      }
    }
    return false;
  }

  checkBoundaryCollision() {
    let { x, y } = this.snake[0];
    if (x < 0 || y < 0 || x > this.canvas.width - this.CELLSIZE || y > this.canvas.height - this.CELLSIZE) {
      return true;
    }
  }

  checkFoodCollision() {
    let snakeHead = this.snake[0];
    let snake = this.snake;
    let foodPosition = this.foodPosition;

    if (snakeHead.x === foodPosition.x && snakeHead.y === foodPosition.y) {
      // console.log('ate food');
      this.ateFoodSound.play();
      snake.push({ x: foodPosition.x, y: foodPosition.y });
      this.foodPosition = this.createFood();
      this.randColor = this.randomFoodColor();
      this.score++;
    }
  }

  randomFoodColor() {
    return this.foodColors[Math.floor(Math.random() * this.foodColors.length)];
  }

  keyDownEvent(e) {
    let keycode = e.which;
    let direction = this.direction;

    if (keycode === 37 && direction !== 'right') {
      direction = 'left';
    } else if (keycode === 38 && direction !== 'down') {
      direction = 'up';
    } else if (keycode === 39 && direction !== 'left') {
      direction = 'right';
    } else if (keycode === 40 && direction !== 'up') {
      direction = 'down';
    }

    this.direction = direction;
    e.preventDefault();
  }

  /*
    https://www.w3schools.com/graphics/game_sound.asp
  */
  sound(src) {
    let sound = document.createElement('audio');
    sound.src = src;
    sound.setAttribute('preload', 'auto');
    sound.setAttribute('controls', 'none');
    sound.style.display = 'none';
    document.body.appendChild(sound);
    return sound;
  }

  /*
    http://creativejs.com/resources/requestanimationframe/index.html
  */
  start() {
    let fps = this.FPS;
    this.init();
    let animate = () => {
      setTimeout(() => {
        this.update();
        this.draw();
        requestAnimationFrame(animate);
      }, 1000 / fps);
    };
    animate();
  }
}

window.onload = () => {
  let snake = new Snake(document.getElementById('canvas'));
  debugger;
  snake.start();
};
