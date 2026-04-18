<!-- <template>
  <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <h3>📱 PhoneStore</h3>
          <p>Premium smartphones, unbeatable prices.</p>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <p class="footer-col-title">Shop</p>
            <router-link to="/products">All Products</router-link>
            <router-link to="/products?brand=apple">Apple</router-link>
            <router-link to="/products?brand=samsung">Samsung</router-link>
          </div>
          <div class="footer-col">
            <p class="footer-col-title">Account</p>
            <router-link to="/profile">My Profile</router-link>
            <router-link to="/checkout">Cart</router-link>
            <router-link to="/login">Login</router-link>
          </div>
          <div class="footer-col">
            <p class="footer-col-title">Support</p>
            <router-link to="/contact">Contact Us</router-link>
            <a href="#">Returns Policy</a>
            <a href="#">Warranty</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© {{ new Date().getFullYear() }} PhoneStore. All rights reserved.</span>
        <div class="social-links">
          <a href="#">Twitter</a>
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
        </div>
      </div>
    </footer>
</template>
<style scoped>
.site-footer {
  background: rgba(2,6,23,0.8);
  border-top: 1px solid rgba(255,255,255,0.07);
  padding: 40px 20px 24px;
}
 
.footer-inner {
  max-width: 1100px;
  margin: 0 auto 32px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
}
 
.footer-brand h3 {
  margin: 0 0 8px;
  font-size: 1.2rem;
}
 
.footer-brand p {
  color: #64748b;
  margin: 0;
  font-size: 0.88rem;
}
 
.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}
 
.footer-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
 
.footer-col-title {
  margin: 0;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #86efac;
}
 
.footer-col a {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}
 
.footer-col a:hover { color: white; }
 
.footer-bottom {
  max-width: 1100px;
  margin: 0 auto;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.07);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #64748b;
  font-size: 0.85rem;
}
 
.social-links {
  display: flex;
  gap: 18px;
}
 
.social-links a {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}
 
.social-links a:hover { color: #22c55e; }

@media (max-width:900px){
  .footer-inner{
    grid-template-columns: 1fr;
  }
  .footer-links{
    grid-template-columns: repeat(2,1fr);
  }
}

@media (max-width: 540px){
  .footer-links{
    grid-template-columns: 1fr;
  }
}
</style> -->
<script setup>
const year = new Date().getFullYear();

const links = {
  Shop: [
    {label: 'All products', to: '/products'},
    {label: 'Apple', to: '/products?brand=apple'},
    {label: 'Samsung', to: '/products?brand=samsung'},
    {label: 'Xiaomi', to: '/products?brand=xiaomi'},
    {label: 'Deals', to: '/products?kind=price_desc'},
  ],
  Account: [
    {label: 'My Profile', to: '/profile'},
    {label: 'My Orders', to: '/profile'},
    {label: 'Cart', to: '/cart'},
    {label: 'Login', to: '/login'},
    {label: 'Register', to: '/register'},
  ],
  Support: [
    {label: 'Contact Us', to: '/contact'},
    {label: 'Returns Policy', to: '/'},
    {label: 'Warranty', to: '/'},
    {label: 'Shipping', to: '/'},
    {label: 'FAQ', to: '/'},
  ]
};

const socials = [
  { label: 'Twitter', href: '#', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
  { label: 'Instagram', href: '#', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
  { label: 'Facebook', href: '#', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
]
</script>
<template>
  <footer class="site-footer">
    <!-- top glow divider -->
     <div class="footer-glow" />
      <div class="footer-inner">
       <!-- brands -->
        <div class="footer-brand">
            <div class="brand-mark">
              <span class="brand-icon">📱</span>
              <span class="brand-name">PhoneStore</span>
            </div>
            <p class="brand-tagline">
              Premium smartphones at honest prices. Every device tested, every order guaranteed.
            </p>
            <div class="social-row">
              <a 
              v-for="s in socials" 
              :key="s.label" 
              :href="s.href" 
              :aria-label="s.label"
              class="social-link"
              target="_blank"
              rel="noopener noreferrer"
              >
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path :d="s.icon" />
                </svg>
            </a>
            </div>
            <div class="trust-badges">
              <span class="badge">🔒 SSL Secure</span>
              <span class="badge">↩️ 30-Day Returns</span>
            </div>
        </div>
          <!-- links -->
           <nav class="footer-nav">
            <div v-for="(items, group) in links" :key="group" class="footer-col">
              <p class="col-heading">{{ group }}</p>
              <ul>
                <li v-for="link in items" :key="link.label">
                  <router-link :to="link.to">{{ link.label }}</router-link>
                </li>
              </ul>
            </div>
           </nav>
      </div>
      <!-- bottom bar -->
       <div class="footer-bottom">
        <div class="footer-bottom-inner">
          <span class="copyright">© {{ year }} PhoneStore. All rights reserved.</span>
          <div class="legal-links">
            <a href="#">Privacy Policy</a>
            <span class="sep">·</span>
            <a href="#">Terms of Service</a>
            <span class="sep">·</span>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
       </div>
  </footer>
</template>
<style scoped>
.site-footer{
  position: relative;
  background: rgba(2,6,23,0.92);
  border-top: 1px solid rgba(255,255,255,0.06);
}
/*  subtle green glow along the top edge  */
.footer-glow{
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 1px;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(34,197,94,0.55), transparent);
}

.footer-inner{
  max-width: 1100px;
  margin: 0 auto;
  padding: 52px 20px 40px;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
  align-items: start;
}

.footer-brand{
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.brand-mark{
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon{
  font-size: 1.5rem;
  line-height: 1;
}

.brand-name{
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  letter-spacing: -0.05rem;
}

.brand-tagline{
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.65rem;
  min-width: 260px;
}

.social-row{
  display: flex;
  gap: 10px;
}

.social-link{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(15,23,42,0.9);
  border: 1px solid rgba(255,255,255,0.1);
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2 ease, border-color 0.2s ease, transform 0.2s ease;
}

.social-link:hover{
  color: #22c55e;
  border-color: rgba(34,197,94,0.4);
  transform: translateY(-2px);
}

.trust-badges{
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.badge{
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  color: #94a3b8;
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(15,23,42,0.8);
}

/* nav columns */

.footer-nav{
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 32px;
}

.footer-col{
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.col-heading{
  margin: 0;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  color: #86efac;
}

.footer-col ul{
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-col a{
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  position: relative;
  display: inline-block;
}

.footer-col a::after{
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  background: #22c55e;
  transition: width 0.2s ease;
}

.footer-col a:hover{
  color: #e2e8f0;
}

.footer-col a:hover::after{
  width: 100%;
}

/* bottom bar */

.footer-bottom{
  border-top: 1px solid rgba(255,255,255,0.1);
}

.footer-bottom-inner{
  max-width: 1100px;
  margin: 0 auto;
  padding: 18px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.copyright{
  font-size: 0.8rem;
  color: #334155;
}

.legal-links{
  display: flex;
  align-items: center;
  gap: 8px;
}

.legal-links a{
  font-size: 0.9rem;
  color: #334155;
  text-decoration: none;
  transition: color 0.2s ease;
}

.legal-links a:hover{
  color: #94a3b8
}

.sep{
  color: #1e293b;
  font-size: 0.8rem;
}

/* responsive */

@media (max-width: 860px){
  .footer-inner{
    grid-template-columns: 1fr;
    gap: 36px;
  }

  .brand-tagline{
    max-width: 100%;
  }
}

@media (max-width:560px){
  .footer-nav{
    grid-template-columns: repeat(2,1fr);
  }

  .footer-bottom-inner{
    flex-direction: column;
    align-items: flex-start;
    grid-auto-flow: 10px;
  }
}

@media (max-width:360px){
  .footer-nav{
    grid-template-columns: 1fr;
  }
}
</style>
