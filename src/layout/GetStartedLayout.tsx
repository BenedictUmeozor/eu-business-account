import Loader from "@/components/app/Loader";
import { useAppSelector } from "@/hooks";
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

const GetStartedLayout = () => {
  const session = useAppSelector(state => state.session);
  const userState = useAppSelector(state => state.user);
  const { pathname } = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const hasCheckedRef = useRef(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Only redirect if this is a fresh page load/direct access
        if (
          !hasCheckedRef.current &&
          session?.user &&
          (pathname === "/get-started" || pathname === "/login")
        ) {
          navigate("/dashboard", { replace: true });
        }

        if (
          (hasCheckedRef.current && pathname === "/get-started") ||
          (userState?.user?.hasFinishedOnboarding && pathname === "/login")
        ) {
          navigate("/dashboard", { replace: true });
        }

        hasCheckedRef.current = true;
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [
    session?.user,
    navigate,
    pathname,
    userState?.user?.hasFinishedOnboarding,
  ]);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [pathname]);

  if (isChecking) {
    return <Loader />;
  }

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-primary">
        <div className="absolute bottom-0 left-0 right-0 h-[45%] origin-[100%] -skew-y-6 transform bg-primary-50" />
      </div>
      <div ref={ref} />
      <section className="w-full max-w-7xl mx-auto overflow-y-auto lg:px-8  px-4 min-h-screen z-10 pt-8">
        <a
          href="https://hellomemoney.com/"
          className="flex items-center gap-2 max-lg:justify-center">
          <img
            src="/images/hellome.png"
            alt="Hellomemoney"
            className="h-10 w-10"
          />
          <p className="font-cabinet text-2xl font-extrabold text-white no-underline">
            HelloMe Money
          </p>
        </a>
        <div className="relative mx-auto grid grid-cols-1 items-start gap-12 lg:grid-cols-2 justify-between">
          <section className="grid h-full grid-rows-[minmax(1fr,600px)_auto] gap-16 py-8 pb-4 max-lg:hidden">
            <div className="space-y-12 text-white max-w-[400px]">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h5 className="text-base font-semibold">
                    Multicurrency Business Accounts
                  </h5>
                  <p>
                    A global account for individuals, startups, creators, and
                    businesses to manage finances Seamlessly.
                  </p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-base font-semibold">
                    FX and International payments
                  </h5>
                  <p>Convert and transfer funds to 100+ countries with ease.</p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-base font-semibold">
                    Free UK Company Registration
                  </h5>
                  <p>
                    Register your UK company hassle-free, with a virtual office,
                    accountant, secretary, and dedicated phone line.
                  </p>
                </div>
                <div className="space-y-2">
                  <h5 className="text-base font-semibold">Platform APIs</h5>
                  <p>
                    Automate global payroll and bulk payments with powerful
                    APIs.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative space-y-2">
              <div className="flex items-center justify-center w-36">
                <img
                  src="/images/qrcode.png"
                  alt=""
                  className="h-36 w-36 object-contain"
                />
              </div>
              <p className="w-40 text-center px-2 text-grey-600 font-medium">
                Scan code to use on your mobile
              </p>
            </div>
          </section>
          <div className="py-4 pb-4 lg:py-8">
            <Outlet />
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetStartedLayout;
