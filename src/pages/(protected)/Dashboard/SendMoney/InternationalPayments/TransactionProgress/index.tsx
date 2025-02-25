import { Button, Divider, StepProps, Steps, Tag } from "antd";
import { useNavigate } from "react-router";

const steps: StepProps[] = [
  {
    title: (
      <Tag className="bg-primary-50 text-primary font-medium text-xs">
        Completed
      </Tag>
    ),
    description: (
      <div className="space-y-0.5 ">
        <h6 className="text-grey-600 text-sm font-normal">Your bank account</h6>
        <p className="text-grey-500 text-sm">
          Awaiting your bank payment 01 Feb, 10:40 GMT
        </p>
      </div>
    ),
  },
  {
    title: (
      <Tag className="bg-pending-50 text-pending font-medium text-xs">
        Pending
      </Tag>
    ),
    description: (
      <div className="space-y-0.5 ">
        <h6 className="text-grey-600 text-sm font-normal">HelloMe Money</h6>
      </div>
    ),
  },
  {
    title: (
      <Tag className="bg-pending-50 text-pending font-medium text-xs">
        Pending
      </Tag>
    ),
    description: (
      <div className="space-y-0.5 ">
        <h6 className="text-grey-600 text-sm font-normal">Recipient's bank</h6>
      </div>
    ),
  },
  {
    title: (
      <Tag className="bg-positive-50 text-positive font-medium text-xs">
        Successful
      </Tag>
    ),
    description: (
      <div className="space-y-0.5 ">
        <h6 className="text-grey-600 text-sm font-normal">Received by recipient</h6>
      </div>
    ),
  },
];

const TransactionProgress = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <header className="space-y-1">
          <h3 className="text-xl text-grey-700 font-semibold">
            Transaction Progress
          </h3>
          <p className="text-grey-500">Let’s get your money moving</p>
        </header>
        <Steps current={0} items={steps} direction="vertical" progressDot />
        <Divider dashed variant="dashed" />
        <div className="flex items-center justify-center">
          <Button
            type="primary"
            size="large"
            shape="round"
            className="w-48"
            onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Component = TransactionProgress;

export default TransactionProgress;
