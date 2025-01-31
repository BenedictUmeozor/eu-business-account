import { memo, useCallback, useState } from "react";
import { IdentificationIcon } from "@heroicons/react/24/outline";
import { Card, Space } from "antd";
import HeaderTitle from "@/components/ui/HeaderTitle";
import IDCardUpload from "./IDCardUpload";
import ProofOfIdentity from "./ProofOfIdentity";

type VerificationType = "id" | "poi" | undefined;

const IdentityVerfication = ({ next }: { next: () => void }) => {
  const [verificationType, setVerificationType] = useState<VerificationType>();

  const back = useCallback(() => setVerificationType(undefined), []);

  if (verificationType === "id")
    return <IDCardUpload next={next} back={back} />;
  if (verificationType === "poi")
    return <ProofOfIdentity next={next} back={back} />;

  return (
    <div className="h-full w-full space-y-8 p-8">
      <HeaderTitle
        headerDescription="Select one preferred means of identification"
        headerTitle="Identity Verification"
        html={
          <p>
            Select <strong>one</strong> preferred means of identification
          </p>
        }
      />

      <div className="grid grid-cols-2 gap-6 gap-x-4 max-lg:grid-cols-1">
        <Card
          size="small"
          role="button"
          onClick={() => setVerificationType("id")}
          className="cursor-pointer transition-all duration-100 ease-linear hover:bg-grey-50"
        >
          <Space align="center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50">
              <IdentificationIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-medium text-grey-700">
                National ID Card
              </h3>
              <p className="text-sm text-grey-500">
                Upload a valid government ID
              </p>
            </div>
          </Space>
        </Card>
        <Card
          size="small"
          role="button"
          onClick={() => setVerificationType("poi")}
          className="cursor-pointer transition-all duration-100 ease-linear hover:bg-grey-50"
        >
          <Space align="center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50">
              <IdentificationIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-base font-medium text-grey-700">
                Proof of Identity
              </h3>
              <p className="text-sm text-grey-500">
                Upload a valid passport or driver license
              </p>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};
export default memo(IdentityVerfication);
