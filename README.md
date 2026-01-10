# UUID Generator (AI Built)

A Tailwind-styled UUID generator built with React 19 and Vite. The app lets you preview up to 20 freshly generated UUIDs, switch between v1/v4/v7 versions, copy individual values with feedback, and download batches (up to 200) as newline-delimited text files.

## AI Agent & Tooling
- Core implementation produced by GitHub Copilot running the GPT-5.1-Codex model.
- Copilot authored UI layout, React state logic, clipboard/download utilities, and Tailwind styling inside VS Code.
- Human input focused on high-level requirements, reviewing each iteration, and applying the prompts listed below.

## Feature Highlights
- Unified slider that drives both the on-screen preview count (capped at 20) and the downloadable batch size (1–200).
- Version selector covering UUID v1 (timestamp/MAC), v4 (random), and v7 (time-ordered) via the `uuid` npm package.
- Copy-to-clipboard with micro-interaction feedback plus a timestamped download action guarded against oversized files.
- Insight cards summarizing current options (version, batch size, characters per UUID) placed directly above the list for quick scanning.
- Responsive layout with gradients, keyboard-friendly control handling, and pointer event throttling to avoid jank.

## Keyboard Shortcuts
- ⌘/Ctrl + Enter — Regenerate the latest UUID batch.
- ⌘/Ctrl + Alt + S — Download the current batch as a `.txt` file.
- ⌘/Ctrl + Shift + C — Copy the first UUID in the visible list.
- ⌥/Alt + Arrow Up/Down — Adjust batch size (hold Shift for ±10).
- ⌥/Alt + 1 / 2 / 3 — Switch to v4, v1, or v7 generators respectively.
- ⌥/Alt + U / H / B — Toggle uppercase, remove hyphens, or wrap with braces.
- Shift + ? — Open the in-app shortcut reference overlay.
- Esc — Close the shortcut reference overlay.

## Rephrased Prompt Log
1. Build a Tailwind-forward UUID generator interface that feels polished and modern.
2. Add a selector that lets the user toggle between UUID versions v1, v4, and v7.
3. Keep badges/stat labels on a single line so that wording like "Characters Each" never wraps or overflows.
4. Provide animated feedback when copying UUIDs and acknowledge downloads with contextual text.
5. Extend download batches to 200 entries while keeping only 20 visible in the live preview.
6. Replace multiple controls with one slider that manages both preview and download counts, updating immediately as it moves.
7. Relocate version, batch size, and per-UUID character details into the stat cards above the list to avoid duplicate text elsewhere.

## Getting Started
1. `npm install`
2. `npm run dev`
3. Open `http://localhost:5173` (or the URL printed in the terminal) to interact with the UI.

## Tech Stack
- React 19 + Vite
- Tailwind CSS
- `uuid` npm package
- Clipboard and File APIs
