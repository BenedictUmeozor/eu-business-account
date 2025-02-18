import { Button } from "antd";
import { Link } from "react-router";

const EmailVerified = () => {
  return (
    <section className="space-y-6 rounded-xl bg-white p-6 shadow-lg lg:max-w-[466px] ml-auto pb-16">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex aspect-square w-24 h-24 items-center justify-center">
          <img
            src="/images/check.png"
            alt=""
            className="h-full w-full object-contain"
          />
        </div>
        <div className="w-full text-center space-y-2">
          <h5 className="text-xl text-grey-700 font-semibold">
            Email verified!
          </h5>
          <p className="text-grey-600">
            Your email is now verified and you can proceed with your onboarding
          </p>
        </div>
        <Link to="/onboarding" className="w-full block">
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
