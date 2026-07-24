function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Configuration for the Hacker News job. Read lazily (at job run time) so the
 * HTTP server can still start and serve health checks when the secrets are not
 * configured. Values are supplied via environment variables, typically backed
 * by Secret Manager in Cloud Run.
 */
export function getHnJobConfig() {
  return {
    pushBulletApiKey: requireEnv('PUSHBULLET_API_KEY'),
    pushBulletDeviceId: requireEnv('PUSHBULLET_DEVICE_ID'),
    dropboxAccessToken: requireEnv('DROPBOX_ACCESS_TOKEN'),
  };
}
