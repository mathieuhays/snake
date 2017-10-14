(function () {
  "use strict";

  var ready = {
    done: false,
    callbacks: [],
    pointer: null,
    intervalTiming: 100,
    polyfillReady: false
  };

  /**
   * Fire callback if page is ready for DOM interaction
   * Queue the callback to be called later if the document is not ready
   *
   * @param callback
   */
  function onReady(callback) {
    if (ready.done) {
      callback();
      return;
    }

    ready.callbacks.push(callback);
  }

  function maybeLoadPolyfill() {
    if (!("keys" in Object)) {
      loadPolyfill();
    } else {
      onPolyfillReady();
    }
  }

  function loadPolyfill() {
    var script = document.getElementsByTagName("script")[0],
      newScript = document.createElement("script");

    newScript.async = true;
    newScript.src = "https://cdn.polyfill.io/v2/polyfill.min.js?features=default&callback=MH.polyfillReady";
    script.parentNode.insertBefore(newScript, script);
  }

  function onPolyfillReady() {
    ready.polyfillReady = true;
  }

  /**
   * Load polyfill if we detect that the browser needs polyfill-ing.
   */
  maybeLoadPolyfill();

  /**
   * Poll document state until our page is fully loaded.
   *
   * @type {number}
   */
  ready.pointer = setInterval(function () {
    if (("complete" === document.readyState || "interactive" === document.readyState) &&
      ready.polyfillReady) {

      // Stop listening
      clearInterval(ready.pointer);
      ready.done = true;

      // Go through our registered callbacks if any
      if (ready.callbacks.length) {
        ready.callbacks.forEach(function (callback) {
          callback();
        });
      }
    }

  }, ready.intervalTiming);

  window.MH = {
    onReady: onReady,
    polyfillReady: onPolyfillReady
  };
})();
