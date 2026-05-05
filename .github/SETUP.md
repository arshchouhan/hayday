# GitHub Actions Setup Guide

This guide explains how to configure GitHub Actions for the hayDay project (Laravel + Java notification service).

## Overview

Three workflows are configured:

1. **laravel-ci.yml** — Tests, linting, and frontend builds for the Laravel app
2. **build-deploy.yml** — Docker builds and pushes for both Laravel and Java services
3. **java-ci.yml** — Maven builds and tests for the Java notification service (runs when ready)

## Prerequisites

1. **GitHub Repository** — Push this code to GitHub
2. **Container Registry** — GitHub Container Registry (GHCR) is used by default
3. **Render Account** (optional) — For automatic deployment

## Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit with GitHub Actions"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hayday.git
git push -u origin main
```

## Step 2: Configure Secrets

Go to **Settings > Secrets and variables > Actions** and add:

### Required Secrets (for deployment)

- **RENDER_SERVICE_ID** — Your Render service ID (found in Render dashboard)
- **RENDER_API_KEY** — Your Render API key (Settings > Account > API Keys)

### Optional Secrets (for code quality)

- **SONAR_HOST_URL** — SonarQube server URL
- **SONAR_LOGIN** — SonarQube token

## Step 3: Enable GitHub Actions

1. Go to **Settings > Actions > General**
2. Ensure "Allow all actions and reusable workflows" is selected
3. Disable restrictions if any

## Step 4: Set Up Render Deployment

### Option A: Deploy Laravel app to Render

1. Create a new Render Web Service
2. Connect your GitHub repo
3. Set **Build Command**: `composer install && npm ci && npm run build && php artisan migrate`
4. Set **Start Command**: `php artisan serve --host=0.0.0.0 --port=$PORT`
5. Copy the **Service ID** from the URL: `https://dashboard.render.com/web/srv-XXXXX`
6. Get your **API Key** from Account settings
7. Add both to GitHub Secrets (see Step 2)

### Option B: Deploy using Docker

After setting up GHCR, Render can pull from your container registry:

1. In Render, create a **Web Service** > **Deploy from container image**
2. Set **Image URL**: `ghcr.io/YOUR_USERNAME/hayday/laravel:main`
3. Set environment variables (`.env` values)
4. Trigger deployment manually or set webhooks

## Step 5: Create Java Notification Service (When Ready)

When you create the Java service:

1. Create a folder: `notification-service/`
2. Add a `pom.xml` with Maven configuration
3. Add a `Dockerfile` for the Java app
4. Commit and push — `java-ci.yml` will auto-trigger

Example folder structure:
```
notification-service/
  ├── pom.xml
  ├── Dockerfile
  ├── src/
  │   ├── main/java/
  │   └── test/java/
  └── README.md
```

## Workflow Details

### laravel-ci.yml

Runs on every push/PR to `main` or `develop`:

- **Test** — Runs `php artisan test` against MongoDB
- **Lint** — Uses PHPStan for static analysis
- **Frontend** — Builds and lints React with Node 22

### build-deploy.yml

Runs on every push to `main`:

- **Build Laravel** — Docker build + push to GHCR
- **Build Java** — Only runs if `notification-service/pom.xml` exists
- **Deploy** — Calls Render API to redeploy

Images are tagged with:
- Branch name: `laravel:main`, `laravel:develop`
- Semantic versions: `laravel:v1.0.0`, `laravel:1.0`
- Git SHA: `laravel:abc123def`

### java-ci.yml

Runs on changes to `notification-service/`:

- **Maven build** — `mvn clean package`
- **Run tests** — `mvn test`
- **Artifacts** — Stores test results

## Common Issues

### "Container build fails"

Check:
- `npm ci` succeeds locally: `npm ci && npm run build`
- MongoDB URI is correct in `.env`
- All environment variables are set

### "Render deployment doesn't trigger"

Check:
- `RENDER_SERVICE_ID` and `RENDER_API_KEY` are correct
- Render service exists and is active
- Check **Actions** tab for logs

### "Java workflow doesn't run"

The Java workflow only triggers if:
- Changes are pushed to `notification-service/`
- `notification-service/pom.xml` exists

To test manually, go to **Actions > Java CI > Run workflow > main**

## Viewing Logs

1. Go to **Actions** tab
2. Click the workflow run
3. Expand each job to see logs

## Next Steps

1. Verify Laravel CI passes
2. Add Render secrets and test deployment
3. When creating Java service, verify java-ci.yml runs
4. Monitor container registry for built images
