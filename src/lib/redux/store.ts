import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./slices/session";
import userReducer from "./slices/user";

const store = configureStore({
  reducer: {
    session: sessionReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store
