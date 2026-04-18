import { defineStore } from "pinia";
import {
  getAllOrders as getAllOrdersRequest,
  getMyOrders as getMyOrdersRequest,
  getOrderDetails as getOrderDetailsRequest,
  cancelOrder as cancelOrderRequest,
  updateOrderStatus as updateOrderStatusRequest
} from "../../services/orderService";

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [],
    loading: false,
    error: ''
  }),
  actions: {
    async fetchAllOrders(){
      try {
        this.loading = true;
        this.error = '';
        const res = await getAllOrdersRequest();
        this.orders = res.data;
      } catch (error) {
        this.error = 'Failed to fetch orders';
        console.error('Failed to fetch orders:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchMyOrders(){
      try {
        this.loading = true;
        this.error = '';
        const res = await getMyOrdersRequest();
        this.orders = res.data;
      } catch (error) {
        this.error = 'Failed to fetch my orders';
        console.error('Failed to fetch my orders:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchOrderDetails(id){
      try {
        this.loading = true;
        this.error = '';
        const res = await getOrderDetailsRequest(id);
        return res.data;
      } catch (error) {
        this.error = 'Failed to fetch order details';
        console.error('Failed to fetch order details:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async cancelOrder(id){
      try {
        this.loading = true;
        this.error = '';
        await cancelOrderRequest(id);
        const index = this.orders.findIndex(order => order.id === id);
        if(index !== -1) {
          this.orders[index].status = 'cancelled';
        }
      } catch (error) {
        this.error = 'Failed to cancel order';
        console.error('Failed to cancel order:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateOrderStatus(id, status){
      try {
        this.loading = true;
        this.error = '';
        await updateOrderStatusRequest(id, status);
        const index = this.orders.findIndex(order => order.id === id);
        if(index !== -1){
          this.orders[index].status = status;
        }
      } catch (error) {
        this.error = 'Failed to update order status';
        console.error('Failed to update order status:', error);
        throw error;
      }
      finally{
        this.loading = false;
      }
    }
  }
});
