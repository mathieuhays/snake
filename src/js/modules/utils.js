/**
 *  Utils
 */

export function getBackingStorePixelRatio(context) {
  const defaultRatio = 1;

  return (
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    defaultRatio
  );
}

export function getDevicePixelRatio() {
  const defaultRatio = 1;

  return window.devicePixelRatio || defaultRatio;
}


export function on(selector, event, callback) {
  const elements = document.querySelectorAll(selector);

  if (!elements.length) {
    return false;
  }

  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(event, callback);
  }

  return true;
}
