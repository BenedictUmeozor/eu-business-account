import HM_NSP from "@/constants/namespace";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearSession } from "./session";

interface State {
  user: {
    hasFinishedOnboarding: boolean;
  };
}

const stateObj = sessionStorage.getItem(HM_NSP.USER);
const initialState: State = stateObj ? JSON.parse(stateObj) : null;

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setOnboardingStatus: (state, action: PayloadAction<boolean>) => {
      state.user.hasFinishedOnboarding = action.payload;
      sessionStorage.setItem(HM_NSP.USER, JSON.stringify(state));
    },
    resetUserState: state => {
      state.user.hasFinishedOnboarding = false;
      sessionStorage.removeItem(HM_NSP.USER);
    },
  },
  extraReducers: builder => {
    builder.addCase(clearSession, state => {
      state.user.hasFinishedOnboarding = false;
      sessionStorage.removeItem(HM_NSP.USER);
    });
  }
});

export const { setOnboardingStatus, resetUserState } = userSlice.actions;
export default userSlice.reducer;
