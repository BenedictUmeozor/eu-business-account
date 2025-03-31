import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import { Alert, Button, Divider, message, Result, Spin, StepProps, Steps, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";

const getStepStatus = (statusCode: string) => {
  switch (statusCode) {
    case "1":
      return {
        tagClassName: "bg-positive-50 text-positive",
        label: "Completed"
      };
    case "2":
      return {
        tagClassName: "bg-negative-50 text-negative",
        label: "Failed"
      };
    case "0":
    default:
      return {
        tagClassName: "bg-pending-50 text-pending",
        label: "Pending"
      };
  }
};

const TransactionProgress = () => {
  const params = useParams() as { reference: string };
  const navigate = useNavigate();
  const [invalidReference, setInvalidReference] = useState(false);

  const mutation = useSharedMutationAction<HM.PaymentProgress>({
    url: ENDPOINTS.PAYMENT_PROGRESS,
    onError: error => {
      message.error(getErrorMessage(error));
      setInvalidReference(true);
    },
  });

  useEffect(() => {
    if (!mutation.data && params.reference) {
      mutation.mutateAsync({
        transaction_reference: params.reference,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.reference]);

  const steps = useMemo(() => {
    const data = mutation.data;
    
    const customerBankStatus = getStepStatus(data?.customer_bank_status || "0");
    const hellomeMoneyStatus = getStepStatus(data?.hellome_money_status || "0");
    const receipientBankStatus = getStepStatus(data?.receipient_bank_status || "0");
    
    return [
      {
        title: (
          <Tag className={customerBankStatus.tagClassName + " font-medium text-xs"}>
            {customerBankStatus.label}
          </Tag>
        ),
        description: (
          <div className="space-y-0.5">
            <h6 className="text-grey-600 text-sm font-normal">Your bank account</h6>
            <p className="text-grey-500 text-sm">
              Awaiting your bank payment 
            </p>
          </div>
        ),
      },
      {
        title: (
          <Tag className={hellomeMoneyStatus.tagClassName + " font-medium text-xs"}>
            {hellomeMoneyStatus.label}
          </Tag>
        ),
        description: (
          <div className="space-y-0.5">
            <h6 className="text-grey-600 text-sm font-normal">HelloMe Money</h6>
          </div>
        ),
      },
      {
        title: (
          <Tag className={receipientBankStatus.tagClassName + " font-medium text-xs"}>
            {receipientBankStatus.label}
          </Tag>
        ),
        description: (
          <div className="space-y-0.5">
            <h6 className="text-grey-600 text-sm font-normal">Recipient's bank</h6>
          </div>
        ),
      },
    ] as StepProps[];
  }, [mutation.data]);

  // Calculate current step based on statuses
  const currentStep = useMemo(() => {
    const data = mutation.data;
    if (!data) return 0;
    
    if (data.customer_bank_status === "1") {
      if (data.hellome_money_status === "1") {
        if (data.receipient_bank_status === "1") {
          return 3; // All complete
        }
        return 2; // Up to hellome_money complete
      }
      return 1; // Only customer_bank complete
    }
    return 0; // Nothing complete yet
  }, [mutation.data]);

  if (invalidReference) {
    return (
      <div className="flex items-center justify-center py-16">
        <Result
          status="error"
          title="Invalid Transaction Reference"
          subTitle="The provided transaction reference is invalid or doesn't exist."
          extra={[
            <Button 
              type="primary" 
              key="dashboard" 
              onClick={() => navigate("/dashboard")}
              size="large"
              shape="round"
            >
              Back to Dashboard
            </Button>
          ]}
        />
      </div>
    );
  }

  if (mutation.isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <header className="space-y-1">
          <h3 className="text-xl text-grey-700 font-semibold">
            Transaction Progress
          </h3>
          <p className="text-grey-500">Let's get your money moving</p>
        </header>
        
        {!params.reference && (
          <Alert
            message="Missing transaction reference"
            description="No transaction reference was provided."
            type="error"
            showIcon
          />
        )}
        
        {mutation.data?.cancel_reason && (
          <Alert
            message={mutation.data.cancel_reason}
            type="warning"
            showIcon
          />
        )}
        
        <Steps current={currentStep} items={steps} direction="vertical" progressDot />
        
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
