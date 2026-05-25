# Vercel Deployment

## Setup

Copy the files from this directory to the project root:

```bash
cp -r packages/deploy/vercel/* .
```

This will add:

- `vercel.json` - Vercel configuration
- `api/index.js` - Serverless function entry point

**Important:** In the Vercel dashboard, keep the **Root Directory** set to the repository root (leave it empty). Vercel may auto-detect `packages/backend` or another subdirectory — this is wrong. The `vercel.json` at the root already handles build commands for all packages. See [Root Directory](https://vercel.com/docs/builds/configure-a-build#root-directory) for more details.

## Configuration

### Environment Variables

Set these in the Vercel dashboard (Settings > Environment Variables):

**Required:**

- `DATABASE_RLS_URL` - PostgreSQL connection string (RLS user)
- `DATABASE_BYPASS_RLS_URL` - PostgreSQL connection string (bypass user)
- `AUTH_SECRET` - Random string for session encryption
- `FRONTEND_URL` - Your Vercel app URL (e.g., `https://your-app.vercel.app`)
- `BACKEND_URL` - Same as FRONTEND_URL for Vercel deployments

**Background Jobs:**

- `BACKGROUND_JOB_MODE` - Job processing mode:
  - `inline` (recommended for Hobby plan) - Process jobs immediately (blocking, no cron needed)
  - `cron` (recommended for Pro plan) - Uses Vercel Cron to call `/api/background-jobs/process`
  - `worker` - Requires separate worker process (not supported on Vercel)
- `CRON_SECRET` - Required when `BACKGROUND_JOB_MODE=cron`

**Optional:**

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` - For payments
- `ANTHROPIC_API_KEY` - For AI chatbot
- OAuth credentials (`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`)
- Email SMTP settings (`EMAIL_FROM`, `EMAIL_SMTP_*`)
- S3 storage settings (`S3_BUCKET`, `S3_ACCESS_KEY_ID`, etc.)

### Database

Vercel works best with serverless-compatible PostgreSQL:

- [Neon](https://neon.tech)
- [Supabase](https://supabase.com)

**Important:** Create your database in the same region as your Vercel deployment. Vercel defaults to Washington, D.C. (`iad1`). Mismatched regions add significant latency to every database query.

### Background Jobs

**Hobby plan — use inline mode (recommended):**

Set `BACKGROUND_JOB_MODE=inline`. Jobs run immediately after being added, blocking the request until complete. No external scheduling needed. This is the simplest option and works well for most use cases.

**Pro plan — use cron mode:**

Set `BACKGROUND_JOB_MODE=cron`. The `vercel.json` includes a cron job for background processing:

```json
"crons": [
  {
    "path": "/api/background-jobs/process",
    "schedule": "0 0 * * *"
  }
]
```

The default schedule runs once daily. On a Pro plan you can change to every minute for near-real-time processing:

```json
"schedule": "* * * * *"
```

Set `CRON_SECRET` in your environment variables when using cron mode.

## Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

Or connect your GitHub repository in the Vercel dashboard for automatic deployments.

### After Deployment

Once deployed, copy your app URL (e.g., `https://your-app.vercel.app`) and set both `FRONTEND_URL` and `BACKEND_URL` to that URL in the Vercel dashboard. Both must point to the same URL since the backend runs as a serverless function on the same domain. Redeploy after updating.

## Limitations

- **Cold starts**: Serverless functions have cold start latency
- **Execution time**: 10s (Hobby) / 60s (Pro) max per request
- **No persistent connections**: WebSockets require external service
- **No background workers**: Use Vercel Crons or external queue service

For long-running jobs or WebSocket support, consider the VM deployment option.
