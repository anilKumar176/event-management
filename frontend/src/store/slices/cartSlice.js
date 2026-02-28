import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
    try {
        const cartData = localStorage.getItem('cart');
        return cartData ? JSON.parse(cartData) : { items: [], total: 0 };
    } catch (error) {
        return { items: [], total: 0 };
    }
};

const saveCartToStorage = (cart) => {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: loadCartFromStorage(),
    reducers: {
        addToCart: (state, action) => {
            const { product, quantity = 1 } = action.payload;
            const existingItem = state.items.find(item => item.productId === product._id);

            if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.total = existingItem.price * existingItem.quantity;
            } else {
                state.items.push({
                    productId: product._id,
                    name: product.name,
                    price: product.price,
                    quantity,
                    total: product.price * quantity,
                    image: product.images?.[0] || '',
                    vendorId: product.vendorId
                });
            }

            // Recalculate total
            state.total = state.items.reduce((sum, item) => sum + item.total, 0);
            saveCartToStorage(state);
        },
        removeFromCart: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter(item => item.productId !== productId);
            state.total = state.items.reduce((sum, item) => sum + item.total, 0);
            saveCartToStorage(state);
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.items.find(item => item.productId === productId);
            
            if (item) {
                item.quantity = quantity;
                item.total = item.price * quantity;
                state.total = state.items.reduce((sum, item) => sum + item.total, 0);
                saveCartToStorage(state);
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            saveCartToStorage(state);
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;