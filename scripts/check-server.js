import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.resolve(here, '../src/server.js');
const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'smallfish-check-'));
const transport = new StdioClientTransport({ command: process.execPath, args: [serverPath], env: { ...process.env, LOCAL_BROWSER_MCP_DATA_DIR: tempRoot } });
const client = new Client({ name: 'smallfish-check', version: '1.0.0' });

try {
  await client.connect(transport);
  const { tools } = await client.listTools();
  const required = ['browser_start', 'browser_read_page', 'browser_search_page', 'browser_outline', 'browser_mouse', 'browser_screenshot', 'browser_close', 'web_search', 'monitor_check'];
  const missing = required.filter(name => !tools.some(tool => tool.name === name));
  if (missing.length) throw new Error(`Missing tools: ${missing.join(', ')}`);

  const started = await client.callTool({ name: 'browser_start', arguments: { profile: 'health-check', headless: true } });
  const startText = started.content?.map(part => part.text ?? '').join('\n') ?? '';
  if (startText.startsWith('Error:')) throw new Error(`Browser launch failed: ${startText}`);
  const page = await client.callTool({ name: 'browser_read_page', arguments: { profile: 'health-check', start_char: 0, control_limit: 200 } });
  const pageText = page.content?.map(part => part.text ?? '').join('\n') ?? '';
  if (!pageText.includes('about:blank')) throw new Error(`Browser returned an unexpected page response: ${pageText.slice(0, 500)}`);
  const outline = await client.callTool({ name: 'browser_outline', arguments: { profile: 'health-check' } });
  if (outline.isError) throw new Error('browser_outline returned an MCP error.');
  const screenshot = await client.callTool({ name: 'browser_screenshot', arguments: { profile: 'health-check' } });
  if (!screenshot.content?.some(part => part.type === 'image' && part.mimeType === 'image/png')) throw new Error('browser_screenshot did not return an inline PNG image.');
  await client.callTool({ name: 'browser_close', arguments: { profile: 'health-check' } });

  console.log(`MCP connection OK; discovered ${tools.length} tools; Chromium launch and page read OK.`);
} finally {
  await client.close().catch(() => {});
  await fs.rm(tempRoot, { recursive: true, force: true });
}
