import HeaderTitle from "@/components/ui/HeaderTitle";
import { Segmented } from "antd";
import { useEffect, useRef, useState } from "react";
import EditIndividualForm from "./EditIndividualForm";
import EditBusinessForm from "./EditBusinessForm";

const EditShareholderForm = ({ 
  shareholder,
  onClose 
}: { 
  shareholder: HM.Shareholder;
  onClose: () => void;
}) => {
  const [segment, setSegment] = useState<"Individual" | "Business">(
    shareholder.type as "Individual" | "Business"
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="h-full w-full space-y-6 p-8" ref={ref}>
      <HeaderTitle
        headerDescription="Update the details of the shareholder"
        headerTitle="Edit Shareholder"
      />
      <section className="space-y-8">
        <Segmented
          options={["Individual", "Business"]}
          value={segment}
          onChange={setSegment}
          disabled
          className="w-full rounded-lg border border-solid border-grey-200 bg-white p-1 [&_.ant-segmented-item-selected]:bg-primary-50 [&_.ant-segmented-item-selected]:text-primary [&_.ant-segmented-item:hover]:bg-primary-50 [&_.ant-segmented-item:hover]:text-primary [&_.ant-segmented-item]:grid [&_.ant-segmented-item]:h-10 [&_.ant-segmented-item]:place-items-center [&_.ant-segmented-item]:text-primary"
          block
        />
        {segment === "Individual" ? (
          <EditIndividualForm shareholder={shareholder} onClose={onClose} />
        ) : (
          <EditBusinessForm shareholder={shareholder} onClose={onClose} />
        )}
      </section>
    </div>
  );
};

export default EditShareholderForm;