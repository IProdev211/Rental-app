import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from './reducers/authReducer';
import { bikeReducer } from './reducers/bikeReducer';
import { reserveReducer } from './reducers/reserveReducer';
import { userReducer } from './reducers/userReducer';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bike: bikeReducer,
    user: userReducer,
    reserve: reserveReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
