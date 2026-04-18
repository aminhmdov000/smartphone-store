<script setup>
import { computed, onMounted, ref } from 'vue';
import { useOrderStore } from '../store/modules/orders';
import { getOrderStatuses } from '../services/orderService';
import { useCartStore } from '../store/modules/cart';
import { useUserStore } from '../store/modules/users';
import { useAuthStore } from '../store/modules/auth';
import { useProductStore } from '../store/modules/products';

const orderStore = useOrderStore();
const cartStore = useCartStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const productStore = useProductStore();
const orders = computed(() => orderStore.orders);
const visibleOrders = computed(() =>
  orders.value.filter((order) => order.status !== 'cancelled')
);
const loading = computed(() => orderStore.loading);
const error = computed(() => orderStore.error);
const users = computed(() => userStore.users);
const userLoading = computed(() => userStore.loading);
const userError = computed(() => userStore.error);
const products = computed(() => productStore.products);
const productLoading = computed(() => productStore.loading);
const productError = computed(() => productStore.error);
const statuses = ref([]);
const selectedStatuses = ref({});
const updatingOrderId = ref(null);
const deletingUserId = ref(null);
const savingProduct = ref(false);
const deletingProductId = ref(null);
const activeSection = ref('orders');
const totalRevenue = computed(() =>
  visibleOrders.value.reduce((sum, order) => sum + Number(order.total_price || 0), 0)
);
const deliveredCount = computed(() =>
  visibleOrders.value.filter((order) => order.status === 'delivered').length
);
const activeUsers = computed(() => users.value.filter((user) => user.role !== 'admin').length);
const adminUsers = computed(() => users.value.filter((user) => user.role === 'admin').length);
const lowStockProducts = computed(() =>
  products.value.filter((product) => Number(product.stock) <= 5).length
);
const editingProductId = ref(null);
const productMessage = ref('');
const productForm = ref({
  name: '',
  slug: '',
  brand: '',
  price: '',
  stock: '',
  image_url: '',
  description: '',
  screen_size: '',
  ram: '',
  storage: '',
  camera: '',
  battery: ''
});

const resetProductForm = () => {
  editingProductId.value = null;
  productForm.value = {
    name: '',
    slug: '',
    brand: '',
    price: '',
    stock: '',
    image_url: '',
    description: '',
    screen_size: '',
    ram: '',
    storage: '',
    camera: '',
    battery: ''
  };
};

const syncSelectedStatuses = () => {
  selectedStatuses.value = Object.fromEntries(
    visibleOrders.value.map((order) => [order.id, order.status])
  );
};

onMounted(async () => {
  try {
    await Promise.all([
      orderStore.fetchAllOrders(),
      userStore.fetchUsers(),
      productStore.fetchProducts()
    ]);
    syncSelectedStatuses();

    const res = await getOrderStatuses();
    statuses.value = res.data.statuses;
  } catch (err) {
    console.error('Fetch orders failed:', err.response?.data || err.message);
  }
});

const updateOrderStatus = async(order) => {
  try {
    if (updatingOrderId.value === order.id) return;
    if (visibleOrders.value.length < 1) {
      alert('No orders to update');
      return;
    }

    const nextStatus = selectedStatuses.value[order.id];
    if (!nextStatus || nextStatus === order.status) {
      alert('Choose a different status first.');
      return;
    }

    updatingOrderId.value = order.id;
    await orderStore.updateOrderStatus(order.id, nextStatus);
    if (nextStatus === 'cancelled') {
      delete selectedStatuses.value[order.id];
    } else {
      selectedStatuses.value[order.id] = nextStatus;
    }
    alert('Order status updated successfully!');
  } catch (error) {
    console.error('Update order status failed:', error.response?.data || error.message);
    selectedStatuses.value[order.id] = order.status;
  } finally {
    if (updatingOrderId.value === order.id) {
      updatingOrderId.value = null;
    }
  }
};

const removeUser = async(user) => {
  if (deletingUserId.value === user.id) return;
  if (user.id === authStore.user?.id) {
    alert('You cannot remove the currently logged in admin.');
    return;
  }

  const confirmed = window.confirm(`Delete ${user.email}? This action cannot be undone.`);
  if (!confirmed) return;

  try {
    deletingUserId.value = user.id;
    await userStore.deleteUser(user.id);
  } catch (error) {
    console.error('Delete user failed:', error.response?.data || error.message);
  } finally {
    if (deletingUserId.value === user.id) {
      deletingUserId.value = null;
    }
  }
};

const startEditProduct = (product) => {
  editingProductId.value = product.id;
  productMessage.value = '';
  productForm.value = {
    name: product.name || '',
    slug: product.slug || '',
    brand: product.brand || '',
    price: String(product.price ?? ''),
    stock: String(product.stock ?? ''),
    image_url: product.image_url || '',
    description: product.description || '',
    screen_size: product.screen_size || '',
    ram: product.ram || '',
    storage: product.storage || '',
    camera: product.camera || '',
    battery: product.battery || ''
  };
  activeSection.value = 'products';
};

const saveProduct = async() => {
  try {
    if (savingProduct.value) return;

    const payload = {
      name: productForm.value.name.trim(),
      slug: productForm.value.slug.trim(),
      brand: productForm.value.brand.trim(),
      price: Number(productForm.value.price),
      stock: Number(productForm.value.stock),
      image_url: productForm.value.image_url,
      description: productForm.value.description.trim(),
      screen_size: productForm.value.screen_size.trim(),
      ram: productForm.value.ram.trim(),
      storage: productForm.value.storage.trim(),
      camera: productForm.value.camera.trim(),
      battery: productForm.value.battery.trim()
    };

    if (!payload.name || !payload.slug || !payload.brand || !payload.description) {
      productMessage.value = 'Name, slug, brand, and description are required.';
      return;
    }

    if (!Number.isFinite(payload.price) || payload.price < 0) {
      productMessage.value = 'Price must be a valid positive number.';
      return;
    }

    if (!Number.isInteger(payload.stock) || payload.stock < 0) {
      productMessage.value = 'Stock must be a valid whole number.';
      return;
    }

    savingProduct.value = true;
    productMessage.value = '';

    if (editingProductId.value) {
      await productStore.updateProduct(editingProductId.value, payload);
      productMessage.value = 'Product updated successfully.';
    } else {
      await productStore.createProduct(payload);
      productMessage.value = 'Product created successfully.';
    }

    resetProductForm();
  } catch (error) {
    productMessage.value = error.response?.data?.error || 'Failed to save product.';
  } finally {
    savingProduct.value = false;
  }
};

const removeProduct = async(product) => {
  if (deletingProductId.value === product.id) return;

  const confirmed = window.confirm(`Delete ${product.name}? This action cannot be undone.`);
  if (!confirmed) return;

  try {
    deletingProductId.value = product.id;
    productMessage.value = '';
    await productStore.deleteProduct(product.id);
    if (editingProductId.value === product.id) {
      resetProductForm();
    }
    productMessage.value = 'Product deleted successfully.';
  } catch (error) {
    productMessage.value = error.response?.data?.error || 'Failed to delete product.';
  } finally {
    if (deletingProductId.value === product.id) {
      deletingProductId.value = null;
    }
  }
};

const formatPrice = (value) => cartStore.formatPrice(value);
const formatDate = (value) => {
  if (!value) return 'Unknown date';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

</script>
<template>
  <section class="admin-page">
    <div class="admin-shell">
      <header class="admin-hero">
        <div>
          <p class="eyebrow">Admin Panel</p>
          <h1>Management dashboard</h1>
          <p class="subtitle">Switch between orders and users with one clean control panel.</p>
        </div>
        <div class="hero-stats">
          <div class="stat-card">
            <span>Active Orders</span>
            <strong>{{ visibleOrders.length }}</strong>
          </div>
          <div class="stat-card">
            <span>Delivered</span>
            <strong>{{ deliveredCount }}</strong>
          </div>
          <div class="stat-card">
            <span>Revenue</span>
            <strong>{{ formatPrice(totalRevenue) }}</strong>
          </div>
          <div class="stat-card">
            <span>Users</span>
            <strong>{{ activeUsers }}</strong>
          </div>
          <div class="stat-card">
            <span>Admins</span>
            <strong>{{ adminUsers }}</strong>
          </div>
        </div>
      </header>

      <div class="switcher">
        <button
          class="switch-button"
          :class="{ active: activeSection === 'orders' }"
          @click="activeSection = 'orders'"
        >
          Orders
        </button>
        <button
          class="switch-button"
          :class="{ active: activeSection === 'users' }"
          @click="activeSection = 'users'"
        >
          Users
        </button>
        <button
          class="switch-button"
          :class="{ active: activeSection === 'products' }"
          @click="activeSection = 'products'"
        >
          Products
        </button>
      </div>

      <section v-if="activeSection === 'orders'" class="panel panel-wide">
          <div class="section-head">
            <div>
              <p class="section-label">Orders</p>
              <h2>Recent activity</h2>
            </div>
          </div>

          <p v-if="loading && !visibleOrders.length" class="state-message">Loading orders...</p>
          <p v-else-if="error" class="state-message error">{{ error }}</p>
          <div v-else-if="!visibleOrders.length" class="state-message">
            No active orders found.
          </div>

          <div v-else class="orders-grid">
            <article v-for="order in visibleOrders" :key="order.id" class="order-card">
              <div class="order-head">
                <div>
                  <p class="order-label">Customer</p>
                  <h3>{{ order.user_email }}</h3>
                </div>
                <span class="status-pill" :class="order.status">{{ order.status }}</span>
              </div>

              <div class="order-meta">
                <div>
                  <span>Order ID</span>
                  <strong>#{{ order.id }}</strong>
                </div>
                <div>
                  <span>Total</span>
                  <strong>{{ formatPrice(order.total_price) }}</strong>
                </div>
                <div>
                  <span>Placed</span>
                  <strong>{{ formatDate(order.created_at) }}</strong>
                </div>
              </div>

              <div class="status-editor">
                <select class="selectStatus" v-model="selectedStatuses[order.id]">
                  <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
                </select>
                <button class="updateOrders" @click="updateOrderStatus(order)" :disabled="updatingOrderId === order.id">
                  {{ updatingOrderId === order.id ? 'Updating...' : 'Update Status' }}
                </button>
              </div>
            </article>
          </div>
      </section>

      <section v-else-if="activeSection === 'users'" class="panel panel-wide">
          <div class="section-head">
            <div>
              <p class="section-label">Users</p>
              <h2>User management</h2>
            </div>
            <span class="users-count">{{ users.length }} total</span>
          </div>

          <p v-if="userLoading && !users.length" class="state-message">Loading users...</p>
          <p v-else-if="userError" class="state-message error">{{ userError }}</p>
          <div v-else-if="!users.length" class="state-message">
            No users found.
          </div>

          <div v-else class="user-list">
            <article v-for="user in users" :key="user.id" class="user-card">
              <div class="user-main">
                <span class="user-avatar">{{ user.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
                <div>
                  <h3>{{ user.name }}</h3>
                  <p>{{ user.email }}</p>
                </div>
              </div>

              <div class="user-meta">
                <span class="role-pill" :class="user.role">{{ user.role }}</span>
                <small>{{ formatDate(user.created_at) }}</small>
              </div>

              <button
                class="deleteUser"
                @click="removeUser(user)"
                :disabled="deletingUserId === user.id || user.id === authStore.user?.id"
              >
                {{
                  user.id === authStore.user?.id
                    ? 'Current Admin'
                    : deletingUserId === user.id
                      ? 'Removing...'
                      : 'Remove User'
                }}
              </button>
            </article>
          </div>
      </section>

      <section v-else class="panel panel-wide">
          <div class="section-head">
            <div>
              <p class="section-label">Products</p>
              <h2>Product management</h2>
            </div>
            <span class="users-count">{{ products.length }} total · {{ lowStockProducts }} low stock</span>
          </div>

          <p v-if="productMessage" class="state-message" :class="{ error: productMessage.toLowerCase().includes('failed') || productMessage.toLowerCase().includes('required') || productMessage.toLowerCase().includes('valid') }">
            {{ productMessage }}
          </p>

          <div class="product-manager">
            <div class="product-form-card">
              <div class="product-form-head">
                <div>
                  <p class="order-label">{{ editingProductId ? 'Edit Product' : 'Add Product' }}</p>
                  <h3>{{ editingProductId ? 'Update item details' : 'Create a new product' }}</h3>
                </div>
                <button v-if="editingProductId" class="ghost-button" @click="resetProductForm">
                  Cancel Edit
                </button>
              </div>

              <div class="product-form-grid">
                <label class="field-group">
                  <span>Name</span>
                  <input v-model="productForm.name" type="text" placeholder="iPhone 15 Pro">
                </label>
                <label class="field-group">
                  <span>Slug</span>
                  <input v-model="productForm.slug" type="text" placeholder="iphone-15-pro">
                </label>
                <label class="field-group">
                  <span>Brand</span>
                  <input v-model="productForm.brand" type="text" placeholder="Apple">
                </label>
                <label class="field-group">
                  <span>Price</span>
                  <input v-model="productForm.price" type="number" min="0" step="0.01" placeholder="999">
                </label>
                <label class="field-group">
                  <span>Stock</span>
                  <input v-model="productForm.stock" type="number" min="0" step="1" placeholder="12">
                </label>
                <label class="field-group">
                  <span>Image URL</span>
                  <input v-model="productForm.image_url" type="text" placeholder="/uploads/phone.png">
                </label>
                <label class="field-group">
                  <span>Screen Size</span>
                  <input v-model="productForm.screen_size" type="text" placeholder='6.1"' >
                </label>
                <label class="field-group">
                  <span>RAM</span>
                  <input v-model="productForm.ram" type="text" placeholder="8GB">
                </label>
                <label class="field-group">
                  <span>Storage</span>
                  <input v-model="productForm.storage" type="text" placeholder="256GB">
                </label>
                <label class="field-group">
                  <span>Camera</span>
                  <input v-model="productForm.camera" type="text" placeholder="48MP">
                </label>
                <label class="field-group">
                  <span>Battery</span>
                  <input v-model="productForm.battery" type="text" placeholder="3274mAh">
                </label>
                <label class="field-group field-group-wide">
                  <span>Description</span>
                  <textarea v-model="productForm.description" rows="4" placeholder="Short product description"></textarea>
                </label>
              </div>

              <button class="updateOrders" @click="saveProduct" :disabled="savingProduct">
                {{ savingProduct ? 'Saving...' : editingProductId ? 'Update Product' : 'Create Product' }}
              </button>
            </div>

            <div class="product-list-wrap">
              <p v-if="productLoading && !products.length" class="state-message">Loading products...</p>
              <p v-else-if="productError && !products.length" class="state-message error">{{ productError }}</p>
              <div v-else-if="!products.length" class="state-message">
                No products found.
              </div>

              <div v-else class="product-list">
                <article v-for="product in products" :key="product.id" class="product-card-admin">
                  <div class="product-card-head">
                    <div>
                      <h3>{{ product.name }}</h3>
                      <p>{{ product.brand }} · {{ product.slug }}</p>
                    </div>
                    <span class="stock-pill" :class="{ low: Number(product.stock) <= 5 }">
                      Stock {{ product.stock }}
                    </span>
                  </div>

                  <div class="product-meta">
                    <div>
                      <span>Price</span>
                      <strong>{{ formatPrice(product.price) }}</strong>
                    </div>
                    <div>
                      <span>Storage</span>
                      <strong>{{ product.storage || 'N/A' }}</strong>
                    </div>
                    <div>
                      <span>RAM</span>
                      <strong>{{ product.ram || 'N/A' }}</strong>
                    </div>
                  </div>

                  <p class="product-description">{{ product.description }}</p>

                  <div class="product-actions">
                    <button class="ghost-button" @click="startEditProduct(product)">Edit</button>
                    <button
                      class="deleteUser"
                      @click="removeProduct(product)"
                      :disabled="deletingProductId === product.id"
                    >
                      {{ deletingProductId === product.id ? 'Deleting...' : 'Delete' }}
                    </button>
                  </div>
                </article>
              </div>
            </div>
          </div>
      </section>
    </div>
  </section>
</template>
<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 32px 20px 48px;
  background:
    radial-gradient(circle at top right, rgba(245, 158, 11, 0.16), transparent 25%),
    linear-gradient(180deg, #07111d 0%, #0f172a 55%, #111827 100%);
}

.admin-shell {
  max-width: 1160px;
  margin: 0 auto;
  color: white;
}

.admin-hero {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 20px;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #fbbf24;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.3rem);
  line-height: 1.05;
}

.subtitle {
  margin: 12px 0 0;
  max-width: 680px;
  color: #cbd5e1;
}

.hero-stats {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-columns: repeat(5, minmax(120px, 1fr));
  gap: 12px;
}

.stat-card {
  min-width: 0;
  padding: 18px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-card span {
  display: block;
  margin-bottom: 8px;
  color: #cbd5e1;
}

.stat-card strong {
  display: block;
  font-size: 1.35rem;
  line-height: 1.2;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}

.state-message {
  padding: 22px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.state-message.error {
  color: #fecaca;
}

.switcher {
  display: inline-flex;
  gap: 10px;
  padding: 8px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 24px;
}

.switch-button {
  border: none;
  border-radius: 14px;
  padding: 12px 18px;
  background: transparent;
  color: #cbd5e1;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.switch-button:hover {
  transform: translateY(-1px);
}

.switch-button.active {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.panel {
  padding: 24px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.72);
  box-shadow: 0 20px 40px rgba(2, 6, 23, 0.24);
}

.panel-wide {
  width: 100%;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 16px;
  margin-bottom: 20px;
}

.section-label {
  margin: 0 0 4px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.76rem;
  color: #fbbf24;
}

.section-head h2 {
  margin: 0;
  font-size: 1.5rem;
}

.users-count {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.12);
  color: #bfdbfe;
}

.orders-grid,
.user-list,
.product-list {
  display: grid;
  gap: 18px;
}

.order-card{
  padding: 20px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.82);
  color: white;
}

.order-head {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 16px;
  margin-bottom: 18px;
}

.order-label {
  margin: 0 0 4px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.76rem;
  color: #fbbf24;
}

.order-head h3 {
  margin: 0;
  font-size: 1.3rem;
}

.status-pill {
  padding: 8px 12px;
  border-radius: 999px;
  text-transform: capitalize;
  background: rgba(148, 163, 184, 0.14);
  color: #e2e8f0;
}

.status-pill.pending {
  background: rgba(249, 115, 22, 0.16);
  color: #fdba74;
}

.status-pill.shipped {
  background: rgba(59, 130, 246, 0.16);
  color: #93c5fd;
}

.status-pill.delivered {
  background: rgba(34, 197, 94, 0.16);
  color: #86efac;
}

.status-pill.cancelled {
  background: rgba(239, 68, 68, 0.16);
  color: #fca5a5;
}

.status-pill.paid {
  background: rgba(168, 85, 247, 0.16);
  color: #d8b4fe;
}

.order-meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(140px, 1fr));
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
  margin-bottom: 6px;
  color: #cbd5e1;
}

.status-editor {
  display: flex;
  gap: 14px;
  align-items: center;
}

.updateOrders{
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border: none;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.16);
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease, background-color 0.2s ease;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}
.updateOrders:focus{
  outline: none;
}
.updateOrders:hover{
  transform: translateY(-1px);
}
.updateOrders:disabled{
  cursor: not-allowed;
  opacity: 0.7;
}

.selectStatus{
  min-width: 180px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(2, 6, 23, 0.7);
  color: white;
}

.user-card {
  display: grid;
  gap: 14px;
  padding: 18px;
  border-radius: 20px;
  background: rgba(2, 6, 23, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.user-main {
  display: flex;
  align-items: center;
  gap: 14px;
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  color: white;
  font-weight: 700;
  flex-shrink: 0;
}

.user-main h3 {
  margin: 0 0 4px;
  font-size: 1.05rem;
}

.user-main p {
  margin: 0;
  color: #cbd5e1;
  word-break: break-word;
}

.user-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
}

.role-pill {
  padding: 8px 12px;
  border-radius: 999px;
  text-transform: capitalize;
  background: rgba(148, 163, 184, 0.14);
  color: #e2e8f0;
}

.role-pill.admin {
  background: rgba(245, 158, 11, 0.16);
  color: #fcd34d;
}

.role-pill.user {
  background: rgba(34, 197, 94, 0.16);
  color: #86efac;
}

.deleteUser {
  border: none;
  border-radius: 14px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.deleteUser:hover {
  transform: translateY(-1px);
}

.deleteUser:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.product-manager {
  /* display: grid; */
  /* grid-template-columns: minmax(320px, 430px) minmax(0, 1fr); */
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.product-form-card,
.product-card-admin {
  padding: 20px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.82);
}

.product-form-head,
.product-card-head,
.product-actions {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 14px;
}

.product-form-head {
  margin-bottom: 18px;
}

.product-form-head h3,
.product-card-head h3 {
  margin: 0;
  font-size: 1.15rem;
}

.product-card-head p {
  margin: 6px 0 0;
  color: #94a3b8;
}

.product-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.field-group {
  display: grid;
  gap: 8px;
}

.field-group span {
  color: #cbd5e1;
  font-size: 0.92rem;
}

.field-group input,
.field-group textarea {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(2, 6, 23, 0.72);
  color: white;
}

.field-group-wide {
  grid-column: 1 / -1;
}

.product-list-wrap {
  min-width: 0;
}

.product-meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  gap: 12px;
  margin: 18px 0;
}

.product-meta div {
  padding: 14px;
  border-radius: 16px;
  background: rgba(2, 6, 23, 0.5);
}

.product-meta span {
  display: block;
  margin-bottom: 6px;
  color: #cbd5e1;
}

.product-description {
  margin: 0 0 18px;
  color: #cbd5e1;
}

.ghost-button {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 23, 42, 0.72);
  color: white;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
}

.stock-pill {
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.16);
  color: #86efac;
}

.stock-pill.low {
  background: rgba(249, 115, 22, 0.18);
  color: #fdba74;
}

@media (max-width: 920px) {
  .admin-hero,
  .order-head,
  .status-editor,
  .product-form-head,
  .product-card-head,
  .product-actions {
    flex-direction: column;
    align-items: start;
  }

  .hero-stats,
  .order-meta,
  .product-form-grid,
  .product-meta,
  .product-manager {
    grid-template-columns: 1fr;
  }

  .product-manager {
    display: grid;
  }

  .field-group-wide,
  .product-list-wrap {
    grid-column: auto;
  }

  .hero-stats,
  .order-meta {
    grid-template-columns: 1fr;
  }

  .user-meta {
    flex-direction: column;
    align-items: start;
  }
}
</style>
