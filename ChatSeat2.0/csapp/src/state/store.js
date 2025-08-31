import { configureStore } from "@reduxjs/toolkit";
import loggedInUserReducer from "./loggedInUser";

// Function to load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Function to save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch {}
};

// Load the initial state from localStorage
const preloadedState = loadState();

// If no state is found, use an empty object for the loggedInUser
const store = configureStore({
  reducer: {
    loggedInUser: loggedInUserReducer,
  },

  // Use the preloaded state if available, otherwise use an empty object
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Subscribe to store updates and save the state to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
