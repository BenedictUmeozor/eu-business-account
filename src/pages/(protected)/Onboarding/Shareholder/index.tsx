import HeaderTitle from "@/components/ui/HeaderTitle";
import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import AddButton from "./AddButton";
import useMutationAction from "@/hooks/use-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { Button, message } from "antd";
import { getErrorMessage } from "@/utils";
import AddShareholderForm from "./AddShareholderForm";
import EditShareholderForm from "./EditShareholderForm";
import Loader from "@/components/app/Loader";

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
  const [shareholders, setShareholders] = useState<HM.Shareholder[]>([]);

  const mutation = useMutationAction<HM.ShareholderResponse>({
    url: ENDPOINTS.GET_SHAREHOLDERS,
    method: "POST",
    mutationKey: ["get-shareholders"],
    onSuccess: data => {
      setShareholders(data.shareholder?.data || []);
      console.log(data?.shareholder?.data.length, "lentgth");
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const removeForm = useCallback(() => {
    setShowAddForm(false);
    setEditingShareholder(null);
  }, []);

  const showForm = useCallback(() => {
    setShowAddForm(true);
  }, []);

  const handleEdit = useCallback((shareholder: HM.Shareholder) => {
    setEditingShareholder(shareholder);
  }, []);

  const getShareholders = useCallback(async () => {
    await mutation.mutateAsync({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getShareholders();
  }, [getShareholders, showAddForm, editingShareholder]);

  useEffect(() => {
    if (!isReview) {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isReview]);

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
      {mutation.isPending && <Loader />}
      <HeaderTitle
        headerDescription="Add up to Four (4) key shareholders in your business"
        headerTitle="Add Key Shareholders"
      />
      <section className="grid grid-cols-1 grid-rows-[120px] gap-6 lg:grid-cols-2">
        <AddButton
          shareholder={shareholders[0] || null}
          key={1}
          showForm={showForm}
          onEdit={handleEdit}
        />
        <AddButton
          shareholder={shareholders[1] || null}
          key={2}
          showForm={showForm}
          onEdit={handleEdit}
        />
        <AddButton
          shareholder={shareholders[2] || null}
          key={3}
          showForm={showForm}
          onEdit={handleEdit}
        />
        <AddButton
          shareholder={shareholders[3] || null}
          key={4}
          showForm={showForm}
          onEdit={handleEdit}
        />
      </section>
      {shareholders.length > 0 && (
        <Button
          className="w-48"
          size="large"
          type="primary"
          shape="round"
          onClick={next}>
          Next
        </Button>
      )}
    </div>
  );
};

export default AddShareholders;
