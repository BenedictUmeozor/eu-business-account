import { useNavigate } from "react-router";
import { message } from "antd";
import useMutationAction from "./use-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { getErrorMessage } from "@/utils";
import { useAppDispatch } from ".";
import { setOnboardingStatus } from "@/lib/redux/slices/user";

// ProgressData interface represents the onboarding progress fields returned from the API
interface ProgressData {
  email_verification: string;
  business_verification: string;
  business_details: string;
  personal_details: string;
  shareholder: string;
  shareholder_document: string;
  business_document: {
    incorporation_document: string;
    proof_of_source_of_funds: string;
    proof_of_business_address: string;
    license_of_operation: string;
  };
}

const useCheckOnboardingProgress = (email?: string) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
      const shareholder = Number(data.shareholder);
      const shareholderDocument = Number(data.shareholder_document);
      
      // Check if business documents are completed
      const businessDocuments = data.business_document;
      const isBusinessDocumentsCompleted = 
        Number(businessDocuments.incorporation_document) === 1 &&
        Number(businessDocuments.proof_of_source_of_funds) === 1 &&
        Number(businessDocuments.proof_of_business_address) === 1 &&
        Number(businessDocuments.license_of_operation) === 1;

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

      if (shareholder === 0) {
        // Add Shareholders step
        navigate("/onboarding", { state: { current: 3 } });
        return;
      }
      
      if (shareholderDocument === 0 || !isBusinessDocumentsCompleted) {
        // Add Documents step
        navigate("/onboarding", { state: { current: 4 } });
        return;
      }

      // If all steps are completed, set onboarding status to true
      dispatch(setOnboardingStatus(true));
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
