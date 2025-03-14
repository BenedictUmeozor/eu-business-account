import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "./slices/session";
import AccountReducer from "./slices/account";

const store = configureStore({
  reducer: {
    session: sessionReducer,
    accounts: AccountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
