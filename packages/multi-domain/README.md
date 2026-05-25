# Multi-Domain Caddy Setup

Caddy reverse proxy for multi-tenant local development with wildcard domain support.

## Quick Start

```bash
docker compose up -d
```

Then start the application with `pnpm dev`.

### Trust Local HTTPS Certificate

Caddy auto-generates certificates. To trust them, copy the CA cert and install.

Run these commands from the `packages/multi-domain` directory (where `docker-compose.yml` is located):

```bash
cd packages/multi-domain
```

**macOS:**

```bash
docker compose cp caddy:/data/caddy/pki/authorities/local/root.crt /tmp/root.crt && \
    sudo security add-trusted-cert -d -r trustRoot \
    -k /Library/Keychains/System.keychain /tmp/root.crt
```

**Windows (PowerShell as Admin):**

```powershell
docker compose cp caddy:/data/caddy/pki/authorities/local/root.crt $env:TEMP/root.crt; `
    certutil -addstore -f "ROOT" $env:TEMP/root.crt
```

**Linux:**

```bash
docker compose cp caddy:/data/caddy/pki/authorities/local/root.crt \
    /usr/local/share/ca-certificates/root.crt && \
    sudo update-ca-certificates
```

Access via:

- Frontend: `http://<tenant>.project.localhost`
- API: `http://project.localhost`

## Commands

**View logs:**

```bash
docker compose logs caddy -f
```

**Reload config:**

```bash
docker compose exec -w /etc/caddy caddy caddy reload
```

**Stop:**

```bash
docker compose down
```

## Configuration

The `Caddyfile` defines routing:

- `*.project.localhost` and `project.localhost` → Frontend (port 5173)
- `*.project.localhost/api` and `project.localhost/api` → Backend API (port 3011)

Uses `host.docker.internal` to reach host machine services from Docker container.

## Volumes

- `caddy_data`: TLS certificates and persistent data
- `caddy_config`: Caddy configuration state

## Reference

- [Caddy Docker Compose Documentation](https://caddyserver.com/docs/running#docker-compose)
