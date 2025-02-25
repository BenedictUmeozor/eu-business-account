import { Modal } from "antd";
import { FileIcon } from "lucide-react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import AccountStatement from "./AccounStatement";

const MoreActions = forwardRef<HM.ModalRefObject>((_props, ref) => {
  const [open, setOpen] = useState(false);

  const statementRef = useRef<HM.ModalRefObject>(null);

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
      <section className="space-y-4">
        <div className="flex items-center gap-6 rounded-xl shadow p-5 bg-white cursor-pointer border-2 transition-all duration-200 ease-linear border-solid border-transparent hover:border-primary" onClick={() => statementRef.current?.openModal()}>
          <div className="bg-primary-50 w-20 aspect-square rounded-full flex items-center justify-center">
            <FileIcon className="w-9 h-9 text-primary" />
          </div>
          <div className="space-y-1 flex-grow">
            <h5 className="text-base text-grey-700 font-medium">
              Account Statement
            </h5>
            <p className="text-sm text-grey-600">
              Generate account statement for a particular time period
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 rounded-xl shadow p-5 bg-white cursor-pointer border-2 transition-all duration-200 ease-linear border-solid border-transparent hover:border-primary">
          <div className="bg-primary-50 w-20 aspect-square rounded-full flex items-center justify-center">
            <FileIcon className="w-9 h-9 text-primary" />
          </div>
          <div className="space-y-1 flex-grow">
            <h5 className="text-base text-grey-700 font-medium">
              Freeze Account
            </h5>
            <p className="text-sm text-grey-600">
              Temporarily block freeze your account if you suspect any
              suspicious activity.
            </p>
          </div>
        </div>
      </section>
      <AccountStatement ref={statementRef} />
    </Modal>
  );
});

export default MoreActions;
