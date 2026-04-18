<template>
  <div class="home-page">
    <!-- hero section -->
     <section class="hero">
      <div class="hero-slides">
        <TransitionGroup name="slide-fade">
          <div v-for="(slide, i) in slides" :key="i" v-show="currentSlide === i" class="hero-slide">
            <div class="slide-emoji">{{ slide.img }}</div>
            <div class="slide-content">
              <span class="slide-tag" :style="{color: slide.accent}">{{ slide.tag }}</span>
              <h1>{{ slide.title }}</h1><br><span :style="{color: slide.accent}">{{ slide.subtitle }}</span>
              <p>{{ slide.desc }}</p>
              <router-link to="/products" class="hero-cta" :style="{background: `linear-gradient(135deg, ${slide.accent}, ${slide.accent}cc)`}">{{ slide.cta }}</router-link>
            </div>
          </div>
        </TransitionGroup>
      </div>
      <!-- controls -->
       <button class="slide-arrow left" @click="prevSlide"><</button>
       <button class="slide-arrow right" @click="nextSlide">></button>
       <div class="slide-dots">
        <button v-for="(_, i) in slides" :key="i" 
        class="dot" 
        :class="{active: currentSlide === i}" 
        @click="setSlide(i)"/>
       </div>
       <!-- search bar -->
        <div class="hero-search-wrap">
          <div class="hero-search">
            <input type="text" @keyup.enter="goSearch" v-model="searchQuery" placeholder="Search for phones, brands, models..." />
            <button @click="goSearch">Search</button>
          </div>
        </div>
     </section>
     <div class="page-body">
            <!-- STATS BAR -->
            <section class="stats-bar">
              <div v-for="stat in stats" :key="stat.label" class="stat-item">
                <strong>{{ stat.value }}</strong>
                <span>{{ stat.label }}</span>
              </div>
            </section>
            <!-- FEATURED PRODUCTS -->
             <section class="section">
              <div class="section-head">
                <div>
                  <p class="eyebrow">Handpicked</p>
                  <h2>Featured Products</h2>
                </div>
                <router-link to="/products" class="view-all">View All →</router-link>
              </div>
              <div v-if="productStore.loading" class="state-msg">Loading products...</div>
              <div v-else-if="!featuredProducts.length" class="state-msg">No products available yet.</div>
              <div v-else class="products-grid">
                <article v-for="product in featuredProducts" :key="product.id" class="product-card" @click="router.push(`/product/${product.id}`)">
                  <div class="product-img-wrap">
                    <img v-if="product.image_url" :src="getImage(product.image_url)" :alt="product.name" class="product-img" />
                    <div v-else class="product-img-placeholder">📱</div>
                  </div>
                  <div class="product-info">
                    <p class="product-brand">{{ product.brand }}</p>
                    <h3 class="product-name">{{ product.name }}</h3>
                    <p class="product-price">{{ formatPrice(product.price) }}</p>
                  </div>
                </article>
              </div>
             </section>
             <!-- BRANDS -->
              <section class="section">
                <div class="section-head">
                  <div>
                    <p class="eyebrow">Browse by</p>
                    <h2>Top Brands</h2>
                  </div>
                </div>
                <div class="brands-grid">
                  <button 
                  v-for="brand in brands" 
                  :key="brand.name" 
                  class="brand-card" 
                  @click="goToBrand(brand.query)"
                  >
                    <span class="brand-logo">{{ brand.logo }}</span>
                    <span class="brand-name">{{ brand.name }}</span>
                  </button>
                </div>
              </section>
              <!-- DEALS/PROMO -->
               <section class="section">
                <div class="deals-banner">
                  <div class="deals-content">
                    <p class="eyebrow" style="color: #fb923c;">Flash Sale</p>
                    <h2>Today's Best Deals</h2>
                    <p class="deals-sub">Prices drop every hour. Limited stock available.</p>
                    <div class="countdown">
                      <div class="time-block">
                        <strong>{{ pad(countdown.hours) }}</strong>
                        <span>Hours</span>
                      </div>
                      <div class="time-sep">:</div>
                      <div class="time-block">
                        <strong>{{ pad(countdown.minutes) }}</strong>
                        <span>Mins</span>
                      </div>
                      <div class="time-sep">:</div>
                      <div class="time-block">
                        <strong>{{ pad(countdown.seconds) }}</strong>
                        <span>Secs</span>
                      </div>
                    </div>
                    <router-link to="/products" class="action-button primary" style="display: inline-flex; margin-top: 8px;">
                      Shop the Sale →
                    </router-link>
                  </div>
                  <div class="deals-cards">
                    <div class="deal-card">
                      <p class="deal-off">-30%</p>
                      <p class="deal-title">iPhone 15 series </p>
                      <p class="deal-sub">From $699</p>
                    </div>
                    <div class="deal-card">
                      <p class="deal-off">-25%</p>
                      <p class="deal-title">Galaxy S24</p>
                      <p class="deal-sub">From $549</p>
                    </div>
                    <div class="deal-card">
                      <p class="deal-off">-40%</p>
                      <p class="deal-title">Pixel 8a</p>
                      <p class="deal-sub">From $399</p>
                    </div>
                  </div>
                </div>
               </section>
               <!-- WHY US? -->
                <section class="section">
                  <div class="section-head">
                    <div>
                      <p class="eyebrow">Our Promise</p>
                      <h2>Why Choose Us?</h2>
                    </div>
                  </div>
                  <div class="features-grid">
                    <div v-for="feat in features" :key="feat.title" class="feature-card">
                      <span class="feat-icon">{{ feat.icon }}</span>
                      <h3>{{ feat.title }}</h3>
                      <p>{{ feat.desc }}</p>
                    </div>
                  </div>
                </section>
                <!-- TESTIMONIALS -->
                 <section class="section">
                  <div class="section-head">
                    <div>
                      <p class="eyebrow">Social Proof</p>
                      <h2>What Our Customers Say?</h2>
                    </div>
                  </div>
                  <div class="testimonials-grid">
                    <div v-for="t in testimonials" :key="t.name" class="testimonial-card">
                      <div class="stars">{{'★'.repeat(t.rating)}}</div>
                      <p class="t-text">{{ t.text }}</p>
                      <div class="t-author">
                        <strong>{{ t.name }}</strong>
                        <span>{{ t.role }}</span>
                      </div>
                    </div>
                  </div>
                 </section>
                 <!-- CTA BANNER -->
                  <section class="cta-banner">
                    <div class="cta-content">
                      <p class="eyebrow">Ready to upgrade?</p>
                      <h2>Your Next Phone is One Click Away</h2>
                      <router-link to="/products" class="action-button primary" style="display: inline-flex; font-size: 1rem; padding: 14px 28px;">
                        Shop Now →
                      </router-link>
                    </div>
                    <div class="newsletter">
                      <p class="panel-label">Stay in the Loop</p>
                      <p style="color: #cbd5e1; margin: 0 0 12px;">
                        Get deals and new arrivals straight to your inbox.
                      </p>
                      <div class="newsletter-form">
                        <input type="email" v-model="email" placeholder="Enter your email" @keyup.enter="subscribeNewsletter"/>
                        <button class="action-button primary" @click="subscribeNewsletter">Subscribe</button>
                      </div>
                      <p v-if="newsletterMessage" class="state-message success" style="margin-top: 10px; padding: 10px 14px;">{{ newsletterMessage }}</p>
                    </div>
                  </section>
     </div>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../store/modules/products';
import { useCartStore } from '../store/modules/cart';

const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();

const searchQuery = ref('');
const currentSlide = ref(0);
const countdown = ref({ hours: 5, minutes: 59, seconds: 59 });
const email = ref('');
const newsletterMessage = ref('');
let countdownTimer = null;
let slideTimer = null;

const slides = [
  {
    tag: 'New Arrival',
    title: 'Premium Smartphones',
    subtitle: 'Starting at $299',
    desc: 'Flagship performance. Everyday price.',
    cta: 'Shop Now',
    accent: '#22c55e',
    img: '📱',
  },
  {
    tag: 'Best Seller',
    title: 'Top Brands,',
    subtitle: 'One Place.',
    desc: 'Apple, Samsung, Google — all under one roof.',
    cta: 'Explore Brands',
    accent: '#38bdf8',
    img: '🏆',
  },
  {
    tag: 'Flash Sale',
    title: 'Up to 40% Off',
    subtitle: 'This Weekend Only',
    desc: "Limited stock. Don't miss out.",
    cta: 'See Deals',
    accent: '#f97316',
    img: '⚡',
  },
];

const stats = [
  { value: '10K+', label: 'Happy Customers'},
  { value: '500+', label: 'Products'},
  { value: '50+', label: 'Brands'},
  { value: '4.9★', label: 'Average Rating'}
];

const brands = [
  { name: 'Apple', logo: '🍎', query: 'apple' },
  { name: 'Samsung', logo: '⬛', query: 'samsung' },
  { name: 'Google', logo: '🔵', query: 'google' },
  { name: 'OnePlus', logo: '🔴', query: 'oneplus' },
  { name: 'Xiaomi', logo: '🟠', query: 'xiaomi' },
  { name: 'Sony', logo: '🎵', query: 'sony' },
];

const features = [
  { icon: '🚚', title: 'Fast Shipping', desc: 'Free 2-day delivery on all orders over $99.' },
  { icon: '🛡️', title: '2-Year Warranty', desc: 'Every device backed by our full warranty program.' },
  { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free return policy, no questions asked.' },
  { icon: '🔒', title: 'Secure Payments', desc: 'SSL-encrypted checkout. Your data stays safe.' },
];

const testimonials = [
  { name: 'Sarah K.', rating: 5, text: 'Incredible service. My phone arrived next day, perfectly packaged. Will definitely buy again!', role: 'Verified Buyer' },
  { name: 'Marcus L.', rating: 5, text: 'Best prices I found anywhere. The checkout was smooth and support was helpful.', role: 'Verified Buyer' },
  { name: 'Yuki T.', rating: 5, text: 'Legit store. Got my iPhone in 2 days. Even came with a free case!', role: 'Verified Buyer' },
];

const featuredProducts = computed(() => (productStore.filteredProducts || []).slice(0, 8));
const formatPrice = (price) => cartStore.formatPrice(price);
const getImage = (image) => {
  if (!image) return null;
  if (image.startsWith('http') || image.startsWith('/')) return image;
  return `/uploads/${image}`;
};


const goSearch = () => {
  if(searchQuery.value.trim()) {
    router.push({ path: '/products', query: { search: searchQuery.value.trim()}});
  } else{
    router.push('/products');
  }
}

const goToBrand = (query) => {
  router.push({ path: '/products', query: { brand: query}});
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? slides.length - 1 : currentSlide.value - 1;
}
const nextSlide = () => {
  currentSlide.value = currentSlide.value === slides.length - 1 ? 0 : currentSlide.value + 1;
}

// auto slide ever 5 seconds
const setSlide = (i) => {
  currentSlide.value = i;
  resetSlideTimer();
}
const resetSlideTimer = () => {
  if(slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 5000);
}

const tickCountDown = () => {
  if(countdown.value.seconds > 0 ) {
    countdown.value.seconds--; 
  } else if(countdown.value.minutes > 0 ){
    countdown.value.minutes--;
    countdown.value.seconds = 59
  } else if(countdown.value.hours > 0) {
    countdown.value.hours--;
    countdown.value.minutes = 59;
    countdown.value.seconds = 59
  }
};
// start countdown timer
const pad = (n) => String(n).padStart(2, '0');

const subscribeNewsletter = () => {
  if(!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    newsletterMessage.value = 'Please enter a valid email address.';
    return
  }
  newsletterMessage.value = "You're in! We'll be in touch soon."; 
  email.value = '';
  setTimeout(() => (newsletterMessage.value = ''), 3000);
};

onMounted(async() => {
  await productStore.fetchProducts();
  slideTimer = setInterval(nextSlide, 5000);
  countdownTimer = setInterval(tickCountDown, 1000);
});

onUnmounted(() => {
  if(slideTimer) clearInterval(slideTimer);
  if(countdownTimer) clearInterval(countdownTimer);
});

</script>
<style scoped>
/* BASE */
.home-page{
  min-height: 100vh;
  background: linear-gradient(180deg, #07111d 0%, #0f172a 55%, #111827 100%);
  color: white;
  font-family: inherit;
}

/* HERO */
.hero{
  position: relative;;
  min-height: 520px;
  overflow: hidden;
  background: 
  radial-gradient(circle at 20% 50%, rgba(34,197,94,0.14), transparent 40%),
  radial-gradient(circle at 80% 20%, rgba(56,189,248,0.1), transparent 35%),
  linear-gradient(135deg, #07111d 0%, #0d1f35 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px 110px;
}

.hero-slides{
  position: relative;
  width: 100%;
  max-width: 900px;
  min-height: 280px;
}

.hero-slide{
  display: flex;
  align-items: center;
  gap: 40px;
  animation: none;
}

.slide-emoji{
  font-size: clamp(5rem, 10vw, 8rem);
  flex-shrink: 0;
  filter: drop-shadow(0 0 40px rgba(34,197,94, 0.3));
}
.slide-content{
  flex: 1;
}

.slide-tag{
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  margin-bottom: 12px;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
}

.slide-content h1{
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.1;
  margin: 0 0 14px;
}

.slide-content p{
  color: #cbd5e1;
  margin: 0 0 22px;
  font-size: 1.05rem;
}

.hero-cta{
  display: inline-flex;
  padding: 13px 26px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 0.95rem;
  color: white;
  text-decoration: none;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.hero-cta:hover{
  transform: translateY(-2px);
  opacity: 0.9;
}

.slide-arrow{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255, 0.12);
  color: white;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  font-size: 1.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  z-index: 5;
}

.slide-arrow:hover{background: rgba(34,197,94,0.2);}
.slide-arrow.left{left: 12px;}
.slide-arrow.right{right: 12px}

.slide-dots{
  position: absolute;
  bottom: 72px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.dot{
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
  border: none;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease; 
}

.dot.active, .dot:hover{
  background: #22c55e;
  transform: scale(1.3);
} 

.hero-search-wrap{
  position: absolute;
  bottom: 28px;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

.hero-search{
  display: flex;
  width: 100%;
  max-width: 560px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(15,23,42,0.88);
  backdrop-filter: blur(12px);
}

.hero-search input{
  flex: 1;
  padding: 14px 18px;
  background: transparent;
  border: none;
  color: white;
  font-size: 0.95rem;
  outline: none;
}
.hero-search input:placeholder-shown{color: #64748b;}

.hero-search button{
  padding: 14px 22px;
  background: linear-gradient(135deg,#22c55e, #16a34a);
  border: none;
  color: white;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}
.hero-search button:hover{opacity: 0.9;}

/* Slide transitions */
.slide-fade-enter-active, .slide-fade-leave-active{
  transition: opacity 0.5s ease, transform 0.5s ease;
  position: absolute;
  width: 100%;
}

.slide-fade-enter-from{ opacity: 0; transform: translateX(40px);}
.slide-fade-enter-to{opacity: 0; transform: translateX(-40px)}


/* PAGE BODY */

.page-body{
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px 48px;
}

/* STATS BAR */
.stats-bar{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin: 32px 0;
}

.stat-item{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 18px;
  border-radius: 20px;
  background: rgba(15,23,42,0.76);
  border: 1px solid rgba(255,255,255,0.06);;
  text-align: center;
}

.stat-item strong{
  font-size: 1.5rem;
  color: #22c55e;
}

.stat-item span{
  font-size: 0.82rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}

/* SECTIONS */

.section{margin-bottom: 48px;}

.section-head{
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 22px;
}

.eyebrow{
  margin: 0 0 6px;
  font-size: 0.78rem;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  color: #86efac;
}

.section-head h2, h2{
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 1.9rem);
}

.view-all{
  color: #22c55e;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 8px 16px;
  border-radius: 10px;
  background: rgba(34,197,94,0.1);
  border: 1px solid rgba(34,197,94,0.2);
  transition: background 0.2s ;
}
.view-all:hover{ background: rgba(34,197,94,0.18) ;}

/* products grid */
.products-grid{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
}

.product-card{
  background: rgba(15,23,42,0.82);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 22px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.product-card:hover{
  transform: translateY(-4px);
  border-color: rgba(34,197,94,0.3);
}

.product-img-wrap{
  aspect-ratio: 1;
  background: rgba(2,6,23,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-img-placeholder{
  font-size: 4rem;
}

.product-info{
  padding: 14px 16px;
}

.product-brand{
  margin: 0 0 4px;
  font-size: 0.76rem;
  color: #86efac;
  text-transform: uppercase;
  letter-spacing: 0.12rem;
}

.product-name{
  margin: 0 0 8px;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.3;
}

.product-price{
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #22c55e;
}

/* brands */
.brands-grid{
  display: grid;
  grid-template-columns: repeat(6,1fr);
  gap: 14px;
}

.brand-card{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 12px;
  background: rgba(15,23,42,0.76);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  cursor: pointer;
  color: white;
  transition: transform 0.2s ease, border-color 0.2s ease ;
}

.brand-card:hover{
  transform: translateY(-3px);
  border-color: rgba(34,197,94,0.3);
}

.brand-logo{ font-size: 2rem;}
.brand-name{font-size: 0.85rem; font-weight: 600;}

/* deals */

.deals-banner{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 28px;
  border-radius: 26px;
  background: 
  radial-gradient(circle at top right, rgba(251,146,60,0.14), transparent 50%),rgba(15,23,42,0.82);
  border: 1px solid rgba(251,146,60,0.18);
}

.deals-content h2{margin: 0 0 8px;}
.deals-sub{color: #cbd5e1; margin: 0 0 20px;}

.countdown{
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.time-block{
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px;
  background: rgba(2,6,23,0.6);
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.08);
  min-width: 60px;
}
.time-block strong{
  font-size: 1.6rem;
  font-variant-numeric: tabular-nums;
  color: #fb923c;
}

.time-block span{
  font-size: 0.7rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}

.time-sep{
  font-size: 1.8rem;
  color: #fb923c;
  margin-bottom: 12px;
}

.deals-cards{
  display: grid;
  gap: 14px;
}

.deal-card{
  padding: 16px 20px;
  border-radius: 18px;
  border: 1px solid rgba(251,146,60,0.15);
  background: rgba(2,6,23,0.55);
  display: flex;
  align-items: center;
  gap: 16px;
}

.deal-off{
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #fb923c;
  min-width: 50px;
}

.deal-title{
  margin: 0;
  flex: 1;
  font-weight: 600;
}

.deal-sub{
  margin: 0;
  color: #94a3b8;
  font-size: 0.88rem;
}

/* WHY US */

.features-grid{
  display: grid;
  grid-template-columns: repeat(4,1fr);
  gap: 16px;
}

.feature-card{
  padding: 22px;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(15,23,42,0.76);
  transition: transform 0.2s ease;
}
.feature-card:hover{ transform: translateY(-3px);}

.feat-icon{
  font-size: 2rem;
  display: block;
  margin-bottom: 14px;
}

.feature-card h3{
  margin: 0 0 8px;
  font-size: 1rem;
}

.feature-card p{
  margin: 0;
  color: #94a3b8;
  font-size: 0.88rem;
  line-height: 1.5;
}

/* Testimonials */

.testimonials-grid{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.testimonial-card{
  padding: 24px;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(15,23,42,0.76);
}

.stars{
  color: #fbbf24;
  font-size: 1rem;
  margin-bottom: 14px;
  letter-spacing: 2px;
}

.t-text{
  color: #cbd5e1;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 16px;
}

.t-author{
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.t-author strong{ font-size: 0.95rem;}
.t-author span{ font-size: 0.8rem; color: #86efac;}

/* CTA Banner */

.cta-banner{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 32px;
  border-radius: 26px;
  background:
  radial-gradient(circle at bottom left, rgba(34,197,94,0.16), transparent 50%),
  rgba(15,23,42,0.82);
  border: 1px solid rgba(34,197,94,0.2);
  margin-bottom: 48px;
}

.cta-content{
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
}

.cta-content h2{ margin: 0;}

.newsletter{
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(2,6,23,0.45);
  border-radius: 20px;
  padding: 22px;
}

.panel-label{
  color: #86efac;
  margin: 0 0 6px;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.15rem;
}

.newsletter-form{
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.newsletter-form input{
  flex: 1;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(15,23,42,0.88);
  color: white;
  outline: none;
}

.newsletter-form input:focus{ border-color: rgba(34,197,94,0.55);}

/* action button */

.action-button{
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 14px;
  padding: 12px 22px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.action-button:hover{ transform: translateY(-1px); opacity: 0.9; }

.primary{
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

.state-msg{
  padding: 22px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(255,255,255,0.08);
  color: #cbd5e1;
}

.state-message.success{ color: #bbf7d0;}

/* responsive */

@media (max-width: 900px){
  .stats-bar,.brands-grid,.features-grid,.testimonials-grid{
    grid-template-columns: repeat(2, 1fr);
  }
  .products-grid{
    grid-template-columns: repeat(2,1fr);
  }

  .deals-banner,.cta-banner{
    grid-template-columns: 1fr;
  }

  .hero-slide{
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 540px){
  .stats-bar,.brands-grid,.features-grid,.testimonials-grid,.products-grid{
    grid-template-columns: 1fr;
  }

  .newsletter-form{
    flex-direction: column;
  }
}
</style>
