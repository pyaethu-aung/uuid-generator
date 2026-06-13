export const IS_MAC =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || "");

export const KEY_META = IS_MAC ? "⌘" : "Ctrl+";
export const KEY_OPT  = IS_MAC ? "⌥" : "Alt+";
