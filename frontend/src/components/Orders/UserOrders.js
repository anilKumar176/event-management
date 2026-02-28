import React, { useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserOrders } from '../../store/slices/orderSlice';

// Rest of your UserOrders.js code remains exactly the same...

const UserOrders = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { orders, isLoading } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(getUserOrders());
    }, [dispatch]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'success';
            case 'cancelled':
                return 'error';
            case 'shipped':
                return 'info';
            case 'processing':
                return 'warning';
            default:
                return 'default';
        }
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Orders
            </Typography>

            {orders.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                        No orders yet
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/products')}
                        sx={{ mt: 2 }}
                    >
                        Start Shopping
                    </Button>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Items</TableCell>
                                <TableCell align="right">Total Amount</TableCell>
                                <TableCell>Payment Status</TableCell>
                                <TableCell>Order Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>#{order._id.slice(-6)}</TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {order.items.length} item(s)
                                    </TableCell>
                                    <TableCell align="right">
                                        ₹{order.totalAmount}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.paymentStatus}
                                            color={order.paymentStatus === 'completed' ? 'success' : 'warning'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.orderStatus}
                                            color={getStatusColor(order.orderStatus)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            size="small"
                                            onClick={() => navigate(`/order/${order._id}`)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default UserOrders;