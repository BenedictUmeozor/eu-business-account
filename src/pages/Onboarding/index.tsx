import { StepProps, Steps } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import Welcome from "./Welcome";
import BusinessNameSearch from "./BusinessNameSearch";
import BusinessInformation from "./BusinessInformation";
import PersonalInfo from "./PersonalInfo";
import IdentityVerification from "./IdentityVerification";
import AddShareholders from "./Shareholder/AddShareholders";
import Review from "./Review";
import OnboardingSuccess from "./OnboardingSuccess";

const steps: StepProps[] = [
  {
    title: "Business Verification",
  },
  {
    title: "Business Information",
  },
  {
    title: "Personal Information",
  },
  {
    title: "Identity Verification",
  },
  {
    title: "Add Shareholders",
  },
  {
    title: "Review",
  },
];

const Onboarding = () => {
  const [current, setCurrent] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);

  const next = useCallback(() => {
    setCurrent(prev => (prev === -1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [current]);

  return (
    <section className="no-scrollbar grid grid-cols-[300px_1fr] overflow-hidden rounded-xl">
      <aside className="grid h-full max-w-[600px] grid-rows-[1fr_auto] gap-12 border border-r-0 border-solid border-grey-200 bg-primary-50 pb-8 pt-12">
        <section>
          <div className="bg-primary-100 px-4 py-3 text-lg">
            <h2 className="text-center text-lg font-medium">
              Business Account onboarding
            </h2>
          </div>
          <div className="mx-auto my-8 flex w-[80%] items-center justify-center">
            <Steps
              current={current}
              items={steps}
              direction="vertical"
              progressDot
            />
          </div>
        </section>
        <footer className="space-x-2 text-center text-sm text-grey-500">
          <span>Got Questions?</span>
          <Link to="/" className="text-primary">
            Contact Us
          </Link>
        </footer>
      </aside>
      <div
        ref={ref}
        className="grid h-full place-items-center border border-solid border-grey-200"
      >
        {current === -1 && <Welcome next={next} />}
        {current === 0 && <BusinessNameSearch next={next} />}
        {current === 1 && <BusinessInformation next={next} />}
        {current === 2 && <PersonalInfo next={next} />}
        {current === 3 && <IdentityVerification next={next} />}
        {current === 4 && <AddShareholders next={next} />}
        {current === 5 && <Review nextAction={next} />}
        {current === 6 && <OnboardingSuccess />}
      </div>
    </section>
  );
};

export const Component = Onboarding;

export default Onboarding;
