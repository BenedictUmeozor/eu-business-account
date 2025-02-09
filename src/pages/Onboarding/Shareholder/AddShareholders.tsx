import HeaderTitle from "@/components/ui/HeaderTitle";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import AddShareholderButton from "./AddShareholderButton";
import AddShareholderForm from "./AddShareholderForm";
import { Button, message } from "antd";
import EditShareholder from "./EditShareholder";
import clsx from "clsx";
import { Shareholder, useOnboardingContext } from "@/contexts/onboarding";

const AddShareholders = ({
  next,
  isReview,
}: {
  next: () => void;
  isReview?: boolean;
}) => {
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedShareholder, setSelectedShareholder] =
    useState<Shareholder | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const { shareholders, setShareholders, stakePercentage } =
    useOnboardingContext();

  const _setShowForm = useCallback(() => {
    if (stakePercentage === 100) {
      message.error("You already have 100% stake in the business");
      return;
    }
    setShowForm(true);
  }, [stakePercentage]);
  
  const hanldeAddShareholder = useCallback(
    (shareholder: Shareholder) => {
      const length = shareholders.length;
      setShareholders([...shareholders, { ...shareholder, id: length + 1 }]);
      setShowForm(false);
      console.log(shareholders);
    },
    [shareholders, setShareholders]
  );

  const handleEditShareholder = useCallback(
    (shareholder: Shareholder) => {
      const newShareholders = shareholders.map(d => {
        if (d.id === shareholder.id) {
          return shareholder;
        } else {
          return d;
        }
      });
      setShareholders(newShareholders);
      setShowEditForm(false);
      setSelectedShareholder(null);
    },
    [shareholders, setShareholders]
  );

  const _setSelectedShareholder = useCallback((shareholder: Shareholder) => {
    setSelectedShareholder(shareholder);
    setShowEditForm(true);
  }, []);

  useEffect(() => {
    if (!isReview) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [shareholders, isReview]);

  if (showForm) {
    return <AddShareholderForm handleAddShareholder={hanldeAddShareholder} />;
  }

  if (showEditForm && !!selectedShareholder) {
    return (
      <EditShareholder
        shareholder={selectedShareholder}
        handleEditShareholder={handleEditShareholder}
      />
    );
  }

  return (
    <div
      className={clsx("h-full w-full space-y-8", !isReview && "p-8")}
      ref={ref}>
      <HeaderTitle
        headerDescription="Add up to Four (4) key shareholders in your business"
        headerTitle="Add Key Shareholders"
      />
      <section className="grid grid-cols-1 grid-rows-[120px] gap-6 lg:grid-cols-2">
        <AddShareholderButton
          shareholders={shareholders}
          index={0}
          setShowForm={_setShowForm}
          setSelectedShareholder={_setSelectedShareholder}
        />
        <AddShareholderButton
          shareholders={shareholders}
          index={1}
          setShowForm={_setShowForm}
          setSelectedShareholder={_setSelectedShareholder}
        />
        <AddShareholderButton
          shareholders={shareholders}
          index={2}
          setShowForm={_setShowForm}
          setSelectedShareholder={_setSelectedShareholder}
        />
        <AddShareholderButton
          shareholders={shareholders}
          index={3}
          setShowForm={_setShowForm}
          setSelectedShareholder={_setSelectedShareholder}
        />
      </section>
      {shareholders.length > 0 && (
        <Button
          type="primary"
          onClick={next}
          className="w-48"
          shape="round"
          size="large">
          Continue
        </Button>
      )}
    </div>
  );
};
export default memo(AddShareholders);
