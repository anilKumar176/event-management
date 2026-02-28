import React, { useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderById, clearCurrentOrder } from '../../store/slices/orderSlice';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const OrderSuccess = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentOrder: order } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getOrderById(id));
        
        return () => {
            dispatch(clearCurrentOrder());
        };
    }, [dispatch, id]);

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                
                <Typography variant="h4" gutterBottom>
                    Order Placed Successfully!
                </Typography>
                
                <Typography variant="body1" color="text.secondary" paragraph>
                    Thank you for your order. Your order has been placed successfully.
                </Typography>
                
                {order && (
                    <Box sx={{ my: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Order Details
                        </Typography>
                        <Typography variant="body2">
                            Order ID: #{order._id}
                        </Typography>
                        <Typography variant="body2">
                            Total Amount: ₹{order.totalAmount}
                        </Typography>
                        <Typography variant="body2">
                            Payment Method: {order.paymentMethod}
                        </Typography>
                        <Typography variant="body2">
                            Order Status: {order.orderStatus}
                        </Typography>
                    </Box>
                )}
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/orders')}
                    >
                        View My Orders
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/products')}
                    >
                        Continue Shopping
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default OrderSuccess;