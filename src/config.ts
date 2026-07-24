function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Each value is read lazily (at call time) and independently, so a caller only
// requires the variables it actually uses and the HTTP server can still start
// and serve health checks without the job secrets configured. In Cloud Run the
// values come from the service's environment variables.
export const pushBulletApiKey = (): string => requireEnv('PushBulletApiKey');
export const pushBulletDeviceId = (): string => requireEnv('DeviceId');

// Dropbox uses an OAuth2 refresh token (with the app key/secret); the SDK
// exchanges it for short-lived access tokens automatically.
export const dropboxCredentials = () => ({
  appKey: requireEnv('DropboxAppKey'),
  appSecret: requireEnv('DropboxAppSecret'),
  refreshToken: requireEnv('DropboxRefreshToken'),
});
