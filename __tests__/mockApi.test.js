import { createDemoAdapter } from '../api/mockApi';

const request = (url, method = 'get', data, params) => ({
  url,
  method,
  data: data ? JSON.stringify(data) : undefined,
  params,
});

describe('demo API fixtures', () => {
  const adapter = createDemoAdapter();

  it('returns a demo login session', async () => {
    const response = await adapter(request('api/v1/users/login', 'post', {
      email: 'demo@offerspay.test',
      password: 'OffersPay123!',
    }));

    expect(response.status).toBe(200);
    expect(response.data.data.user.email).toBe('demo@offerspay.test');
    expect(response.data.data.accessToken).toBe('demo-access-token');
  });

  it('provides home, store, product, wallet and notification fixtures', async () => {
    const urls = [
      'api/v1/dashboard/user-home-data',
      'api/v1/stores',
      'api/v1/products',
      'api/v1/walletHistory/user',
      'api/v1/notifications',
    ];

    const responses = await Promise.all(urls.map(url => adapter(request(url))));

    expect(responses[0].data.data.banners.length).toBeGreaterThan(0);
    expect(responses[1].data.data.storeData.length).toBeGreaterThan(0);
    expect(responses[2].data.data.products.length).toBeGreaterThan(0);
    expect(responses[3].data.data.results.length).toBeGreaterThan(0);
    expect(responses[4].data.data.notifications.length).toBeGreaterThan(0);
  });
});
