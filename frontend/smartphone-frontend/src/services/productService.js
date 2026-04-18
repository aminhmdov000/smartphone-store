import api from './api';

export const getProducts = () => {
  return api.get('/products');
};

export const createProduct = (productData) => {
  return api.post('/products/add', productData);
};

export const updateProduct = (id, productData) => {
  return api.put(`/products/${id}`, productData);
};

export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};
