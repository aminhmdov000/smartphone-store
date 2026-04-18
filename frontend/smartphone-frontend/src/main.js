import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './store/modules/auth'
import { useCartStore } from './store/modules/cart'
import './style.css'
import App from './App.vue'
import router  from './router'
const app = createApp(App);
const pinia = createPinia();
app.use(pinia)
const authStore = useAuthStore();
authStore.loadUserFromStorage();
const cartStore = useCartStore();
cartStore.fetchCart();
app.use(router);
app.mount('#app');
// createApp(App).use(router).use(pinia).mount('#app')
