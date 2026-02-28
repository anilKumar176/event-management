import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all users
export const getUsers = createAsyncThunk(
    'admin/getUsers',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`${API_URL}/admin/users`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Get all vendors
export const getVendors = createAsyncThunk(
    'admin/getVendors',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`${API_URL}/admin/vendors`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Get dashboard stats
export const getDashboardStats = createAsyncThunk(
    'admin/getDashboardStats',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`${API_URL}/admin/stats`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Update user status
export const updateUserStatus = createAsyncThunk(
    'admin/updateUserStatus',
    async ({ id, isActive }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.put(`${API_URL}/admin/users/${id}/status`, { isActive }, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Verify vendor
export const verifyVendor = createAsyncThunk(
    'admin/verifyVendor',
    async ({ id, isVerified }, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.put(`${API_URL}/admin/vendors/${id}/verify`, { isVerified }, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        vendors: [],
        stats: null,
        isLoading: false,
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Users
            .addCase(getUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get Vendors
            .addCase(getVendors.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getVendors.fulfilled, (state, action) => {
                state.isLoading = false;
                state.vendors = action.payload;
            })
            .addCase(getVendors.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get Dashboard Stats
            .addCase(getDashboardStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stats = action.payload;
            })
            .addCase(getDashboardStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update User Status
            .addCase(updateUserStatus.fulfilled, (state, action) => {
                const updatedUser = action.payload.user;
                const index = state.users.findIndex(u => u._id === updatedUser._id);
                if (index !== -1) {
                    state.users[index] = updatedUser;
                }
            })
            // Verify Vendor
            .addCase(verifyVendor.fulfilled, (state, action) => {
                const updatedVendor = action.payload.vendor;
                const index = state.vendors.findIndex(v => v._id === updatedVendor._id);
                if (index !== -1) {
                    state.vendors[index] = updatedVendor;
                }
            });
    }
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;