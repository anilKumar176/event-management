import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './store/store';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProductList from './components/Products/ProductList';
import ProductDetails from './components/Products/ProductDetails';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import OrderSuccess from './components/Orders/OrderSuccess';
import UserOrders from './components/Orders/UserOrders';
import VendorDashboard from './components/Vendor/VendorDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }
    
    return children;
};

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Navbar />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<ProductList />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* User Routes */}
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={
                        <ProtectedRoute allowedRoles={['user', 'admin']}>
                            <Checkout />
                        </ProtectedRoute>
                    } />
                    <Route path="/order-success/:id" element={
                        <ProtectedRoute allowedRoles={['user', 'admin']}>
                            <OrderSuccess />
                        </ProtectedRoute>
                    } />
                    <Route path="/orders" element={
                        <ProtectedRoute allowedRoles={['user', 'admin']}>
                            <UserOrders />
                        </ProtectedRoute>
                    } />
                    
                    {/* Vendor Routes */}
                    <Route path="/vendor/dashboard" element={
                        <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                            <VendorDashboard />
                        </ProtectedRoute>
                    } />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
                <ToastContainer position="bottom-right" />
            </Router>
        </Provider>
    );
}

export default App;