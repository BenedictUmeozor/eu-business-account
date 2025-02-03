import { Button } from "antd";
import { memo } from "react";

const Welcome = ({ next }: { next: () => void }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <div className="flex aspect-square w-64 items-center justify-center">
        <img
          src="/images/login.png"
          alt=""
          className="h-full w-full object-contain"
        />
      </div>
      <div className="space-y-8 text-center">
        <div className="space-y-4">
          <h6 className="text-xl font-medium">Welcome Michelle!</h6>
          <p className="mx-auto max-w-xs text-grey-700">
            Set up your business account in a few steps
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Button
            type="primary"
            className="w-48 text-base"
            shape="round"
            size="large"
            onClick={next}>
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};
export default memo(Welcome);
