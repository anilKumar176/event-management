const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env file from parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully');

        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@example.com' });
        
        if (adminExists) {
            console.log('⚠️ Admin user already exists with email: admin@example.com');
            console.log('Admin details:');
            console.log('- Name:', adminExists.name);
            console.log('- Email:', adminExists.email);
            console.log('- Role:', adminExists.role);
            process.exit(0);
        }

        // Create admin user
        console.log('Creating admin user...');
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123',
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

        console.log('✅ Admin user created successfully!');
        console.log('Admin details:');
        console.log('- Name:', admin.name);
        console.log('- Email:', admin.email);
        console.log('- Password: admin123');
        console.log('- Role:', admin.role);
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        if (error.message.includes('ECONNREFUSED')) {
            console.log('\n💡 Tip: Make sure MongoDB is running!');
            console.log('Start MongoDB with: net start MongoDB');
        }
        process.exit(1);
    }
};

createAdmin();