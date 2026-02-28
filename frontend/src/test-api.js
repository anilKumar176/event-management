const testAPI = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        console.log('✅ Backend is reachable!');
        console.log('Products API response:', data);
    } catch (error) {
        console.error('❌ Cannot connect to backend:', error.message);
        console.log('Make sure backend is running on port 5000');
    }
};

testAPI();