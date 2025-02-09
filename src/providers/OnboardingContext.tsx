import { OnboardingContext, Shareholder } from "@/contexts/onboarding";
import { ReactNode, useReducer, useMemo } from "react";

interface OnboardingState {
  current: number;
  showLicense: 0 | 1;
  shareholders: Shareholder[];
  businessType: HM.BusinessType | undefined;
  stakePercentage: number | undefined;
}

type OnboardingAction =
  | { type: "SET_CURRENT"; payload: number }
  | { type: "SET_LICENSE"; payload: 0 | 1 }
  | { type: "SET_SHAREHOLDERS"; payload: Shareholder[] }
  | { type: "SET_BUSINESS_TYPE"; payload: HM.BusinessType }
  | { type: "SET_STAKE_PERCENTAGE"; payload: number };

const initialState: OnboardingState = {
  current: -1,
  showLicense: 0,
  shareholders: [],
  businessType: undefined,
  stakePercentage: undefined,
};

function onboardingReducer(
  state: OnboardingState,
  action: OnboardingAction
): OnboardingState {
  switch (action.type) {
    case "SET_CURRENT":
      return { ...state, current: action.payload };
    case "SET_LICENSE":
      return { ...state, showLicense: action.payload };
    case "SET_SHAREHOLDERS":
      return { ...state, shareholders: action.payload };
    case "SET_BUSINESS_TYPE":
      return { ...state, businessType: action.payload };
    case "SET_STAKE_PERCENTAGE":
      return { ...state, stakePercentage: action.payload };
    default:
      return state;
  }
}

const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  const contextValue = useMemo(
    () => ({
      ...state,
      setCurrent: (value: number) =>
        dispatch({ type: "SET_CURRENT", payload: value }),
      setShowLicense: (value: 0 | 1) =>
        dispatch({ type: "SET_LICENSE", payload: value }),
      setShareholders: (value: Shareholder[]) =>
        dispatch({ type: "SET_SHAREHOLDERS", payload: value }),
      setBusinessType: (value: HM.BusinessType) =>
        dispatch({ type: "SET_BUSINESS_TYPE", payload: value }),
      setStakePercentage: (value: number) =>
        dispatch({ type: "SET_STAKE_PERCENTAGE", payload: value }),
    }),
    [state]
  );

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingProvider;
