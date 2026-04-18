<script setup>
import { useCartStore } from '../../store/modules/cart';
import { useAuthStore } from '../../store/modules/auth';

const cartStore = useCartStore();
const authStore = useAuthStore();

const props = defineProps({
  product: Object
});

const getImage = (image) => {
  if(!image) return null;
  if(image.startsWith('http') || image.startsWith('/')) return image;
  return `/uploads/${image}`
}
const sendToCart = () => {
  if(!authStore.isLoggedIn) return;
  cartStore.addToCart(props.product)
}
</script>
<template>
  <div class="product-card">
    <!-- image -->
     <div class="card-img-wrap">
      <img 
      v-if="product.image_url"
      :src="getImage(product.image_url)" 
      :alt="product.name"
      class="card-img"
      >
      <div v-else class="card-img-placeholder">📱</div>
     </div>
     <!-- info -->
      <div class="card-body">
        <p class="card-brand">{{ product.brand }}</p>
        <h3 class="card-name">{{ product.name }}</h3>
        <p class="card-price">{{ cartStore.formatPrice(product.price) }}</p>
      </div>
      <!-- actions -->
       <div class="card-footer">
        <router-link :to="'/product/' + product.id" class="btn-details">View Details</router-link>
        <button 
        class="btn-cart"
        :disabled="!authStore.isLoggedIn"
        :title="!authStore.isLoggedIn ? 'Login to add to cart' : ''"
        @click="sendToCart"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="15" height="15">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          Add to Cart
        </button>
       </div>
  </div>
</template>
<style scoped>
.product-card{
  display: flex;
  flex-direction: column;
  background: rgba(15,23,42,0.8);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 22px;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.product-card:hover{
  transform: translateY(-4px);
  border-color: rgba(34,197,94,0.3);
}

.card-img-wrap{
  aspect-ratio: 1;
  background: rgba(2,6,23,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .card-img{
  transform: scale(1.04);
}

.card-img-placeholder{
  font-size: 4rem;
}

.card-body{
  padding: 14px 16px 10px;
  flex: 1;
}

.card-brand{
  margin: 0 0 4px;
  font-size: 0.8rem;
  color: #86efac;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14rem;
}

.card-name{
  margin: 0 0 10px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.35;
  display: -webkit-box;
  /* -webkit-line-clamp: 2; */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-price{
  color: #22c55e;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.card-footer{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px 14px 14px;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.btn-details, .btn-cart{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
  text-decoration: none;
  border: none;
}

.btn-details{
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #cbd5e1;
}

.btn-details:hover{
  background: rgba(255,255,255,0.12);
  color: white;
}

.btn-cart{
  color: white;
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.btn-cart:hover:not(:disabled){
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-cart:disabled{
  opacity: 0.35;
  cursor: not-allowed;
  background: rgba(255,255,255,0.1);
  color: #465569;
}

</style>
