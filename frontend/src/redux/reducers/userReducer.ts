import { createSlice } from '@reduxjs/toolkit';
import { TUser, TUserState } from '../../types';

const initialState: TUserState = {
  loading: false,
  users: [] as TUser[],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setConstants(state: TUserState, action: any) {
      return {
        ...state,
        constants: action.payload
      }
    },
    setUsers(state: TUserState, action: any) {
      return {
        ...state,
        users: action.payload
      }
    },
    addNewUser(state: TUserState, action: any) {
      return {
        ...state,
        users: [...state.users, action.payload]
      }
    },
    updateUser(state: TUserState, action: any) {
      const newUser = action.payload
      const users = [...state.users]
      const index = users.findIndex(b => b.id === newUser.id)
      if (index !== -1) {
        users.splice(index, 1, newUser)
        return {
          ...state,
          users
        }
      }
      return state
    },
    deleteUsers(state: TUserState, action: any) {
      const deleteUsers = action.payload;
      const users = [...state.users]
      return {
        ...state,
        users: users.filter(user => !deleteUsers.includes(user.id))
      }
    }
  },
});

export const { setConstants, setUsers, addNewUser, updateUser, deleteUsers } =
  userSlice.actions

export const userReducer = userSlice.reducer;
