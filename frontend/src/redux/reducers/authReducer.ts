import { createSlice } from '@reduxjs/toolkit';
import { TUser, TAuthState } from '../../types';

const initialState: TAuthState = {
  isLoggedIn: false,
  userInfo: {} as TUser,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn(state: TAuthState, action: any) {
      const data = action.payload;
      state.loading = false;
      state.userInfo = data;
      state.isLoggedIn = true;
    },
    setLoggedOut(state: TAuthState) {
      state.loading = false;
      state.userInfo = {} as TUser;
      state.isLoggedIn = false;
    },
  },
});

export const { setLoggedIn, setLoggedOut } =
  authSlice.actions

export const authReducer = authSlice.reducer;
