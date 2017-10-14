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
