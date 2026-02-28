import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'user'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        // Prepare data for API
        const submitData = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            role: formData.role
        };

        console.log('Submitting:', submitData);

        try {
            // Direct API call
            const response = await axios.post('http://localhost:5000/api/auth/register', submitData);
            console.log('Success:', response.data);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error('Error:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Register
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Register As</InputLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                label="Register As"
                            >
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="vendor">Vendor</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>

                        <Typography align="center">
                            Already have an account?{' '}
                            <Link to="/login" style={{ textDecoration: 'none' }}>
                                Login here
                            </Link>
                        </Typography>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Register;