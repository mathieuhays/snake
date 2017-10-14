/**
 *  Keyboard util
 */

import isFunction from "lodash/isFunction";
import isArray from "lodash/isArray";

export const ARROW_UP = 38;
export const ARROW_DOWN = 40;
export const ARROW_LEFT = 37;
export const ARROW_RIGHT = 39;

export function onKeyPress(keys, callback) {
  if (!isArray(keys)) {
    keys = [ keys ];
  }

  if (!isFunction(callback)) {
    return false;
  }

  window.addEventListener("keydown", (e) => {
    const event = window.event ? window.event : e;

    if (keys.indexOf(event.keyCode) > -1) {
      callback(event.keyCode);
    }
  });

  return true;
}
