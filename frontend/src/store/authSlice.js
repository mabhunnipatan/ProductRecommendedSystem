import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');
const userStr = localStorage.getItem('user');

let initialUser = null;
try {
  initialUser = userStr ? JSON.parse(userStr) : null;
} catch (e) {
  initialUser = null;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: token || null,
    user: initialUser,
    isAuthenticated: !!token,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, ...userData } = action.payload;
      state.token = token;
      state.user = userData;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
