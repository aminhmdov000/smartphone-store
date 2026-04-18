import {createRouter,createWebHistory} from 'vue-router';
import { useAuthStore } from '../store/modules/auth';
import Home from '../views/Home.vue';
import Admin from '../views/Admin.vue';
import Cart from '../views/Cart.vue';
import Checkout from '../views/Checkout.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ProductDetail from '../views/ProductDetail.vue';
import Profile from '../views/Profile.vue';
import About from '../views/About.vue';
import Products from '../views/Products.vue';
import Contact from '../views/Contact.vue';
const routes = [
  {path: '/', name: 'home', component: Home},
  {path: '/admin', name: 'admin', component: Admin, meta: {requiresAuth:true ,requiresAdmin: true}},
  {path: '/cart', name: 'cart', component: Cart, meta: {requiresAuth: true}},
  {path: '/checkout', name: 'checkout', component: Checkout, meta: {requiresAuth: true}},
  {path: '/login', name: 'login', component: Login, meta: {guestOnly: true}},
  {path: '/register', name: 'register', component: Register, meta: {guestOnly: true}},
  {path: '/product/:id', name: 'productDetail', component: ProductDetail},
  {path: '/profile', name: 'profile', component: Profile, meta: {requiresAuth: true}},
  {path: '/contact', name: 'contact', component: Contact},
  {path: '/about', name: 'about', component: About},
  {path: '/products', name: 'products', component: Products},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to,from,savedPosition){
    if(savedPosition) return savedPosition;
    else return {top: 0};
  }
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLoggedIn;
  const isAdmin = authStore.user?.role === 'admin';
  if(to.meta.requiresAuth && !isLoggedIn) {
    return {
      path: '/login',
      query: {redirect: to.fullPath}
  }
  }
  if(to.meta.requiresAdmin && !isAdmin) return '/';
  if(to.meta.guestOnly && isLoggedIn)  return '/';
});

export default router;
