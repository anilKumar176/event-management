import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    Typography,
    Button,
    Box,
    Chip,
    Divider,
    TextField,
    Paper,
    Skeleton
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById, clearCurrentProduct } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentProduct: product, isLoading } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        dispatch(getProductById(id));
        
        return () => {
            dispatch(clearCurrentProduct());
        };
    }, [dispatch, id]);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0 && value <= (product?.quantity || 0)) {
            setQuantity(value);
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            toast.warning('Please login to add items to cart');
            navigate('/login');
            return;
        }
        
        dispatch(addToCart({ product, quantity }));
        toast.success(`${quantity} item(s) added to cart`);
    };

    const handleBuyNow = () => {
        if (!user) {
            toast.warning('Please login to purchase');
            navigate('/login');
            return;
        }
        
        dispatch(addToCart({ product, quantity }));
        navigate('/cart');
    };

    if (isLoading || !product) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Skeleton variant="rectangular" height={400} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Skeleton variant="text" height={60} />
                        <Skeleton variant="text" height={30} width="60%" />
                        <Skeleton variant="text" height={100} />
                        <Skeleton variant="text" height={50} width="40%" />
                    </Grid>
                </Grid>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
            >
                Back
            </Button>

            <Grid container spacing={4}>
                {/* Product Images */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            height="400"
                            image={product.images?.[selectedImage] || 'https://via.placeholder.com/600x400?text=No+Image'}
                            alt={product.name}
                            sx={{ objectFit: 'contain' }}
                        />
                    </Card>
                    
                    {product.images?.length > 1 && (
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            {product.images.map((image, index) => (
                                <Card
                                    key={index}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        cursor: 'pointer',
                                        border: selectedImage === index ? '2px solid #1976d2' : 'none'
                                    }}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="80"
                                        image={image}
                                        alt={`${product.name} ${index + 1}`}
                                    />
                                </Card>
                            ))}
                        </Box>
                    )}
                </Grid>

                {/* Product Details */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>
                        {product.name}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip label={product.category} color="primary" size="small" />
                        <Chip
                            label={product.status}
                            color={product.status === 'available' ? 'success' : 'error'}
                            size="small"
                        />
                    </Box>

                    <Typography variant="h5" color="primary" gutterBottom>
                        ₹{product.price}
                    </Typography>

                    <Typography variant="body1" paragraph>
                        {product.description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* Specifications */}
                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Specifications
                            </Typography>
                            {Object.entries(product.specifications).map(([key, value]) => (
                                <Grid container spacing={2} key={key} sx={{ mb: 1 }}>
                                    <Grid item xs={4}>
                                        <Typography variant="body2" color="text.secondary">
                                            {key}:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant="body2">
                                            {value}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ))}
                        </Box>
                    )}

                    {/* Vendor Information */}
                    {product.vendorId && (
                        <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Sold by
                            </Typography>
                            <Typography variant="h6">
                                {product.vendorId.name}
                            </Typography>
                        </Paper>
                    )}

                    {/* Quantity and Stock */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Typography variant="body1">
                            Quantity:
                        </Typography>
                        <TextField
                            type="number"
                            size="small"
                            value={quantity}
                            onChange={handleQuantityChange}
                            inputProps={{ min: 1, max: product.quantity }}
                            sx={{ width: 100 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            {product.quantity} available
                        </Typography>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<ShoppingCartIcon />}
                            onClick={handleAddToCart}
                            disabled={product.quantity === 0}
                            fullWidth
                        >
                            Add to Cart
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={handleBuyNow}
                            disabled={product.quantity === 0}
                            fullWidth
                        >
                            Buy Now
                        </Button>
                    </Box>

                    {product.quantity === 0 && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            This product is currently out of stock
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProductDetails;