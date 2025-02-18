import { memo } from "react";
import { Button, Checkbox } from "antd";
import HeaderTitle from "@/components/ui/HeaderTitle";

const IdentityVerfication = ({ next }: { next: () => void }) => {
  return (
    <section className="h-full w-full space-y-8 p-8 grid grid-rows-[1fr_auto] ">
      <div className="space-y-8">
        <HeaderTitle
          headerDescription="Select one preferred means of identification"
          headerTitle="Identity Verification"
          html={
            <p>
              Select <strong>one</strong> preferred means of identification
            </p>
          }
        />

        <div>
          <Checkbox className="!text-base !text-gray-600">
            We will be redirecting you to Sumsub to complete your identity
            verification
          </Checkbox>
        </div>

        <Button
          type="primary"
          className="w-48"
          shape="round"
          size="large"
          onClick={next}>
          Proceed
        </Button>
      </div>
      <footer className="flex items-center justify-center">
        <div className="flex items-center justify-center gap-2 !text-gray-600">
          Powered by
          <img src="/images/sumsub.png" alt="sumsub" className="w-32" />
        </div>
      </footer>
    </section>
  );
};
export default memo(IdentityVerfication);
