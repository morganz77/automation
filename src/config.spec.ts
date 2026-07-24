import {
  dropboxCredentials,
  pushBulletApiKey,
  pushBulletDeviceId,
} from './config';

describe('config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('reads each variable when present', () => {
    process.env.PushBulletApiKey = 'api-key';
    process.env.DeviceId = 'device-id';
    process.env.DropboxAppKey = 'app-key';
    process.env.DropboxAppSecret = 'app-secret';
    process.env.DropboxRefreshToken = 'refresh-token';

    expect(pushBulletApiKey()).toBe('api-key');
    expect(pushBulletDeviceId()).toBe('device-id');
    expect(dropboxCredentials()).toEqual({
      appKey: 'app-key',
      appSecret: 'app-secret',
      refreshToken: 'refresh-token',
    });
  });

  it('throws naming the missing variable', () => {
    process.env.DropboxAppKey = 'app-key';
    process.env.DropboxAppSecret = 'app-secret';
    delete process.env.DropboxRefreshToken;

    expect(() => dropboxCredentials()).toThrow(/DropboxRefreshToken/);
  });
});
