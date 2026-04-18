<!-- <script setup>
import {computed, ref, onMounted} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../store/modules/products';
import { useCartStore } from '../store/modules/cart';
import { useAuthStore } from '../store/modules/auth';

const route = useRouter();
const router = useRouter();
const productStore = useProductStore();
const authStore = useAuthStore();
const cartStore = useCartStore();

const loading = ref(false);
const error = ref('');
const added = ref(false);
const selectQty = ref(1);
let addedTimer = null;

const product = computed(() => 
  productStore.products.find((p) => p.ud === Number(route.params.id))
);

const getImage = (image) => {
  if(!image) return
  if(image.startsWith('hhtp') || image.startsWith('/')) return image;
  return `/uploads/${image}`;
}

const formattedPrice = computed(() => 
  product.value ? cartStore.formatPrice(product.value.price) : ''
);

const addToCart = () => {
  if(!authStore.isLoggedIn || !product.value) return;
  for(let i = 0; i < selectedQty.value; i++ ){
    cartStore.addToCart(product.value)
  }
  added.value = true
  if(addedTimer) clearTimeout(addedTimer);
  addedtimer = setTimeout(() => {added.value = false;}, 2500);
};

onMounted(async() => {
  if(!productStore.products.length){
    loading.value = true
  try{
    await productStore.fetchProducts();
  } catch(err){
    error.value = 'Failed to load product.'
  } finally{
    loading.value = false;
  }
}
})
</script> -->
<!-- <template>
  <div class="detail-page">
    loading
     <div v-if="loading" class="state-wrap">
      <div class="spiinner-lg"></div>
      <p>Loading product...</p>
     </div>
     error
      <div v-else-if="error" class="state-wrap error">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        {{ error }}
        <button class="back-btn" @click="router.back()">Go back</button>
      </div>
      not found
       <div v-else-if="!product" class="state-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <p>Produt not found.</p>
          <button class="back-btn" @click="router.push('/products')">Browse products</button>
       </div>
       products
        <div v-else class="detail-wrap">
          Breadcrumb
           <nav class="breadcrumb">

           </nav>
        </div>
  </div>
</template> -->

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductStore } from '../store/modules/products';
import { useCartStore } from '../store/modules/cart';
import { useAuthStore } from '../store/modules/auth';

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();
const authStore = useAuthStore();

const loading = ref(false);
const error = ref('');
const added = ref(false);
const selectedQty = ref(1);
let addedTimer = null;

const product = computed(() =>
  productStore.products.find((p) => p.id === Number(route.params.id))
);

const getImage = (image) => {
  if (!image) return null;
  if (image.startsWith('http') || image.startsWith('/')) return image;
  return `/uploads/${image}`;
};

const formattedPrice = computed(() =>
  product.value ? cartStore.formatPrice(product.value.price) : ''
);

const addToCart = () => {
  if (!authStore.isLoggedIn || !product.value) return;
  cartStore.addToCart(product.value, selectedQty.value);
  added.value = true;
  if (addedTimer) clearTimeout(addedTimer);
  addedTimer = setTimeout(() => { added.value = false; }, 2500);
};

onMounted(async () => {
  if (!productStore.products.length) {
    loading.value = true;
    try {
      await productStore.fetchProducts();
    } catch (err) {
      error.value = 'Failed to load product.';
    } finally {
      loading.value = false;
    }
  }
});
</script>

<template>
  <div class="detail-page">

    <!-- Loading -->
    <div v-if="loading" class="state-wrap">
      <div class="spinner-lg"></div>
      <p>Loading product...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-wrap error">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
      <p>{{ error }}</p>
      <button class="back-btn" @click="router.back()">Go back</button>
    </div>

    <!-- Not found -->
    <div v-else-if="!product" class="state-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <p>Product not found.</p>
      <button class="back-btn" @click="router.push('/products')">Browse products</button>
    </div>

    <!-- Product -->
    <div v-else class="detail-wrap">

      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <router-link to="/">Home</router-link>
        <span>/</span>
        <router-link to="/products">Products</router-link>
        <span>/</span>
        <span class="crumb-current">{{ product.name }}</span>
      </nav>

      <div class="detail-grid">

        <!-- Image panel -->
        <div class="image-panel">
          <div class="image-wrap">
            <img
              v-if="product.image_url"
              :src="getImage(product.image_url)"
              :alt="product.name"
              class="product-img"
            />
            <div v-else class="img-placeholder">📱</div>
          </div>
        </div>

        <!-- Info panel -->
        <div class="info-panel">

          <div class="info-top">
            <p class="product-brand">{{ product.brand }}</p>
            <h1 class="product-name">{{ product.name }}</h1>
            <p class="product-price">{{ formattedPrice }}</p>
          </div>

          <p v-if="product.description" class="product-desc">{{ product.description }}</p>
          <p v-else class="product-desc muted">No description available for this product.</p>

          <!-- Specs -->
          <div v-if="product.specs || product.storage || product.screen_size || product.camera || product.battery" class="specs-grid">
            <div v-if="product.storage" class="spec-item">
              <span>Storage</span>
              <strong>{{ product.storage }}</strong>
            </div>
            <div v-if="product.ram" class="spec-item">
              <span>RAM</span>
              <strong>{{ product.ram }}</strong>
            </div>
            <div v-if="product.screen_size" class="spec-item">
              <span>Screen Size</span>
              <strong>{{ product.screen_size }}</strong>
            </div>
            <div v-if="product.camera" class="spec-item">
              <span>Camera</span>
              <strong>{{ product.camera }}</strong>
            </div>
            <div v-if="product.battery" class="spec-item">
              <span>Battery</span>
              <strong>{{ product.battery }}</strong>
            </div>
          </div>

          <!-- Quantity + Add to Cart -->
          <div class="purchase-row">
            <div class="qty-control">
              <button @click="selectedQty = Math.max(1, selectedQty - 1)" :disabled="selectedQty <= 1">−</button>
              <span>{{ selectedQty }}</span>
              <button @click="selectedQty = Math.min(10, selectedQty + 1)" :disabled="selectedQty >= 10">+</button>
            </div>

            <button
              class="add-to-cart-btn"
              :class="{ added }"
              :disabled="!authStore.isLoggedIn"
              @click="addToCart"
            >
              <template v-if="added">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Added to cart!
              </template>
              <template v-else-if="!authStore.isLoggedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
                Login to add
              </template>
              <template v-else>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                Add to Cart
              </template>
            </button>
          </div>

          <!-- Login nudge -->
          <p v-if="!authStore.isLoggedIn" class="login-nudge">
            <router-link to="/login">Sign in</router-link> to add this product to your cart.
          </p>

          <!-- Trust badges -->
          <div class="trust-row">
            <div class="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              2-Year Warranty
            </div>
            <div class="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
              30-Day Returns
            </div>
            <div class="trust-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14">
                <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              Free Shipping $99+
            </div>
          </div>

        </div>
      </div>

      <!-- Back link -->
      <div class="back-row">
        <button class="back-btn" @click="router.back()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to products
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.detail-page {
  min-height: 100vh;
  padding: 32px 20px 64px;
  background:
    radial-gradient(circle at top right, rgba(34, 197, 94, 0.1), transparent 35%),
    linear-gradient(180deg, #07111d 0%, #0f172a 55%, #111827 100%);
  color: white;
}

/* ── States ── */
.state-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 60vh;
  color: #64748b;
  text-align: center;
}

.state-wrap.error { color: #f87171; }
.state-wrap p { margin: 0; font-size: 1rem; }

.spinner-lg {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: #22c55e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Main wrap ── */
.detail-wrap {
  max-width: 1100px;
  margin: 0 auto;
}

/* ── Breadcrumb ── */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
  font-size: 0.82rem;
  color: #475569;
}

.breadcrumb a {
  color: #475569;
  text-decoration: none;
  transition: color 0.18s;
}

.breadcrumb a:hover { color: #22c55e; }
.crumb-current { color: #94a3b8; }

/* ── Grid ── */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
  margin-bottom: 32px;
}

/* ── Image panel ── */
.image-panel {
  position: sticky;
  top: 90px;
}

.image-wrap {
  aspect-ratio: 1;
  border-radius: 26px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-placeholder {
  font-size: 8rem;
}

/* ── Info panel ── */
.info-panel {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-top { display: flex; flex-direction: column; gap: 8px; }

.product-brand {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #86efac;
}

.product-name {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2rem);
  line-height: 1.15;
}

.product-price {
  margin: 0;
  font-size: 1.6rem;
  font-weight: 800;
  color: #22c55e;
}

.product-desc {
  margin: 0;
  color: #94a3b8;
  font-size: 0.92rem;
  line-height: 1.7;
}

.product-desc.muted { color: #334155; font-style: italic; }

/* ── Specs ── */
.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.spec-item {
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.spec-item span {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #475569;
}

.spec-item strong {
  font-size: 0.9rem;
  color: white;
}

/* ── Purchase row ── */
.purchase-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.qty-control {
  display: flex;
  align-items: center;
  gap: 0;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;
}

.qty-control button {
  width: 38px;
  height: 44px;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-control button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.07);
  color: white;
}

.qty-control button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-control span {
  min-width: 36px;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
}

.add-to-cart-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 13px 20px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s, background 0.3s;
  min-height: 46px;
}

.add-to-cart-btn:hover:not(:disabled) {
  opacity: 0.88;
  transform: translateY(-1px);
}

.add-to-cart-btn:disabled {
  background: rgba(255, 255, 255, 0.07);
  color: #475569;
  cursor: not-allowed;
}

.add-to-cart-btn.added {
  background: linear-gradient(135deg, #16a34a, #15803d);
}

/* ── Login nudge ── */
.login-nudge {
  margin: -8px 0 0;
  font-size: 0.82rem;
  color: #475569;
}

.login-nudge a {
  color: #22c55e;
  text-decoration: none;
  font-weight: 600;
}

.login-nudge a:hover { text-decoration: underline; }

/* ── Trust row ── */
.trust-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.trust-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: #64748b;
  padding: 7px 12px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

/* ── Back ── */
.back-row { margin-top: 8px; }

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 23, 42, 0.7);
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

/* ── Responsive ── */
@media (max-width: 760px) {
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .image-panel {
    position: static;
  }

  .image-wrap {
    max-height: 360px;
  }

  .purchase-row {
    flex-direction: column;
    align-items: stretch;
  }

  .qty-control {
    justify-content: center;
  }
}
</style>
