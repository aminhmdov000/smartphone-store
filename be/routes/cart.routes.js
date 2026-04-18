const express = require('express');
// CREATE A NEW ROUTER INSTANCE
const router = express.Router();
// IMPORT THE PROTECT MIDDLEWARE TO SECURE THE CART ROUTES
const authMiddleware = require('../middleware/auth.middleware');
// IMPORT THE CART CONTROLLER TO HANDLE CART-RELATED REQUESTS
const cartController = require('../controllers/cart.controller');
// DEFINE ROUTES FOR CART OPERATIONS (GET CART, ADD TO CART, UPDATE CART ITEM, REMOVE CART ITEM)
router.get('/', authMiddleware.protect, cartController.getCard);
router.post('/add', authMiddleware.protect, cartController.addToCart);
router.put('/update/:id', authMiddleware.protect, cartController.updateCartItem);
router.delete('/remove/:id', authMiddleware.protect, cartController.removeCartItem)
// Export the router to be used in app.js
module.exports = router;