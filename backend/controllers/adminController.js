const User = require('../models/User');
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Get all users
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all vendors
// @route   GET /api/admin/vendors
const getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find({})
            .populate('userId', 'name email phone');

        res.json(vendors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
const updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isActive = isActive;
        await user.save();

        res.json({ message: 'User status updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Verify vendor
// @route   PUT /api/admin/vendors/:id/verify
const verifyVendor = async (req, res) => {
    try {
        const { isVerified } = req.body;
        const vendor = await Vendor.findById(req.params.id);

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        vendor.isVerified = isVerified;
        await vendor.save();

        res.json({ message: 'Vendor verification updated', vendor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalVendors = await User.countDocuments({ role: 'vendor' });
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        const recentOrders = await Order.find({})
            .populate('userId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        const revenue = await Order.aggregate([
            { $match: { paymentStatus: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.json({
            totalUsers,
            totalVendors,
            totalProducts,
            totalOrders,
            recentOrders,
            totalRevenue: revenue[0]?.total || 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getUsers,
    getVendors,
    updateUserStatus,
    verifyVendor,
    getDashboardStats
};