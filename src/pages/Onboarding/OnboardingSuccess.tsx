import { Button } from 'antd';
import { memo } from 'react';

const OnboardSuccess = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8">
      <div className="flex aspect-square w-64 items-center justify-center">
        <img
          src="/images/onboard-success.png"
          alt=""
          className="h-full w-full object-contain"
        />
      </div>
      <div className="space-y-8 text-center">
        <div className="space-y-4">
          <h6 className="text-xl font-medium">Onboarding Complete</h6>
          <p className="mx-auto max-w-xs text-grey-700">
            Your account is good to go. Get started with making payment the fast
            and secure way
          </p>
        </div>
        <div className="flex items-center justify-center">
          <Button
            type="primary"
            className="w-48 text-base"
            shape="round"
            size="large"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
export default memo(OnboardSuccess);
