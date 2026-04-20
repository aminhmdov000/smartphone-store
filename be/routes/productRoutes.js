const express = require('express');
const router = express.Router();
const productController = require('../controllers/productControllers');
const authMiddleware = require('../middleware/auth.middleware'); 
const upload = require('../middleware/upload.middleware');

router.get('/', productController.getAllProducts);
router.get('/search', productController.getProducts); 
router.post('/add', authMiddleware.protect, authMiddleware.admin, upload.single('image'), productController.createProduct);
router.put('/:id', authMiddleware.protect, authMiddleware.admin, upload.single('image'), productController.updateProduct);
router.delete('/:id', authMiddleware.protect, authMiddleware.admin, productController.deleteProduct);
router.get('/:slug', productController.getProductsBySlug);

module.exports = router;
