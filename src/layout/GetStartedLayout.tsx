import Loader from "@/components/app/Loader";
import { useAppSelector } from "@/hooks";
import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { APP_FEATURES } from "@/constants";

const GetStartedLayout = () => {
  const session = useAppSelector(state => state.session);
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

        if (session?.user && pathname === "/get-started") {
          navigate("/dashboard", { replace: true });
        }

        hasCheckedRef.current = true;
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [session?.user, navigate, pathname]);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [pathname]);

  if (isChecking) {
    return <Loader />;
  }

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden pb-12">
      <div className="absolute inset-0 bg-primary">
        <div className="absolute bottom-0 left-0 right-0 h-[35%] origin-[100%] -skew-y-6 transform bg-primary-50" />
      </div>
      <div ref={ref} />
      <section className="w-full max-w-7xl mx-auto space-y-8 lg:px-8 px-4 min-h-screen z-10 pt-8">
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
          {/* QR code positioned on the dividing line */}
          {/* <div className="absolute left-0 top-[72.5%] z-10 space-y-2 max-lg:hidden flex flex-col items-center justify-center mb-2">
            <div className="flex items-center justify-center w-32">
              <img
                src="/images/qrcode.png"
                alt=""
                className="w-full object-contain"
              />
            </div>
            <p className="w-40 text-center px-2 text-grey-600 font-medium">
              Scan code to use on your mobile
            </p>
          </div> */}

          <section className="grid h-full grid-rows-[1fr_auto] gap-16 py-8 pb-4 max-lg:hidden">
            <div className="space-y-12 text-white max-w-[400px]">
              <div className="space-y-6">
                {APP_FEATURES.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img src="/images/steps.png" alt="image" className="w-10" />
                    <div className="space-y-3 flex-grow">
                      <h5 className="text-base font-semibold">
                        {feature.title}
                      </h5>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
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
