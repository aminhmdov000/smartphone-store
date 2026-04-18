<template>
  <section class="auth-page">
    <div class="auth-wrap">
      <!-- left panel -->
       <div class="auth-side">
        <div class="side-inner">
          <div class="side-logo">
            <div class="phone-icon">
              <div class="phone-dot"></div>
            </div>
            <span>Smart<span class="green">Store</span></span>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to access your orders, profile and the best deals on premium smartphones.</p>
          <div class="side-features">
            <div class="feature-row">
              <span class="feature-dot"></span>
              <span>Track and manage your orders</span>
            </div>
            <div class="feature-row">
              <span class="feature-dot"></span>
              <span>Fast, secure checkout</span>
            </div>
          </div>
        </div>
       </div>
       <!-- Form card -->
        <div class="auth-card">
          <div class="auth-card-inner">
            <div class="card-head">
              <p class="eyebrow">Welcome back</p>
              <h1>Sign in</h1>
              <p class="subtitle">
                No account yet? <router-link to="/register">Create one</router-link>
              </p>
            </div>
            <form class="auth-form" novalidate @submit.prevent="signIn">
              <label class="field">
                <span>Email address</span>
                <input type="email" v-model="email" placeholder="name@company.com" autocomplete="email">
              </label>
              <label class="field">
                <span>Password</span>
                <input type="password" v-model="password" placeholder="********" autocomplete="currrent-password">
              </label>
              <div class="form-row">
                <label class="remember-row">
                  <input type="checkbox" v-model="remember" />
                  <span>Remember me</span>
                </label>
                <a href="#" class="forgot-link">Forgot password?</a>
              </div>
              <Transition name="err">
                <p v-if="error" class="error-msg">{{ error }}</p>
              </Transition>
              <button type="submit" class="submit-btn" :disabled="loading">
                <span v-if="!loading">Sign in</span>
                <span v-else class="spinner"></span>
              </button>
            </form>
          </div>
        </div>
    </div>
  </section>
</template>
<style scoped>
.auth-page{
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  background: linear-gradient(180deg, #07111d 0%, #0f172a 60%, #111827 100%);
}

.auth-wrap{
  display: flex;
  width: 100%;
}

.auth-side{
 flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px 40px;
  background: 
  radial-gradient(circle at 30% 40%, rgba(34,197,94,0.06), transparent 55%),
  rgba(2,6,23,0.5);
  border-right: 1px solid rgba(255,255,255,0.06);
}

.side-inner{
  max-width: 360px;
  color: white;
}

.side-logo{
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.3rem;
  font-weight: 800;
  color: white;
  margin-bottom: 40px;
  letter-spacing: 0.3px;
}

.phone-icon{
  border: 2.5px solid rgba(255,255,255,0.5);
  border-radius: 10px;
  width: 30px;
  height: 50px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 5px ;
}

.phone-dot{
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
}

.green{ color: #22c55e;}

.side-inner h2{
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  line-height: 1.2;
  margin: 0 0 16px;
}

.side-inner > p{
  color: #64748b;
  line-height: 1.7;
  margin: 0 0 16px;
}

.side-features{
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feature-row{
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  color: #94a3b8;
}

.feature-dot{
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  flex-shrink: 0;
}
 
/* form card */

.auth-card{
  width: 480px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
  background: rgba(7,17,29,0.6);
}

.auth-card-inner{
  width: 100%;
  max-width: 380px;
}

.card-head{
  margin-bottom: 30px;
}

.eyebrow{
  margin: 0 0 8px;
  font-size: 0.7rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: #86efac;
}

h1{
  margin: 0 0 10px;
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  line-height: 1;
}

.subtitle{
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
}

.subtitle a{
  color: #22c55e;
  font-weight: 600;
  text-decoration: none;
}

/* form fields */
.auth-form{
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field{
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field span{
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
}

.field input{
  padding-inline: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(15,23,42,0.8);
  color: white;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.field input:placeholder-shown{ color: #334155;}

.field input:focus{
  border-color: rgba(34,197,94,0.5);
  box-shadow: 0 0 0 3px rgba(34,197,94, 0.1);
}

/* remember / forgot row */
.form-row{
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.remember-row{
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.remember-row input[type="checkbox"]{
  width: 15px;
  height: 15px;
  accent-color: #22c55e;
  cursor: pointer;
}

.remember-row span{
  font-size: 0.9rem;
  color: #64748b;
}

.forgot-link{
  font-size: 0.9rem;
  color: #22c55e;
  /* text-decoration: none; */
  font-weight: 600;
}

.forgot-link:hover{
  text-decoration: underline;
}

/* error */
.error-msg{
  margin: 0;
  padding:10px 14px;
  border-radius: 10px;
  background: rgba(239,68,68,0.2);
  border: 1px solid rgba(239,68,68,0.3);
  color: #fca5a5;
  font-size: 0.9rem;
}

.err-enter-active, .err-leave-active{
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.err-enter-from, .err-leave-to{
  opacity: 0;
  transform: translateY(-6px);
}

.submit-btn{
  width: 100%;
  border: none;
  border-radius: 14px;
  padding: 13px;
  background: linear-gradient(135deg, #22c553, #16a34a);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
}

.submit-btn:hover:not(:disabled){
  opacity: 0.9;
  transform: translateY(-1px);
}

.spinner{
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin{ to { transform: rotate(360deg); } }

@media (max-width: 860px){
  /* .auth-side{ display: none;} */

  .auth-wrap{
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .auth-card{ 
    width: 100%;
    padding: 48px 24px;
  }

  .auth-page{
    align-items: flex-start;
    padding: 36px 16px 48px;
  }
}
</style>
<script setup>
import { ref } from 'vue';
import { login } from '../services/authService';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../store/modules/auth';
import { useCartStore } from '../store/modules/cart';

const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const error = ref('');
const errorTimer = ref(0)
const loading = ref(false);
const remember = ref(false)
const showError = (message,duration = 3000) => {
  if(errorTimer.value) clearTimeout(errorTimer.value);
  error.value = message
  errorTimer.value = setTimeout(() => {
    error.value = '';
  }, duration);
}
const signIn = async() => {
  if(loading.value) return
  if(!email.value.trim() || !password.value.trim()) {
    return showError('Email and password are required.');
  }
  loading.value = true
  try {
    const res = await login({
      email: email.value,
      password: password.value
    });
    authStore.login(
      res.data.user,
      res.data.accessToken,
      res.data.refreshToken
    )
    await cartStore.fetchCart();
    const redirect = route.query.redirect || '/';
    if(res.data.user.role === 'admin') router.push('/admin');
    else router.push(redirect);
    // router.push(redirect)
  } catch (err) {
    showError(err.response?.data?.error || 'Login failed. Please try again.');
  }
  finally{
    loading.value = false
  }
} 
</script>
