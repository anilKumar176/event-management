const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @desc    Get user profile
// @route   GET /api/users/profile
router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        
        req.user.name = name || req.user.name;
        req.user.phone = phone || req.user.phone;
        req.user.address = address || req.user.address;
        
        const updatedUser = await req.user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address,
            role: updatedUser.role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;