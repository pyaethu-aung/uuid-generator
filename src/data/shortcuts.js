const SHORTCUTS = [
  {
    combo: "Cmd/Ctrl + Enter",
    description: "Regenerate the latest UUID batch",
  },
  {
    combo: "Cmd/Ctrl + Alt + S",
    description: "Download the batch as a .txt file",
  },
  {
    combo: "Cmd/Ctrl + Shift + C",
    description: "Copy the first UUID in the batch",
  },
  {
    combo: "Alt + Arrow Up / Down",
    description: "Adjust batch size (hold Shift for ±10)",
  },
  {
    combo: "Alt + 1 / 2 / 3",
    description: "Switch between v4, v1, and v7 generators",
  },
  {
    combo: "Alt + U / H / B",
    description: "Toggle uppercase, remove hyphens, wrap braces",
  },
  {
    combo: "Shift + ?",
    description: "Open the shortcut reference panel",
  },
  {
    combo: "Esc",
    description: "Close the shortcut panel",
  },
];

export default SHORTCUTS;
