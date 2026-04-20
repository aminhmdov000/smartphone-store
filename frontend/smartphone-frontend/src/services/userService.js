import api from './api';

export const getUsers = () => {
  return api.get('/users/users');
};

export const deleteUser = (id) => {
  return api.delete(`/users/users/${id}`);
};

export const updateProfile = (profileData) => {
  return api.put('/users/profile', profileData);
};

export const getProfile = () => {
  return api.get('/users/profile');
};

export const removeProfile = () => {
  return api.delete('/users/profile');
};
