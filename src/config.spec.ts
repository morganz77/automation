import {
  dropboxAccessToken,
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
    process.env.DropAccessToken = 'drop-token';

    expect(pushBulletApiKey()).toBe('api-key');
    expect(pushBulletDeviceId()).toBe('device-id');
    expect(dropboxAccessToken()).toBe('drop-token');
  });

  it('throws naming the missing variable', () => {
    delete process.env.DropAccessToken;

    expect(() => dropboxAccessToken()).toThrow(/DropAccessToken/);
  });
});
