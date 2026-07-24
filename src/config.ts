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
    pushBulletApiKey: requireEnv('PushBulletApiKey'),
    pushBulletDeviceId: requireEnv('DeviceId'),
    dropboxAccessToken: requireEnv('DropAccessToken'),
  };
}
