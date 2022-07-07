import { createSlice } from '@reduxjs/toolkit';
import { TReserve, TReserveState } from '../../types';

const initialState: TReserveState = {
  loading: false,
  reserves: [] as TReserve[],
  myReserves: [] as TReserve[]
};

const reserveSlice = createSlice({
  name: 'reserve',
  initialState,
  reducers: {
    setReserves(state: TReserveState, action: any) {
      return {
        ...state,
        reserves: action.payload
      }
    },
    setMyReserves(state: TReserveState, action: any) {
      return {
        ...state,
        myReserves: action.payload
      }
    },
    cancelMyReserve(state: TReserveState, action: any) {
      return {
        ...state,
        myReserves: (state.myReserves || []).filter((r) => r.id !== action.payload)
      }
    },
  },
});

export const { setReserves, setMyReserves, cancelMyReserve } =
  reserveSlice.actions

export const reserveReducer = reserveSlice.reducer;
