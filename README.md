# automation

An HTTP-triggered background job runner for Google Cloud Run. It exposes a
small Express server that runs jobs on demand, typically driven by Cloud
Scheduler.

Currently bundled jobs:

- **HN** — fetches the current top Hacker News stories, skips anything already
  seen (tracked in a Dropbox-backed cache), and pushes a digest of the best new
  ones through Pushbullet.

The HN job used to live in a separate `hn-job` repository and was shipped into
this service as a `makeself` self-extracting archive. It is now vendored
directly under `src/jobs/hn`, so this repository is fully self-contained.

## Project layout

```
src/
  server.ts          Express server; routes job requests
  config.ts          Env-backed configuration (read lazily)
  jobs/
    hn/
      index.ts       runHnJob() entry point
      hnutils.ts     Hacker News fetch/format helpers
      dbx.ts         Dropbox-backed "already seen" cache
      hnutils.spec.ts
types/
  pushbullet.d.ts    Type shim for the untyped pushbullet package
```

## API

- `GET /` — health check, returns `It works!`.
- `POST /` with `{"jobType": "HN"}` — runs the HN job. Responds `201` on
  success, `400` for an unknown job type, `500` on failure.

## Configuration

The HN job requires the following environment variables (read only when the job
runs, so the server still starts without them):

| Variable            | Description                  |
| ------------------- | ---------------------------- |
| `PushBulletApiKey`  | Pushbullet API key           |
| `DeviceId`          | Target Pushbullet device id  |
| `DropAccessToken`   | Dropbox access token (cache) |

For local development, copy `.env.example` to `.env` and fill in the values;
they are loaded automatically via `dotenv`. In Cloud Run they are set as plain
environment variables on the service (see the deploy step below); the `.env`
file is not used there.

## Develop

```bash
npm install
npm run build      # compile src/ -> dist/
npm test           # run jest tests
npm start          # run compiled server (needs the env vars above)
```

## Run the container locally

```bash
docker build -t automation:latest .
docker run -p 8080:8080 \
  -e PushBulletApiKey=... \
  -e DeviceId=... \
  -e DropAccessToken=... \
  automation:latest
```

## Deploy to Cloud Run

The three job values are passed as plain environment variables on the service.
Load them from a local `.env` and expand them so the literal values stay out of
your shell history:

```bash
PROJECT_ID=$(gcloud config get-value project)
REGION=us-east1
REPO=automation-repo
IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/automation"

gcloud builds submit --tag "$IMAGE"

set -a; . ./.env; set +a
gcloud run deploy automation \
  --image "$IMAGE" \
  --region "$REGION" \
  --platform managed \
  --set-env-vars "DropAccessToken=$DropAccessToken,PushBulletApiKey=$PushBulletApiKey,DeviceId=$DeviceId"
```

## Schedule the HN job

Cloud Scheduler invokes the service on a cron schedule:

```bash
SERVICE_URL=$(gcloud run services describe automation --region us-east1 --format 'value(status.url)')
gcloud scheduler jobs create http hn \
  --schedule "1 8,14,21 * * *" \
  --time-zone "America/New_York" \
  --http-method POST \
  --headers "Content-Type=application/json" \
  --message-body '{"jobType": "HN"}' \
  --uri "$SERVICE_URL" \
  --oidc-service-account-email "[SERVICE-ACCOUNT]@$(gcloud config get-value project).iam.gserviceaccount.com" \
  --oidc-token-audience "$SERVICE_URL"
```
