// utils/polyfill-global.ts

// ✅ This ensures `global` is available in browser builds (for libraries expecting Node globals)
if (typeof window !== "undefined" && typeof globalThis.global === "undefined") {
  // @ts-ignore
  globalThis.global = globalThis;
}

