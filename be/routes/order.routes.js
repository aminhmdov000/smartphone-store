const express = require('express') // IMPORT EXPRESS LIBRARY TO CREATE ROUTER
const router = express.Router(); // CREATE A MINI ROUTER FOR ORDER-REALTED ROUTES
const authMiddleware = require('../middleware/auth.middleware'); // IMPORT THE PROTECT MIDDLEWARE TO SECURE THE ORDER ROUTES
const orderController = require('../controllers/order.controller'); // IMPORT THE ORDER CONTROLLER TO HANDLE ORDER-RELATED REQUESTS 
router.post('/checkout', authMiddleware.protect, orderController.checkout); // DEFINE A ROUTE TO HANDLE CHECKOUT AND ORDER CREATION, PROTECTED BY AUTHENTICATION /api/orders/checkout
router.get('/', authMiddleware.protect, authMiddleware.admin , orderController.getAllOrders); // get all orders admin
router.get('/statuses', authMiddleware.protect, authMiddleware.admin, orderController.getOrderStatuses); // get order statuses for admin
router.get('/my-orders', authMiddleware.protect, orderController.myOrders); //GET MY ORDERS
router.get('/:id', authMiddleware.protect, orderController.orderDetails); // GET ORDER DETAILS INCLUDING ORDER ITEMS (PRODUCT INFO) FOR A SPECIFIC ORDER, CHECKING THAT THE ORDER BELONGS TO THE LOGGED-IN USER
router.put('/:id/status', authMiddleware.protect, authMiddleware.admin, orderController.updateStatus); // update order status admin
router.put('/:id/cancel', authMiddleware.protect, orderController.cancelledOrders); // cancel order by id
module.exports = router;
