<script setup>
import { reactive, watch } from 'vue';
const emit = defineEmits(['filter']);
const filters = reactive({
  search: '',
  brand: '',
  minPrice: '',
  maxPrice: '',
  kind: ''
});
watch(filters, () => {
  emit('filter', { ...filters});
}, { deep: true});

const clearFilters = () => {
  filters.search = '';
  filters.brand = '';
  filters.minPrice = '';
  filters.maxPrice = '';
  filters.kind = '';
}

const hasActiveFilters = () => {
  return !!(filters.search || filters.brand || filters.minPrice || filters.maxPrice || filters.kind);
}
</script>
<template>
  <div class="filter-bar">
    <!-- search -->
     <div class="filter-search">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="16" height="16">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input type="text" v-model="filters.search" placeholder="Search phones, brands..." />
     </div>
     <div class="filter-select-wrap">
      <select v-model="filters.brand">
        <option value="">All Brands</option>
        <option value="apple">Apple</option>
        <option value="samsung">Samsung</option>
        <option value="google">Google</option>
        <option value="oneplus">OnePlus</option>
        <option value="xiaomi">Xiaomi</option>
        <option value="sony">Sony</option>
      </select>
     </div>
     <!-- min price -->
      <div class="filter-input-wrap">
        <span class="input-prefix">$</span>
        <input type="number" v-model="filters.minPrice" placeholder="Min price" min="0">
      </div>
      <!-- max price -->
       <div class="filter-input-wrap">
        <span class="input-prefix">$</span>
        <input type="number" v-model="filters.maxPrice" placeholder="Max price" min="0">
       </div>
       <!-- sort -->
        <div class="filter-select-wrap">
          <select v-model="filters.kind">
            <option value="">Sort: Default</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>
        <!-- clear -->

        <button
        v-if="hasActiveFilters()"
        class="clear-btn"
        @click="clearFilters"
        title="Clear all filters"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
          Clear
    </button>
  </div>
</template>
<style scoped>
.filter-bar{
  display: flex;
  flex-wrap: wrap;
  background: rgba(15,23,42,0.9);
  gap: 10px;
  margin-bottom: 24px;
  padding: 16px 18px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 22px;
  backdrop-filter: blur(12px);
  align-items: center;
}

.filter-search{
  position: relative;
  flex: 2;
  min-width: 180px; 
}

.search-icon{
  position: absolute;
  left: 13px;
  color: #475569;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.filter-search input{
  width: 100%;
  padding: 11px 14px 11px 38px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  outline: none;
  color: white;
  font-size: 0.9rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.filter-search input:focus{
  border-color: rgba(34,197,94, 0.4);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.filter-search input::placeholder{ color: #334155;}

/* select wrapper */

.filter-select-wrap{
  flex: 1;
  min-width: 140px;
}

.filter-select-wrap select{
  width: 100%;
  color: white;
  background: rgba(2,6,23,0.7);
  padding: 11px 14px; 
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='m19 9-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px;
  padding-right: 34px;
}

.filter-select-wrap select:focus{
  border-color: rgba(34,197,94,0.4);
}

.filter-select-wrap select option{
  background: #0f172a;
  color: white;
}

.filter-input-wrap{
  position: relative;
  flex: 1;
  min-width: 110px;
}

.input-prefix{
  position: absolute;
  color: #475569;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  pointer-events: none;
}

.filter-input-wrap input{
  width: 100%;
  padding: 11px 14px 11px 26px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(2,6,23,0.7);
  color: white;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.filter-input-wrap input:focus{
  border-color: rgba(34,197,94,0.4);
  box-shadow: 0 0 0 3px rgba(34,197,94,0.1);
}

.filter-input-wrap input::placeholder{ color: #334155;}

/* Hide number spinners */
.filter-input-wrap input::-webkit-outer-spin-button,
.filter-input-wrap input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.clear-btn{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius:  12px;
  border: 1px solid rgba(239,68,68,0.2);
  background: rgba(239,68,68,0.1);
  color: #fca5a5;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  flex-shrink: 0;
}

.clear-btn:hover{
  background: rgba(239,68,68,0.15);
  border-color: rgba(239,68,68,0.35);
}

@media (max-width: 640px) {
  .filter-bar{
    padding: 14px;
    gap: 8px;
  }

  .filter-search,
  .filter-select-wrap,
  .filter-input-wrap{
    flex: unset;
    width: 100%;
    min-width: unset;
  }
}
</style>
