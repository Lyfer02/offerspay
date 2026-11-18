jest.mock('../api/axios', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

import API from '../api/axios';
import { authService } from '../api/services/auth.service';
import { endpoints } from '../api/endPoints';

describe('authService.refreshToken', () => {
  it('posts the refresh token to the configured endpoint', async () => {
    API.post.mockResolvedValue({ data: { accessToken: 'next-access-token' } });

    await authService.refreshToken('current-refresh-token');

    expect(API.post).toHaveBeenCalledWith(endpoints.auth.refreshToken, {
      refreshToken: 'current-refresh-token',
    });
  });
});
