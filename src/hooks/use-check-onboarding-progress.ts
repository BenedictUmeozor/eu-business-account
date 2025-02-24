import { useNavigate } from "react-router";
import { message } from "antd";
import useMutationAction from "./use-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { getErrorMessage } from "@/utils";
import { useAppDispatch } from ".";
import { setOnboardingStatus } from "@/lib/redux/slices/user";

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
    HM.QueryResponseWithData<HM.OnboardingProgress>
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

      if (emailVerification === 0) {
        sendOtpMutation.mutate({ email: email! });
        return;
      }

      if (businessVerification === 0) {
        navigate("/onboarding", { state: { current: -1 } });
        return;
      }

      if (businessDetails === 0) {
        navigate("/onboarding", { state: { current: 1 } });
        return;
      }

      if (personalDetails === 0) {
        navigate("/onboarding", { state: { current: 2 } });
        return;
      }

      if (shareholder === 0) {
        navigate("/onboarding", { state: { current: 4 } });
        return;
      }

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
