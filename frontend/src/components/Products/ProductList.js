import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Box,
    Pagination,
    Skeleton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';

const ProductList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products, totalPages, currentPage, isLoading } = useSelector(
        (state) => state.products
    );
    const { user } = useSelector((state) => state.auth);

    const [filters, setFilters] = useState({
        category: '',
        search: '',
        page: 1
    });

    const categories = [
        'Electronics',
        'Furniture',
        'Stationery',
        'Catering',
        'Decor',
        'AV Equipment',
        'Other'
    ];

    useEffect(() => {
        dispatch(getProducts(filters));
    }, [dispatch, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
            page: 1
        }));
    };

    const handlePageChange = (event, value) => {
        setFilters((prev) => ({
            ...prev,
            page: value
        }));
    };

    const handleAddToCart = (product) => {
        if (!user) {
            toast.warning('Please login to add items to cart');
            navigate('/login');
            return;
        }
        dispatch(addToCart({ product, quantity: 1 }));
        toast.success('Product added to cart');
    };

    const handleViewDetails = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Grid container spacing={3}>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item}>
                            <Skeleton variant="rectangular" height={200} />
                            <Skeleton variant="text" />
                            <Skeleton variant="text" width="60%" />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Filters */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            label="Search Products"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                label="Category"
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            {/* Product Grid */}
            {products.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                        No products found
                    </Typography>
                </Box>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {products.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product._id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                                        alt={product.name}
                                        sx={{ objectFit: 'cover', cursor: 'pointer' }}
                                        onClick={() => handleViewDetails(product._id)}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h6" component="h2">
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {product.description?.substring(0, 100)}...
                                        </Typography>
                                        <Typography variant="h6" color="primary">
                                            ₹{product.price}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Quantity Available: {product.quantity}
                                        </Typography>
                                        {product.vendorId && (
                                            <Typography variant="body2" color="text.secondary">
                                                Vendor: {product.vendorId.name}
                                            </Typography>
                                        )}
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            size="small"
                                            color="primary"
                                            onClick={() => handleViewDetails(product._id)}
                                        >
                                            View Details
                                        </Button>
                                        <Button
                                            size="small"
                                            color="primary"
                                            variant="contained"
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.quantity === 0}
                                        >
                                            {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            )}
        </Container>
    );
};

export default ProductList;