<template>
  <div>
    <!-- loading -->
     <div v-if="productStore.loading" class="product-grid">
      <div v-for="n in 8" :key="n" class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton-line short"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line medium"></div>
        </div>
        <div class="skeleton-footer">
          <div class="skeleton-btn"></div>
          <div class="skeleton-btn"></div>
        </div>
      </div>
     </div>
         <!-- Error -->
    <div v-else-if="productStore.error" class="state-card error">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
      </svg>
      <p>{{ productStore.error }}</p>
    </div>
 
    <!-- Empty -->
    <div v-else-if="!productStore.filteredProducts.length" class="state-card">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <p>No products match these filters.</p>
      <span>Try adjusting your search or clearing the filters.</span>
    </div>

    <div v-else class="product-grid">
      <ProductCard v-for="product in productStore.filteredProducts" :key="product.id" :product="product" />
    </div>
  </div>
</template>
<script setup>
// import { onMounted } from 'vue';
import { useProductStore } from '../../store/modules/products';
import ProductCard from './ProductCard.vue';

const productStore = useProductStore();

// onMounted(() => {
//   productStore.fetchProducts().catch(() => {});
// })
</script>
<style scoped>
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 20px;
}
 
/* ── State cards ── */
.state-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 48px 24px;
  border-radius: 22px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #64748b;
  text-align: center;
}
 
.state-card p {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #94a3b8;
}
 
.state-card span {
  font-size: 0.85rem;
  color: #475569;
}
 
.state-card.error {
  border-color: rgba(239, 68, 68, 0.15);
}
 
.state-card.error p { color: #fca5a5; }
.state-card.error svg { color: #f87171; }
 
/* ── Skeleton loading ── */
.skeleton-card {
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 22px;
  overflow: hidden;
}
 
.skeleton-img {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.04);
  animation: shimmer 1.4s ease infinite;
}
 
.skeleton-body {
  padding: 14px 16px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
 
.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.06);
  animation: shimmer 1.4s ease infinite;
  width: 100%;
}
 
.skeleton-line.short { width: 40%; height: 9px; }
.skeleton-line.medium { width: 30%; }
 
.skeleton-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 12px 14px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}
 
.skeleton-btn {
  height: 36px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  animation: shimmer 1.4s ease infinite;
}
 
@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
 
@media (max-width: 600px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
 
@media (max-width: 380px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
