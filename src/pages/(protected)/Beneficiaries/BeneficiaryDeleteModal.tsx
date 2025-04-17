import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import { Button, message, Modal } from "antd";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";

export type BeneficiariesDeleteRefObject = {
  openModal: (beneficiary: HM.UserBeneficiary) => void;
};

const BeneficiaryDeleteModal = forwardRef<
  BeneficiariesDeleteRefObject,
  {
    refetch: () => Promise<void>;
  }
>(({ refetch }, ref) => {
  const [open, setOpen] = useState(false);
  const [beneficiary, setBeneficiary] = useState<HM.UserBeneficiary | null>(
    null
  );

  const mutation = useSharedMutationAction<HM.QueryResponse>({
    url: ENDPOINTS.DELETE_BENEFICIARY,
    mutationKey: ["delete-beneficiary", beneficiary?.beneficiary_id],
    onSuccess: async data => {
      message.success(data?.message);
      await refetch();
      closeModal();
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const closeModal = useCallback(() => {
    setOpen(false);
    setBeneficiary(null);
    mutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = useCallback(async () => {
    await mutation.mutateAsync({
      beneficiary_id: beneficiary?.beneficiary_id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beneficiary]);

  useImperativeHandle(ref, () => ({
    openModal: b => {
      setBeneficiary(b);
      setOpen(true);
    },
  }));

  return (
    <Modal
      open={open}
      onCancel={closeModal}
      footer={null}
      width={400}
      title={
        <span className="text-xl font-semibold text-grey-700">
          Delete beneficiary?
        </span>
      }>
      <div className="space-y-8">
        <p className="text-grey-600">
          You are about to delete “{beneficiary?.beneficiary_name}” as a
          beneficiary
        </p>
        <div className="space-y-2">
          <Button
            type="primary"
            size="large"
            shape="round"
            className="w-full text-base"
            loading={mutation.isPending}
            block
            onClick={handleClick}>
            Delete
          </Button>
          <Button
            type="text"
            size="large"
            shape="round"
            className="w-full text-base"
            disabled={mutation.isPending}
            block
            onClick={closeModal}>
            Go Back
          </Button>
        </div>
      </div>
    </Modal>
  );
});

export default BeneficiaryDeleteModal;
