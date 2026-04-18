<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useCartStore } from '../../store/modules/cart';
import {useAuthStore} from '../../store/modules/auth';
import Sidebar from './Sidebar.vue';
const login = useAuthStore();
const cartStore = useCartStore();
const userInitial = computed(() => (login.user?.name || 'U').charAt(0).toUpperCase());
const isScrolled = ref(false);
const sidebarOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 80
}

const openSidebar = () => {
  sidebarOpen.value = true;
  document.body.style.overflow = 'hidden'
};

const closeSidebar = () => {
  sidebarOpen.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})

</script>
<template>
  <div :class="['navbar', {scroll: isScrolled}]">
    <nav>
      <router-link to="/" class="brand-link">
        <div class="logo-wrapper">
        <div class="logo-box">
          <div class="phone">
            <div class="home-button"></div>
          </div>
          <div class="brand">
            <h1>
              Smart<span>Store</span>
            </h1>
            <p>SMARTPHONE SHOP</p>
          </div>
        </div>
      </div>
      </router-link>
     
<div class="nav-center">
        <div class="middleroutes">
          <router-link to="/admin" v-if="login.user?.role === 'admin'">Admin</router-link>
          <router-link to="/products">Products</router-link>
          <router-link to="/about">About</router-link>
          <router-link to="/contact">Contact</router-link>
        </div>
      </div>
      <div class="right-section">
        <div class="desktop-icons">
          <router-link to="/cart" class="icon-link cart-link" v-if="login.isLoggedIn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            <span class="cart-count">{{ cartStore.cart.length }}</span>
          </router-link>
          <router-link v-if="login.isLoggedIn" to="/profile" class="profile-chip">
            <span class="avatar">{{ userInitial }}</span>
          </router-link>
          <router-link v-else to="/login" class="login-link">Sign in</router-link>
        </div>
        <!-- hamburger button -->
        <button @click="openSidebar" aria-label="Open menu" class="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  </div>
  <Sidebar :is-open="sidebarOpen" @close="closeSidebar" />
</template>
<style scoped> 
.navbar{
  margin: 0;
  padding: 14px 28px;
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: padding 0.2s ease, background 0.2s ease;
}

.navbar.scroll {
  padding: 10px 28px;
  background: rgba(15, 23, 42, 0.96);
}
.navbar nav{
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar a {
  text-decoration: none;
}

.brand-link {
  flex-shrink: 0;
}

.profile{
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.middleroutes{
  display: flex;
  gap: 4px;
  align-items: center;
  /* flex-wrap: wrap; */
}

.middleroutes a {
  padding: 10px 14px;
  border-radius: 999px;
  font-size: 0.98rem;
  font-weight: 600;
  color: #cbd5e1;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.middleroutes a:hover,
.middleroutes a.router-link-active {
  background: rgba(59, 130, 246, 0.2);
  color: white;
  transform: translateY(-1px);
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #ffffff, #eff6ff);
  padding: 10px 16px;
  border-radius: 20px;
  border: 1px solid rgba(37, 99, 235, 0.08);
  /* box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08); */
}

.phone {
  width: 26px;
  height: 44px;
  border: 3px solid #111;
  border-radius: 10px;
  /* position: relative; */
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 6px;
}

.home-button {
  width: 6px;
  height: 6px;
  background: #111;
  border-radius: 50%;
}

.brand h1 {
  font-size: 17px;
  font-weight: 800;
  margin: 0;
  letter-spacing: 0.5px;
  color: #111;
}

.brand h1 span {
  color: #2563eb;
}

.brand p {
  font-size: 9px;
  letter-spacing: 3px;
  margin: 4px 0 0;
  color: #6b7280;
}

.icon-link,
.login-link,
.profile-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.icon-link {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s;
  position: relative;
  /* backdrop-filter: blur(10px); */
}

.icon-link:hover{
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.2);
}

.cart-count {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #22c55e;
  color: white;
  font-size: 0.72rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

.profile-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  /* backdrop-filter: blur(10px); */
  transition: background 0.2s;
}
.profile-chip:hover {
  background: rgba(255, 255, 255, 0.12);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
}

.profile-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.profile-text strong {
  font-size: 0.9rem;
}

.profile-text small {
  text-transform: capitalize;
  color: #64748b;
}

.login-link {
  display: inline-flex;
  align-items: center;
  padding: 10px 18px;
  border-radius: 12px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
}
.login-link:hover{
  opacity: 0.9;
  transform: translateY(-1px);
}
.right-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.desktop-icons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.hamburger{
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.07);
  cursor: pointer;
  transition: background 0.2s;
}

.hamburger:hover{
  background: rgba(255,255,255,0.12);
}

.hamburger span{
  display: block;
  height: 2px;
  border-radius: 2px;
  background: #cbd5e1;
  transition: background 0.2s;
}


@media (max-width: 768px){
  .navbar{
    padding: 12px 18px;
  }

  .navbar.scroll{
    padding: 10px 18px;
  }

  .nav-center, .desktop-icons{
    display: none;
  }

  .hamburger{
    display:  flex;
  }
}

@media (max-width: 480px){
  .brand p{
    display: none;
  }
.logo-box{
  padding: 8px 12px;
}
}
</style>
