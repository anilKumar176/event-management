const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find all users
        const users = await User.find({});
        console.log(`📊 Total users: ${users.length}\n`);

        // Test each user
        for (const user of users) {
            console.log(`👤 User: ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   ID: ${user._id}`);
            
            // Test password for known users
            if (user.email === 'user@gmail.com') {
                const isMatch = await user.comparePassword('123456');
                console.log(`   🔑 Password '123456' matches: ${isMatch}`);
            }
            if (user.email === 'vendor1@gmail.com') {
                const isMatch = await user.comparePassword('123456');
                console.log(`   🔑 Password '123456' matches: ${isMatch}`);
            }
            if (user.email === 'admin@example.com') {
                const isMatch = await user.comparePassword('admin123');
                console.log(`   🔑 Password 'admin123' matches: ${isMatch}`);
            }
            console.log(''); // Empty line
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testUsers();