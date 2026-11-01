import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    isOpen: false,
  },
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    addToCartLocal: (state, action) => {
      const existing = state.items.find((item) => (item.productId || item.id) === (action.payload.productId || action.payload.id));
      if (existing) {
        existing.quantity += action.payload.quantity || 1;
      } else {
        state.items.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }
    },
    removeFromCartLocal: (state, action) => {
      state.items = state.items.filter((item) => (item.productId || item.id) !== action.payload);
    },
    updateQuantityLocal: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => (i.productId || i.id) === productId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => (i.productId || i.id) !== productId);
        } else {
          item.quantity = quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  setCartItems,
  addToCartLocal,
  removeFromCartLocal,
  updateQuantityLocal,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
