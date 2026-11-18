import axios from 'axios';
import { API_URL, DEMO_MODE } from '@env';
import { endpoints } from './endPoints';
import storage from '../src/utils/storage';
import { notifySessionExpired } from '../src/utils/authSession';
import { createDemoAdapter } from './mockApi';

const apiBaseUrl = typeof API_URL === 'string' ? API_URL.trim().replace(/\/+$/, '') : '';
const isDemoMode = DEMO_MODE === 'true';

const API = axios.create({
  baseURL: apiBaseUrl || undefined,
  withCredentials: true,
  ...(isDemoMode ? { adapter: createDemoAdapter() } : {}),
});
let refreshRequest = null;

API.interceptors.request.use(
  async config => {
    if (!isDemoMode && !apiBaseUrl) {
      throw new Error('API_URL is not configured. Set it in the project .env file or enable DEMO_MODE.');
    }

    const token = await storage.user.getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

API.interceptors.response.use(
  response => response,
  async error => {
    const request = error.config;
    const isRefreshRequest = request?.url?.includes(endpoints.auth.refreshToken);

    if (error.response?.status !== 401 || !request || request._retry || isRefreshRequest) {
      return Promise.reject(error);
    }

    request._retry = true;

    try {
      if (!refreshRequest) {
        refreshRequest = (async () => {
          const refreshToken = await storage.user.getRefreshToken();
          if (!refreshToken) {
            throw new Error('No refresh token is available.');
          }

          const response = await axios.post(
            `${apiBaseUrl}/${endpoints.auth.refreshToken}`,
            { refreshToken },
            { withCredentials: true },
          );
          const tokenData = response.data?.data || response.data;
          const accessToken = tokenData?.accessToken;
          const nextRefreshToken = tokenData?.refreshToken || refreshToken;

          if (!accessToken) {
            throw new Error('The refresh response did not contain an access token.');
          }

          const accessTokenStored = await storage.user.setAccessToken(accessToken);
          const refreshTokenStored = await storage.user.setRefreshToken(nextRefreshToken);
          if (!accessTokenStored || !refreshTokenStored) {
            throw new Error('Unable to persist refreshed credentials.');
          }

          return accessToken;
        })().finally(() => {
          refreshRequest = null;
        });
      }

      const accessToken = await refreshRequest;
      request.headers = request.headers || {};
      request.headers.Authorization = `Bearer ${accessToken}`;
      return API(request);
    } catch (refreshError) {
      await storage.user.clearUserData();
      notifySessionExpired();
      return Promise.reject(refreshError);
    }
  },
);

export default API;
