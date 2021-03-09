## Run Docker image locally

```bash
docker build . -t automation:latest
docker run -p 8080:8080 automation
```

## Deploy to Google Cloud Run

1.  Comment out `*.sh` and `*.js` in `.gitignore`
1.  ```bash
    ./node_modules/typescript/bin/tsc -p tsconfig.json
    ```
1.  ```bash
    PROJECT_ID=$(gcloud config get-value project)
    gcloud builds submit --tag gcr.io/$PROJECT_ID/automation
    gcloud run deploy --image gcr.io/$PROJECT_ID/automation --platform managed
    ```

## Google Cound Scheduler Job

UI seems to be very limited. Use command line

```bash
# service url
gcloud run services describe automation --format 'value(status.url)'
# create job for hn
gcloud beta scheduler jobs create http hn --schedule "1 8,14,21 * * *" --time-zone="America/New_York" --http-method=POST --headers="Content-Type=application/json" --message-body='{"jobType": "HN"}' --uri=[SERVICE-URL]--oidc-service-account-email=[SERVICE-ACCOUNT_NAME]@[PROJECT-ID].iam.gserviceaccount.com --oidc-token-audience=[SERVICE-URL]
```
