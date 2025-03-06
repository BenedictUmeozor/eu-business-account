import { Modal } from "antd";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Title from "./Title";
import ProcessStart from "./ProcessStart";
import PersonalDetailsForm from "./PersonalDetailsForm";
import ContactAddressInfo from "./ContactAddressInfo";
import OccupationForm from "./OccupationForm";
import IDDetails from "./IDDetails";
import FinancialInformation from "./FinancialInformation";
import AlmostDone from "./AlmostDone";
import ScanCode from "./ScanCode";
import ReviewInfo from "./ReviewInfo";
import TaxInformation from "./TaxInformation";
import Success from "./Success";

const AccountRequestModal = forwardRef<HM.ModalRefObject>((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      setOpen(true);
    },
  }));

  const handleCancel = useCallback(() => {
    setOpen(false);
    setCurrent(0);
  }, []);

  const nextStep = useCallback(() => {
    setCurrent(prev => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrent(prev => prev - 1);
  }, []);

  useEffect(() => {
    divRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [current]);

  return (
    <Modal
      open={open}
      footer={null}
      onCancel={handleCancel}
      width={500}
      title={<Title current={current} />}>
      <div className="pt-4" ref={divRef}>
        {current === 0 && <ProcessStart nextStep={nextStep} />}
        {current === 1 && (
          <PersonalDetailsForm prevStep={prevStep} nextStep={nextStep} />
        )}
        {current === 2 && (
          <ContactAddressInfo prevStep={prevStep} nextStep={nextStep} />
        )}
        {current === 3 && (
          <OccupationForm prevStep={prevStep} nextStep={nextStep} />
        )}
        {current === 4 && <IDDetails prevStep={prevStep} nextStep={nextStep} />}
        {current === 5 && (
          <TaxInformation prevStep={prevStep} nextStep={nextStep} />
        )}
        {current === 6 && (
          <FinancialInformation prevStep={prevStep} nextStep={nextStep} />
        )}
        {current === 7 && (
          <AlmostDone prevStep={prevStep} nextStep={nextStep} />
        )}
        {current === 8 && <ScanCode prevStep={prevStep} nextStep={nextStep} />}
        {current === 9 && (
          <ReviewInfo prevStep={prevStep} nextStep={nextStep} />
        )}
        {current === 10 && <Success onClose={handleCancel} />}
      </div>
    </Modal>
  );
});

export default AccountRequestModal;
