<template>
  <div class="about-page">
 
    <!-- Hero -->
    <section class="about-hero">
      <p class="eyebrow">Our Story</p>
      <h1>Built for people who love great phones.</h1>
      <p class="hero-sub">SmartStore is your trusted destination for modern mobile technology — honest prices, real support, and a store that puts you first.</p>
    </section>
 
    <!-- Stats bar -->
    <div class="stats-bar">
      <div class="stat-item" v-for="stat in stats" :key="stat.label">
        <strong>{{ stat.value }}</strong>
        <span>{{ stat.label }}</span>
      </div>
    </div>
 
    <!-- Sections -->
    <div class="sections-grid">
 
      <div class="section-card">
        <div class="section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="22" height="22">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
          </svg>
        </div>
        <h2>Who We Are</h2>
        <p>SmartStore is an online platform dedicated to providing the latest smartphones and mobile accessories. Our goal is to make modern technology accessible, affordable, and easy to purchase for everyone — wherever you are.</p>
      </div>
 
      <div class="section-card">
        <div class="section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="22" height="22">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <h2>Our Story</h2>
        <p>Our journey started with a simple idea — helping people find the right smartphone without confusion. Over time, we built a platform where users can explore devices, compare features, and purchase their favorites with confidence.</p>
      </div>
 
      <div class="section-card">
        <div class="section-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="22" height="22">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <h2>Our Mission</h2>
        <p>We're on a mission to provide customers with high-quality products, competitive prices, and a seamless shopping experience. We keep our catalog updated with the newest mobile technologies and most trusted brands.</p>
      </div>
 
    </div>
 
    <!-- Why choose us -->
    <section class="why-section">
      <div class="why-head">
        <p class="eyebrow">Our Promise</p>
        <h2>Why Choose SmartStore</h2>
      </div>
      <div class="why-grid">
        <div class="why-card" v-for="item in whyItems" :key="item.title">
          <span class="why-icon">
            <component :is="'svg'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" :d="item.icon" />
            </component>
          </span>
          <div>
            <strong>{{ item.title }}</strong>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>
 
    <!-- CTA -->
    <section class="about-cta">
      <h2>Ready to find your next phone?</h2>
      <p>Browse our full catalog and get the best deal today.</p>
      <router-link to="/products" class="cta-btn">Shop Now →</router-link>
    </section>
 
  </div>
</template>
 
<script setup>
const stats = [
  { value: '10K+', label: 'Happy customers' },
  { value: '500+', label: 'Products' },
  { value: '50+', label: 'Brands' },
  { value: '4.9★', label: 'Avg. rating' },
];
 
const whyItems = [
  {
    title: 'Top brands, one place',
    desc: 'Apple, Samsung, Google and more — all in one catalog.',
    icon: 'M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3',
  },
  {
    title: 'Secure shopping',
    desc: 'SSL-encrypted checkout. Your data and payments stay safe.',
    icon: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
  },
  {
    title: 'Fast delivery',
    desc: 'Free 2-day shipping on orders over $99.',
    icon: 'M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12',
  },
  {
    title: 'Affordable prices',
    desc: 'We negotiate directly with brands to pass savings on to you.',
    icon: 'M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  },
  {
    title: '2-year warranty',
    desc: 'Every device we sell is covered by our full warranty program.',
    icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  },
  {
    title: '30-day returns',
    desc: 'Not happy? Return it within 30 days, no questions asked.',
    icon: 'M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3',
  },
];
</script>
 
<style scoped>
.about-page {
  min-height: 100vh;
  padding: 0 0 64px;
  background:
    radial-gradient(circle at top center, rgba(34, 197, 94, 0.12), transparent 40%),
    linear-gradient(180deg, #07111d 0%, #0f172a 55%, #111827 100%);
  color: white;
}
 
/* ── Hero ── */
.about-hero {
  max-width: 700px;
  margin: 0 auto;
  padding: 72px 20px 48px;
  text-align: center;
}
 
.eyebrow {
  margin: 0 0 12px;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #86efac;
}
 
h1 {
  margin: 0 0 18px;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.1;
}
 
.hero-sub {
  margin: 0;
  color: #64748b;
  font-size: 1rem;
  line-height: 1.7;
}
 
/* ── Stats bar ── */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  max-width: 900px;
  margin: 0 auto 48px;
  padding: 0 20px;
}
 
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 20px 16px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.07);
  text-align: center;
}
 
.stat-item strong {
  font-size: 1.5rem;
  color: #22c55e;
}
 
.stat-item span {
  font-size: 0.78rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
 
/* ── Section cards ── */
.sections-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  max-width: 1100px;
  margin: 0 auto 48px;
  padding: 0 20px;
}
 
.section-card {
  padding: 28px 24px;
  border-radius: 24px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: border-color 0.2s, transform 0.2s;
}
 
.section-card:hover {
  border-color: rgba(34, 197, 94, 0.2);
  transform: translateY(-3px);
}
 
.section-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.18);
  color: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
}
 
.section-card h2 {
  margin: 0;
  font-size: 1.1rem;
}
 
.section-card p {
  margin: 0;
  color: #64748b;
  font-size: 0.88rem;
  line-height: 1.65;
}
 
/* ── Why section ── */
.why-section {
  max-width: 1100px;
  margin: 0 auto 48px;
  padding: 0 20px;
}
 
.why-head {
  margin-bottom: 24px;
}
 
.why-head h2 {
  margin: 0;
  font-size: 1.6rem;
}
 
.why-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
 
.why-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 20px 18px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.07);
  transition: border-color 0.2s;
}
 
.why-card:hover {
  border-color: rgba(34, 197, 94, 0.18);
}
 
.why-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.15);
  color: #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}
 
.why-card strong {
  display: block;
  font-size: 0.92rem;
  color: white;
  margin-bottom: 5px;
}
 
.why-card p {
  margin: 0;
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.5;
}
 
/* ── CTA ── */
.about-cta {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  text-align: center;
  border-radius: 26px;
  background:
    radial-gradient(circle at center, rgba(34, 197, 94, 0.1), transparent 70%),
    rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(34, 197, 94, 0.14);
}
 
.about-cta h2 {
  margin: 0 0 10px;
  font-size: 1.5rem;
}
 
.about-cta p {
  margin: 0 0 24px;
  color: #64748b;
}
 
.cta-btn {
  display: inline-flex;
  align-items: center;
  padding: 13px 28px;
  border-radius: 14px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.2s;
}
 
.cta-btn:hover {
  opacity: 0.88;
  transform: translateY(-1px);
}
 
/* ── Responsive ── */
@media (max-width: 900px) {
  .sections-grid,
  .why-grid {
    grid-template-columns: 1fr 1fr;
  }
 
  .stats-bar {
    grid-template-columns: repeat(2, 1fr);
  }
}
 
@media (max-width: 560px) {
  .sections-grid,
  .why-grid,
  .stats-bar {
    grid-template-columns: 1fr;
  }
}
</style>
