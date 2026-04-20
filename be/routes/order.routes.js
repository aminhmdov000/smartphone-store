const express = require('express') 
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware'); 
const orderController = require('../controllers/order.controller'); 
router.post('/checkout', authMiddleware.protect, orderController.checkout); 
router.get('/', authMiddleware.protect, authMiddleware.admin , orderController.getAllOrders); 
router.get('/statuses', authMiddleware.protect, authMiddleware.admin, orderController.getOrderStatuses); 
router.get('/my-orders', authMiddleware.protect, orderController.myOrders); 
router.get('/:id', authMiddleware.protect, orderController.orderDetails); 
router.put('/:id/status', authMiddleware.protect, authMiddleware.admin, orderController.updateStatus); 
router.put('/:id/cancel', authMiddleware.protect, orderController.cancelledOrders);
module.exports = router;
