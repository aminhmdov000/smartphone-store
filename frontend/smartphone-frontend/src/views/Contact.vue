<template>
  <div class="contact-page">
    <div class="contact-wrap">
      <!-- left intp panel -->
       <div class="contact-info">
        <p class="eyebrow">Get in touch</p>
        <h1>We'd love to hear from you</h1>
        <p class="info-sub">Have a question about an order, a product, or anything else? Send us a message and we'll get back to you within 24 hours.</p>
        <div class="info-cards">
          <div class="info-card">
            <span class="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </span>
            <div>
              <strong>Email us</strong>
              <span class="texts">support@smartstore.com</span>
            </div>
          </div>
          <div class="info-card">
            <span class="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </span>
            <div>
              <strong>Response time</strong>
              <span class="texts">Within 24 hours</span>
            </div>
          </div>
          <div class="info-card">
            <span class="info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </span>
            <div>
              <strong>Support hours</strong>
              <span class="texts">Monday-Friday, 9am-6pm</span>
            </div>
          </div>
        </div>
       </div>
       <!-- form -->
        <div class="contact-form-card">
          <form @submit.prevent="sendMessage" class="contact-form" novalidate>
            <div class="form-head">
              <p class="eyebrow">Contact form</p>
              <h2>Send a message</h2>
            </div>
            <label class="field">
              <span>Your email</span>
              <input type="email" v-model="email" placeholder="name@company.com" autocomplete="email"> 
            </label>
            <label class="field">
              <span>Subject</span>
              <input type="text" v-model="subject" placeholder="How can we help you?">
            </label>
            <label class="field">
              <span>Message</span>
              <textarea rows="5" v-model="message" placeholder="Tell us more about your question or issue..."></textarea>
            </label>
            <Transition name="msg">
              <p v-if="error" class="feedback-msg error">{{ error }}</p>
              <p v-else-if="success" class="feedback-msg success">{{ success }}</p>
            </Transition>
            <button type="submit" class="submit-btn" :disabled="loading">
              <template v-if="!loading">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>         
                Send message 
              </template>
              <span v-else class="spinner"></span>
            </button>
          </form>
        </div>
    </div>   
  </div>
</template>
<style scoped>
.contact-page{
  min-height: 100vh;
  padding: 48px 20px;
  background: 
    radial-gradient(circle at top right, rgba(34, 197, 94, 0.12), transparent 35%),
    linear-gradient(180deg, #07111d 0%, #0f172a 55%, #111827 100%);
  ;  
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-wrap{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  max-width: 1000px;
  width: 100%;
  align-items: start;
}

/* left panel */

.contact-info{
  color: white;
  padding-top: 12px;
}

.eyebrow{
  margin: 0 0 10px;
  font-size: 0.75rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: #86efac;
}

h1{
  margin: 0 0 16px;
  font-size: clamp(1.6rem, 3vw, 2,2rem);
  line-height: 1.2;
}

.info-sub{
  color: #64748b;
  line-height: 1.7;
  margin: 0 0 32px;
  font-size: 0.9rem;
}

.info-cards{
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-card{
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  background: rgba(15,23,42,0.8);
}

.info-icon{
  width: 38px;
  height: 38px;
  border: 1px solid rgba(34,197,94, 0.2);
  border-radius: 10px;
  background: rgba(34,197,94,0.15);
  color: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-card div{
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.info-card strong{
  font-size: 0.9rem;
  color: white;
}

.info-card .texts{
  font-size: 0.8rem;
  color: #64748b;
}

/* form card */

.contact-form-card{
  background: rgba(15,23,42,0.9);
  border: 1px solid rgba(255,255,255,0.1);
  border: 26px;
  padding: 32px 28px;
}

.contact-form{
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-head{ margin-bottom: 4px;}

.form-head h2{
  color: white;
  margin: 0;
  font-size: 1.3rem;
}

/* fields */

.field{
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field span{
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.05rem;
}

.field input, .field textarea{
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(2,6,23,0.7);
  color: white;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
  resize: vertical; 
}

.field input::placeholder,
.field textarea::placeholder{ 
  color: #334155;
}

.field input:focus,
.field textarea:focus{
  border-color: rgba(34,197,94,0.5);
  box-shadow: 0 0 0 3px rgba(34,197,94,0.1);
}

/* feedback */
.feedback-msg{
  margin: 0;
  padding: 11px 14px;
  border: 12px;
  font-size: 0.9rem;
}

.feedback-msg.error{
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  color: #fca5a5;
  border-radius: 12px;
}

.feedback-msg.success{
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.2);
  color: #86efac;
  border-radius: 12px;
}

.msg-enter-active, .msg-leave-active{ transition: opacity 0.2s, transform 0.2s;}
.msg-enter-from, .msg-leave-to{ opacity: 0; transform: translateY(-6px);}

/* submit button */
.submit-btn{
  display: flex;
  color: white;
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 8px;
  padding: 13px;
  border-radius: 14px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition:  opacity 0.2s, transform 0.2s;
  min-height: 48px;
}

.submit-btn:hover:not(:disabled){
  opacity: 0.9;
  transform: translateY(-1px);
}

.submit-btn:disabled{
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
 
@keyframes spin { to { transform: rotate(360deg); } }

/* responsive */

@media (max-width: 800px){
  .contact-wrap{
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .contact-page{
    align-items: flex-start;
    padding: 36px 16px 48px;
  }
}

</style>
<script setup>
import { ref } from 'vue';
// import { useRouter } from 'vue-router';
import { contact } from '../services/authService';

const email = ref('');
const subject = ref(''); 
const message = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);
const successTimer = ref(0);
const errorTimer = ref(0);
const showError = (message,duration=3000) => {
  if(errorTimer.value) clearTimeout(errorTimer.value);
  error.value = message;
  success.value = null
  successTimer.value = setTimeout(() => {
    error.value = null
  }, duration);
}
const showSuccess = (message,duration=3000) => {
  if(successTimer.value) clearTimeout(successTimer.value);
  success.value = message;
  error.value = null
  successTimer.value = setTimeout(() => {
    success.value = null
  }, duration);
}
const sendMessage = async() => {
  if(loading.value) return;
  success.value = null
  error.value = null
  if(!email.value.trim() || !subject.value.trim() || !message.value.trim()) return showError('All fields are required!');
  loading.value = true;
  try {
    await contact({
      email: email.value,
      subject: subject.value,
      message: message.value
    })
    showSuccess('Message sent successfully!')
    email.value = '',
    subject.value = '',
    message.value = ''
  } catch (err) {
    showError(err.response?.data?.error || err.message)
  }
  finally{
    loading.value = false;
  }
} 
</script>