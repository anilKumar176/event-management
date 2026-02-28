import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create order
export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (orderData, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.post(`${API_URL}/orders`, orderData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Get user orders
export const getUserOrders = createAsyncThunk(
    'orders/getUserOrders',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`${API_URL}/orders/myorders`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Get order by ID
export const getOrderById = createAsyncThunk(
    'orders/getOrderById',
    async (id, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`${API_URL}/orders/${id}`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        orders: [],
        currentOrder: null,
        isLoading: false,
        error: null
    },
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders.unshift(action.payload);
                state.currentOrder = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get User Orders
            .addCase(getUserOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
            })
            .addCase(getUserOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get Order By Id
            .addCase(getOrderById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getOrderById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentOrder = action.payload;
            })
            .addCase(getOrderById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;