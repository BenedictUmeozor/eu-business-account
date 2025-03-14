import { Button, message } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import Loader from "@/components/app/Loader";
import useCheckOnboardingProgress from "@/hooks/use-check-onboarding-progress";
import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { setBusiness, setUser } from "@/lib/redux/slices/session";
import { getErrorMessage } from "@/utils";

interface LocationState {
  email: string;
  password: string;
}

const EmailVerified = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const session = useAppSelector(state => state.session);
  const email = (location.state as LocationState)?.email;
  const password = (location.state as LocationState)?.password;
  const [isChecking, setIsChecking] = useState(true);

  const { checkProgress, isChecking: checkProgressIsChecking } =
    useCheckOnboardingProgress(email, "/dashboard");

  const mutation = useSharedMutationAction<HM.LoginResponse>({
    url: ENDPOINTS.LOGIN_USER,
    mutationKey: ["login"],
    onSuccess: response => {
      dispatch(setBusiness(response.business_data));
      dispatch(setUser(response.data));

      navigate("", { state: { from: "/login" }, replace: true });
      checkProgress.mutate({
        business_token: response.business_data.business_token,
      });
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const handleNavigate = () => {
    if (session?.user) {
      navigate("/onboarding");
    } else {
      mutation.mutate({
        email,
        password,
      });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!email) {
          if (session?.user) {
            navigate("/dashboard");
          } else {
            navigate("/login");
          }
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [email, navigate, session]);

  if (isChecking) {
    return <Loader />;
  }

  if (!email) return null;

  return (
    <section className="ml-auto space-y-6 rounded-xl bg-white p-6 pb-16 shadow-lg lg:max-w-[466px]">
      {checkProgressIsChecking && <Loader />}
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex aspect-square h-24 w-24 items-center justify-center">
          <img
            src="/images/check.png"
            alt=""
            className="h-full w-full object-contain"
          />
        </div>
        <div className="w-full space-y-2 text-center">
          <h5 className="text-xl font-semibold text-grey-700">
            Email verified!
          </h5>
          <p className="text-grey-600">
            Your email is now verified and you can proceed with your onboarding
          </p>
        </div>

        <Button
          type="primary"
          shape="round"
          size="large"
          className="w-full"
          loading={mutation.isPending}
          onClick={handleNavigate}>
          {session?.user ? "Continue Onboarding" : "Continue Onboarding"}
        </Button>
      </div>
    </section>
  );
};

export const Component = EmailVerified;

export default EmailVerified;
