import api from './api';

export const getCart = () => api.get('/cart');

export const addCartItem = ({ productID, quantity }) =>
  api.post('/cart/add', { productID, quantity });

export const updateCartItem = (id, quantity) =>
  api.put(`/cart/update/${id}`, { quantity });

export const removeCartItem = (id) => api.delete(`/cart/remove/${id}`);
