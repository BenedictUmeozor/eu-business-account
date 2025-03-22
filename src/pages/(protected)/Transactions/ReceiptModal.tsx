import { useDelay } from "@/hooks";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Button, Modal, Alert } from "antd";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { CURRENCIES } from "@/constants/currencies";
import { XCircleIcon, AlertCircleIcon, ClockIcon } from "lucide-react";
import clsx from "clsx";
import ENDPOINTS from "@/constants/endpoints";
import useSharedQueryAction from "@/hooks/use-shared-query-action";
import ReceiptComponent from "@/components/global/receipt-component";
import useStatusStyle from "@/hooks/use-status-style";

export type ReceiptRefObject = {
  openModal: (transaction: HM.Transaction) => void;
};

const ReceiptModal = forwardRef<ReceiptRefObject>((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currency, setCurrency] = useState<HM.Currency>();
  const [requestId, setRequestId] = useState<string | null>(null);
  const { getStatusStyle } = useStatusStyle();

  const handleShowReceipt = useCallback(() => setShowReceipt(true), []);

  const { delayedFunction, isLoading } = useDelay(handleShowReceipt, 2000);

  const reset = () => {
    setOpen(false);
    setShowReceipt(false);
    setRequestId(null);
  };

  useImperativeHandle(ref, () => ({
    openModal: tran => {
      setRequestId(tran?.request_id || null);
      setOpen(true);
    },
  }));

  const { data: receiptData, refetch } = useSharedQueryAction<HM.SingleReceipt>(
    {
      url: requestId ? ENDPOINTS.GET_RECEIPT(requestId) : "",
      key: ["receipt", requestId],
      enabled: false,
    }
  );

  useEffect(() => {
    if (open && requestId) {
      refetch();
    }
  }, [open, requestId, refetch]);

  useEffect(() => {
    if (receiptData) {
      const cur = CURRENCIES.find(c => c.currencyCode === receiptData.currency);
      setCurrency(cur);
    }
  }, [receiptData]);

  const isSuccessfulStatus = (status?: string) => {
    if (!status) return false;
    const lowerStatus = status.toLowerCase().trim();
    return lowerStatus === "completed" || lowerStatus === "success";
  };

  const getStatusIcon = () => {
    if (!receiptData) return null;

    const status = receiptData.transaction_status.toLowerCase();
    const statusClass = getStatusStyle(status).split(" ")[0];

    if (status === "completed" || status === "success") {
      return <CheckCircleIcon className={`w-4 h-4 ${statusClass}`} />;
    } else if (status === "pending") {
      return <ClockIcon className={`w-4 h-4 ${statusClass}`} />;
    } else if (status === "declined" || status === "failed") {
      return <XCircleIcon className={`w-4 h-4 ${statusClass}`} />;
    } else if (status === "completedwitherrors") {
      return <AlertCircleIcon className={`w-4 h-4 ${statusClass}`} />;
    } else {
      return <CheckCircleIcon className={`w-4 h-4 ${statusClass}`} />;
    }
  };

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={reset}
      width={640}
      title={
        !showReceipt ? (
          <span className="text-xl text-grey-700 font-semibold">
            Transaction details
          </span>
        ) : null
      }>
      {showReceipt && receiptData ? (
        <ReceiptComponent receipt={receiptData} />
      ) : (
        <section>
          {receiptData ? (
            <>
              <header className="flex items-center justify-center flex-col gap-6 border-0 border-t border-b border-solid border-grey-200 py-3">
                <a
                  href="https://hellomemoney.com/"
                  className="flex items-center gap-2 max-lg:justify-center">
                  <img
                    src="/images/hellome.png"
                    alt="Hellomemoney"
                    className="h-8 w-8"
                  />
                  <p className="font-cabinet text-lg font-extrabold text-secondary no-underline">
                    HelloMe Money
                  </p>
                </a>
                <div className="text-center space-y-2">
                  <p className="text-positive-600 font-semibold font-nunito text-4xl">
                    {`${currency?.currencySymbol}${receiptData.amount_sent.value}`}
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    {getStatusIcon()}
                    <span
                      className={clsx(
                        "font-medium",
                        getStatusStyle(receiptData.transaction_status).split(
                          " "
                        )[0]
                      )}>
                      {receiptData.transaction_status}
                    </span>
                  </div>
                  {receiptData.transaction_status?.toLowerCase() ===
                    "completedwitherrors" &&
                    receiptData.errors?.length > 0 && (
                      <div className="mt-2">
                        <Alert
                          message={
                            <span>
                              {receiptData.errors.substring(
                                2,
                                receiptData.errors.length - 2
                              )}
                            </span>
                          }
                          type="warning"
                          showIcon
                          className="text-xs"
                        />
                      </div>
                    )}
                </div>
              </header>
              <div className="border-0 border-solid border-grey-200 border-b py-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-grey-500">Recipient Name</span>
                  <span className="font-medium text-grey-700 font-nunito">
                    {receiptData.beneficiary.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-grey-500">Payment Reference</span>
                  <span className="font-medium text-grey-700 font-nunito">
                    {receiptData.reference || receiptData.narration || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-grey-500">Payment Method</span>
                  <span className="font-medium text-grey-700 font-nunito">
                    Bank Transfer
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-grey-500">Delivery Method</span>
                  <span className="font-medium text-grey-700 font-nunito">
                    Account Deposit
                  </span>
                </div>
              </div>
              <div className="border-0 border-solid border-grey-200 border-b py-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-grey-500">Payment Time</span>
                  <span className="font-medium text-grey-700 font-nunito">
                    {receiptData.date.posting}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-grey-500">Account Number</span>
                  <span className="font-medium text-grey-700 font-nunito">
                    {receiptData.beneficiary.account_number}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-grey-500">Balance Before</span>
                  <span className="font-medium text-grey-700 font-nunito">
                    {`${currency?.currencySymbol}${receiptData.balance.balance_before}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-grey-500">Balance After</span>
                  <span className="font-medium text-grey-700 font-nunito">
                    {receiptData.balance.balance_after
                      ? `${currency?.currencySymbol}${receiptData.balance.balance_after}`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-grey-500">Recipient's Bank</span>
                  <span className="font-medium text-grey-700 font-nunito">
                    {receiptData.bank.bank_name ||
                      receiptData.bank.bank_country ||
                      "N/A"}
                  </span>
                </div>
              </div>
              <div className="my-4 flex flex-col gap-6 items-center justify-center">
                <Button
                  type="primary"
                  size="large"
                  className="!text-base"
                  loading={isLoading}
                  onClick={delayedFunction}
                  disabled={!isSuccessfulStatus(receiptData.transaction_status)}
                  shape="round">
                  Download
                </Button>
                <div className="rounded-lg bg-primary-700 p-8 grid grid-cols-[1fr_auto] gap-8 items-center w-full">
                  <div className="flex items-center gap-6">
                    <img
                      src="/images/add-friend.png"
                      alt="add friend"
                      className="w-20 aspect-[0.965]"
                    />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-pending-200">
                        Invite a friend and get £5.00
                      </p>
                      <span className="text-xs text-primary-100">
                        They sign up and verify their identity They send up to
                        £100 and you both get £5
                      </span>
                    </div>
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="primary"
                      className="!text-xs bg-primary-50 text-primary">
                      Invite friends
                    </Button>
                  </div>
                </div>
                <p className="text-center w-full text-sm text-grey-600">
                  Got any complaints?{" "}
                  <span className="text-primary">Chat with us</span>
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-10">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          )}
        </section>
      )}
    </Modal>
  );
});

export default ReceiptModal;
