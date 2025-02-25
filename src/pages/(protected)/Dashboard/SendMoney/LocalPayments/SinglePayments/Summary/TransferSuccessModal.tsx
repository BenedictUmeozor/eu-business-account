import { Button, Modal } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useNavigate } from "react-router";

export type TransferSuccessRefObject = {
  openModal: () => void;
};

const TransferSuccessModal = forwardRef<TransferSuccessRefObject>(
  (_props, ref) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    useImperativeHandle(ref, () => ({
      openModal: () => setOpen(true),
    }));

    return (
      <Modal
        open={open}
        footer={null}
        width={500}
        closable={false}
        centered>
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
              onClick={() => navigate("/dashboard")}
              className="bg-primary-50 text-primary">
              Dashboard
            </Button>
            <Button type="primary" size="large" shape="round">
              View Receipt
            </Button>
          </div>
        </section>
      </Modal>
    );
  }
);

export default TransferSuccessModal;
