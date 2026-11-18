import storage from '../src/utils/storage';

describe('user credential storage', () => {
  beforeEach(async () => {
    await storage.user.clearUserData();
  });

  it('stores tokens separately from the persisted user profile', async () => {
    await expect(
      storage.user.setUserInfo({
        id: 'user-1',
        name: 'Test User',
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      }),
    ).resolves.toBe(true);

    await expect(storage.user.getUserInfo()).resolves.toEqual({
      id: 'user-1',
      name: 'Test User',
    });
    await expect(storage.user.getAccessToken()).resolves.toBe('access-token');
    await expect(storage.user.getRefreshToken()).resolves.toBe('refresh-token');
  });
});
