import { Button, Input, Modal } from "antd";
import { forwardRef, memo, useImperativeHandle, useState } from "react";

export type PinRefObject = {
  openModal: () => void;
  closeModal: () => void;
};

interface Props {
  onSubmit: () => void | Promise<void>;
  loading?: boolean;
  title?: string;
}

const PinModal = forwardRef<PinRefObject, Props>(
  ({ onSubmit, loading, title = "Enter PassCode" }, ref) => {
    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      openModal: () => setOpen(true),
      closeModal: () => setOpen(false),
    }));

    const handleSubmit = () => {
      onSubmit();
    };

    return (
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={500}
        centered>
        <section className="space-y-10">
          <header className="space-y-1">
            <h2 className="text-grey-700 text-xl font-semibold">{title}</h2>
            <p className="text-sm text-grey-600">
              Enter your four digit passcode to continue
            </p>
          </header>
          <div className="w-56 mx-auto">
            <Input.OTP length={4} style={{ width: "100%" }} />
          </div>
          <div className="flex flex-col items-center justify-center gap-6">
            <Button
              type="primary"
              size="large"
              className="w-48"
              shape="round"
              onClick={handleSubmit}
              loading={loading}>
              Continue
            </Button>
            <Button type="link" className="text-primary !text-base">
              Forgot Pin?
            </Button>
          </div>
        </section>
      </Modal>
    );
  }
);

export default memo(PinModal);
