const helmet = require('helmet'); // Security headers middleware
const path = require('path')
//IMPORT EXPRESS FRAMEWORK
const express = require('express');
//ALLOW FRONTEND TO CONNECT TO BACKEND (CROSS-ORIGIN RESOURCE SHARING)
const cors = require('cors');
//IMPORT PRODUCT ROUTTES FILE
const {limiter} = require('./middleware/rateLimiter');
const productRoutes = require('./routes/productRoutes');
const {errorHandler} = require('./middleware/error.middleware');
//IMPORT AUTH ROUTES FILE
const authRoutes = require('./routes/auth.routes');
//IMPORT CART ROUTES FILE
const cartRoutes = require('./routes/cart.routes');
//IMPORT ORDER ROUTES
const orderRoutes = require('./routes/order.routes');
const userRoutes = require('./routes/user.routes');
const contactRoutes = require('./routes/contactus.routes');
//CREATE EXPRESS APPLICATION
const app = express();
//MIDDLEWARE TO PARSE JSON BODIES
app.use(express.json());
//MIDDLEWARE TO ENABLE CORS FOR ALL ROUTES (CALLING FRONTEND FROM DIFFERENT ORIGIN)
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// app.use(limiter);
//USE PRODUCT ROUTES FOR ANY REQUEST STARTING WITH /api/products
app.use('/api/products', productRoutes);
//USE AUTH ROUTES FOR ANY REQUEST STARTING WITH /api/auth
app.use('/api/auth', authRoutes);
//USE CART ROUTES FOR ANY REQUEST STARTING WITH /api/cart
app.use('/api/cart', cartRoutes);
//USE ORDER ROUTES FOR ANY REQUEST STARTING WITH /api/orders
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(errorHandler);
module.exports = app;

