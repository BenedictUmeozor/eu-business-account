import { memo, useCallback, useState } from "react";
import { Button } from "antd";
import HeaderTitle from "@/components/ui/HeaderTitle";
import { CheckCircleIcon, IdCardIcon } from "lucide-react";
import ProofOfIdentity from "./ProofOfIdentity";

const IdentityVerfication = ({ next }: { next: () => void }) => {
  const [hasUploaded, setHasUploaded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const nextAction = useCallback(() => {
    setHasUploaded(true);
    setShowForm(false);
  }, []);

  if (showForm)
    return (
      <ProofOfIdentity next={nextAction} back={() => setShowForm(false)} />
    );

  return (
    <section className="h-full w-full space-y-8 p-8 ">
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

        <section className="grid grid-cols-2 gap-4">
          <div
            className="border border-solid border-grey-200 rounded-lg cursor-pointer p-3 flex items-center gap-1"
            role="button" onClick={() => setShowForm(true)}>
            <div className="flex items-center gap-2">
              <div className="bg-primary-50 w-9 aspect-square rounded-full grid place-items-center">
                <IdCardIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-0.5">
                <p className="font-medium text-grey-700">Proof of Identity</p>
                <span className="text-grey-500 text-sm">
                  Upload a valid passport or driver license
                </span>
              </div>
            </div>
            {hasUploaded && (
              <CheckCircleIcon className="w-5 h-5 text-positive" />
            )}
          </div>
        </section>

        {hasUploaded && (
          <Button
            type="primary"
            className="w-48"
            shape="round"
            size="large"
            onClick={next}>
            Next
          </Button>
        )}

        {/* <div>
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
        </Button> */}
      </div>
      {/* <footer className="flex items-center justify-center">
        <div className="flex items-center justify-center gap-2 !text-gray-600">
          Powered by
          <img src="/images/sumsub.png" alt="sumsub" className="w-32" />
        </div>
      </footer> */}
    </section>
  );
};
export default memo(IdentityVerfication);
