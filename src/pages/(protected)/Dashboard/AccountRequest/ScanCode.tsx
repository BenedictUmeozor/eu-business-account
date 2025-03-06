import { Button } from "antd";
import { memo } from "react";

const ScanCode = ({
  nextStep,
  prevStep,
}: {
  prevStep: () => void;
  nextStep: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center justify-center gap-3">
        <img src="/images/gbp-request-code.png" alt="code" className="w-56" />
        <p
          className="w-full text-center font-medium text-grey-600 text-sm"
          onClick={nextStep}>
          Scan code to proceed
        </p>
      </div>
      <div className="grid place-items-center">
        <Button
          type="text"
          className="w-72 text-primary !text-lg"
          size="large"
          shape="round"
          onClick={prevStep}>
          Go Back
        </Button>
      </div>
      <footer className="flex items-center justify-center flex-col space-y-2">
        <p className="w-full text-grey-600">Powered by Sumsub</p>
        <img src="/images/sumsub-logo.png" alt="sumsub" className="w-16" />
      </footer>
    </div>
  );
};
export default memo(ScanCode);
