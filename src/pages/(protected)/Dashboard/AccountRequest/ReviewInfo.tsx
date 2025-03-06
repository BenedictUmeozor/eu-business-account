import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "antd";
import { memo } from "react";

const ReviewInfo = ({
  nextStep,
  prevStep,
}: {
  prevStep: () => void;
  nextStep: () => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-grey-600">Biodata</span>
          <CheckCircleIcon className="w-5 h-5 text-positive" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-grey-600">Contact Information</span>
          <CheckCircleIcon className="w-5 h-5 text-positive" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-grey-600">ID Information</span>
          <CheckCircleIcon className="w-5 h-5 text-positive" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-grey-600">Occupation details</span>
          <CheckCircleIcon className="w-5 h-5 text-positive" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-grey-600">Identity verification</span>
          <CheckCircleIcon className="w-5 h-5 text-positive" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-grey-600">Sumsub process</span>
          <CheckCircleIcon className="w-5 h-5 text-positive" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-grey-600">Tax Information</span>
          <CheckCircleIcon className="w-5 h-5 text-positive" />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-grey-600">Financial Information</span>
          <CheckCircleIcon className="w-5 h-5 text-positive" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button
          type="primary"
          className="bg-primary-50 text-primary"
          onClick={prevStep}
          size="large"
          shape="round">
          Back
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          shape="round"
          onClick={nextStep}>
          Submit
        </Button>
      </div>
    </div>
  );
};
export default memo(ReviewInfo);
