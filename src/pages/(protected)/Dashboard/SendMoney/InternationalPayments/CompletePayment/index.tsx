import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import { Alert, Button, message } from "antd";
import { CheckCircleIcon, CopyIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useLocation, useNavigate } from "react-router";
import countries from "@/data/codes.json";
import Loader from "@/components/app/Loader";

interface LocationState
  extends Omit<HM.ProcessRemitterResponse, "status" | "message"> {
  trans_ref: string;
}

const CompletePayment = () => {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState };

  const handleCancel = () => {
    navigate("/dashboard", { state: null });
  };

  const mutation = useSharedMutationAction<HM.HelloMePaymentDetails>({
    url: ENDPOINTS.REMITTER_INITIATE_HELLOMEMONEY_PAYMENT,
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const handleNext = () => {
    navigate(
      `/dashboard/send-money/international-payments/single/transaction-progress/${state.transaction_reference}`
    );
  };

  const currency = useMemo(() => {
    return (
      countries.find(
        c => c.currencyCode === mutation.data?.data.currency?.toUpperCase()
      )?.currencySymbol || ""
    );
  }, [mutation.data]);

  useEffect(() => {
    if (state) {
      mutation.mutateAsync({
        transaction_reference: state.transaction_reference,
        payment_method: "HELLOMEPAYMENT",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (!state) {
      navigate("/dashboard");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className="flex items-center justify-center py-16">
      {mutation.isPending && <Loader />}
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <header className="space-y-1">
          <h3 className="text-xl text-grey-700 font-semibold">
            Complete Payment
          </h3>
          <p className="text-grey-500">
            Proceed to your mobile banking app and make payment using the
            account details below
          </p>
        </header>
        <Alert
          message="Use these exact details to make payments to HelloMe Money. Once payment has been made click “Payment made”"
          showIcon
          type="info"
          className="text-primary"
        />
        <section className="space-y-2">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <span className="text-sm text-grey-500">Account name</span>
              <p className="font-medium text-grey-700">
                {mutation.data?.data.account_name}
              </p>
            </div>
            <ClipboardCopy copyText={mutation.data?.data.account_name ?? ""} />
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <span className="text-sm text-grey-500">Account number</span>
              <p className="font-medium text-grey-700">
                {mutation.data?.data.account_number}
              </p>
            </div>
            <ClipboardCopy
              copyText={mutation.data?.data.account_number ?? ""}
            />
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <span className="text-sm text-grey-500">Transfer amount</span>
              <p className="font-medium text-grey-700">
                {currency}
                {mutation.data?.data.amount_payable}
              </p>
            </div>
            <ClipboardCopy
              copyText={`${currency}${mutation.data?.data.amount_payable}`}
            />
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <span className="text-sm text-grey-500">Sort code</span>
              <p className="font-medium text-grey-700">
                {mutation.data?.data.sort_code}
              </p>
            </div>
            <ClipboardCopy copyText={mutation.data?.data.sort_code ?? ""} />
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <span className="text-sm text-grey-500">Reference number</span>
              <p className="font-medium text-grey-700">
                {mutation.data?.reference_number}
              </p>
            </div>
            <ClipboardCopy copyText={mutation.data?.reference_number ?? ""} />
          </div>
        </section>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="primary"
            onClick={handleCancel}
            className="bg-primary-50 text-primary"
            size="large"
            disabled={mutation.isPending}
            shape="round">
            Cancel Transfer
          </Button>
          <Button
            type="primary"
            size="large"
            shape="round"
            onClick={handleNext}
            loading={mutation.isPending}>
            Payment made
          </Button>
        </div>
      </div>
    </div>
  );
};

const ClipboardCopy = ({ copyText }: { copyText: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <CopyToClipboard text={copyText} onCopy={handleCopy}>
      <div className="rounded-full self-end h-9 w-9 bg-primary-50 flex items-center justify-center cursor-pointer transition-all duration-200 ease-linear hover:bg-primary-100">
        <Button
          type="text"
          icon={
            copied ? (
              <CheckCircleIcon className="w-4 h-4 text-grey-500" />
            ) : (
              <CopyIcon className="w-4 h-4 text-grey-500" />
            )
          }
        />
      </div>
    </CopyToClipboard>
  );
};

export const Component = CompletePayment;

export default CompletePayment;
