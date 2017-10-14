/**
 *  Food
 */

export default class Food {
  constructor(position, value, game) {
    this.position = position;
    this.value = value;
    this.game = game;
  }

  getPosition() {
    return this.position;
  }

  draw() {
    console.log(this.position, this.game.grid.size);
    const size = this.game.grid.getCellSize();

    this.game.context.beginPath();
    this.game.context.rect(
      this.position.x * size + size / 4,
      this.position.y * size + size / 4,
      size / 2,
      size / 2
    );
    this.game.context.fillStyle = "rgb(255, 75, 0)";
    this.game.context.fill();
    this.game.context.closePath();
  }
}
