
<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import ProductList from '../components/product/ProductList.vue';
import ProductFilter from '../components/product/ProductFilter.vue';
import { useProductStore } from '../store/modules/products';
 
const productStore = useProductStore();
const route = useRoute();
const fetchError = ref('');
 
const applyFilters = (newFilters) => {
  productStore.setFilters(newFilters);
};
 
onMounted(async () => {
  const { brand, search } = route.query;
 
  if (brand || search) {
    productStore.setFilters({
      brand: brand || '',
      search: search || '',
    });
  }
 
  if (!productStore.products.length) {
    try {
      await productStore.fetchProducts();
    } catch (err) {
      fetchError.value = 'Failed to load products. Please try again.';
      console.error('fetchProducts error:', err);
    }
  }
});
</script>
 
<template>
  <div class="products-page">
    <header class="products-hero">
      <div>
        <p class="eyebrow">Catalog</p>
        <h1>Find the right phone faster</h1>
        <p class="subtitle">Search, filter, and sort the catalog without leaving the page.</p>
      </div>
      <p class="results-count">{{ productStore.filteredProducts.length }} products</p>
    </header>
 
    <ProductFilter @filter="applyFilters" />
 
    <p v-if="fetchError" class="state-message error">{{ fetchError }}</p>
    <p v-else-if="productStore.loading" class="state-message">Loading products...</p>
    <ProductList v-else />
  </div>
</template>
 
<style scoped>
.products-page {
  min-height: 100vh;
  padding: 32px 20px 48px;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.2), transparent 30%),
    linear-gradient(180deg, #08111f 0%, #0f172a 50%, #111827 100%);
}
 
.products-hero {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  margin-bottom: 24px;
  color: white;
}
 
.eyebrow {
  margin: 0 0 8px;
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #93c5fd;
}
 
h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.05;
}
 
.subtitle {
  margin: 12px 0 0;
  max-width: 680px;
  color: #cbd5e1;
}
 
.results-count {
  margin: 0;
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.7);
  white-space: nowrap;
  color: white;
}
 
.state-message {
  padding: 22px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  margin-top: 16px;
}
 
.state-message.error {
  color: #fecaca;
  border-color: rgba(239, 68, 68, 0.2);
}
 
@media (max-width: 768px) {
  .products-hero {
    flex-direction: column;
    align-items: start;
  }
}
</style>