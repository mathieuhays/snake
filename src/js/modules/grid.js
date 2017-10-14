export default class Grid {
  constructor(context, size) {
    this.context = context;
    this.size = size;
  }

  draw() {
    this.context.strokeStyle = "#000";

    for (let i = 0; i <= this.size; i++) {
      this.drawLine("x", i * this.getCellSize());
      this.drawLine("y", i * this.getCellSize());
    }
  }

  drawLine(axis, coordinate) {
    let originX = 0;
    let originY = 0;
    let destX = 0;
    let destY = 0;

    if (axis === "x") {
      originX = coordinate;
      destX = coordinate;
      destY = this.context.canvas.height;
    } else if (axis === "y") {
      originY = coordinate;
      destY = coordinate;
      destX = this.context.canvas.width;
    }

    this.context.beginPath();
    this.context.moveTo(originX, originY);
    this.context.lineTo(destX, destY);
    this.context.stroke();
    this.context.closePath();
  }

  getCellSize() {
    let smallestSize = this.context.canvas.width;

    if (this.context.canvas.height < smallestSize) {
      smallestSize = this.context.canvas.height;
    }

    return Math.floor(smallestSize / this.size);
  }
}
