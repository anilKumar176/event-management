import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all products
export const getProducts = createAsyncThunk(
    'products/getProducts',
    async ({ page = 1, category = '', search = '' } = {}, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${API_URL}/products?page=${page}&category=${category}&search=${search}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Get single product
export const getProductById = createAsyncThunk(
    'products/getProductById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/products/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Create product (Vendor)
export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (productData, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.post(`${API_URL}/products`, productData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        currentProduct: null,
        totalPages: 1,
        currentPage: 1,
        total: 0,
        isLoading: false,
        error: null
    },
    reducers: {
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Products
            .addCase(getProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload.products;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
                state.total = action.payload.total;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get Product By Id
            .addCase(getProductById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getProductById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentProduct = action.payload;
            })
            .addCase(getProductById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Create Product
            .addCase(createProduct.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products.unshift(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;