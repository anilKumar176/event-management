import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Tab,
    Tabs
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, createProduct } from '../../store/slices/productSlice';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';

// Rest of your VendorDashboard.js code remains exactly the same...

const VendorDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products, isLoading } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    
    const [tabValue, setTabValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        quantity: '',
        images: []
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
        if (user?.role !== 'vendor' && user?.role !== 'admin') {
            navigate('/');
            return;
        }
        dispatch(getProducts({ vendor: user?._id }));
    }, [dispatch, user, navigate]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewProduct({
            name: '',
            category: '',
            description: '',
            price: '',
            quantity: '',
            images: []
        });
    };

    const handleInputChange = (e) => {
        setNewProduct({
            ...newProduct,
            [e.target.name]: e.target.value
        });
    };

    const handleAddProduct = async () => {
        try {
            await dispatch(createProduct(newProduct)).unwrap();
            toast.success('Product added successfully');
            handleCloseDialog();
        } catch (error) {
            toast.error(error || 'Failed to add product');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return 'success';
            case 'out_of_stock':
                return 'error';
            case 'discontinued':
                return 'default';
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4">
                    Vendor Dashboard
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenDialog}
                >
                    Add New Product
                </Button>
            </Box>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="My Products" />
                    <Tab label="Orders" />
                    <Tab label="Analytics" />
                </Tabs>
            </Paper>

            {tabValue === 0 && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product._id}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell align="right">₹{product.price}</TableCell>
                                    <TableCell align="right">{product.quantity}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={product.status}
                                            color={getStatusColor(product.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton 
                                            color="primary" 
                                            size="small"
                                            onClick={() => navigate(`/vendor/product/${product._id}`)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="error" size="small">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {products.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body1" sx={{ py: 4 }}>
                                            No products added yet. Click "Add New Product" to get started.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {tabValue === 1 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Orders
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Order management features coming soon...
                    </Typography>
                </Paper>
            )}

            {tabValue === 2 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Analytics features coming soon...
                    </Typography>
                </Paper>
            )}

            {/* Add Product Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Product Name"
                                name="name"
                                value={newProduct.name}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Category"
                                name="category"
                                value={newProduct.category}
                                onChange={handleInputChange}
                                required
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                type="number"
                                value={newProduct.price}
                                onChange={handleInputChange}
                                required
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Quantity"
                                name="quantity"
                                type="number"
                                value={newProduct.quantity}
                                onChange={handleInputChange}
                                required
                                InputProps={{ inputProps: { min: 0 } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={4}
                                value={newProduct.description}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAddProduct} variant="contained">
                        Add Product
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default VendorDashboard;