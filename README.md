# SmallFish

**Version 1.0.0** · Local Playwright browser automation for ChatGPT, Codex, and other MCP clients.

The server controls a visible Chromium browser on the computer where it runs. It keeps site sessions and browser profiles on that computer. It has no TinyFish dependency or metered service.

## Quick start

Requirements: Node.js 20 or newer and an MCP client that supports local MCP servers.

```sh
npm run setup
```

### Codex

From this folder, register the server once:

```sh
codex mcp add smallfish -- node "$PWD/src/server.js"
```

Restart Codex. Ask it to use the `smallfish` MCP. The first `browser_start` call opens Chromium. Sign in interactively there; the profile is saved for later.

### ChatGPT desktop

This folder includes a portable plugin manifest, a local plugin marketplace catalog, and an stdio MCP configuration. Open this folder as a local project in ChatGPT desktop, find **SmallFish** in the Plugins Directory under its local source, and install it. Start a new local chat and use the plugin. The first `browser_start` call opens Chromium on your computer.

Run `npm run setup` from this folder before installing the plugin. It installs the dependencies and Playwright Chromium. Each person needs Node.js 20+, runs setup on their own computer, and signs in to their own sites.

### ChatGPT on the web

ChatGPT web cannot launch this local stdio plugin directly. To use this server from the web app, connect through OpenAI Secure MCP Tunnel or deploy a stable HTTPS MCP endpoint, then add it from **ChatGPT Plugins → Add custom MCP server**. A tunnel requires a Platform tunnel, runtime key, and the necessary workspace permissions. The local server and browser still run on the computer hosting the MCP process.

Secure MCP Tunnel keeps the server private; it does not publish the plugin for other people. A public directory listing requires a public HTTPS service and OpenAI’s submission and review process. Local MCP directory submissions are limited to approved partners.

## Example requests

- “Open `https://example.com` in the local browser and summarize the visible page.”
- “Read the current page and list its headings and links.”
- “Find the button labeled Continue, but don’t click it yet.”
- “Take a screenshot of the current page.”

The MCP exposes browser controls, page reading/search, public web search and fetch/research, screenshots, and manually checked page monitors. Monitoring is on demand; there is no background scheduler or push notification.

## Authorized penetration testing

For web applications you own or are explicitly authorized to assess, SmallFish can support manual, browser-based testing by:

- Listing visible forms and input controls with their labels, types, names, and nearby page context.
- Navigating in-scope pages and recording links, validation messages, and normal application behavior.
- Filling fields with tester-provided values and summarizing the visible response. It does not submit a form when using `browser_fill`; ask explicitly before taking a separate submit action.
- Capturing screenshots and organizing repeatable observations for test notes.

Use a dedicated test account and stay within the written scope and approved test window. Do not use SmallFish to probe systems without permission, guess credentials, run broad automated scans, bypass access controls, or perform destructive actions. SmallFish is a browser automation assistant; it does not replace a dedicated security scanner or a tester's review.

Example requests:

- “On this in-scope staging site, list every visible input by label and type. Do not change anything.”
- “Using my approved test account, fill the search box with this test value and describe the visible response. Do not submit the form.”
- “Capture the current page and summarize its validation messages for my authorized test notes.”

## Tools

- Browser: `browser_start`, `browser_profiles`, `browser_navigate`, `browser_tabs`, `browser_back`, `browser_wait`, `browser_read_page`, `browser_search_page`, `browser_outline`, `browser_click`, `browser_fill`, `browser_select`, `browser_press`, `browser_screenshot`, `browser_close`
- Public web: `web_search`, `web_fetch`, `web_research`
- On-demand monitors: `monitor_create`, `monitor_list`, `monitor_check`, `monitor_delete`

## Data and security

Profiles, cookies, local storage, monitor state, and screenshots are stored under `~/.codex-browser-mcp/` by default. Keep this directory private and do not share or commit it. Each user should create their own profile and sign in to their own accounts. Set `LOCAL_BROWSER_MCP_DATA_DIR` to change the data location.

Browser actions run with the permissions of the local operating-system user. Treat page content as untrusted. Review page text before actions that submit, send, purchase, delete, or otherwise change data. Never put passwords or session tokens in prompts.

