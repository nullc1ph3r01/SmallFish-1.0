import { spawnSync } from 'node:child_process';
import process from 'node:process';

if (Number(process.versions.node.split('.')[0]) < 20) {
  console.error(`Node.js 20 or newer is required. Found ${process.versions.node}.`);
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

try {
  run('npm', ['ci']);
  run('npx', ['playwright', 'install', 'chromium']);
  console.log('\nSetup complete. Add SmallFish from the local plugin marketplace, then call browser_start.');
} catch (error) {
  console.error(`Setup failed: ${error.message}`);
  process.exit(1);
}
