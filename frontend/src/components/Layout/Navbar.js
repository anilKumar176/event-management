import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Avatar,
    Box
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

// Rest of your Navbar.js code remains exactly the same...

// Rest of your Navbar.js code remains exactly the same...

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        handleClose();
        navigate('/login');
    };

    const cartCount = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1, cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                >
                    Technical Event Management
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        color="inherit"
                        onClick={() => navigate('/cart')}
                    >
                        <Badge badgeContent={cartCount} color="error">
                            <ShoppingCart />
                        </Badge>
                    </IconButton>

                    {user ? (
                        <>
                            <IconButton
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                                    {user.name?.charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
                                    Profile
                                </MenuItem>
                                {user.role === 'user' && (
                                    <MenuItem onClick={() => { handleClose(); navigate('/orders'); }}>
                                        My Orders
                                    </MenuItem>
                                )}
                                {user.role === 'vendor' && (
                                    <MenuItem onClick={() => { handleClose(); navigate('/vendor/dashboard'); }}>
                                        Vendor Dashboard
                                    </MenuItem>
                                )}
                                {user.role === 'admin' && (
                                    <MenuItem onClick={() => { handleClose(); navigate('/admin/dashboard'); }}>
                                        Admin Dashboard
                                    </MenuItem>
                                )}
                                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" onClick={() => navigate('/login')}>
                                Login
                            </Button>
                            <Button color="inherit" onClick={() => navigate('/register')}>
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;