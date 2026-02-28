import React, { useState } from 'react';
import {
    Container,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography,
    Grid,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    Radio,
    FormControlLabel,
    Box,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../../store/slices/orderSlice';
import { clearCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';

// Rest of your Checkout.js code remains exactly the same...

const steps = ['Shipping Address', 'Payment Method', 'Review Order'];

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items, total } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const { isLoading } = useSelector((state) => state.orders);

    const [activeStep, setActiveStep] = useState(0);
    const [address, setAddress] = useState({
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        pincode: user?.address?.pincode || ''
    });
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    React.useEffect(() => {
        if (!user) {
            navigate('/login');
        }
        if (items.length === 0) {
            navigate('/cart');
        }
    }, [user, items, navigate]);

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        });
    };

    const handleNext = () => {
        if (activeStep === 0) {
            // Validate address
            if (!address.street || !address.city || !address.state || !address.pincode) {
                toast.error('Please fill in all address fields');
                return;
            }
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handlePlaceOrder = async () => {
        const orderData = {
            items: items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            })),
            paymentMethod,
            shippingAddress: address
        };

        try {
            const result = await dispatch(createOrder(orderData)).unwrap();
            dispatch(clearCart());
            toast.success('Order placed successfully!');
            navigate(`/order-success/${result._id}`);
        } catch (error) {
            toast.error(error || 'Failed to place order');
        }
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Street Address"
                                name="street"
                                value={address.street}
                                onChange={handleAddressChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={address.city}
                                onChange={handleAddressChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="State"
                                name="state"
                                value={address.state}
                                onChange={handleAddressChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Pincode"
                                name="pincode"
                                value={address.pincode}
                                onChange={handleAddressChange}
                                required
                            />
                        </Grid>
                    </Grid>
                );
            
            case 1:
                return (
                    <FormControl component="fieldset">
                        <FormLabel component="legend">Select Payment Method</FormLabel>
                        <RadioGroup
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <FormControlLabel value="Cash" control={<Radio />} label="Cash on Delivery" />
                            <FormControlLabel value="UPI" control={<Radio />} label="UPI" />
                            <FormControlLabel value="Card" control={<Radio />} label="Credit/Debit Card" />
                        </RadioGroup>
                    </FormControl>
                );
            
            case 2:
                return (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Order Summary
                        </Typography>
                        
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Shipping Address
                                </Typography>
                                <Typography variant="body2" paragraph>
                                    {address.street}, {address.city}, {address.state} - {address.pincode}
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Payment Method
                                </Typography>
                                <Typography variant="body2" paragraph>
                                    {paymentMethod}
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Items
                                </Typography>
                                {items.map((item) => (
                                    <Box key={item.productId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">
                                            {item.name} x {item.quantity}
                                        </Typography>
                                        <Typography variant="body2">
                                            ₹{item.total}
                                        </Typography>
                                    </Box>
                                ))}
                                
                                <Divider sx={{ my: 2 }} />
                                
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6">Total</Typography>
                                    <Typography variant="h6">₹{total}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </>
                );
            
            default:
                return 'Unknown step';
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Checkout
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {activeStep === steps.length ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Processing your order...
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {getStepContent(activeStep)}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                            >
                                Back
                            </Button>
                            <Button
                                variant="contained"
                                onClick={activeStep === steps.length - 1 ? handlePlaceOrder : handleNext}
                                disabled={isLoading}
                            >
                                {activeStep === steps.length - 1 
                                    ? (isLoading ? 'Placing Order...' : 'Place Order') 
                                    : 'Next'}
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default Checkout;