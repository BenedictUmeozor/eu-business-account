import { Button } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks";
import Loader from "@/components/app/Loader";

interface LocationState {
  email: string;
}

const EmailVerified = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const session = useAppSelector(state => state.session);
  const email = (location.state as LocationState)?.email;
  const [isChecking, setIsChecking] = useState(true);

  const handleNavigate = () => {
    if (session?.user) {
      navigate("/onboarding");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!email) {
          if (session?.user) {
            navigate("/dashboard")
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
          onClick={handleNavigate}>
          {session?.user ? "Continue Onboarding" : "Continue to Login"}
        </Button>
      </div>
    </section>
  );
};

export const Component = EmailVerified;

export default EmailVerified;
