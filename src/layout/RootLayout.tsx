import AppHeader from "@/components/app/AppHeader";
import Sidebar from "@/components/app/Sidebar";
import { useAppSelector } from "@/hooks";
import { Affix, Spin } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Outlet,
  useNavigate,
  useNavigation,
  useParams,
  useLocation,
} from "react-router";
import useCheckOnboardingProgress from "@/hooks/use-check-onboarding-progress";
import Loader from "@/components/app/Loader";

const RootLayout = () => {
  const { state } = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const session = useAppSelector(state => state.session);
  const onboardingStatus = useAppSelector(
    state => state.session.onboardingStatus
  );
  const ref = useRef<HTMLDivElement>(null);
  const navigation = useNavigation();
  const params = useParams();
  const { checkProgress, isChecking: isCheckingProgress } =
    useCheckOnboardingProgress(session?.user?.email);
  const fromLogin = useMemo(
    () => location.state?.from === "/login",
    [location.state]
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!session?.user) {
          navigate("/login", { replace: true });
          return;
        }

        if (
          !session?.signedIn?.signedIn &&
          session?.user &&
          onboardingStatus?.completed
        ) {
          navigate("/confirm-passcode", {
            state: { email: session?.user?.email },
          });
          return;
        }

        // Only check onboarding progress if not coming from login
        if (!fromLogin && !onboardingStatus?.completed) {
          checkProgress.mutate({
            business_token: session.business?.business_token,
          });
        }

        if (
          !fromLogin &&
          onboardingStatus?.completed &&
          location.pathname.includes("/onboarding")
        ) {
          navigate("/dashboard", { replace: true });
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user, fromLogin, onboardingStatus?.completed, session.signedIn]);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [navigation.state, navigation.location?.pathname, params]);

  if (isChecking || isCheckingProgress || !session?.user) {
    return <Loader />;
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
            <div ref={ref} />
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
