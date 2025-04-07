import { Modal, Segmented } from "antd";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import IndividualForm from "./IndividualForm";
import BusinessForm from "./BusinessForm";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import IndemnityAgreement from "./IndemnityAgreement";

interface Props {
  currency: string | undefined | null;
  isRemitter?: boolean;
  action?: () => Promise<void>;
  targetCountry?: string;
}

const AddBeneficiaryModal = forwardRef<HM.ModalRefObject, Props>(
  (props, ref) => {
    const [open, setOpen] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [segment, setSegment] = useState<"Individual" | "Business">(
      "Individual"
    );
    const [parent] = useAutoAnimate();

    const closeModal = useCallback(() => setOpen(false), []);

    useImperativeHandle(ref, () => ({
      openModal: () => setOpen(true),
    }));

    useEffect(() => {
      setSegment("Individual");
    }, []);

    return (
      <>
        <Modal
          open={open}
          title={
            <span className="text-xl font-semibold text-grey-700">
              {agreed
                ? "Add new beneficiary"
                : "Beneficiary Indemnity Agreement"}
            </span>
          }
          onCancel={() => setOpen(false)}
          className="my-4"
          footer={null}
          width={500}
          centered>
          <section className="space-y-6" ref={parent}>
            {agreed ? (
              <>
                <Segmented
                  options={["Individual", "Business"]}
                  value={segment}
                  onChange={setSegment}
                  className="w-full rounded-lg border border-solid border-grey-200  bg-white p-1 [&_.ant-segmented-item-selected]:bg-primary [&_.ant-segmented-item-selected]:text-white [&_.ant-segmented-item:hover]:bg-primary-50 [&_.ant-segmented-item:hover]:text-primary [&_.ant-segmented-item]:grid [&_.ant-segmented-item]:h-10 [&_.ant-segmented-item]:place-items-center "
                  block
                />
                {segment === "Individual" ? (
                  <IndividualForm
                    setOpen={closeModal}
                    currency={props?.currency as string}
                    action={props?.action}
                    targetCountry={props.targetCountry}
                    isRemitter={props.isRemitter}
                  />
                ) : (
                  <BusinessForm
                    setOpen={closeModal}
                    currency={props?.currency as string}
                    action={props?.action}
                    targetCountry={props.targetCountry}
                    isRemitter={props.isRemitter}
                  />
                )}
              </>
            ) : (
              <IndemnityAgreement onAccept={() => setAgreed(true)} />
            )}
          </section>
        </Modal>
      </>
    );
  }
);

export default AddBeneficiaryModal;
