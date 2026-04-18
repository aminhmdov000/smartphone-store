import api from './api';
export const register = (user) => {
  return api.post('/auth/register', user);
};
export const login = (user) => {
  return api.post('/auth/login', user)
};
export const logout = (refreshToken) => {
  return api.post('/auth/logout', { refreshToken });
};
export const contact = (contact) => {
  return api.post('/contact', contact)
};
export const refreshToken = (refreshToken) => {
  return api.post('/auth/refresh-token', {refreshToken});
}
