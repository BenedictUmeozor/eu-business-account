import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import HM_NSP from "@/constants/namespace";
import { store } from "../store";

const userState = sessionStorage.getItem(HM_NSP.USER);
const businessState = sessionStorage.getItem(HM_NSP.BUSINESS);

interface SessionState {
  user: HM.LoginResponse["data"] | null;
  business: HM.LoginResponse["business_data"] | null;
}

const initialState: SessionState = {
  user: userState ? JSON.parse(userState) : null,
  business: businessState ? JSON.parse(businessState) : null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<HM.LoginResponse["data"]>) => {
      state.user = action.payload;
      sessionStorage.setItem(HM_NSP.USER, JSON.stringify(action.payload));
    },
    setBusiness: (
      state,
      action: PayloadAction<HM.LoginResponse["business_data"]>
    ) => {
      state.business = action.payload;
      sessionStorage.setItem(HM_NSP.BUSINESS, JSON.stringify(action.payload));
    },
    clearSession: state => {
      state.user = null;
      state.business = null;
      sessionStorage.removeItem(HM_NSP.USER);
      sessionStorage.removeItem(HM_NSP.BUSINESS);
    },
  },
});

export const logout = () => {
  store.dispatch(clearSession());
  window.location.href = "/login";
};

export const { setUser, setBusiness, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
