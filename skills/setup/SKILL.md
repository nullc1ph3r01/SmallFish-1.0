---
name: setup
description: Set up and start SmallFish for the first time. Use when the user asks to set up or start the SmallFish plugin.
---

# Set up SmallFish

1. Tell the user setup must be run from the SmallFish folder with `npm run setup`. It installs the Node dependencies and Playwright Chromium on this computer. Do not run installers without the user's request.
2. After setup, call `browser_start` with `headless: false` and the user's requested URL, if provided. If no URL was provided, start at `about:blank`.
3. Tell the user to sign in interactively in the visible Chromium window. Do not ask them to paste passwords into chat or tool arguments.
4. Confirm the browser is open with `browser_tabs` and explain that its saved profile stays on this computer.
