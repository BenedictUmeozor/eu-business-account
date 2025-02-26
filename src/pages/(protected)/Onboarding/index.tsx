/* eslint-disable react-hooks/exhaustive-deps */
import { StepProps, Steps, Tag } from "antd";
import { useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import Welcome from "./Welcome";
import BusinessNameSearch from "./BusinessNameSearch";
import BusinessInformation from "./BusinessInformation";
import PersonalInfo from "./PersonalInfo";
import IdentityVerification from "./IdentityVerification";
import AddShareholders from "./Shareholder";
import Review from "./Review";
import OnboardingSuccess from "./OnboardingSuccess";
import AddDocuments from "./Documents";
import OnboardingProvider from "@/providers/OnboardingContext";
import { useOnboardingContext } from "@/contexts/onboarding";

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
    title: "Add Documents",
  },
  {
    title: "Review",
  },
];

const Onboarding = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { current, setCurrent } = useOnboardingContext();
  const location = useLocation();

  const next = useCallback(() => {
    setCurrent(current + 1);
  }, [current]);

  useEffect(() => {
    if (typeof location.state?.current === "number") {
      setCurrent(location.state.current);
    }
  }, [location]);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [current]);

  return (
    <section className="no-scrollbar grid grid-cols-[312px_1fr] overflow-hidden rounded-xl">
      <aside className="grid h-full max-w-[600px] grid-rows-[1fr_auto] gap-12 border border-r-0 border-solid border-grey-200 bg-primary-50 pb-8 pt-12">
        <section>
          <div className="bg-primary-100 px-4 py-3 text-lg flex items-center space-x-2">
            <h2 className="text-center text-lg font-medium">
              Get Business Account
            </h2>
            <Tag color="#ebf4ff" className="rounded-2xl text-primary-600">
              Corporate
            </Tag>
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
        className="grid h-full place-items-center border border-solid border-grey-200 bg-white">
        {current === -1 && <Welcome next={next} />}
        {current === 0 && <BusinessNameSearch next={next} />}
        {current === 1 && <BusinessInformation next={next} />}
        {current === 2 && <PersonalInfo next={next} />}
        {current === 3 && <IdentityVerification next={next} />}
        {current === 4 && <AddShareholders next={() => setCurrent(6)} />}
        {current === 5 && <AddDocuments next={next} />}
        {current === 6 && <Review nextAction={next} />}
        {current === 7 && <OnboardingSuccess />}
      </div>
    </section>
  );
};

const OnboardingWrapper = () => (
  <OnboardingProvider>
    <Onboarding />
  </OnboardingProvider>
);

export const Component = OnboardingWrapper;
export default OnboardingWrapper;
