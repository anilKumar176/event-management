const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testLogin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'user@gmail.com';
        const password = '123456';

        const user = await User.findOne({ email });
        
        if (!user) {
            console.log('User not found');
            process.exit();
        }

        console.log('User found:', user.email);
        console.log('Stored password hash:', user.password);

        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

testLogin();