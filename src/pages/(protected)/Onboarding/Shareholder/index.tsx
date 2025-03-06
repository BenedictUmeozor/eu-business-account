import HeaderTitle from "@/components/ui/HeaderTitle";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AddButton from "./AddButton";
import { Button } from "antd";
import AddShareholderForm from "./AddShareholderForm";
import EditShareholderForm from "./EditShareholderForm";
import Loader from "@/components/app/Loader";
import usePersonalDetails from "@/hooks/use-personal-details";
import useShareholders from "@/hooks/use-shareholders";
import useShareholderProgress from "@/hooks/use-shareholder-progress";
import { useAppSelector } from "@/hooks";

const AddShareholders = ({
  next,
  isReview,
}: {
  next: () => void;
  isReview?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingShareholder, setEditingShareholder] =
    useState<HM.Shareholder | null>(null);
  const [shareholderDocumentComplete, setShareholderDocumentComplete] =
    useState(false);
  const [progressChecked, setProgressChecked] = useState(false);
  const session = useAppSelector(state => state.session);

  // Use the shareholders hook
  const {
    shareholders,
    isLoading: isLoadingShareholders,
    getShareholders,
  } = useShareholders();

  const shareholderDocComplete = useMemo(() => {
    return shareholders.every(
      shareholder => shareholder.documents?.data?.length > 0
    );
  }, [shareholders]);

  // Use the shareholder progress hook
  const { getShareholderProgress, isChecking } = useShareholderProgress(
    session?.user?.email
  );

  // Use the auto add shareholder hook
  // const { autoAddedShareholder, isLoading: isAutoAddingShareHolder } =
  //   useAutoAddShareholder({
  //     email: session?.user?.email,
  //     isReview,
  //   });

  // Fetch personal details to check percentage stake
  const { personalDetails, isLoading: isLoadingPersonalDetails } =
    usePersonalDetails(session?.user?.email);

  const removeForm = useCallback(() => {
    (async () => {
      await getShareholders();
      await checkShareholderProgress();
    })();
    setShowAddForm(false);
    setEditingShareholder(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showForm = useCallback(() => {
    setShowAddForm(true);
  }, []);

  const handleEdit = useCallback((shareholder: HM.Shareholder) => {
    setEditingShareholder(shareholder);
  }, []);

  const canAddShareholders = useCallback(
    () => Number(personalDetails?.percentage_stake) < 100,
    [personalDetails]
  );

  const checkShareholderProgress = async () => {
    const progress = await getShareholderProgress();
    setShareholderDocumentComplete(progress.shareholderDocumentComplete);
    setProgressChecked(true);
  };

  useEffect(() => {
    (async () => {
      await getShareholders();
      await checkShareholderProgress();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isReview) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isReview]);

  // After editing or adding a shareholder, recheck document progress
  useEffect(() => {
    if (!showAddForm && !editingShareholder) {
      (async () => {
        await getShareholders();
        await checkShareholderProgress();
      })();
    }
    getShareholders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAddForm, editingShareholder]);

  const isLoading = useMemo(
    () => isLoadingShareholders || isLoadingPersonalDetails || isChecking,
    [isLoadingShareholders, isLoadingPersonalDetails, isChecking]
  );

  if (showAddForm) return <AddShareholderForm removeForm={removeForm} />;
  if (editingShareholder)
    return (
      <EditShareholderForm
        shareholder={editingShareholder}
        onClose={removeForm}
      />
    );

  return (
    <div
      className={clsx("h-full w-full space-y-8", !isReview && "p-8")}
      ref={ref}>
      {isLoading && <Loader />}
      <HeaderTitle
        headerDescription={
          personalDetails?.percentage_stake == "100"
            ? "You are the only shareholder with 100% stake"
            : "Add up to Four (4) key shareholders in your business"
        }
        headerTitle="Add Key Shareholders"
      />
      <section className="grid grid-cols-1 grid-rows-[120px] gap-6 lg:grid-cols-2">
        <AddButton
          shareholder={shareholders[0] || null}
          key={1}
          canAddShareholder={canAddShareholders()}
          showForm={showForm}
          onEdit={handleEdit}
        />

        <AddButton
          shareholder={shareholders[1] || null}
          canAddShareholder={canAddShareholders()}
          key={2}
          showForm={showForm}
          onEdit={handleEdit}
        />
        <AddButton
          shareholder={shareholders[2] || null}
          canAddShareholder={canAddShareholders()}
          key={3}
          showForm={showForm}
          onEdit={handleEdit}
        />
        <AddButton
          shareholder={shareholders[3] || null}
          key={4}
          canAddShareholder={canAddShareholders()}
          showForm={showForm}
          onEdit={handleEdit}
        />
      </section>

      {/* Only show next button if shareholders exist and their documents are complete */}
      {shareholders.length > 0 &&
        progressChecked &&
        shareholderDocumentComplete &&
        shareholderDocComplete && (
          <Button
            className="w-48"
            size="large"
            type="primary"
            shape="round"
            onClick={next}>
            Next
          </Button>
        )}

      {/* Show message if shareholders exist but documents are not complete */}
      {shareholders.length > 0 &&
        progressChecked &&
        (!shareholderDocumentComplete || !shareholderDocComplete) && (
          <div className="text-yellow-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            Please ensure all shareholder documents are uploaded before
            proceeding to the next step.
          </div>
        )}
    </div>
  );
};

export default AddShareholders;
