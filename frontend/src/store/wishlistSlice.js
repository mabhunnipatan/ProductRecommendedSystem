import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    isOpen: false,
  },
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
    },
    toggleWishlistLocal: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex(
        (i) => (i.productId || i.id) === (product.productId || product.id)
      );
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
    },
    toggleWishlistModal: (state) => {
      state.isOpen = !state.isOpen;
    },
    setWishlistOpen: (state, action) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setWishlist, toggleWishlistLocal, toggleWishlistModal, setWishlistOpen } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
