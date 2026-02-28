const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
    try {
        const { items, paymentMethod, shippingAddress } = req.body;

        // Calculate total amount
        let totalAmount = 0;
        for (let item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.productId}` });
            }
            
            // Check quantity
            if (product.quantity < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient quantity for product: ${product.name}` 
                });
            }

            item.price = product.price;
            item.total = product.price * item.quantity;
            item.name = product.name;
            item.vendorId = product.vendorId;
            totalAmount += item.total;

            // Update product quantity
            product.quantity -= item.quantity;
            await product.save();
        }

        // Create order
        const order = await Order.create({
            userId: req.user._id,
            items,
            totalAmount,
            paymentMethod,
            shippingAddress,
            paymentStatus: paymentMethod === 'Cash' ? 'pending' : 'completed',
            orderStatus: 'pending'
        });

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user orders
// @route   GET /api/orders/myorders
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate('items.productId', 'name images')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email phone')
            .populate('items.productId', 'name images');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to view this order
        if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update order status (Admin/Vendor)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.orderStatus = orderStatus;
        await order.save();

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus
};