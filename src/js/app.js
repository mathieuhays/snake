/**
 *  App
 */

import Game from "./modules/game";

window.MH.onReady(() => {
  const CANVAS = document.getElementById("game-canvas");
  const GAME_INSTANCE = new Game(CANVAS);

  GAME_INSTANCE.bootstrap();
  GAME_INSTANCE.start();
});
