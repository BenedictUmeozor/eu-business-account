import { useDelay } from "@/hooks";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Button, Modal } from "antd";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import Receipt from "./Receipt";

const LocalReceiptModal = forwardRef<HM.ModalRefObject>((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleShowReceipt = useCallback(() => setShowReceipt(true), []);

  const { delayedFunction, isLoading } = useDelay(handleShowReceipt, 2000);

  const reset = () => {
    setOpen(false);
    setShowReceipt(false);
  };

  useImperativeHandle(ref, () => ({
    openModal: () => {
      setOpen(true);
    },
  }));

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
      {showReceipt ? (
        <Receipt />
      ) : (
        <section>
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
                £100.00
              </p>
              <div className="flex items-center justify-center gap-1">
                <CheckCircleIcon className="w-4 h-4 text-positive-600" />
                <span className="text-positive-600 font-medium">
                  Successful
                </span>
              </div>
            </div>
          </header>
          <div className="border-0 border-solid border-grey-200 border-b py-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-grey-500">Recipient Name</span>
              <span className="font-medium text-grey-700 font-nunito">
                ₦270,000
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-grey-500">Payment Reference</span>
              <span className="font-medium text-grey-700 font-nunito">
                HMR0910202400145
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
                Dec 22, 2024, 13:22:16
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-grey-500">Account Number</span>
              <span className="font-medium text-grey-700 font-nunito">
                00004444000
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-grey-500">Commission Fee</span>
              <span className="font-medium text-grey-700 font-nunito">
                ₦270
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-grey-500">Recipient's Bank</span>
              <span className="font-medium text-grey-700 font-nunito">
                Sterling Bank
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-grey-500">Sender</span>
              <span className="font-medium text-grey-700 font-nunito">
                Michelle Mezie
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
                    They sign up and verify their identity They send up to £100
                    and you both get £5
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
        </section>
      )}
    </Modal>
  );
});

export default LocalReceiptModal;
