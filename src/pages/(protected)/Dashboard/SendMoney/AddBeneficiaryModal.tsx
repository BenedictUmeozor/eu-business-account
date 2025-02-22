import { Modal, Segmented } from "antd";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import IndividualForm from "./IndividualForm";
import BusinessForm from "./BusinessForm";

const AddBeneficiaryModal = forwardRef<HM.ModalRefObject>((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [segment, setSegment] = useState<"Individual" | "Business">(
    "Individual"
  );

  const closeModal = useCallback(() => setOpen(false), []);

  useImperativeHandle(ref, () => ({
    openModal: () => setOpen(true),
  }));

  return (
    <>
      <Modal
        open={open}
        title={
          <span className="text-xl font-semibold text-grey-700">
            Add new beneficiary
          </span>
        }
        onCancel={() => setOpen(false)}
        footer={null}
        width={500}
        centered>
        <section className="space-y-6">
          <Segmented
            options={["Individual", "Business"]}
            value={segment}
            onChange={setSegment}
            className="w-full rounded-lg border border-solid border-grey-200  bg-white p-1 [&_.ant-segmented-item-selected]:bg-primary [&_.ant-segmented-item-selected]:text-white [&_.ant-segmented-item:hover]:bg-primary-50 [&_.ant-segmented-item:hover]:text-primary [&_.ant-segmented-item]:grid [&_.ant-segmented-item]:h-10 [&_.ant-segmented-item]:place-items-center "
            block
          />
          {segment === "Individual" ? (
            <IndividualForm setOpen={closeModal} />
          ) : (
            <BusinessForm setOpen={closeModal} />
          )}
        </section>
      </Modal>
    </>
  );
});

export default AddBeneficiaryModal;
