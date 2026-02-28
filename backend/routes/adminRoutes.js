const express = require('express');
const router = express.Router();
const {
    getUsers,
    getVendors,
    updateUserStatus,
    verifyVendor,
    getDashboardStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin); // All admin routes require authentication and admin role

router.get('/users', getUsers);
router.get('/vendors', getVendors);
router.get('/stats', getDashboardStats);
router.put('/users/:id/status', updateUserStatus);
router.put('/vendors/:id/verify', verifyVendor);

module.exports = router;