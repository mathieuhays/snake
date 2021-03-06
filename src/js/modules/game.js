/**
 *  Game Instance
 */

import Grid from "./grid";
import { Snake, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT, MOVE_UP, MOVE_IDLE } from "./snake";
import Food from "./food";
import { getBackingStorePixelRatio, getDevicePixelRatio, on } from "./utils";
import { onKeyPress, ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, ARROW_UP } from "./keyboard";
import random from "lodash/random";
import forIn from "lodash/forIn";
import Point from "./point";
import Gameover from "./gameover";

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.setupDone = false;
    this.isRunning = false;
    this.animationFrame = null;
    this.grid = new Grid(this, 21);
    this.snake = new Snake(this, 20);
    this.framerate = null;
    this.frameDelta = null;
    this.timer = null;
    this.food = [];
    this.ratio = 1;
    this.isGameOver = false;
    this.screens = {
      gameover: new Gameover(document.querySelector(".js-gameover"))
    };

    this.setFramerate(8); // 24 frame /sec

    this.onResize = this.onResize.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.run = this.run.bind(this);
  }

  bootstrap() {
    // set canvas size & stuff
    this.onResize();

    // setup listeners & stuff
    this.init();
  }

  init() {
    window.addEventListener("resize", this.onResize);
    document.addEventListener("visibilitychange", this.onVisibilityChange);

    this.registerActions();

    if (!this.setupDone) {
      this.setup();
    }
  }

  closeScreens() {
    forIn(this.screens, (screen) => {
      screen.disable();
    });
  }

  reset() {
    this.closeScreens();
    this.snake.reset();
    this.food = [];
    this.isGameOver = false;
  }

  registerActions() {
    on(".js-start", "click", () => {
      console.log('start trigger');

      this.reset();
      this.start();
    });
  }

  onResize() {
    const pixelRatio = getDevicePixelRatio();
    const backingStoreRatio = getBackingStorePixelRatio(this.context);
    this.ratio = pixelRatio / backingStoreRatio;

    const parentSize = this.canvas.parentElement.offsetWidth;

    this.canvas.height = parentSize * this.ratio;
    this.canvas.width = parentSize * this.ratio;

    this.canvas.style.height = `${parentSize}px`;
    this.canvas.style.width = `${parentSize}px`;

    this.context.scale(this.ratio, this.ratio);

    this.snake.setSize(this.grid.getCellSize());
    this.snake.setConstraint(0, this.grid.size - 1);
  }

  onVisibilityChange() {
    if (document.hidden) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    this.isRunning = true;
    this.run();
  }

  stop() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationFrame);
  }

  gameover() {
    this.isGameOver = true;
    this.stop();
    this.snake.move(MOVE_IDLE);

    this.screens.gameover.enable();

    // @TODO add gameover animation
  }

  // handle current frame and call the next one
  run() {
    if (this.shouldUpdate()) {
      // Update first
      this.update();

      // Draw what have been updated
      this.draw();
    }

    if (this.isRunning) {
      this.animationFrame = requestAnimationFrame(this.run);
    }
  }

  setup() {
    this.timer = Date.now();

    // handle keyboard snake controls.
    onKeyPress([ ARROW_UP, ARROW_RIGHT, ARROW_LEFT, ARROW_DOWN ], (key) => {
      if (key === ARROW_DOWN) {
        this.snake.move(MOVE_DOWN);
      } else if (key === ARROW_UP) {
        this.snake.move(MOVE_UP);
      } else if (key === ARROW_LEFT) {
        this.snake.move(MOVE_LEFT);
      } else if (key === ARROW_RIGHT) {
        this.snake.move(MOVE_RIGHT);
      }
    });
  }

  setFramerate(framerate) {
    this.framerate = framerate;
    this.frameDelta = 1000 / this.framerate;
  }

  shouldUpdate() {
    const delta = Date.now() - this.timer;
    const shouldUpdate = delta > this.frameDelta;

    if (shouldUpdate) {
      this.timer = Date.now();
    }

    return shouldUpdate;
  }

  update() {
    // Only update game elements if we are playing
    if (this.isGameOver) {
      return;
    }

    this.snake.update(this.frameDelta);

    if (!this.food.length) {
      this.food.push(new Food(this.generateRandomPoint(), 1, this));
    }
  }

  draw() {
    // Reset canvas
    this.context.globalCompositeOperation = "source-over";
    this.context.fillStyle = "#333";
    this.context.fillRect(0, 0, window.innerWidth, window.innerHeight);

    // Draw all the things
    this.grid.draw();

    this.snake.draw();

    this.food.forEach((food) => {
      food.draw();
    });
  }

  getFoodItems() {
    return this.food;
  }

  positionIsOccupied(point) {
    for (let i = 0, len = this.snake.body.length; i < len; i++) {
      if (point.equals(this.snake.body[i])) {
        return true;
      }
    }

    return false;
  }

  generateRandomPoint() {
    let point;

    do {
      point = new Point(
        random(0, this.grid.size - 1),
        random(0, this.grid.size - 1)
      );
    } while (this.positionIsOccupied(point));

    return point;
  }
}
