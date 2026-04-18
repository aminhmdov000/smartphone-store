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
          <h2>Your next phone is one step away.</h2>
          <p>Join thousands of customers who get the best deals on premium smartphones.</p>
          <div class="side-stats">
            <div class="side-stat">
              <strong>10K+</strong>
              <span>Happy Customers</span>
            </div>
            <div class="side-stat"> 
              <strong>500+</strong>
              <span>Products</span>
            </div>
          </div>
        </div>
       </div>
       <!-- Form card -->
        <div class="auth-card">
          <div class="auth-inner-card">
            <div class="card-head">
              <p class="eyebrow">Get started</p>
              <h1>Create an account</h1>
              <p class="subtitle">Already have one? <router-link to="/login">Sign in</router-link></p>
            </div>
            <form @submit.prevent="signUp" class="auth-form" novalidate>
              <label class="field">
                <span>Full name</span>
                <input type="text" v-model="name" placeholder="John Doe" autocomplete="name" />
              </label>
              <label class="field">
                <span>Email adress</span>
                <input type="email" v-model="email" placeholder="name@company.com" autocomplete="email" />
              </label>
              <label class="field">
                <span>Password</span>
                <input type="password" v-model="password" placeholder="********" />
              </label>
              <label class="terms-row">
                <input type="checkbox" v-model="terms" />
                <span>I accept the <a href="#">Terms and Conditions</a></span>
              </label>
              <Transition name="err">
                <p v-if="error" class="error-msg">{{ error }}</p>
              </Transition>
              <button class="submit-btn" :disabled="loading" type="submit">
                <span v-if="!loading">Create account</span>
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

/* left panel */
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

.side-inner p{
  color: #64748b;
  line-height: 1.7;
  margin: 0 0 32px;
}

.side-stats{
  display: flex;
  gap: 20px;
}

.side-stat{
  border: 1px solid rgba(255,255,255,0.07);
  padding: 14px 18px;
  border-radius: 16px;
  background: rgba(15,23,42, 0.7);
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.side-stat strong{
  font-size: 1.3rem;
  color: #22c55e;
}

.side-stat span{
  font-size: 0.8rem;
  color: #475569;
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

.subtitle a:hover{ text-decoration: underline;}

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

/* terms */
.terms-row{
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}

.terms-row input[type='checkbox']{
  margin-top: 2px;
  width: 16px;
  height: 16px;
  accent-color: #22c55e;
  flex-shrink: 0;
  cursor: pointer;
}

.terms-row span{
  font-size: 0.8rem;
  color: #64748b;
}

.terms-row a{
  color: #22c55e;
}

.terms-row a:hover{ text-decoration: underline;}

/* error messages */

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

/* submit button */
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

/* responsive */

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
import { register } from '../services/authService';
import { useRouter } from 'vue-router';

const router = useRouter();
const name = ref('');
const password = ref('');
const email = ref('');
const error = ref('');
const loading = ref(false)
const errorTimer = ref(0);
const terms = ref(false);

const showError = (message, duration=3000) => {
  if(errorTimer.value) clearTimeout(errorTimer.value);
  error.value = message
  errorTimer.value = setTimeout(() => {
    error.value = '';
  }, duration);
};

const signUp = async() => {
  if(loading.value) return;
  try {
    if(!name.value.trim() || !password.value.trim() || !email.value.trim() || !terms.value) return showError('All fields are required!');
    if(name.value.trim().length < 3) return showError('Name must be at least 3 characters!');
    if(password.value.trim().length < 8 || !/[A-Z]/.test(password.value) || !/[a-z]/.test(password.value) || !/\d/.test(password.value)){
      return showError('Password must includes Upper, Lower letters and Numbers!');
    }
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regexEmail.test(email.value)) return showError('Please enter valid email!');
    if(!terms.value) return showError('You must accept the Terms and Conditions!');
    loading.value = true;
    await register({
      name: name.value,
      password: password.value,
      email: email.value
    });
    router.push('/login')
  } catch (err) {
    showError(err.response?.data?.error || err.message || 'Registration failed.')
    console.log(err.response?.data)
  }
  finally{
    loading.value = false
  }
}
</script>
