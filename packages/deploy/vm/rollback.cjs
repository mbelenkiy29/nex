#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';
const deployDir = __dirname;
const scriptPath = path.join(deployDir, 'rollback.sh');

// Pass all arguments to the bash script
const args = process.argv.slice(2);

// Check if Ansible is available
function checkAnsible(useWSL = false) {
  try {
    if (useWSL) {
      execSync('wsl.exe which ansible-playbook', { stdio: 'ignore' });
    } else {
      execSync('which ansible-playbook', { stdio: 'ignore' });
    }
    return true;
  } catch (err) {
    return false;
  }
}

if (isWindows) {
  // On Windows, Ansible requires WSL (doesn't work in Git Bash)
  let hasWSL = false;

  try {
    execSync('wsl.exe --version', { stdio: 'ignore' });
    hasWSL = true;
  } catch (err) {
    hasWSL = false;
  }

  if (!hasWSL) {
    console.error(
      '\n❌ Error: Windows Subsystem for Linux (WSL) is required for rollback!',
    );
    console.error(
      '\nAnsible (the deployment tool) does not run natively on Windows.',
    );
    console.error('You need to install WSL to rollback from Windows:');
    console.error(
      '  1. Install WSL: https://docs.microsoft.com/en-us/windows/wsl/install',
    );
    console.error(
      '  2. Inside WSL, install Ansible: sudo apt update && sudo apt install ansible',
    );
    console.error(
      '\nAlternatively, you can rollback from a Mac/Linux machine or CI/CD pipeline.',
    );
    process.exit(1);
  }

  // Check if Ansible is installed in WSL
  if (!checkAnsible(true)) {
    console.error('\n❌ Error: Ansible is not installed in WSL!');
    console.error('\nTo install Ansible in WSL, run:');
    console.error('  wsl.exe sudo apt update');
    console.error('  wsl.exe sudo apt install ansible');
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

  console.log('⏪ Running rollback through WSL...\n');

  // Use execSync with cd command to avoid path translation issues
  // Git Bash translates /mnt/ paths, so we cd in WSL first
  try {
    const wslCommand = `wsl.exe bash -c "cd ${wslDeployDir} && bash ./rollback.sh ${args.join(' ')}"`;
    execSync(wslCommand, {
      stdio: 'inherit',
    });
    process.exit(0);
  } catch (error) {
    process.exit(error.status || 1);
  }
} else {
  // On Unix-like systems (Mac, Linux), run bash directly

  // Check if Ansible is installed
  if (!checkAnsible(false)) {
    console.error('\n❌ Error: Ansible is not installed!');
    console.error('\nTo install Ansible, run:');
    console.error('  brew install ansible                          # macOS');
    console.error(
      '  sudo apt update && sudo apt install ansible   # Ubuntu/Debian',
    );
    console.error(
      '  pipx install --include-deps ansible           # Other Linux',
    );
    process.exit(1);
  }

  const child = spawn('bash', [scriptPath, ...args], {
    cwd: deployDir,
    stdio: 'inherit',
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
}
