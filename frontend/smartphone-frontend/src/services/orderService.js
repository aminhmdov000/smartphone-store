import api from "./api";
import { useCartStore } from "../store/modules/cart";
export const checkout = async(orderData) => {
  const cartStore = useCartStore();
  if(!cartStore.cart.length) throw new Error('Cart is empty!');
  const payload = {
    ...orderData,
    items: cartStore.cart,
    total_price: cartStore.totalPrice 
  }
  const res = await api.post('/orders/checkout', payload);
  await cartStore.clearCart(false);
  return res.data;
};
export const getMyOrders = () => {
  return api.get('/orders/my-orders');
};
//Admin functions
export const getAllOrders = () => {
  return api.get('/orders');
}
//Order details and cancel order (both user and admin)
export const getOrderDetails = (id) => {
  return api.get(`/orders/${id}`);
}
export const cancelOrder = (id) => {
  return api.put(`/orders/${id}/cancel`);
}
export const updateOrderStatus = (id, status) => {
  return api.put(`/orders/${id}/status`, {status});
}
export const getOrderStatuses = () => {
  return api.get('/orders/statuses');
}
