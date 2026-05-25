# Deployment

This directory contains Ansible playbooks and scripts for deploying the application to production and staging environments.

## Overview

The deployment system uses:

- **Ansible** - Infrastructure automation and configuration management
- **Blue-Green Deployment** - Zero-downtime deployments with instant rollback capability
- **Systemd Services** - Process management for backend, frontend, and worker services
- **Caddy** - Reverse proxy and automatic HTTPS
- **PostgreSQL** - Database server
- **Redis** - Cache and job queue
- **MinIO** - S3-compatible object storage for file uploads

### Cross-Platform Scripts

The deployment includes Node.js wrapper scripts that work on all platforms:

- **`deploy.js`** - Cross-platform deployment script (wraps `deploy.sh`)
- **`rollback.js`** - Cross-platform rollback script (wraps `rollback.sh`)
- **`logs.js`** - Cross-platform logs viewer script (wraps `logs.sh`)

These scripts automatically detect your platform and handle:

- **Mac/Linux**: Run bash scripts directly
- **Windows**: Run through WSL (Windows Subsystem for Linux)

The deploy and rollback scripts check for Ansible installation and provide helpful error messages if dependencies are missing.

## Architecture

The deployment creates blue and green service instances:

- **Backend**: `backend-blue.service` / `backend-green.service` (Port 3011/3012)
- **Frontend**: `frontend-blue.service` / `frontend-green.service` (Port 5173/5174)
- **Worker**: `worker-blue.service` / `worker-green.service`

Caddy routes traffic to the active color. Deployment switches colors, allowing instant rollback.

## Prerequisites

### All Platforms

1. **Ansible** must be installed:

   ```bash
   # macOS
   brew install ansible

   # Ubuntu/Debian
   sudo apt update && sudo apt install ansible

   # Other Linux (with pipx)
   pipx install --include-deps ansible
   ```

2. **SSH access** to target servers configured in inventory files

3. **Secrets configured** - Copy and configure secrets file:
   ```bash
   cp group_vars/secrets.yml.example group_vars/secrets.yml
   # Edit secrets.yml with your actual values
   ```

### Windows-Specific

On Windows, Ansible requires WSL (Windows Subsystem for Linux):

1. **Install WSL**:

   ```powershell
   wsl --install
   ```

2. **Inside WSL, install Ansible**:

   ```bash
   sudo apt update
   sudo apt install ansible
   ```

3. The `deploy.js` script automatically handles running deployment through WSL.

## Quick Start

### Deploy to Production

```bash
pnpm deploy
# or from deploy directory
node deploy.js
```

### Deploy to Staging

```bash
pnpm deploy staging
```

### Dry Run (Check Mode)

```bash
pnpm deploy -- -c
# or
pnpm deploy -- --check
```

## Quick Reference

All deployment commands available from the project root:

```bash
# Deployment
pnpm deploy                    # Deploy to production
pnpm deploy staging            # Deploy to staging
pnpm deploy -- -c              # Dry run (check mode)
pnpm deploy -- --tags app      # Deploy only app components

# Rollback
pnpm rollback                  # Rollback production
pnpm rollback staging          # Rollback staging

# Logs & Monitoring
pnpm logs status               # Service status & active color
pnpm logs metrics              # System resources (CPU, memory, disk)
pnpm logs backend              # Backend logs
pnpm logs frontend             # Frontend logs
pnpm logs worker               # Worker logs
pnpm logs caddy                # Web server logs
pnpm logs postgres             # Database logs
pnpm logs redis                # Redis logs
pnpm logs system               # System error logs
pnpm logs all                  # All application logs

# Log options
pnpm logs backend -- -f        # Follow logs in real-time
pnpm logs backend -- -n 200    # Show 200 lines
pnpm logs backend -- -s backend-blue  # Specific service
```

## Configuration

### Inventory Files

Define your servers in `inventories/`:

- `production.ini` - Production servers
- `staging.ini` - Staging servers (if applicable)

Example inventory:

```ini
[app]
your-server.com ansible_user=deploy

[app:vars]
ansible_python_interpreter=/usr/bin/python3
```

### Variables

Configure deployment settings in `group_vars/`:

- `all.yml` - Common variables (ports, paths, etc.)
- `secrets.yml` - Sensitive data (database passwords, API keys, etc.)
- `secrets.yml.example` - Template for secrets file

**Important**: `secrets.yml` is gitignored. Never commit secrets!

### Environment Variables

The deployment creates a `.env` file on the server from variables defined in `group_vars/`. Key variables:

- `APP_DOMAIN` - Your application domain
- `DATABASE_RLS_URL` - PostgreSQL connection string (RLS)
- `DATABASE_BYPASS_RLS_URL` - PostgreSQL connection string (Bypass RLS)
- `REDIS_URL` - Redis connection string
- `BACKEND_PORT` - Backend API port
- `FRONTEND_PORT` - Frontend port

See `roles/app/templates/env.j2` for the complete `.env` template.

## Deployment Commands

### Basic Deployment

```bash
# Deploy to production
pnpm deploy

# Deploy to staging
pnpm deploy staging
```

### Advanced Options

```bash
# Dry run (no changes made)
pnpm deploy -- --check

# Deploy only specific components
pnpm deploy -- --tags app
pnpm deploy -- --tags caddy
pnpm deploy -- --tags postgres

# Skip specific components
pnpm deploy -- --skip-tags app

# Limit to specific hosts
pnpm deploy -- --limit server1

# Verbose output
pnpm deploy -- -v
pnpm deploy -- -vv
pnpm deploy -- -vvv
```

### Available Tags

- `common` - System setup, security, users
- `postgres` - PostgreSQL installation and configuration
- `redis` - Redis installation and configuration
- `nodejs` - Node.js installation
- `caddy` - Caddy web server
- `app` - Application deployment

## Rollback

If a deployment causes issues, rollback to the previous version:

```bash
pnpm rollback

# Or from deploy directory
node rollback.js

# With environment
pnpm rollback staging
```

Rollback is instant - it switches Caddy to route to the other color.

The rollback script works cross-platform (Mac, Linux, Windows with WSL) just like the deploy script.

## Viewing Logs

The deployment includes a comprehensive logs script to view all server logs and metrics:

```bash
# View service status
pnpm logs status

# View system metrics (CPU, memory, disk)
pnpm logs metrics

# View application logs
pnpm logs backend          # Backend service logs
pnpm logs frontend         # Frontend service logs
pnpm logs worker           # Worker service logs
pnpm logs all              # All application logs

# View infrastructure logs
pnpm logs caddy            # Web server logs
pnpm logs postgres         # Database logs
pnpm logs redis            # Redis logs
pnpm logs system           # System error logs
```

### Log Options

```bash
# Follow logs in real-time (like tail -f)
pnpm logs backend -- -f
pnpm logs worker -- -f

# Show specific number of lines
pnpm logs backend -- -n 50
pnpm logs all -- -n 200

# View specific service (blue or green)
pnpm logs backend -- -s backend-blue
pnpm logs worker -- -s worker-green

# Combine options
pnpm logs backend -- -s backend-blue -f
pnpm logs all -- -n 500 -f
```

### Logs on Staging

```bash
# All commands work with staging environment
pnpm logs staging status
pnpm logs staging backend -- -f
pnpm logs staging metrics
```

### What Each Command Shows

- **status** - Service statuses, active deployment color
- **metrics** - CPU/memory/disk usage, top processes, network stats, disk I/O
- **backend** - Backend API server logs (both blue and green)
- **frontend** - Frontend server logs (both blue and green)
- **worker** - Background job worker logs (both blue and green)
- **caddy** - Web server and reverse proxy logs
- **postgres** - Database logs and slow queries
- **redis** - Cache/queue logs and connection stats
- **system** - System error logs and security events (fail2ban)
- **all** - All application services combined

### Examples

```bash
# Quick health check
pnpm logs status

# Monitor backend in real-time
pnpm logs backend -- -f

# Debug worker issues
pnpm logs worker -- -n 200

# Check system resources
pnpm logs metrics

# View only active backend
pnpm logs backend -- -s backend-blue -f

# See all recent errors
pnpm logs system -- -n 100

# Monitor database performance
pnpm logs postgres
```

The logs script works cross-platform (Mac, Linux, Windows with WSL) and provides a convenient way to monitor your deployed application without manually SSHing into the server.

## How Blue-Green Deployment Works

1. **Initial state**: Blue is active, serving traffic
2. **Deploy**:
   - Green services are stopped
   - New code is deployed to green
   - Green services are started
   - Health checks verify green is working
   - Caddy is reconfigured to route to green
3. **Result**: Green is now active, blue contains the previous version
4. **Next deploy**: Process reverses (deploys to blue)

### Benefits

- **Zero downtime** - Traffic switches instantly
- **Instant rollback** - Switch back to previous color if issues occur
- **Easy testing** - Test new version before switching traffic

## Roles

The deployment is organized into Ansible roles:

- **common** - Base system setup, security, fail2ban
- **postgres** - PostgreSQL database server
- **redis** - Redis server for caching and job queues
- **nodejs** - Node.js runtime installation
- **caddy** - Web server and reverse proxy
- **app** - Application deployment (backend, frontend, worker)

## Troubleshooting

### Quick Diagnostics

Use the logs script for quick diagnostics:

```bash
# Check all service statuses and active color
pnpm logs status

# Check system resources
pnpm logs metrics

# View recent errors
pnpm logs system

# Monitor specific service
pnpm logs backend -- -f
```

### Check Service Status

```bash
# Using logs script (recommended)
pnpm logs status

# Or SSH into server manually
ssh deploy@your-server.com
sudo systemctl status backend-blue backend-green frontend-blue frontend-green worker-blue worker-green
```

### View Application Logs

```bash
# Using logs script (recommended)
pnpm logs backend          # Backend logs
pnpm logs backend -- -f    # Follow in real-time
pnpm logs worker           # Worker logs
pnpm logs all              # All application logs

# Or SSH into server manually
ssh deploy@your-server.com
sudo journalctl -u backend-blue -f
sudo journalctl -u worker-blue -f
```

### Check Which Color is Active

```bash
# Using logs script
pnpm logs status

# Or SSH into server
ssh deploy@your-server.com
cat /opt/app/active_color
```

### Check System Resources

```bash
# Using logs script (recommended)
pnpm logs metrics

# Shows: CPU, memory, disk usage, top processes, network stats
```

### Manual Service Control

If you need to manually control services, SSH into the server:

```bash
ssh deploy@your-server.com

# Start/stop/restart services
sudo systemctl start backend-blue
sudo systemctl stop backend-blue
sudo systemctl restart backend-blue

# Enable/disable auto-start
sudo systemctl enable backend-blue
sudo systemctl disable backend-blue
```

### Deployment Failed

1. Check Ansible output for errors
2. Check service status: `pnpm logs status`
3. Check system resources: `pnpm logs metrics`
4. View recent logs: `pnpm logs backend -- -n 200`
5. Verify SSH access: `ssh deploy@your-server.com`
6. Check server disk space: `pnpm logs metrics` (or `ssh user@server 'df -h'`)
7. View system errors: `pnpm logs system`

### Connection Issues

If you can't connect to the server:

1. Verify inventory file has correct hostname/IP
2. Check SSH key is added: `ssh-add ~/.ssh/your-key`
3. Test SSH connection: `ssh deploy@your-server.com`
4. Verify firewall allows SSH (port 22)

### Windows/WSL Issues

If deployment fails on Windows:

1. Ensure WSL is installed: `wsl --version`
2. Verify Ansible is installed in WSL: `wsl which ansible-playbook`
3. Check file permissions in WSL: `wsl ls -la`

## Security Notes

1. **Secrets Management**
   - Never commit `secrets.yml` to git
   - Use Ansible Vault for sensitive data in production: `ansible-vault encrypt secrets.yml`
   - Rotate secrets regularly

2. **SSH Access**
   - Use SSH keys, not passwords
   - Limit SSH access to specific IPs when possible
   - The deployment sets up fail2ban for brute-force protection

3. **Firewall**
   - The deployment configures UFW firewall
   - Only necessary ports are opened: 22 (SSH), 80 (HTTP), 443 (HTTPS)

4. **Updates**
   - Keep server packages updated
   - Monitor security advisories for dependencies

## Continuous Integration

For CI/CD integration (GitHub Actions, GitLab CI, etc.):

```yaml
# Example GitHub Action
- name: Deploy to production
  run: |
    cd deploy
    ansible-playbook -i inventories/production.ini playbook.yml
  env:
    ANSIBLE_HOST_KEY_CHECKING: False
```

Store `secrets.yml` as a CI/CD secret or use Ansible Vault.

## Manual Deployment (Without Scripts)

If you prefer to run Ansible directly:

```bash
cd deploy

# Deploy
ansible-playbook -i inventories/production.ini playbook.yml

# Check mode
ansible-playbook -i inventories/production.ini playbook.yml --check

# With tags
ansible-playbook -i inventories/production.ini playbook.yml --tags app
```

## Support

For issues or questions:

1. Check service status: `pnpm logs status`
2. View application logs: `pnpm logs backend` or `pnpm logs worker`
3. Check system resources: `pnpm logs metrics`
4. Review Ansible output for errors during deployment
5. View system errors: `pnpm logs system`
6. Verify all prerequisites are installed
7. Check the troubleshooting section above

## License

This deployment configuration is part of the project and shares the same license.
