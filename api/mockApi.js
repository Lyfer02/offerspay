import axios from 'axios';
import { DEMO_LOGIN_EMAIL, DEMO_LOGIN_PASSWORD } from '@env';
import {
  demoBanners,
  demoClicks,
  demoNotifications,
  demoProducts,
  demoShortLinks,
  demoStores,
  demoUser,
  demoWalletBalance,
  demoWalletEntries,
} from './mockData';

const successful = data => ({ success: true, data });

const getPath = config => {
  const rawUrl = config.url || '';
  return new URL(rawUrl, 'http://localhost').pathname.replace(/^\/+|\/+$/g, '');
};

const getParams = config => {
  const params = new URLSearchParams(config.url?.split('?')[1] || '');
  Object.entries(config.params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null) params.set(key, String(value));
  });
  return params;
};

const getBody = config => (
  typeof config.data === 'string' ? JSON.parse(config.data || '{}') : config.data || {}
);

const paginate = (items, params) => {
  const page = Math.max(1, Number(params.get('page')) || 1);
  const limit = Math.max(1, Number(params.get('limit')) || 10);
  const start = (page - 1) * limit;
  const results = items.slice(start, start + limit);
  const totalPages = Math.max(1, Math.ceil(items.length / limit));

  return {
    results,
    pagination: {
      currentPage: page,
      totalPages,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

const getDemoUser = config => {
  const body = getBody(config);
  const fullName = body.name || body.fullName || demoUser.fullName;
  const email = body.email || demoUser.email;
  return { ...demoUser, fullName, email };
};

const routeDemoRequest = config => {
  const path = getPath(config);
  const method = (config.method || 'get').toLowerCase();
  const params = getParams(config);

  if (method === 'post' && path.endsWith('users/login')) {
    const body = getBody(config);
    if (body.email !== DEMO_LOGIN_EMAIL || body.password !== DEMO_LOGIN_PASSWORD) {
      return {
        success: false,
        message: 'Use the demo account configured in the project .env file.',
      };
    }

    return successful({
      user: getDemoUser(config),
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
    });
  }

  if (method === 'post' && path.endsWith('users/register')) {
    return successful({
      user: getDemoUser(config),
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
    });
  }

  if (method === 'post' && path.endsWith('users/refresh-token')) {
    return successful({
      accessToken: 'demo-access-token-refreshed',
      refreshToken: 'demo-refresh-token',
    });
  }

  if (path.endsWith('users/logout') || path.endsWith('fcm/update-token-fcm') || path.endsWith('fcm/clear-token-fcm')) {
    return successful({ message: 'Demo operation completed.' });
  }

  if (method === 'get' && path.endsWith('dashboard/user-home-data')) {
    const groups = demoProducts.reduce((result, product) => {
      const key = product.category;
      result[key] = [...(result[key] || []), product];
      return result;
    }, {});
    return successful({
      wallet: demoWalletBalance,
      storelist: demoStores,
      banners: demoBanners,
      stores: groups,
    });
  }

  if (path === 'api/v1/stores' && method === 'get') {
    const search = (params.get('search') || '').toLowerCase();
    const stores = search
      ? demoStores.filter(store => store.name.toLowerCase().includes(search))
      : demoStores;
    return successful({
      storeData: stores,
      currentPage: Number(params.get('page')) || 1,
      hasNextPage: false,
    });
  }

  const storeId = path.match(/^api\/v1\/stores\/([^/]+)$/)?.[1];
  if (storeId && method === 'get') {
    const store = demoStores.find(item => item._id === storeId) || demoStores[0];
    return successful(store);
  }

  if (path === 'api/v1/products' && method === 'get') {
    const search = (params.get('search') || '').toLowerCase();
    const products = demoProducts.filter(product => {
      const matchesSearch = !search || product.name.toLowerCase().includes(search);
      const matchesStore = !params.get('store') || product.store._id === params.get('store');
      return matchesSearch && matchesStore;
    });
    return successful({
      products,
      pagination: {
        currentPage: Number(params.get('page')) || 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
  }

  if (path === 'api/v1/products/analytics/top/most-shared' && method === 'get') {
    return successful({
      products: demoProducts.filter(product => product.isMostShared).slice(0, Number(params.get('limit')) || 10),
      pagination: { currentPage: 1, totalPages: 1, hasNextPage: false, hasPrevPage: false },
    });
  }

  const productId = path.match(/^api\/v1\/products\/([^/]+)$/)?.[1];
  if (productId && method === 'get') {
    const product = demoProducts.find(item => item._id === productId) || demoProducts[0];
    return successful(product);
  }

  if (path === 'api/v1/banners' && method === 'get') {
    return successful({ banners: demoBanners, bannerData: demoBanners });
  }

  if (path.startsWith('api/v1/banners/') && method === 'get') {
    return successful(demoBanners[0]);
  }

  if (path === 'api/v1/videos' && method === 'get') {
    return successful({ videos: [] });
  }

  if (path === 'api/v1/clicks' && method === 'get') {
    return successful({ clicks: demoClicks });
  }

  if (path === 'api/v1/shortLinks' && method === 'get') {
    return successful({ shortLinks: demoShortLinks });
  }

  if (path === 'api/generate-link' && method === 'post') {
    return successful({
      shortCode: 'demo-link',
      shortUrl: 'https://offerspay.test/d/demo-link',
      url: 'https://offerspay.test/d/demo-link',
    });
  }

  if (path === 'api/v1/walletHistory/get-wallet-details' && method === 'get') {
    return successful(demoWalletBalance);
  }

  if (path === 'api/v1/walletHistory/user' && method === 'get') {
    return successful({
      ...paginate(demoWalletEntries, params),
    });
  }

  if (path === 'api/v1/walletHistory/export-excel' && method === 'get') {
    return new Uint8Array([80, 75, 3, 4]);
  }

  if (path === 'api/v1/images/get-share-data' && method === 'get') {
    return successful({
      image: '',
      referralCode: 'DEMO2026',
      referralEarning: 350,
    });
  }

  if (path === 'api/v1/notifications' && method === 'get') {
    return successful({
      notifications: demoNotifications,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        limit: 10,
        hasNextPage: false,
      },
    });
  }

  if (path === 'api/v1/notifications/mark-seen' && method === 'patch') {
    return successful({ updated: true });
  }

  if (path.startsWith('api/v1/users/admin/') && method === 'get') {
    return successful(demoUser);
  }

  if (path === 'api/v1/users/current-user' && method === 'get') {
    return successful(demoUser);
  }

  if (path === 'api/v1/users/get-users' && method === 'get') {
    return successful({ users: [demoUser] });
  }

  if (path === 'api/v1/users/update-details' && method === 'put') {
    return successful({ ...demoUser, ...getBody(config) });
  }

  if (path === 'api/v1/users/update-profile-picture' && method === 'put') {
    return successful({ avatar: '' });
  }

  if (path.startsWith('api/v1/products/analytics/') && method === 'post') {
    return successful({ recorded: true });
  }

  return undefined;
};

export const createDemoAdapter = () => async config => {
  const data = routeDemoRequest(config);
  if (data === undefined) {
    const response = {
      data: { success: false, message: `No demo fixture for ${config.method?.toUpperCase()} ${config.url}` },
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config,
      request: null,
    };
    throw new axios.AxiosError(
      response.data.message,
      axios.AxiosError.ERR_BAD_REQUEST,
      config,
      null,
      response,
    );
  }

  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    request: null,
  };
};
