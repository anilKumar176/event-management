const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testAPI = async () => {
    try {
        // Test registration
        console.log('Testing registration...');
        const registerData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            phone: '9876543210',
            role: 'user'
        };
        
        const registerRes = await axios.post(`${API_URL}/auth/register`, registerData);
        console.log('Registration successful:', registerRes.data);

        // Test login
        console.log('\nTesting login...');
        const loginData = {
            email: 'test@example.com',
            password: 'password123'
        };
        
        const loginRes = await axios.post(`${API_URL}/auth/login`, loginData);
        console.log('Login successful:', loginRes.data);

        // Test get products
        console.log('\nTesting get products...');
        const productsRes = await axios.get(`${API_URL}/products`);
        console.log('Products fetched:', productsRes.data);

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
};

testAPI();