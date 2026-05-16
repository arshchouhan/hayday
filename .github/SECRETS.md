# GitHub Actions Secrets Reference

## Required Secrets for Deployment

Add these in GitHub: **Settings > Secrets and variables > Actions > New repository secret**

### Render Deployment

| Secret Name | Source | How to Get |
|---|---|---|
| `RENDER_SERVICE_ID` | Render Dashboard | Open your service, copy ID from URL: `srv-xxxxx` |
| `RENDER_API_KEY` | Render Account Settings | Settings > Account > API Keys, create new token |
| `RENDER_KEEPALIVE_URL` | Render Service URL | Your deployed app URL or health endpoint, for example `https://your-app.onrender.com/up` |

### Optional: Code Quality

| Secret Name | Source | How to Get |
|---|---|---|
| `SONAR_HOST_URL` | SonarQube instance | Your SonarQube server URL |
| `SONAR_LOGIN` | SonarQube Security | User > Security > Generate token |

## Environment Variables for Render

When deploying to Render, set these in the **Environment** tab:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hayday
# Optional when the host does not trust the Atlas certificate chain by default.
# MONGODB_TLS_CA_FILE=/path/to/cacert.pem
# MONGODB_TLS_ALLOW_INVALID_CERTIFICATES=false
APP_KEY=base64:xxxxx
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mongodb
NOTIFICATIONS_SERVICE=java
NOTIFICATION_API_URL=https://your-java-notification-service.onrender.com
REDIS_URL=redis://...
LOG_CHANNEL=stack
MAIL_MAILER=smtp
MAIL_HOST=...
MAIL_PORT=...
MAIL_USERNAME=...
MAIL_PASSWORD=...
```

Leave the local `.env` values as `NOTIFICATIONS_SERVICE=laravel` and `NOTIFICATION_API_URL=http://localhost:8080` so development keeps using the existing Laravel-backed notifications.

Get `APP_KEY` by running locally:
```bash
php artisan key:generate --show
```

## Testing Locally

### Run Laravel tests
```bash
php artisan test
```

### Run frontend build
```bash
npm run build
```

### Build Docker image
```bash
docker build -t hayday:local .
docker run -p 8000:8000 hayday:local php artisan serve --host=0.0.0.0
```

### Check Docker image
```bash
docker image ls | grep hayday
docker inspect ghcr.io/YOUR_USERNAME/hayday/laravel:main
```

## Troubleshooting

### Workflow shows red X

1. Click the workflow run
2. Expand failed job
3. Check logs for specific error
4. Common issues:
   - Missing environment variables
   - MongoDB connection failure
   - NPM build error
   - Docker registry auth failure

### Container push fails

Check:
```bash
docker login ghcr.io -u YOUR_USERNAME -p $(gh auth token)
docker push ghcr.io/YOUR_USERNAME/hayday/laravel:main
```

### Render deploy fails

Check Render logs:
1. Go to Render dashboard
2. Click service
3. Scroll to **Logs** section
4. Look for deployment errors

Common fixes:
- Add missing environment variables
- Restart service
- Check disk space
- Verify MongoDB connection

### Keepalive workflow does not ping

Check:
- `RENDER_KEEPALIVE_URL` is set in GitHub Secrets
- The URL returns `200 OK` when opened in a browser
- The keepalive workflow is enabled in the Actions tab
- Render is not blocking the request because of auth or IP restrictions

## Quick Start Checklist

- [ ] Code pushed to GitHub
- [ ] GitHub Actions enabled (Settings > Actions)
- [ ] RENDER_SERVICE_ID added to secrets
- [ ] RENDER_API_KEY added to secrets
- [ ] Environment variables set in Render
- [ ] First workflow run completed successfully
- [ ] Docker image built and pushed
- [ ] Render service redeployed automatically
