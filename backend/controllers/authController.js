const User = require('../models/User');
const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Register user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
    try {
        console.log('Registration request received:', req.body);
        
        const { name, email, password, phone, address, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        console.log('Creating user...');
        const user = new User({
            name,
            email,
            password,
            phone,
            address: address || {},
            role: role || 'user'
        });

        // Save user
        await user.save();
        console.log('User created successfully:', user._id);

        // If role is vendor, create vendor profile
        if (role === 'vendor') {
            console.log('Creating vendor profile...');
            const { businessName, businessType, gstNumber, description } = req.body;
            
            await Vendor.create({
                userId: user._id,
                businessName: businessName || '',
                businessType: businessType || '',
                gstNumber: gstNumber || '',
                description: description || ''
            });
            console.log('Vendor profile created');
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        // Check for duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    try {
        console.log('Login request received:', req.body.email);
        
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if user is active
        if (!user.isActive) {
            console.log('Account is deactivated:', email);
            return res.status(401).json({ message: 'Account is deactivated' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Invalid password for:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Get vendor data if user is vendor
        let vendorData = null;
        if (user.role === 'vendor') {
            vendorData = await Vendor.findOne({ userId: user._id });
        }

        // Generate token
        const token = generateToken(user._id);

        console.log('Login successful:', email);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            vendorData,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (user.role === 'vendor') {
            const vendorData = await Vendor.findOne({ userId: user._id });
            res.json({ user, vendorData });
        } else {
            res.json({ user });
        }
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerUser, loginUser, getProfile };