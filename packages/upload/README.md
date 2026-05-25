# MinIO Setup Guide

This project uses MinIO as a local S3-compatible object storage solution for development. MinIO provides the same API as AWS S3, making it easy to develop and test file upload features locally.

## Quick Start

### 1. Start MinIO with Docker Compose

```bash
docker-compose up -d
```

This will:

- Start MinIO server on ports 9000 (API) and 9001 (Console)
- Create two buckets: `project-public` (anonymous read) and `project-private` (signed URLs only)
- Set up an application user with access credentials
- Configure bucket policies (public bucket has anonymous download, private is restricted)

### 2. Configure Environment Variables

Update your `packages/backend/.env` file with these values:

```bash
# Local Development (MinIO via Docker Compose)
S3_BUCKET_PUBLIC=project-public
S3_BUCKET_PRIVATE=project-private
S3_ACCESS_KEY_ID=app_user
S3_SECRET_ACCESS_KEY=app_password123
S3_REGION=us-east-1
S3_ENDPOINT=http://localhost:9000
```

### 3. Access MinIO Console (Optional)

Open http://localhost:9001 in your browser:

- **Username**: `app_user`
- **Password**: `app_password123`

The console provides a web interface to:

- Browse buckets and files
- Manage access policies
- Configure CORS settings
- Create access keys
- Monitor usage

## File Upload Testing

Once MinIO is running and configured, you can test file uploads through the application:

1. Start the backend: `pnpm dev` (from project root)
2. Navigate to any feature with file uploads.
3. Upload files - they will be stored in MinIO

## Advanced Configuration

### Custom CORS Settings (Optional)

The Docker setup includes basic CORS configuration. If you need to customize it:

1. Install MinIO Client:

   ```bash
   brew install minio/stable/mc  # macOS
   ```

2. Configure alias:

   ```bash
   mc alias set local http://localhost:9000 app_user app_password123
   ```

3. Update CORS:

   ```bash
   mc anonymous set-json cors.json local/project
   ```

   Where `cors.json` contains your custom rules.

### Creating Additional Buckets

```bash
mc mb local/my-new-bucket
mc anonymous set download local/my-new-bucket  # Public read access
```

### Viewing Files

```bash
mc ls local/project           # List files in bucket
mc cat local/project/file.txt # View file contents
```

## Production Deployment

For production, you have several options:

### Option 1: AWS S3 (Recommended)

Update `.env`:

```bash
S3_BUCKET_PUBLIC=your-public-bucket
S3_BUCKET_PRIVATE=your-private-bucket
S3_ACCESS_KEY_ID=your-aws-access-key
S3_SECRET_ACCESS_KEY=your-aws-secret-key
S3_REGION=us-east-1
S3_ENDPOINT=  # Leave empty for AWS S3
```

### Option 2: Self-Hosted MinIO

1. Deploy MinIO to your server (Docker, Kubernetes, or binary)
2. Configure TLS certificates
3. Set up production credentials
4. Update `S3_ENDPOINT` to your MinIO server URL

### Option 3: S3-Compatible Services

Services like Cloudflare R2, Backblaze B2, or DigitalOcean Spaces:

```bash
# Cloudflare R2
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com

# Backblaze B2
S3_ENDPOINT=https://s3.<region>.backblazeb2.com

# DigitalOcean Spaces
S3_ENDPOINT=https://<region>.digitaloceanspaces.com
```

## Troubleshooting

### MinIO not starting

```bash
docker-compose logs minio
docker-compose restart minio
```

### Connection refused errors

Ensure MinIO is running:

```bash
curl http://localhost:9000/minio/health/live
```

### CORS errors in browser

Check CORS configuration:

```bash
mc anonymous get-json local/project
```

### Bucket access denied

Verify credentials and permissions:

```bash
mc admin user info local app_user
```

## Docker Compose Reference

The `docker-compose.yml` configures:

- **MinIO Service**: Main object storage server
  - Ports: 9000 (API), 9001 (Console)
  - Root credentials: `app_user` / `app_password123`
  - Data persisted in Docker volume

- **MinIO Setup Service**: One-time initialization
  - Creates `project` bucket
  - Creates `app_user` with `app_password123`
  - Sets basic permissions

## Security Notes

- **Development Only**: Default credentials are for local development
- **Production**: Use strong, unique credentials and enable TLS
- **Access Control**: Review and restrict bucket policies for production
- **Encryption**: Enable encryption at rest and in transit for sensitive data

## Additional Resources

- [MinIO Documentation](https://min.io/docs/minio/linux/index.html)
- [AWS S3 API Compatibility](https://docs.min.io/docs/aws-sdk-for-javascript-with-minio.html)
- [MinIO Client Guide](https://min.io/docs/minio/linux/reference/minio-mc.html)
