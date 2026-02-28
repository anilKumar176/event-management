const express = require('express');
const router = express.Router();
const {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
    .post(protect, createOrder);

router.get('/myorders', protect, getUserOrders);

router.route('/:id')
    .get(protect, getOrderById);

router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;