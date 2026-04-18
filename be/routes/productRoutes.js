// IMPORT EXPRESS LIBRARY TO CREATE ROUTER
const express = require('express');
// CREATE A NEW ROUTER INSTANCE
const router = express.Router();
// IMPORT THE CONTROLLER FUNCTION TO HANDLE GET REQUESTS FOR ALL PRODUCTS
const productController = require('../controllers/productControllers');
// DEFINE A ROUTE FOR GET REQUESTS TO THE ROOT OF THIS ROUTER (e.g., /api/products/)
const authMiddleware = require('../middleware/auth.middleware'); // PROTECT THIS ROUTE TO REQUIRE AUTHENTICATION
const upload = require('../middleware/upload.middleware');
router.get('/', productController.getAllProducts);
router.get('/search', productController.getProducts); // search with query params
router.post('/add', authMiddleware.protect, authMiddleware.admin, upload.single('image'), productController.createProduct);
router.put('/:id', authMiddleware.protect, authMiddleware.admin, upload.single('image'), productController.updateProduct);
router.delete('/:id', authMiddleware.protect, authMiddleware.admin, productController.deleteProduct);
router.get('/:slug', productController.getProductsBySlug);
// EXPORT THE ROUTER TO BE USED IN APP.JS
module.exports = router;
