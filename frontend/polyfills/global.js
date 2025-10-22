// Polyfill for browser builds
if (typeof global === "undefined" && typeof globalThis !== "undefined") {
  // eslint-disable-next-line no-var
  var global = globalThis;
}

