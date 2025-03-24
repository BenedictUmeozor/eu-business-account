import { Button, Form, FormProps, Input, Modal } from "antd";
import { forwardRef, memo, useImperativeHandle, useState } from "react";

export type PinRefObject = {
  openModal: () => void;
  closeModal: () => void;
};

interface Props {
  onSubmit: (pin: string) => void | Promise<void>;
  loading?: boolean;
  title?: string;
}

const PinModal = forwardRef<PinRefObject, Props>(
  ({ onSubmit, loading, title = "Enter PassCode" }, ref) => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm<{ pin: string }>();

    useImperativeHandle(ref, () => ({
      openModal: () => setOpen(true),
      closeModal: () => setOpen(false),
    }));

    const onFinish: FormProps<{ pin: string }>["onFinish"] = async values => {
      onSubmit(values.pin);
      form.resetFields();
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
              Enter your six digit passcode to continue
            </p>
          </header>
          <Form form={form} onFinish={onFinish} className="space-y-10">
            <Form.Item
              name="pin"
              className="w-56 mx-auto"
              rules={[{ required: true, message: "Passcode is required" }]}>
              <Input.OTP length={4} style={{ width: "100%" }} />
            </Form.Item>
            <div className="flex flex-col items-center justify-center gap-6">
              <Button
                type="primary"
                size="large"
                className="w-48"
                shape="round"
                htmlType="submit"
                loading={loading}>
                Continue
              </Button>
              <Button
                type="link"
                htmlType="button"
                className="text-primary !text-base">
                Forgot Pin?
              </Button>
            </div>
          </Form>
        </section>
      </Modal>
    );
  }
);

export default memo(PinModal);
