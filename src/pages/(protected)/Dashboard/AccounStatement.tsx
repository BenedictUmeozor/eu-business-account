import { Alert, Button, Modal } from "antd";
import clsx from "clsx";
import { forwardRef, useImperativeHandle, useState } from "react";

const AccountStatement = forwardRef<HM.ModalRefObject>((_props, ref) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    openModal: () => setOpen(true),
  }));

  return (
    <Modal
      onCancel={() => setOpen(false)}
      open={open}
      width={500}
      footer={null}
      title={
        <span className="text-xl font-semibold text-grey-600">
          More Actions
        </span>
      }>
      <div className="flex items-center justify-between gap-4">
        <Button size="large" type="primary" className={clsx("")}>
          Custom
        </Button>
      </div>
      <Alert
        message="You can only  generate statements for a time period of six months"
        showIcon
        type="info"
        className="text-primary"
      />
    </Modal>
  );
});

export default AccountStatement;
