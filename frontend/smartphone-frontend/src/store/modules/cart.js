import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem
} from "../../services/cartService";

const roundCurrency = (value) => Number(Number(value).toFixed(2));
const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(roundCurrency(value));

export const useCartStore = defineStore('cart', {  
  state: () => ({
    cart: [],
    loading: false,
    error: ''
  }),
  actions: {
  async fetchCart() {
    const authStore = useAuthStore();
    if (!authStore.isLoggedIn) {
      this.cart = [];
      this.error = '';
      return;
    }

    try {
      this.loading = true;
      this.error = '';
      const res = await getCart();
      this.cart = res.data;
    } catch (error) {
      this.error = error.response?.data?.error || 'Failed to load cart.';
      console.error('Failed to load cart:', error);
    } finally {
      this.loading = false;
    }
  },
  async addToCart(product, quantity = 1) {
    const authStore = useAuthStore();
    if(!authStore.isLoggedIn) return alert('You must sign in!');
    await addCartItem({ productID: product.id, quantity });
    await this.fetchCart();
  },
  async removeFromCart(id){
    await removeCartItem(id);
    this.cart = this.cart.filter((item) => item.cart_item_id !== id);
  },
  async clearCart(syncServer = true){
    const existingItems = [...this.cart];
    this.cart = [];

    if (!syncServer || !existingItems.length) {
      return;
    }

    await Promise.allSettled(
      existingItems.map((item) => removeCartItem(item.cart_item_id))
    );
  },
  async increaseQty(id){
    const item = this.cart.find((cartItem) => cartItem.cart_item_id === id);
    if(!item) return;
    await updateCartItem(id, item.quantity + 1);
    item.quantity += 1;
  },
  async decreaseQty(id){
    const item = this.cart.find((cartItem) => cartItem.cart_item_id === id);
    if(!item) return;
    if(item.quantity <= 1) {
      await this.removeFromCart(id);
      return;
    }
    await updateCartItem(id, item.quantity - 1);
    item.quantity -= 1;
  }
},
 getters: {
    totalPrice: (state) => {   
      const total = state.cart.reduce((sum, item) => {
        return sum + Number(item.price) * Number(item.quantity);
      }, 0);

      return roundCurrency(total);
    },
    formattedTotalPrice() {
      return formatCurrency(this.totalPrice);
    },
    formatPrice: () => (value) => formatCurrency(value)
  }
})
