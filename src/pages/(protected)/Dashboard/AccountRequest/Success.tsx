import { Button } from "antd";

const Success = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex aspect-square w-24 h-24 items-center justify-center mx-auto">
        <img
          src="/images/check.png"
          alt=""
          className="h-full w-full object-contain"
        />
      </div>
      <div className="space-y-1 text-center">
        <h4 className="text-xl text-grey-700 font-semibold">
          Process Complete
        </h4>
        <p className="text-grey-600 text-base">
          Your GBP account request you will get notified once it is approved
          within the next 24hrs
        </p>
      </div>
      <div className="flex items-center justify-center">
        <Button
          type="primary"
          size="large"
          className="w-48"
          shape="round"
          onClick={onClose}>
          Okay
        </Button>
      </div>
    </div>
  );
};
export default Success;
