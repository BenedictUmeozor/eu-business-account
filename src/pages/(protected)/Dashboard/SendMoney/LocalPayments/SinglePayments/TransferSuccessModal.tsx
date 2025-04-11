import ENDPOINTS from "@/constants/endpoints";
import useSharedQueryAction from "@/hooks/use-shared-query-action";
import { Button, Modal } from "antd";
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ReceiptComponent from "@/components/global/receipt-component";

export type TransferSuccessRefObject = {
  openModal: () => void;
  setReqId: (requestId: string) => void;
};

const TransferSuccessModal = forwardRef<TransferSuccessRefObject>(
  (_props, ref) => {
    const [open, setOpen] = useState(false);
    const [requestId, setRequestId] = useState<string | null>(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const navigate = useNavigate();

    useImperativeHandle(ref, () => ({
      openModal: () => setOpen(true),
      setReqId: (requestId: string) => {
        setRequestId(requestId);
      },
    }));

    const { data, refetch, isPending, fetchStatus } =
      useSharedQueryAction<HM.SingleReceipt>({
        url: ENDPOINTS.GET_RECEIPT(requestId!),
        key: ["receipt", requestId],
        enabled: false,
      });

    useEffect(() => {
      if (data) {
        setShowReceipt(true);
      }
    }, [data]);

    return (
      <Modal
        open={open}
        footer={null}
        width={showReceipt ? 520 : 500}
        closable={false}
        centered>
        {!showReceipt ? (
          <section className="space-y-8">
            <div className="h-20 w-20 rounded-full mx-auto">
              <img src="/images/check.png" alt="" className="w-full h-full" />
            </div>
            <div className="text-center space-y-1">
              <h2 className="text-xl text-grey-700">Transfer successful</h2>
              <p className="text-grey-600">
                Your payment was completed successfully
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="primary"
                size="large"
                shape="round"
                disabled={isPending}
                onClick={() => navigate("/dashboard")}
                className="bg-primary-50 text-primary">
                Dashboard
              </Button>
              <Button
                type="primary"
                size="large"
                shape="round"
                loading={isPending && fetchStatus === "fetching"}
                onClick={() => refetch()}>
                View Receipt
              </Button>
            </div>
          </section>
        ) : (
          <ReceiptComponent receipt={data!} path="/dashboard" />
        )}
      </Modal>
    );
  }
);

export default TransferSuccessModal;
