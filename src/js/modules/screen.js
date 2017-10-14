/**
 *  Screen
 */

export default class Screen {
  constructor(screenElement) {
    this.screen = screenElement;

    console.log(this.screen);
  }

  enable() {
    if (this.screen) {
      this.screen.classList.add("screen--active");
    }
  }

  disable() {
    if (this.screen) {
      this.screen.classList.remove("screen--active");
    }
  }
}
