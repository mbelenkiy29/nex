#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const deployDir = __dirname;
const scriptPath = path.join(deployDir, 'logs.sh');

// Pass all arguments to the bash script
const args = process.argv.slice(2);

if (isWindows) {
  // On Windows, use WSL
  let hasWSL = false;

  try {
    execSync('wsl.exe --version', { stdio: 'ignore' });
    hasWSL = true;
  } catch (err) {
    hasWSL = false;
  }

  if (!hasWSL) {
    console.error(
      '\n❌ Error: Windows Subsystem for Linux (WSL) is required to view logs!',
    );
    console.error(
      '\nYou need to install WSL to view server logs from Windows:',
    );
    console.error(
      '  1. Install WSL: https://docs.microsoft.com/en-us/windows/wsl/install',
    );
    console.error(
      '\nAlternatively, you can SSH directly into the server and view logs there.',
    );
    process.exit(1);
  }

  // Convert Windows path to WSL path
  // First normalize backslashes to forward slashes
  let wslScriptPath = scriptPath.replace(/\\/g, '/');
  let wslDeployDir = deployDir.replace(/\\/g, '/');

  // Handle both Windows paths (C: or c:) and Git Bash paths (/c/)
  if (wslScriptPath.match(/^([a-zA-Z]):/)) {
    // Windows path with drive letter: C:/path or c:/path -> /mnt/c/path
    wslScriptPath = wslScriptPath.replace(
      /^([a-zA-Z]):/,
      (_, drive) => `/mnt/${drive.toLowerCase()}`,
    );
  } else if (wslScriptPath.match(/^\/([a-z])\//)) {
    // Git Bash path: /c/path -> /mnt/c/path
    wslScriptPath = wslScriptPath.replace(
      /^\/([a-z])\//,
      (_, drive) => `/mnt/${drive}/`,
    );
  }

  if (wslDeployDir.match(/^([a-zA-Z]):/)) {
    wslDeployDir = wslDeployDir.replace(
      /^([a-zA-Z]):/,
      (_, drive) => `/mnt/${drive.toLowerCase()}`,
    );
  } else if (wslDeployDir.match(/^\/([a-z])\//)) {
    wslDeployDir = wslDeployDir.replace(
      /^\/([a-z])\//,
      (_, drive) => `/mnt/${drive}/`,
    );
  }

  console.log('📋 Viewing server logs through WSL...\n');

  // Use execSync with cd command to avoid path translation issues
  // Git Bash translates /mnt/ paths, so we cd in WSL first
  try {
    const wslCommand = `wsl.exe bash -c "cd ${wslDeployDir} && bash ./logs.sh ${args.join(' ')}"`;
    execSync(wslCommand, {
      stdio: 'inherit',
    });
    process.exit(0);
  } catch (error) {
    process.exit(error.status || 1);
  }
} else {
  // On Unix-like systems (Mac, Linux), run bash directly
  const child = spawn('bash', [scriptPath, ...args], {
    cwd: deployDir,
    stdio: 'inherit',
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}
