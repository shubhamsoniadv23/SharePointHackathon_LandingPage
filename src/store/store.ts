import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import settingsReducer from "./slices/settingsSlice";
import topNavListReducer from "./slices/topNavListDataSlice";

const GLOBAL_STORE_KEY = "__SPFX_REDUX_STORE__";

// Function to create a new Redux store
const createStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      settings: settingsReducer,
      topNavList: topNavListReducer,
    },
  });

// Ensure a single store instance globally
if (!(window as any)[GLOBAL_STORE_KEY]) {
  (window as any)[GLOBAL_STORE_KEY] = createStore();
}

// Correctly infer store type
const store = (window as any)[GLOBAL_STORE_KEY] as ReturnType<
  typeof createStore
>;

export const getStore = () => store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
