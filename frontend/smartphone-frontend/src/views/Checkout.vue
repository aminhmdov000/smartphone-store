<script setup>
import { computed, ref } from 'vue';
import { checkout } from '../services/orderService';
import { useRouter } from 'vue-router';
import { useCartStore } from '../store/modules/cart';
import { useOrderStore } from '../store/modules/orders';

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const isPlacingOrder = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const cartItems = computed(() => cartStore.cart);
const paymentMethod = ref('fake_card');
const fakeCardName = ref('');
const fakeCardNumber = ref('');
const fakeCardExpiry = ref('');
const fakeCardCvv = ref('');

const placeOrder = async() => {
  try {
    if (isPlacingOrder.value) return;
    if (!cartItems.value.length) {
      errorMessage.value = 'Your cart is empty.';
      return;
    }

    if (paymentMethod.value === 'fake_card') {
      if (!fakeCardName.value.trim()) {
        errorMessage.value = 'Enter the card holder name.';
        return;
      }
      if (!/^\d{16}$/.test(fakeCardNumber.value.replace(/\s+/g, ''))) {
        errorMessage.value = 'Use a 16-digit card number.';
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(fakeCardExpiry.value.trim())) {
        errorMessage.value = 'Use expiry in MM/YY format.';
        return;
      }
      if (!/^\d{3,4}$/.test(fakeCardCvv.value.trim())) {
        errorMessage.value = 'Use a 3 or 4 digit CVV.';
        return;
      }
    }

    isPlacingOrder.value = true;
    errorMessage.value = '';
    successMessage.value = paymentMethod.value === 'fake_card'
      ? 'Processing fake payment...'
      : 'Creating your order...';
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const result = await checkout({
      paymentMethod: paymentMethod.value
    });
    successMessage.value = result.success;
    await orderStore.fetchMyOrders();
    await new Promise((resolve) => setTimeout(resolve, 700));
    await router.push('/profile');
  } catch (err) {
    errorMessage.value = err.response?.data?.error || err.message || 'Checkout failed.';
    successMessage.value = '';
    console.error('Checkout failed:', err.response?.data || err.message);
  } finally {
    isPlacingOrder.value = false;
  }
};
</script>
<template>
  <section class="checkout-page">
    <div class="checkout-shell">
      <p class="eyebrow">Checkout</p>
      <h1>Review your order</h1>
      <p class="subtitle">Choose a payment method, simulate payment, and learn the checkout flow.</p>

      <p v-if="errorMessage" class="state-message error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="state-message success">{{ successMessage }}</p>

      <div v-if="cartItems.length" class="checkout-card">
        <div class="payment-panel">
          <p class="section-title">Payment Method</p>

          <label class="payment-option" :class="{ active: paymentMethod === 'fake_card' }">
            <input v-model="paymentMethod" type="radio" value="fake_card">
            <div>
              <strong>Card Payment</strong>
              <span>Simulates instant online payment and creates the order as paid.</span>
            </div>
          </label>

          <label class="payment-option" :class="{ active: paymentMethod === 'cash_on_delivery' }">
            <input v-model="paymentMethod" type="radio" value="cash_on_delivery">
            <div>
              <strong>Cash on Delivery</strong>
              <span>Skips online payment and creates the order as pending.</span>
            </div>
          </label>

          <div v-if="paymentMethod === 'fake_card'" class="fake-card-form">
            <p class="section-title">Card Details</p>
            <input v-model="fakeCardName" type="text" placeholder="Card holder name">
            <input v-model="fakeCardNumber" type="text" inputmode="numeric" maxlength="19" placeholder="4242 4242 4242 4242">
            <div class="card-inline-fields">
              <input v-model="fakeCardExpiry" type="text" maxlength="5" placeholder="MM/YY">
              <input v-model="fakeCardCvv" type="text" inputmode="numeric" maxlength="4" placeholder="CVV">
            </div>
          </div>
        </div>

        <div class="item-list">
          <div v-for="item in cartItems" :key="item.id" class="item-row">
            <div>
              <strong>{{ item.name }}</strong>
              <span>Qty: {{ item.quantity }}</span>
            </div>
            <strong>{{ cartStore.formatPrice(item.price * item.quantity) }}</strong>
          </div>
        </div>

        <div class="summary-row">
          <span>Total</span>
          <strong>{{ cartStore.formattedTotalPrice }}</strong>
        </div>

        <button @click="placeOrder" class="checkout-button" :disabled="isPlacingOrder">
          {{ isPlacingOrder ? 'Submitting...' : paymentMethod === 'fake_card' ? 'Pay Now' : 'Place Order' }}
        </button>
      </div>

      <div v-else class="state-message">
        Your cart is empty.
      </div>
    </div>
  </section>
</template>
<style scoped>
.checkout-page {
  min-height: 100vh;
  padding: 32px 20px 48px;
  background:
    radial-gradient(circle at top right, rgba(34, 197, 94, 0.16), transparent 28%),
    linear-gradient(180deg, #07111d 0%, #0f172a 55%, #111827 100%);
}

.checkout-shell {
  max-width: 780px;
  margin: 0 auto;
  color: white;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #86efac;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
}

.subtitle {
  margin: 12px 0 24px;
  color: #cbd5e1;
}

.checkout-card,
.state-message {
  padding: 22px;
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.state-message.error {
  margin-bottom: 18px;
  color: #fecaca;
}

.state-message.success {
  margin-bottom: 18px;
  color: #bbf7d0;
}

.payment-panel {
  display: grid;
  gap: 14px;
  margin-bottom: 22px;
}

.section-title {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.76rem;
  color: #86efac;
}

.payment-option {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(2, 6, 23, 0.45);
  cursor: pointer;
}

.payment-option.active {
  border-color: rgba(34, 197, 94, 0.55);
  background: rgba(34, 197, 94, 0.12);
}

.payment-option input {
  margin-top: 3px;
}

.payment-option div {
  display: grid;
  gap: 4px;
}

.payment-option span {
  color: #cbd5e1;
}

.fake-card-form {
  display: grid;
  gap: 12px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(2, 6, 23, 0.45);
}

.fake-card-form input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.82);
  color: white;
}

.card-inline-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.item-list {
  display: grid;
  gap: 14px;
  margin-bottom: 20px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(2, 6, 23, 0.45);
}

.item-row div {
  display: grid;
  gap: 4px;
}

.item-row span {
  color: #cbd5e1;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 18px;
  margin-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 1.05rem;
}

.checkout-button {
  width: 100%;
  margin-top: 20px;
  border: none;
  border-radius: 14px;
  padding: 14px 18px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.checkout-button:hover {
  transform: translateY(-1px);
}

.checkout-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .item-row,
  .summary-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-inline-fields {
    grid-template-columns: 1fr;
  }
}
</style>
