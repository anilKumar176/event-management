import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Tab,
    Tabs,
    LinearProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    getUsers,
    getVendors,
    getDashboardStats,
    updateUserStatus,
    verifyVendor
} from '../../store/slices/adminSlice';
import {
    People as PeopleIcon,
    Store as StoreIcon,
    ShoppingCart as CartIcon,
    Inventory as ProductIcon
} from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { users, vendors, stats, isLoading } = useSelector((state) => state.admin);
    const { user } = useSelector((state) => state.auth);
    
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/');
            return;
        }
        
        dispatch(getDashboardStats());
        dispatch(getUsers());
        dispatch(getVendors());
    }, [dispatch, user, navigate]);

    const handleToggleUserStatus = async (userId, currentStatus) => {
        try {
            await dispatch(updateUserStatus({ 
                id: userId, 
                isActive: !currentStatus 
            })).unwrap();
            toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        } catch (error) {
            toast.error('Failed to update user status');
        }
    };

    const handleVerifyVendor = async (vendorId, currentStatus) => {
        try {
            await dispatch(verifyVendor({ 
                id: vendorId, 
                isVerified: !currentStatus 
            })).unwrap();
            toast.success(`Vendor ${!currentStatus ? 'verified' : 'unverified'} successfully`);
        } catch (error) {
            toast.error('Failed to update vendor status');
        }
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <LinearProgress />
            </Container>
        );
    }

    const StatCard = ({ title, value, icon, color }) => (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h4">
                            {value}
                        </Typography>
                    </Box>
                    <Box sx={{
                        backgroundColor: `${color}.light`,
                        borderRadius: '50%',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Users"
                        value={stats?.totalUsers || 0}
                        icon={<PeopleIcon sx={{ color: 'primary.main' }} />}
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Vendors"
                        value={stats?.totalVendors || 0}
                        icon={<StoreIcon sx={{ color: 'success.main' }} />}
                        color="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Products"
                        value={stats?.totalProducts || 0}
                        icon={<ProductIcon sx={{ color: 'warning.main' }} />}
                        color="warning"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Orders"
                        value={stats?.totalOrders || 0}
                        icon={<CartIcon sx={{ color: 'error.main' }} />}
                        color="error"
                    />
                </Grid>
            </Grid>

            {/* Revenue Card */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Total Revenue
                </Typography>
                <Typography variant="h3" color="primary">
                    ₹{stats?.totalRevenue?.toLocaleString() || 0}
                </Typography>
            </Paper>

            {/* Tabs */}
            <Paper sx={{ width: '100%' }}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab label="Users" />
                    <Tab label="Vendors" />
                    <Tab label="Recent Orders" />
                </Tabs>
            </Paper>

            {/* Users Tab */}
            {tabValue === 0 && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={user.role}
                                            color={user.role === 'admin' ? 'error' : user.role === 'vendor' ? 'warning' : 'primary'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={user.isActive ? 'Active' : 'Inactive'}
                                            color={user.isActive ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton 
                                            color={user.isActive ? 'error' : 'success'}
                                            onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                                        >
                                            {user.isActive ? <CancelIcon /> : <CheckCircleIcon />}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Vendors Tab */}
            {tabValue === 1 && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Business Name</TableCell>
                                <TableCell>Owner</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Business Type</TableCell>
                                <TableCell>GST Number</TableCell>
                                <TableCell>Verified</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {vendors.map((vendor) => (
                                <TableRow key={vendor._id}>
                                    <TableCell>{vendor.businessName}</TableCell>
                                    <TableCell>{vendor.userId?.name}</TableCell>
                                    <TableCell>{vendor.userId?.email}</TableCell>
                                    <TableCell>{vendor.businessType}</TableCell>
                                    <TableCell>{vendor.gstNumber || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={vendor.isVerified ? 'Verified' : 'Pending'}
                                            color={vendor.isVerified ? 'success' : 'warning'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton 
                                            color={vendor.isVerified ? 'warning' : 'success'}
                                            onClick={() => handleVerifyVendor(vendor._id, vendor.isVerified)}
                                        >
                                            {vendor.isVerified ? <CancelIcon /> : <CheckCircleIcon />}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Recent Orders Tab */}
            {tabValue === 2 && (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Payment</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stats?.recentOrders?.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell>{order._id.slice(-6)}</TableCell>
                                    <TableCell>{order.userId?.name}</TableCell>
                                    <TableCell>₹{order.totalAmount}</TableCell>
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
                                            color={
                                                order.orderStatus === 'delivered' ? 'success' :
                                                order.orderStatus === 'cancelled' ? 'error' :
                                                order.orderStatus === 'shipped' ? 'info' : 'warning'
                                            }
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString()}
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

export default AdminDashboard;