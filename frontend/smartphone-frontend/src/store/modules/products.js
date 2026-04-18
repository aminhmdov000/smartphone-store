import { defineStore } from "pinia";
import {
  createProduct as createProductRequest,
  deleteProduct as deleteProductRequest,
  getProducts,
  updateProduct as updateProductRequest
} from "../../services/productService";

const normalizeText = (value) => String(value || '').trim().toLowerCase();
export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
    filters: {
      search: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      kind: ''
    }
  }),
  getters: {
    filteredProducts: (state) => {
      const search = normalizeText(state.filters.search);
      const brand = normalizeText(state.filters.brand);
      const minPrice = state.filters.minPrice === '' ? null : Number(state.filters.minPrice);
      const maxPrice = state.filters.maxPrice === '' ? null : Number(state.filters.maxPrice);

      const visibleProducts = state.products.filter((product) => {
        const name = normalizeText(product.name);
        const productBrand = normalizeText(product.brand);
        const price = Number(product.price);

        if (search && !name.includes(search) && !productBrand.includes(search)) {
          return false;
        }

        if (brand && productBrand !== brand) {
          return false;
        }

        if (minPrice !== null && price < minPrice) {
          return false;
        }

        if (maxPrice !== null && price > maxPrice) {
          return false;
        }

        return true;
      });

      if (state.filters.kind === 'price_asc') {
        return [...visibleProducts].sort((a, b) => Number(a.price) - Number(b.price));
      }

      if (state.filters.kind === 'price_desc') {
        return [...visibleProducts].sort((a, b) => Number(b.price) - Number(a.price));
      }

      return visibleProducts;
    }
  },
  actions: {
    async fetchProducts(){
      this.loading = true;
      this.error = null;
      try {
        const res = await getProducts();
        this.products = res.data;
      } catch (err) {
        this.products = [];
        this.error = err.response?.data?.error || 'Failed to load products.';
        console.error(err);
        throw err;
      }
      finally{
        this.loading = false;
      }
    },
    setFilters(filters) {
      this.filters = {
        ...this.filters,
        ...filters
      };
    },
    async createProduct(productData) {
      try {
        this.loading = true;
        this.error = null;
        await createProductRequest(productData);
        await this.fetchProducts();
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to create product.';
        console.error(err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async updateProduct(id, productData) {
      try {
        this.loading = true;
        this.error = null;
        await updateProductRequest(id, productData);
        await this.fetchProducts();
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to update product.';
        console.error(err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async deleteProduct(id) {
      try {
        this.loading = true;
        this.error = null;
        await deleteProductRequest(id);
        this.products = this.products.filter((product) => product.id !== id);
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to delete product.';
        console.error(err);
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
