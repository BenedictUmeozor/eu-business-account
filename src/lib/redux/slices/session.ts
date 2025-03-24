import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import HM_NSP from "@/constants/namespace";

const userState = sessionStorage.getItem(HM_NSP.USER);
const businessState = sessionStorage.getItem(HM_NSP.BUSINESS);
const onboardingStatus = sessionStorage.getItem(HM_NSP.ONBOARDING);
const signedInState = sessionStorage.getItem(HM_NSP.SIGNED_IN);

interface OnboardingStatus {
  completed: boolean;
}

interface SessionState {
  user: HM.LoginResponse["data"] | null;
  business: HM.LoginResponse["business_data"] | null;
  onboardingStatus: OnboardingStatus | null;
  signedIn: { signedIn: boolean } | null;
}

const initialState: SessionState = {
  user: userState ? JSON.parse(userState) : null,
  business: businessState ? JSON.parse(businessState) : null,
  onboardingStatus: onboardingStatus ? JSON.parse(onboardingStatus) : null,
  signedIn: signedInState ? JSON.parse(signedInState) : null,
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
    setOnboardingStatus: state => {
      state.onboardingStatus = { completed: true };
      sessionStorage.setItem(
        HM_NSP.ONBOARDING,
        JSON.stringify(state.onboardingStatus)
      );
    },
    setSignIn: state => {
      state.signedIn = { signedIn: true };
      sessionStorage.setItem(HM_NSP.SIGNED_IN, JSON.stringify(state.signedIn));
    },
    clearSession: state => {
      state.user = null;
      state.business = null;
      state.onboardingStatus = null;
      state.signedIn = null;
      sessionStorage.removeItem(HM_NSP.ONBOARDING);
      sessionStorage.removeItem(HM_NSP.USER);
      sessionStorage.removeItem(HM_NSP.BUSINESS);
      sessionStorage.removeItem(HM_NSP.SIGNED_IN);
    },
  },
});

export const {
  setUser,
  setBusiness,
  clearSession,
  setOnboardingStatus,
  setSignIn,
} = sessionSlice.actions;
export default sessionSlice.reducer;
