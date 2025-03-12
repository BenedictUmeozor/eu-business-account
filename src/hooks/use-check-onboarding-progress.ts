import { useLocation, useNavigate } from "react-router";
import { message } from "antd";
import useMutationAction from "./use-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { getErrorMessage } from "@/utils";
import { useAppDispatch } from ".";
import { setOnboardingStatus } from "@/lib/redux/slices/session";

// ProgressData interface represents the onboarding progress fields returned from the API
export interface ProgressData {
  email_verification: string;
  business_verification: string;
  business_details: string;
  personal_details: string;
  identity_verification_document: string;
  shareholder: string;
  shareholder_document: string;
  business_document: Record<string, string> | null;
}

const allIsTruthy = (obj: Record<string, string> | null) =>
  obj && Object.values(obj).every(value => Number(value) === 1);

const useCheckOnboardingProgress = (email?: string, path?: string) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  const sendOtpMutation = useMutationAction<
    HM.QueryResponse,
    { email: string }
  >({
    url: ENDPOINTS.SEND_OTP,
    mutationKey: ["send-otp"],
    onSuccess: () => {
      navigate("/verify-email", { state: { email } });
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const checkProgress = useMutationAction<
    HM.QueryResponseWithData<ProgressData>
  >({
    url: ENDPOINTS.ONBOARDING_PROGRESS,
    mutationKey: ["onboarding-progress"],
    method: "POST",
    onSuccess: ({ data }) => {
      const emailVerification = Number(data.email_verification);
      const businessVerification = Number(data.business_verification);
      const businessDetails = Number(data.business_details);
      const personalDetails = Number(data.personal_details);
      const identityVerification = Number(data.identity_verification_document);
      const shareholder = Number(data.shareholder);
      const shareholderDocument = Number(data.shareholder_document);

      // Check if business documents are completed
      const businessDocuments = data.business_document;
      // const isBusinessDocumentsCompleted =
      //   businessDocuments &&
      //   Object.values(businessDocuments).every(value => Number(value) === 1);

      if (emailVerification === 0) {
        sendOtpMutation.mutate({ email: email! });
        return;
      }

      if (businessVerification === 0) {
        // Welcome step
        navigate("/onboarding", { state: { current: -1 } });
        return;
      }

      if (businessDetails === 0) {
        // Business Information step
        navigate("/onboarding", { state: { current: 1 } });
        return;
      }

      if (personalDetails === 0) {
        // Personal Information step
        navigate("/onboarding", { state: { current: 2 } });
        return;
      }

      if (identityVerification === 0) {
        // Identity Verification step
        navigate("/onboarding", { state: { current: 5 } });
        return;
      }

      if (shareholder === 0 || shareholderDocument === 0) {
        // Add Shareholders step
        navigate("/onboarding", { state: { current: 6 } });
        return;
      }

      if (!allIsTruthy(businessDocuments)) {
        // Add Documents step
        console.log("All truthy still running", allIsTruthy(businessDocuments));
        navigate("/onboarding", { state: { current: 7 } });
        return;
      }

      console.log("final step");

      // If all steps are completed, set onboarding status to true
      dispatch(setOnboardingStatus());
      if (pathname.includes("/onboarding")) {
        navigate("/dashboard");
        return;
      }

      if (path) {
        navigate(path);
      }
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  return {
    checkProgress,
    isChecking: checkProgress.isPending || sendOtpMutation.isPending,
  };
};

export default useCheckOnboardingProgress;
