import React from 'react';
import {
    Container,
    Grid,
    Typography,
    Button,
    IconButton,
    TextField,
    Box,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';

// Rest of your Cart.js code remains exactly the same...

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, total } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity > 0) {
            dispatch(updateQuantity({ productId, quantity: newQuantity }));
        }
    };

    const handleRemoveItem = (productId) => {
        dispatch(removeFromCart(productId));
        toast.info('Item removed from cart');
    };

    const handleCheckout = () => {
        if (!user) {
            toast.warning('Please login to checkout');
            navigate('/login');
            return;
        }
        
        if (items.length === 0) {
            toast.warning('Your cart is empty');
            return;
        }
        
        navigate('/checkout');
    };

    const handleContinueShopping = () => {
        navigate('/products');
    };

    if (items.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center', py: 8 }}>
                <ShoppingBagIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                    Your cart is empty
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    Looks like you haven't added any items to your cart yet.
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleContinueShopping}
                >
                    Continue Shopping
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleContinueShopping}
                sx={{ mb: 3 }}
            >
                Continue Shopping
            </Button>

            <Typography variant="h4" gutterBottom>
                Shopping Cart
            </Typography>

            <Grid container spacing={3}>
                {/* Cart Items */}
                <Grid item xs={12} md={8}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="center">Quantity</TableCell>
                                    <TableCell align="right">Total</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.productId}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <img
                                                    src={item.image || 'https://via.placeholder.com/50x50'}
                                                    alt={item.name}
                                                    style={{
                                                        width: 50,
                                                        height: 50,
                                                        objectFit: 'cover',
                                                        marginRight: 10
                                                    }}
                                                />
                                                <Box>
                                                    <Typography variant="subtitle2">
                                                        {item.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        ₹{item.price} each
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            ₹{item.price}
                                        </TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(
                                                    item.productId,
                                                    parseInt(e.target.value)
                                                )}
                                                inputProps={{
                                                    min: 1,
                                                    style: { width: 60, textAlign: 'center' }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            ₹{item.total}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleRemoveItem(item.productId)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Summary
                        </Typography>
                        
                        <Box sx={{ my: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="body1">Subtotal:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" align="right">
                                        ₹{total}
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={6}>
                                    <Typography variant="body1">Shipping:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" align="right">
                                        Free
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                
                                <Grid item xs={6}>
                                    <Typography variant="h6">Total:</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6" align="right">
                                        ₹{total}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handleCheckout}
                            sx={{ mb: 1 }}
                        >
                            Proceed to Checkout
                        </Button>
                        
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => dispatch(clearCart())}
                        >
                            Clear Cart
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Cart;