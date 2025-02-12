import HeaderTitle from "@/components/ui/HeaderTitle";
import { Segmented } from "antd";
import { useEffect, useRef, useState } from "react";
import IndividualForm from "./IndividualForm";
import BusinessForm from "./BusinessForm";
import { Shareholder } from "@/contexts/onboarding";

const AddShareholderForm = ({
  handleAddShareholder,
}: {
  handleAddShareholder: (shareholder: Shareholder) => void;
}) => {
  const [segment, setSegment] = useState<"Individual" | "Business">(
    "Individual"
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="h-full w-full space-y-6 p-8" ref={ref}>
      <HeaderTitle
        headerDescription="Complete required details of the shareholder"
        headerTitle="Add Shareholder"
      />
      <section className="space-y-8">
        <Segmented
          options={["Individual", "Business"]}
          value={segment}
          onChange={setSegment}
          className="w-full rounded-lg border border-solid border-grey-200 bg-white p-1 [&_.ant-segmented-item-selected]:bg-primary-50 [&_.ant-segmented-item-selected]:text-primary [&_.ant-segmented-item:hover]:bg-primary-50 [&_.ant-segmented-item:hover]:text-primary [&_.ant-segmented-item]:grid [&_.ant-segmented-item]:h-10 [&_.ant-segmented-item]:place-items-center [&_.ant-segmented-item]:text-primary"
          block
        />
        {segment === "Individual" ? (
          <IndividualForm handleAddShareholder={handleAddShareholder} />
        ) : (
          <BusinessForm handleAddShareholder={handleAddShareholder} />
        )}
      </section>
    </div>
  );
};
export default AddShareholderForm;
