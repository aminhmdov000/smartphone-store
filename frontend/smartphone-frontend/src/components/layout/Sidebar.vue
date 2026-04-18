<script setup>
import { Teleport, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../store/modules/auth';
import { useCartStore } from '../../store/modules/cart';

const proops = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const userInitial = computed(() => (authStore.user?.name || 'U').charAt(0).toUpperCase());


const navLinks = [
  {label: 'Products', to: '/products'},
  {label: 'About', to: '/about'},
  {label: 'Contact', to: '/contact'},
];

// Close sidebar and navigate
const navigate = (path) => { 
  emit('close');
  router.push(path);
}
</script>

<template>
  <Teleport to='body'>
    <!-- backdrop -->
     <Transition name="backdrop">
      <div 
      v-if="isOpen"
      class="sidebar-backdrop"
      @click="emit('close')"
      />
     </Transition>
     <!-- drawer -->
      <Transition name="drawer">
        <aside v-if="isOpen" class="sidebar">
          <!-- Header -->
           <div class="sidebar-header">
            <div class="sidebar-brand">
              <div class="phone-icon">
                <div class="phone-btn"></div>
              </div>
              <div>
                <p class="brand-name">Smart<span>Store</span></p>
                <p class="brand-sub">SMARTPHONE SHOP</p>
              </div>
            </div>
            <button class="close-btn" @click="emit('close')" aria-label="Close menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
           </div>
           <!-- user strip (if logged in) -->
            <div v-if="authStore.isLoggedIn" class="user-strip">
              <div class="user-avatar">{{ userInitial }}</div>
              <div class="user-info">
                <strong>{{ authStore.user?.name || 'Profile' }}</strong>
                <small>{{ authStore.user?.email || authStore.user?.role || 'member'}}</small>
              </div>
            </div>
            <!-- nav links -->
             <nav class="sidebar-nav">
              <p class="nav-section-label">Menu</p>
              <button class="nav-item admin" v-if="authStore.user?.role === 'admin'" @click="navigate('/admin')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                Admin 
              </button>
              <button v-for="link in navLinks" :key="link.to" class="nav-item" @click="navigate(link.to)">
                <svg v-if="link.label === 'Products'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3.75h3" />
                </svg>
                <svg v-else-if="link.label === 'About'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
                <svg v-else-if="link.label === 'Contact'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                {{ link.label }}
              </button>
             </nav>
             <!-- account section -->
              <div class="sidebar-account">
                <p class="nav-section-label">Account</p>
                <template v-if="authStore.isLoggedIn">
                    <button class="nav-item" @click="navigate('/cart')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                      Cart
                      <span v-if="cartStore.cart.length" class="cart-badge">{{ cartStore.cart.length }}</span>
                    </button>
                    <button class="nav-item" @click="navigate('/profile')">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                      My Profile
                    </button>
                </template>
                <template v-else>
                  <button class="nav-item login-nav-item" @click="navigate('/login')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                    Sign In
                  </button>
                </template>
              </div>
        </aside>
      </Transition>
  </Teleport>
</template>
<style scoped>
.sidebar-backdrop{
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.7);
  backdrop-filter: blur(4px);
  z-index: 80;
}

.sidebar{
  position: fixed;
  top: 0;
  left: 0;
  height: 100dvh;
  width: 300px;
  z-index: 100;
  max-width: 85vw;
  background: linear-gradient(180deg, #0d1829 0%, #0f172a 100%);
  border-right: 1px solid rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
}

/* header */
.sidebar-header{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 18px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
}

.sidebar-brand{
  display: flex;
  align-items: center;
  gap: 12px;
}

.phone-icon{
  width: 28px;
  height: 48px;
  border: 2.5px solid rgba(255,255,255,0.5);
  border-radius: 10px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 5px;
  flex-shrink: 0;
}

.phone-btn{
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
}

.brand-name{
  margin:0;
  font-size: 1rem;
  font-weight: 800;
  color: white;
  letter-spacing: 0.5px;
}

.brand-name span{
  color: #22c55e;
}

.brand-sub{
  margin: 2px 0 0;
  font-size: 0.62rem;
  letter-spacing: 0.2rem;
  color: #475569;
}

.close-btn{
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.close-btn:hover{
  background: rgba(239,68,68, 0.2);
  color: #fca5a5;
  border-color: rgba(239,68,68,0.25);
}

/* user strip */
.user-strip{
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 14px 18px;
  padding: 14px;
  border: 1px solid rgba(34,197,94,0.15);
  background: rgba(34,197,94,0.08);
  border-radius: 16px;
}

.user-avatar{
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
}

.user-info{
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.user-info strong{
  font-size: 0.9rem;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-info small{
  font-size: 0.75rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-nav, .sidebar-account{
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-account{
  padding-top: 4px;
  border-top: 1px solid rgba(255,255,255,0.07);
  margin: 4px;
}

.nav-section-label{
  margin: 8px 6px 6px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18rem;
  text-transform: uppercase;
  color: #334155;
}

.nav-item{
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 11px 14px;
  border-radius: 12px;
  border: none;
  background: transparent;
  color: #94a3b8;  
  font-size: 0,92rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s, color 0.2s;
  position: relative; 
}

.nav-item:hover{
  background: rgba(255,255,255,0.06);
  color: white;
}

.nav-item.admin{
  color: #86efac;
}

.nav-item.admin:hover{
  background: rgba(34,197,94,0.1);
  color: #22c55e;
}

.nav-item.login-nav-item{
  color: #22c55e ;
  background: rgba(34,197,94,0.06);
  border: 1px solid rgba(34,197,94,0.2);
  margin-top: 4px;
}

.nav-item.login-nav-item:hover{
  background: rgba(34,197,94, 0.15);
  color: #4ade80;
}

.cart-badge{
  margin-left: auto;
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #22c55e;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}

/* transitions */
.backdrop-enter-active,
.backdrop-leave-active{
  transition: opacity 0.15s ease;
}

.backdrop-enter-from,
.backdrop-to-to{
  opacity: 0;
}

.drawer-enter-active,
.drawer-leave-active{
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}

.drawer-enter-from,
.drawer-leave-to{
  transform: translateX(-100%);
}
</style>