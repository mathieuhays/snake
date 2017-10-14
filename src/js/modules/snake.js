/**
 *  Snake
 */

import Point from "./point";
import filter from "lodash/filter";

export const MOVE_DOWN = [ 0, 1 ];
export const MOVE_UP = [ 0, -1 ];
export const MOVE_RIGHT = [ 1, 0 ];
export const MOVE_LEFT = [ -1, 0 ];

export class Snake {
  constructor(game, size) {
    this.body = null;
    this.speed = null;
    this.position = null;
    this.game = game;
    this.context = this.game.context;
    this.size = size;
    this.constraint = null;
    this.hasEaten = false;

    this.reset();
  }

  reset() {
    this.body = [];
    this.speed = new Point(0, 0);
    this.position = new Point(0, 0);
    this.hasEaten = false;
  }

  getCurrentDirection() {
    return [ this.speed.x, this.speed.y ];
  }

  isSameDirection(directionA, directionB) {
    return (
      directionA[0] === directionB[0] &&
      directionA[1] === directionB[1]
    );
  }

  isValidMove(direction) {
    const currentDirection = this.getCurrentDirection();

    if (this.isSameDirection(MOVE_DOWN, direction) &&
      this.isSameDirection(MOVE_UP, currentDirection)) {
      return false;
    }

    if (this.isSameDirection(MOVE_UP, direction) &&
      this.isSameDirection(MOVE_DOWN, currentDirection)) {
      return false;
    }

    if (this.isSameDirection(MOVE_LEFT, direction) &&
      this.isSameDirection(MOVE_RIGHT, currentDirection)) {
      return false;
    }

    if (this.isSameDirection(MOVE_RIGHT, direction) &&
      this.isSameDirection(MOVE_LEFT, currentDirection)) {
      return false;
    }

    return true;
  }

  move(dir) {
    if (!this.isValidMove(dir)) {
      return;
    }

    this.speed.x = dir[0];
    this.speed.y = dir[1];
  }

  setSize(size) {
    this.size = size;
  }

  setConstraint(min, max) {
    this.constraint = {
      min,
      max
    };
  }

  enforceConstraint() {
    if (!this.constraint) {
      return false;
    }

    if (this.position.x < this.constraint.min) {
      this.position.x = this.constraint.min;
      return true;
    }

    if (this.position.x > this.constraint.max) {
      this.position.x = this.constraint.max;
      return true;
    }

    if (this.position.y < this.constraint.min) {
      this.position.y = this.constraint.min;
      return true;
    }

    if (this.position.y > this.constraint.max) {
      this.position.y = this.constraint.max;
      return true;
    }

    return false;
  }

  eat() {
    this.hasEaten = true;
  }

  hitsTail() {
    if (!this.body.length) {
      return false;
    }

    for (let i = 0, len = this.body.length; i < len; i++) {
      if (this.position.equals(this.body[i])) {
        return true;
      }
    }

    return false;
  }

  update(delta) {
    //. update position

    // update head position
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    if (this.game.food.length) {
      for (let i = 0, len = this.game.food.length; i < len; i++) {
        if (this.position.equals(this.game.food[ i ].getPosition())) {
          this.hasEaten = true;
          this.game.food[ i ] = null;
          break;
        }
      }

      this.game.food = filter(this.game.food);
    }

    if (!this.enforceConstraint()) {
      // only update body if we haven't it a constraint
      // usually snake would die though

      // remove last element of the tail if the snake didn't eat
      if (this.body.length && !this.hasEaten) {
        this.body.pop();
      }

      if (this.hitsTail()) {
        this.game.gameover();
      }

      // add head to the body
      this.body.unshift(new Point(this.position.x, this.position.y));
    } else {
      this.game.gameover();
    }

    // reset
    this.hasEaten = false;
  }

  draw() {
    if (this.body.length) {
      this.context.fillStyle = "#fff";

      for (let i = this.body.length - 1; i >= 0; i--) {
        if (i === 0) {
          this.drawHead(this.body[i]);
        } else {
          this.drawBodyPart(this.body[i]);
        }
      }
    }
  }

  drawBodyPart(point) {
    this.context.beginPath();
    this.context.fillStyle = "#0f0";
    this.context.strokeStyle = "#666";

    this.context.rect(
      point.x * this.size + 1,
      point.y * this.size + 1,
      this.size - 2,
      this.size - 2
    );

    this.context.fill();
    this.context.stroke();
    this.context.closePath();
  }

  drawHead(point) {
    this.context.beginPath();
    this.context.fillStyle = "#f00";
    this.context.strokeStyle = "#333";

    this.context.rect(
      point.x * this.size + 1,
      point.y * this.size + 1,
      this.size - 2,
      this.size - 2
    );

    this.context.fill();
    this.context.stroke();
    this.context.closePath();
  }
}
