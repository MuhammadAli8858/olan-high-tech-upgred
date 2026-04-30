import { spawn } from 'node:child_process';

const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const server = spawn(command, ['run', 'server'], { stdio: 'inherit', shell: true });
const frontend = spawn(command, ['run', 'frontend'], { stdio: 'inherit', shell: true });

function shutdown() {
  server.kill();
  frontend.kill();
  process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
