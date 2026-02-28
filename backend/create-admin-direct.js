const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Define a simple schema without middleware
        const adminSchema = new mongoose.Schema({
            name: String,
            email: String,
            password: String,
            phone: String,
            role: String,
            isActive: Boolean,
            createdAt: { type: Date, default: Date.now }
        });

        // Create model
        const Admin = mongoose.model('Admin', adminSchema, 'users'); // Use 'users' collection

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
        
        if (existingAdmin) {
            console.log('⚠️ Admin user already exists:');
            console.log('Email:', existingAdmin.email);
            console.log('Password: admin123 (if not changed)');
            
            // Update password if needed
            console.log('\nUpdating admin password...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            
            await Admin.updateOne(
                { email: 'admin@example.com' },
                { $set: { password: hashedPassword } }
            );
            console.log('✅ Admin password reset to: admin123');
            
            process.exit(0);
        }

        // Hash password manually
        console.log('Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Create admin user
        const admin = await Admin.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            phone: '1234567890',
            role: 'admin',
            isActive: true,
            address: {
                street: 'Admin Office',
                city: 'Admin City',
                state: 'Admin State',
                pincode: '123456'
            }
        });

        console.log('\n✅ Admin user created successfully!');
        console.log('=================================');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');
        console.log('Role: admin');
        console.log('=================================');
        
        // Verify the password works
        const testPassword = await bcrypt.compare('admin123', admin.password);
        console.log('Password verification test:', testPassword ? '✅ PASSED' : '❌ FAILED');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createAdmin();