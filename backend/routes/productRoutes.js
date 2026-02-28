const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');
const { protect, vendor } = require('../middleware/auth');

router.route('/')
    .get(getProducts)
    .post(protect, vendor, createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

module.exports = router;