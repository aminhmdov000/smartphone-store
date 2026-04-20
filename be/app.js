const helmet = require('helmet'); 
const path = require('path')
const express = require('express');
const cors = require('cors');
const {limiter} = require('./middleware/rateLimiter');
const productRoutes = require('./routes/productRoutes');
const {errorHandler} = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/user.routes');
const contactRoutes = require('./routes/contactus.routes');
const app = express();

app.set('trust proxy', 1);
app.use(express.json());
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(limiter);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(errorHandler);
module.exports = app;

