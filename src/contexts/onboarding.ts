import { createContext, useContext } from "react";

export interface Shareholder {
  id: number;
  business_name: string;
  first_name: string;
  last_name: string;
  email_address: string;
  role: string;
  residential_address: string;
  owns_over_25_percent: 1 | 0;
  authorized_signatory: 1 | 0;
  preferred_means_of_identification: "NIN" | "Passport" | "Drivers License";
  front_image: File | null;
  back_image: File | null;
}

interface OnboardingContextType {
  current: number;
  setCurrent: (value: number) => void;
  showLicense: 1 | 0;
  setShowLicense: (value: 1 | 0) => void;
  shareholders: Shareholder[];
  setShareholders: (value: Shareholder[]) => void;
  businessType: HM.BusinessType | undefined;
  setBusinessType: (value: HM.BusinessType) => void;
  stakePercentage: number | undefined;
  setStakePercentage: (value: number) => void;
}

export const OnboardingContext = createContext<OnboardingContextType>({
  businessType: undefined,
  current: -1,
  setCurrent: () => {},
  showLicense: 0,
  setShowLicense: () => {},
  shareholders: [],
  setShareholders: () => {},
  stakePercentage: undefined,
  setStakePercentage: () => {},
  setBusinessType: () => {},
});

export const useOnboardingContext = () => {
  return useContext(OnboardingContext);
};
