import { createSlice } from '@reduxjs/toolkit';
import { TBike, TBikeState } from '../../types';

const initialState: TBikeState = {
  loading: false,
  bikes: [] as TBike[],
  availableBikes: [] as TBike[],
  constants: {
    locations: [],
    models: [],
    colors: []
  }
};

const bikeSlice = createSlice({
  name: 'bike',
  initialState,
  reducers: {
    setConstants(state: TBikeState, action: any) {
      return {
        ...state,
        constants: action.payload
      }
    },
    setBikes(state: TBikeState, action: any) {
      return {
        ...state,
        bikes: action.payload
      }
    },
    setAvailableBikes(state: TBikeState, action: any) {
      return {
        ...state,
        availableBikes: action.payload
      }
    },
    addNewAvailableBike(state: TBikeState, action: any) {
      return {
        ...state,
        availableBikes: [...state.availableBikes, action.payload]
      }
    },
    addNewBike(state: TBikeState, action: any) {
      return {
        ...state,
        bikes: [...state.bikes, action.payload]
      }
    },
    updateBike(state: TBikeState, action: any) {
      const newBike = action.payload
      const bikes = [...state.bikes]
      const index = bikes.findIndex(b => b.id === newBike.id)
      if (index !== -1) {
        bikes.splice(index, 1, newBike)
        return {
          ...state,
          bikes
        }
      }
      return state
    },
    deleteBikes(state: TBikeState, action: any) {
      const deleteBikes = action.payload;
      const bikes = [...state.bikes]
      return {
        ...state,
        bikes: bikes.filter(bike => !deleteBikes.includes(bike.id))
      }
    }
  },
});

export const { setConstants, setBikes, addNewBike, updateBike, deleteBikes, setAvailableBikes, addNewAvailableBike } =
  bikeSlice.actions

export const bikeReducer = bikeSlice.reducer;
