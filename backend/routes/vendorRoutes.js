const express = require('express');
const router = express.Router();
const { protect, vendor } = require('../middleware/auth');
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');

// @desc    Get vendor profile
// @route   GET /api/vendors/profile
router.get('/profile', protect, vendor, async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ userId: req.user._id })
            .populate('userId', 'name email phone');
        
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }
        
        res.json(vendor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Update vendor profile
// @route   PUT /api/vendors/profile
router.put('/profile', protect, vendor, async (req, res) => {
    try {
        const { businessName, businessType, gstNumber, description } = req.body;
        
        const vendor = await Vendor.findOne({ userId: req.user._id });
        
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor profile not found' });
        }
        
        vendor.businessName = businessName || vendor.businessName;
        vendor.businessType = businessType || vendor.businessType;
        vendor.gstNumber = gstNumber || vendor.gstNumber;
        vendor.description = description || vendor.description;
        
        const updatedVendor = await vendor.save();
        res.json(updatedVendor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Get vendor orders
// @route   GET /api/vendors/orders
router.get('/orders', protect, vendor, async (req, res) => {
    try {
        const orders = await Order.find({ 'items.vendorId': req.user._id })
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @desc    Update order status (for vendor's products)
// @route   PUT /api/vendors/orders/:orderId/status
router.put('/orders/:orderId/status', protect, vendor, async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findById(req.params.orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Check if order contains vendor's products
        const hasVendorProducts = order.items.some(
            item => item.vendorId.toString() === req.user._id.toString()
        );
        
        if (!hasVendorProducts) {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }
        
        order.orderStatus = orderStatus;
        await order.save();
        
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;