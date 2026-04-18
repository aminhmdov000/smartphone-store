import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://smartphone-store-backend-9k4t.onrender.com/api';

const api = axios.create({ baseURL });

const clearAuthStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

const redirectToLogin = () => {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

const storeTokens = (accessToken, refreshToken) => {
  localStorage.setItem('token', accessToken);

  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url === '/auth/refresh-token'
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      clearAuthStorage();
      redirectToLogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const res = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken });
      const nextAccessToken = res.data.accessToken || res.data.token;
      const nextRefreshToken = res.data.refreshToken || refreshToken;

      if (!nextAccessToken) {
        throw new Error('Refresh response did not include an access token.');
      }

      storeTokens(nextAccessToken, nextRefreshToken);
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
