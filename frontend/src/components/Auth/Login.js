import React, { useState, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../store/slices/authSlice';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error, user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'user'
    });

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else if (user.role === 'vendor') {
                navigate('/vendor/dashboard');
            } else {
                navigate('/');
            }
        }
    }, [user, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(login(formData));
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Login As</InputLabel>
                            <Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                label="Login As"
                            >
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="vendor">Vendor</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </Select>
                        </FormControl>

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
                            label="Password"
                            name="password"
                            type="password"
                            value={formData.password}
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
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Button>

                        <Typography align="center">
                            Don't have an account?{' '}
                            <Link to="/register" style={{ textDecoration: 'none' }}>
                                Register here
                            </Link>
                        </Typography>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;