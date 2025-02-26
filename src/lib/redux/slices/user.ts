import HM_NSP from "@/constants/namespace";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearSession } from "./session";

interface State {
  user: {
    hasFinishedOnboarding: boolean;
  };
}

const stateObj = sessionStorage.getItem(HM_NSP.ONBOARDING);
const initialState: State = {
  user: stateObj ? JSON.parse(stateObj) : { hasFinishedOnboarding: false },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setOnboardingStatus: (state, action: PayloadAction<boolean>) => {
      state.user.hasFinishedOnboarding = action.payload;
      sessionStorage.setItem(HM_NSP.ONBOARDING, JSON.stringify(state));
    },
    resetUserState: state => {
      state.user.hasFinishedOnboarding = false;
      sessionStorage.removeItem(HM_NSP.ONBOARDING);
    },
  },
  extraReducers: builder => {
    builder.addCase(clearSession, state => {
      state.user.hasFinishedOnboarding = false;
      sessionStorage.removeItem(HM_NSP.ONBOARDING);
    });
  },
});

export const { setOnboardingStatus, resetUserState } = userSlice.actions;
export default userSlice.reducer;
