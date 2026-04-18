<script setup>
import { useCartStore } from '../store/modules/cart';
const cartStore = useCartStore();
</script>
<template>
  <section class="cart-page">
    <div class="cart-shell">
      <header class="cart-hero">
        <div>
          <p class="eyebrow">Shopping Cart</p>
          <h1>Your selected devices</h1>
          <p class="subtitle">Review quantities, check subtotals, and keep your order tidy before checkout.</p>
        </div>
        <div class="cart-chip">{{ cartStore.cart.length }} items</div>
      </header>

      <div v-if="cartStore.cart.length === 0" class="empty-state">
        <h2>Your cart is empty</h2>
        <p>Add a product from the catalog and it will appear here.</p>
      </div>

      <div v-else class="cart-layout">
        <div class="cart-list">
          <article v-for="item in cartStore.cart" :key="item.cart_item_id" class="cart-item">
            <div class="item-main">
              <h3>{{ item.name }}</h3>
              <p class="price">{{ cartStore.formatPrice(item.price) }}</p>
              <p class="subtotal">Subtotal: {{ cartStore.formatPrice(item.price * item.quantity) }}</p>
            </div>

            <div class="item-actions">
              <div class="qty-control">
                <button class="qty-button" @click="cartStore.decreaseQty(item.cart_item_id)">-</button>
                <span>{{ item.quantity }}</span>
                <button class="qty-button" @click="cartStore.increaseQty(item.cart_item_id)">+</button>
              </div>
              <button class="removeButton" @click="cartStore.removeFromCart(item.cart_item_id)">Remove</button>
            </div>
          </article>
        </div>

        <aside class="summary-card">
          <p class="summary-label">Order Summary</p>
          <h2>{{ cartStore.formattedTotalPrice }}</h2>
          <p class="summary-note">Taxes and shipping will be calculated during checkout.</p>
          <button class="cleanButton" @click="cartStore.clearCart()">Clean Cart</button>
        </aside>
      </div>
    </div>
  </section>
</template>
<style scoped>
.cart-page {
  min-height: 100vh;
  padding: 32px 20px 48px;
  background:
    radial-gradient(circle at top right, rgba(56, 189, 248, 0.18), transparent 25%),
    linear-gradient(180deg, #07111d 0%, #0f172a 55%, #111827 100%);
}

.cart-shell {
  max-width: 1100px;
  margin: 0 auto;
  color: white;
}

.cart-hero {
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
  color: #7dd3fc;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1.05;
}

.subtitle {
  margin: 12px 0 0;
  max-width: 650px;
  color: #cbd5e1;
}

.cart-chip {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.12);
  white-space: nowrap;
}

.empty-state {
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.76);
}

.empty-state h2 {
  margin: 0 0 10px;
}

.empty-state p {
  margin: 0;
  color: #cbd5e1;
}

.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(280px, 0.9fr);
  gap: 24px;
  align-items: start;
}

.cart-list {
  display: grid;
  gap: 16px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.82);
  box-shadow: 0 20px 40px rgba(2, 6, 23, 0.24);
}

.item-main h3 {
  margin: 0 0 10px;
  font-size: 1.2rem;
}

.price {
  margin: 0;
  font-size: 1.1rem;
  color: #93c5fd;
}

.subtotal {
  margin: 10px 0 0;
  color: #cbd5e1;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
}

.qty-control {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(2, 6, 23, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.qty-button {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #f8fafc, #cbd5e1);
  color: #0f172a;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.qty-button:hover {
  transform: translateY(-1px);
}

.summary-card {
  padding: 24px;
  border-radius: 24px;
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.92), rgba(15, 23, 42, 0.92));
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 40px rgba(2, 6, 23, 0.28);
}

.summary-label {
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.78rem;
  color: #7dd3fc;
}

.summary-card h2 {
  margin: 0;
  font-size: 2rem;
}

.summary-note {
  margin: 12px 0 24px;
  color: #cbd5e1;
}

.cleanButton{
  width: 100%;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background-color: #2563eb;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
}
.cleanButton:hover{
  background-color: #1d4ed8;
}
.removeButton{
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  background-color: #ef4444;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
}
.removeButton:hover{
  background-color: #b91c1c;
}

@media (max-width: 860px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .cart-hero,
  .cart-item {
    flex-direction: column;
    align-items: start;
  }

  .item-actions {
    width: 100%;
    align-items: start;
  }
}
</style>
