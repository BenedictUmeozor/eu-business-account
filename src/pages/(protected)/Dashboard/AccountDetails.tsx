import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { Modal } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";

export type AccountDetailsRef = {
  openModal: (currency: HM.Currency) => void;
};

const AccountDetails = forwardRef<AccountDetailsRef>((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<HM.Currency>();
  const [iban, setIban] = useState<Record<string, string>>({});

  useImperativeHandle(ref, () => ({
    openModal: (c: HM.Currency) => {
      setCurrency(c);
      setOpen(true);
    },
  }));

  const handleClose = () => {
    setOpen(false);
    setCurrency(undefined);
    setIban({});
    mutation.reset();
  };

  const mutation = useSharedMutationAction<{ data: Record<string, string> }>({
    url: ENDPOINTS.FETCH_IBAN,
    onSuccess: data => {
      setIban(data.data);
    },
  });

  console.log(iban)

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      width={500}
      footer={null}
      title={
        <span className="text-xl font-semibold text-grey-600">
          Account Details
        </span>
      }>
      <section className="space-y-4">
        <header className="flex items-center justify-between gap-4 relative rounded-lg p-3 overflow-hidden">
          <div className="flex items-center gap-2 z-10 flex-1">
            <img
              src={ENDPOINTS.FLAG_URL(
                currency?.countryCode?.toLowerCase() || ""
              )}
              alt={currency?.countryCode}
              className="w-9 h-9 object-cover rounded-full"
            />
            <span className="text-grey-500 font-medium text-base">
              {currency?.currencyCode}
            </span>
            <div className="absolute left-0 top-0 h-full w-1/2 z-[-1] bg-primary-50 -skew-x-12" />
          </div>
          <div className="flex-1">
            <p className="text-right text-sm text-grey-600 font-medium">
              for local payments only
            </p>
          </div>
        </header>
        <div className="border border-solid border-grey-200 p-4 rounded-lg"></div>
      </section>
    </Modal>
  );
});

// const ClipboardCopy = () => {
//   return <div className="flex items-center"></div>;
// };

export default AccountDetails;
