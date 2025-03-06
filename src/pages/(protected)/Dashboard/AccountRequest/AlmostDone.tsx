import { Button } from "antd";
import { memo } from "react";

const AlmostDone = ({
  nextStep,
  prevStep,
}: {
  prevStep: () => void;
  nextStep: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="w-full text-center flex flex-col items-center justify-center gap-4">
        <img src="/images/thumbs-up.png" alt="thumbs up" className="w-20" />
        <div className="space-y-1">
          <h4 className="text-xl text-grey-700 font-semibold">
            You are almost done!
          </h4>
          <p className="text-grey-600 text-base">
            Proceed to verify your identity, you will need a camera enabled
            device for this phase
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-2 flex-col">
        <Button
          type="primary"
          className="w-72 !text-lg"
          size="large"
          shape="round"
          onClick={nextStep}>
          Continue with mobile
        </Button>
        <Button
          type="primary"
          className="w-72 text-primary bg-primary-50 !text-lg"
          size="large"
          shape="round"
          onClick={nextStep}>
          Continue with PC
        </Button>
        <Button
          type="text"
          className="w-72 text-primary !text-lg"
          size="large"
          shape="round"
          onClick={prevStep}>
          Back
        </Button>
      </div>
      <footer className="flex items-center justify-center flex-col space-y-2">
        <p className="w-full text-grey-600">Powered by Sumsub</p>
        <img src="/images/sumsub-logo.png" alt="sumsub" className="w-16" />
      </footer>
    </div>
  );
};
export default memo(AlmostDone);
