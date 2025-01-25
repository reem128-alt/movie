import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./userReducer";
import searchReducer from "./searchReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
