import AppHeader from "@/components/app/AppHeader";
import Sidebar from "@/components/app/Sidebar";
import ENDPOINTS from "@/constants/endpoints";
import { useAppSelector } from "@/hooks";
import useMutationAction from "@/hooks/use-mutation-action";
import { Affix, message, Spin } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useNavigation } from "react-router";

const RootLayout = () => {
  const { state } = useNavigation();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const session = useAppSelector(state => state.session);

  const progressMutation = useMutationAction<
    HM.QueryResponseWithData<HM.OnboardingProgress>
  >({
    url: ENDPOINTS.ONBOARDING_PROGRESS,
    mutationKey: ["onboarding-progress", session?.business?.business_token],
    method: "POST",
    onSuccess: ({ data }) => {
      const emailVerification = Number(data.email_verification);
      const businessVerification = Number(data.business_verification);
      const businessDetails = Number(data.business_details);
      const personalDetails = Number(data.personal_details);
      const shareholder = Number(data.shareholder);
      if (emailVerification === 0) {
        navigate("/verify-email", { state: { email: session.user?.email } });
        return;
      }

      if (businessVerification === 0) {
        navigate("/onboarding", { state: { current: 0 } });
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
    },
    onError: error => {
      message.error(error?.message || "An unexpected error has occurred");
    },
  });

  useEffect(() => {
    if (session?.business?.business_token) {
      progressMutation.mutate({
        business_token: session.business.business_token,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!session?.user) {
          navigate("/login", { replace: true });
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [session, navigate]);

  if (isChecking || progressMutation.isPending) {
    return (
      <div className="grid h-screen w-screen place-items-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <section>
      <div className="flex">
        <Affix offsetTop={0}>
          <Sidebar />
        </Affix>
        <div className="flex-grow overflow-hidden">
          <AppHeader />
          <main className="relative h-[calc(100vh-70px)] overflow-auto no-scrollbar scroll-smooth px-6 py-4">
            <Outlet />
          </main>
        </div>
      </div>

      {state == "loading" && (
        <div className="fixed left-0 top-0 z-[99999] grid h-screen w-screen place-items-center bg-black/60">
          <Spin size="large" />
        </div>
      )}
    </section>
  );
};

export default RootLayout;
