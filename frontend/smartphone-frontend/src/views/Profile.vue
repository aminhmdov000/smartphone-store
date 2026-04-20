<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { logout } from '../services/authService';
import {
  removeProfile as removeProfileRequest,
  updateProfile as updateProfileRequest
} from '../services/userService';
import { useAuthStore } from '../store/modules/auth';
import { useCartStore } from '../store/modules/cart';
import { useOrderStore } from '../store/modules/orders';

const authStore = useAuthStore();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();

const orders = computed(() => orderStore.orders);
const visibleOrders = computed(() =>
  orders.value.filter((order) => order.status !== 'cancelled')
);
const loading = computed(() => orderStore.loading);
const error = computed(() => orderStore.error);
const userName = computed(() => authStore.user?.name || 'Customer');
const userEmail = computed(() => authStore.user?.email || 'No email available');
const orderCount = computed(() => visibleOrders.value.length);

const isLoggingOut = ref(false);
const isEditingProfile = ref(false);
const isSavingProfile = ref(false);
const isDeletingProfile = ref(false);
const profileMessage = ref('');
const profileError = ref('');
const editName = ref('');
const editEmail = ref('');
let feedbackTimer = null;

const formatPrice = (value) => cartStore.formatPrice(value);
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const clearFeedback = () => {
  profileMessage.value = '';
  profileError.value = '';
};

const showFeedback = (type, message) => {
  clearFeedback();

  if (feedbackTimer) {
    clearTimeout(feedbackTimer);
  }

  if (type === 'error') {
    profileError.value = message;
  } else {
    profileMessage.value = message;
  }

  feedbackTimer = window.setTimeout(() => {
    clearFeedback();
  }, 3500);
};

const syncProfileForm = () => {
  editName.value = authStore.user?.name || '';
  editEmail.value = authStore.user?.email || '';
};

const openProfileEditor = () => {
  syncProfileForm();
  clearFeedback();
  isEditingProfile.value = true;
};

const cancelProfileEdit = () => {
  syncProfileForm();
  clearFeedback();
  isEditingProfile.value = false;
};

const saveProfile = async() => {
  try {
    if (isSavingProfile.value) return;
    const nextName = editName.value.trim();
    const nextEmail = editEmail.value.trim();

    if (!nextName || !nextEmail) {
      showFeedback('error', 'Name and email are required.');
      return;
    }

    if (nextName.length < 2) {
      showFeedback('error', 'Name must be at least 2 characters.');
      return;
    }

    if (!isValidEmail(nextEmail)) {
      showFeedback('error', 'Enter a valid email address.');
      return;
    }

    isSavingProfile.value = true;
    clearFeedback();

    const res = await updateProfileRequest({
      name: nextName,
      email: nextEmail
    });

    authStore.updateUser(res.data.user);

    syncProfileForm();
    showFeedback('success', res.data.success || 'Profile updated successfully!');
    isEditingProfile.value = false;
  } catch (err) {
    showFeedback('error', err.response?.data?.error || 'Failed to update profile.');
  } finally {
    isSavingProfile.value = false;
  }
};

const logOut = async() => {
  if (isLoggingOut.value) return;

  isLoggingOut.value = true;
  const refreshToken = localStorage.getItem('refreshToken');

  try {
    if (refreshToken) {
      await logout(refreshToken);
    }
  } catch (err) {
    console.error('Logout cleanup failed:', err.response?.data || err.message);
  } finally {
    await cartStore.clearCart(false);
    authStore.logout();
    await router.push('/login');
    isLoggingOut.value = false;
  }
};

const deleteProfile = async() => {
  if (isDeletingProfile.value) return;

  const confirmed = window.confirm(
    'Delete your account permanently? This cannot be undone.'
  );

  if (!confirmed) {
    return;
  }

  isDeletingProfile.value = true;
  clearFeedback();

  try {
    await removeProfileRequest();
  } catch (err) {
    showFeedback('error', err.response?.data?.error || 'Failed to delete profile.');
    isDeletingProfile.value = false;
    return;
  }

  const refreshToken = localStorage.getItem('refreshToken');

  try {
    if (refreshToken) {
      await logout(refreshToken);
    }
  } catch (err) {
    console.error('Profile deletion logout cleanup failed:', err.response?.data || err.message);
  } finally {
    await cartStore.clearCart(false);
    authStore.logout();
    await router.push('/login');
    isDeletingProfile.value = false;
  }
};

onMounted(async() => {
  syncProfileForm();
  await orderStore.fetchMyOrders();
});
</script>

<template>
  <section class="profile-page">
    <div class="profile-shell">
      <header class="profile-hero">
        <div>
          <p class="eyebrow">Account</p>
          <h1>{{ userName }}</h1>
          <p class="subtitle">{{ userEmail }}</p>
        </div>
        <div class="hero-stats">
          <div class="stat-card">
            <span>Open Orders</span>
            <strong>{{ orderCount }}</strong>
          </div>
          <div class="stat-card">
            <span>Cart Total</span>
            <strong>{{ cartStore.formattedTotalPrice }}</strong>
          </div>
        </div>
      </header>

      <section class="profile-panel">
        <div class="profile-panel-head">
          <div>
            <p class="panel-label">Profile Settings</p>
            <h2>Account details</h2>
          </div>
          <button
            v-if="!isEditingProfile"
            class="action-button primary"
            @click="openProfileEditor"
          >
            Update Profile
          </button>
        </div>

        <p v-if="profileMessage" class="state-message success">{{ profileMessage }}</p>
        <p v-if="profileError" class="state-message error">{{ profileError }}</p>

        <Transition name="profile-editor">
          <div v-if="isEditingProfile" class="profile-form-card">
          <div class="profile-form-grid">
            <label class="field-group">
              <span>Name</span>
              <input v-model="editName" type="text" placeholder="Your name">
            </label>
            <label class="field-group">
              <span>Email</span>
              <input v-model="editEmail" type="email" placeholder="Your email">
            </label>
          </div>

          <div class="profile-form-actions">
            <button class="action-button primary" @click="saveProfile" :disabled="isSavingProfile">
              {{ isSavingProfile ? 'Saving...' : 'Save Changes' }}
            </button>
            <button class="action-button tertiary" @click="cancelProfileEdit" :disabled="isSavingProfile">
              Cancel
            </button>
          </div>
          </div>
        </Transition>
      </section>

      <div class="action-row">
        <router-link to="/checkout" class="action-button primary">
          Checkout Cart
        </router-link>
        <button class="action-button secondary" @click="logOut" :disabled="isLoggingOut">
          {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
        </button>
        <button
          class="action-button danger"
          @click="deleteProfile"
          :disabled="isDeletingProfile"
        >
          {{ isDeletingProfile ? 'Deleting account...' : 'Delete Account' }}
        </button>
      </div>

      <p v-if="loading" class="state-message">Loading orders...</p>
      <p v-else-if="error" class="state-message error">{{ error }}</p>
      <div v-else-if="!visibleOrders.length" class="empty-orders">
        <h2>No orders yet</h2>
        <p>Your completed orders will show up here after checkout.</p>
      </div>

      <div v-else class="orders-grid">
        <article v-for="order in visibleOrders" :key="order.id" class="order-card">
          <div class="order-head">
            <div>
              <p class="order-label">Order</p>
              <h3>#{{ order.id }}</h3>
            </div>
            <span class="status-pill">{{ order.status }}</span>
          </div>

          <div class="order-meta">
            <div>
              <span>Total</span>
              <strong>{{ formatPrice(order.total_price) }}</strong>
            </div>
            <div>
              <span>Items</span>
              <strong>{{ order.items.length }}</strong>
            </div>
          </div>

          <div class="item-list">
            <div v-for="item in order.items" :key="item.product_id" class="item-card">
              <span>{{ item.name }} x {{ item.quantity }}</span>
              <strong>{{ formatPrice(item.price) }}</strong>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  padding: 32px 20px 48px;
  background:
    radial-gradient(circle at top left, rgba(34, 197, 94, 0.16), transparent 28%),
    linear-gradient(180deg, #07111d 0%, #0f172a 55%, #111827 100%);
}

.profile-shell {
  max-width: 1100px;
  margin: 0 auto;
  color: white;
}

.profile-hero {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: end;
  margin-bottom: 26px;
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
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1.05;
}

.subtitle {
  margin: 12px 0 0;
  color: #cbd5e1;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(160px, 1fr));
  gap: 12px;
}

.stat-card {
  padding: 18px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-card span {
  display: block;
  color: #cbd5e1;
  margin-bottom: 8px;
}

.stat-card strong {
  font-size: 1.35rem;
}

.profile-panel {
  margin-bottom: 24px;
  padding: 22px;
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.profile-panel-head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
}

.panel-label {
  margin: 0 0 4px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.76rem;
  color: #86efac;
}

.profile-panel-head h2 {
  margin: 0;
  font-size: 1.3rem;
}

.profile-form-card {
  margin-top: 18px;
  padding: 18px;
  border-radius: 20px;
  background: rgba(2, 6, 23, 0.52);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.profile-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.field-group {
  display: grid;
  gap: 8px;
}

.field-group span {
  color: #cbd5e1;
  font-size: 0.95rem;
}

.field-group input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 23, 42, 0.88);
  color: white;
}

.field-group input:focus {
  outline: none;
  border-color: rgba(34, 197, 94, 0.55);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12);
}

.profile-form-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.action-row {
  display: flex;
  gap: 14px;
  margin-bottom: 24px;
}

.action-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease, background-color 0.2s ease;
  padding: 12px 22px;
  font-size: 14px;
  font-weight: 600;
}

.action-button:hover {
  transform: translateY(-1px);
}

.action-button:focus {
  outline: none;
}

.action-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.primary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

.secondary,
.tertiary {
  background: rgba(15, 23, 42, 0.82);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.state-message,
.empty-orders {
  padding: 22px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.state-message.error {
  color: #fecaca;
}

.state-message.success {
  color: #bbf7d0;
  margin-top: 16px;
}

.profile-editor-enter-active,
.profile-editor-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.profile-editor-enter-from,
.profile-editor-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.empty-orders h2 {
  margin: 0 0 10px;
}

.empty-orders p {
  margin: 0;
  color: #cbd5e1;
}

.orders-grid {
  display: grid;
  gap: 18px;
}

.order-card {
  padding: 22px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.82);
  box-shadow: 0 20px 40px rgba(2, 6, 23, 0.24);
  color: white;
}

.order-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: start;
  margin-bottom: 18px;
}

.order-label {
  margin: 0 0 4px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.76rem;
  color: #86efac;
}

.order-head h3 {
  margin: 0;
  font-size: 1.35rem;
}

.status-pill {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  color: #bbf7d0;
  text-transform: capitalize;
}

.order-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 18px;
}

.order-meta div {
  padding: 14px;
  border-radius: 16px;
  background: rgba(2, 6, 23, 0.5);
}

.order-meta span {
  display: block;
  color: #cbd5e1;
  margin-bottom: 6px;
}

.item-list {
  display: grid;
  gap: 10px;
}

.item-card {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 14px;
  border-radius: 16px;
  background: rgba(2, 6, 23, 0.45);
}

@media (max-width: 920px) {
  .profile-hero,
  .profile-panel-head,
  .profile-form-actions,
  .action-row,
  .order-head,
  .item-card {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-stats,
  .profile-form-grid,
  .order-meta {
    grid-template-columns: 1fr;
  }
}
</style>
