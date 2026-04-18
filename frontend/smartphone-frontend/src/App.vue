<template>
  <div class="app-vue">
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>
<script setup>
import Navbar from './components/layout/Navbar.vue';
import Footer from './components/layout/Footer.vue';
</script>
<style scoped>
.app-vue {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
}
</style>