import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  success: null,
  loading: false,
  error: null,
};

const loggedInUser = createSlice({
  name: "loggedInUser",
  initialState,
  reducers: {
    setloggedInUserSuccess: (state, action) => {
      return {
        ...state,
        success: action.payload,
      };
    },
    setloggedInUserLoading: (state, action) => {
      return {
        ...state,
        loading: action.payload,
      };
    },
    setloggedInUserError: (state, action) => {
      return {
        ...state,
        error: action.payload,
      };
    },
    logoutUser: () => {
      return initialState;
    },
  },
});

export const {
  setloggedInUserSuccess,
  setloggedInUserLoading,
  setloggedInUserError,
  logoutUser,
} = loggedInUser.actions;

export default loggedInUser.reducer;
