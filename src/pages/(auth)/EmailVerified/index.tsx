import { Button } from "antd";
import { Link, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

interface LocationState {
  email: string;
}

const EmailVerified = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = (location.state as LocationState)?.email;

  useEffect(() => {
    if (!email) {
      navigate("/get-started");
    }
  }, [email, navigate]);

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
        <Link to={`/onboarding`} className="block w-full">
          <Button type="primary" shape="round" size="large" className="w-full">
            Start Onboarding
          </Button>
        </Link>
      </div>
    </section>
  );
};

export const Component = EmailVerified;

export default EmailVerified;
