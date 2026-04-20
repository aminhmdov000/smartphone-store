const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const cartController = require('../controllers/cart.controller');

router.get('/', authMiddleware.protect, cartController.getCard);
router.post('/add', authMiddleware.protect, cartController.addToCart);
router.put('/update/:id', authMiddleware.protect, cartController.updateCartItem);
router.delete('/remove/:id', authMiddleware.protect, cartController.removeCartItem)

module.exports = router;
