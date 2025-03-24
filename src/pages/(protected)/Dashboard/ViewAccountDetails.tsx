import { CURRENCIES } from "@/constants/currencies";
import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import { message, Modal, Segmented, Space } from "antd";
import { sentenceCase } from "change-case";
import {
  CheckCheckIcon,
  Clock4Icon,
  CopyIcon,
  RotateCcwSquareIcon,
  ShieldIcon,
} from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import CopyToClipboard from "react-copy-to-clipboard";

const AccountDetails = forwardRef<HM.ModalRefObject, { currency: string }>(
  (props, ref) => {
    const [open, setOpen] = useState(false);
    const [segment, setSegment] = useState<"Local" | "International">("Local");

    useImperativeHandle(ref, () => ({
      openModal: () => {
        setOpen(true);
      },
    }));

    const mutation = useSharedMutationAction<{
      data: { data: Record<string, string> };
    }>({
      url: ENDPOINTS.GET_ACCOUNT_DETAILS,
      onError: error => {
        message.error(getErrorMessage(error));
      },
    });

    const country = useMemo(() => {
      if (props.currency === "EUR") return "EU";
      return CURRENCIES.find(c => c.currencyCode === props.currency)
        ?.countryCode;
    }, [props.currency]);

    const handleClose = () => {
      setOpen(false);
      setSegment("Local");
    };

    useEffect(() => {
      if (props.currency) {
        mutation.mutateAsync({ currency: props.currency });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.currency]);

    return (
      <Modal
        open={open}
        footer={null}
        onCancel={handleClose}
        title={
          <span className="text-xl text-grey-700 font-semibold">
            Account Details
          </span>
        }>
        {mutation.isPending ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <header className="flex flex-col items-center justify-center gap-4">
              <Space>
                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-solid border-primary-50">
                  <img
                    className="w-full h-full rounded-full object-cover"
                    src={ENDPOINTS.FLAG_URL(country?.toLowerCase() ?? "")}
                    alt={country}
                  />
                </div>
                <span className="text-base text-grey-500 font-medium">
                  {props.currency}
                </span>
              </Space>
              <Segmented
                options={["Local", "International"]}
                value={segment}
                onChange={setSegment}
                className="w-full rounded-lg border border-solid border-grey-200 bg-white p-1 [&_.ant-segmented-item-selected]:bg-primary [&_.ant-segmented-item-selected]:!text-white [&_.ant-segmented-item:hover]:bg-primary-50 [&_.ant-segmented-item:hover]:text-primary [&_.ant-segmented-item]:grid [&_.ant-segmented-item]:h-10 [&_.ant-segmented-item]:place-items-center "
                block
              />
            </header>
            <div className="rounded-xl border border-solid border-grey-200 p-4 space-y-4">
              {Object.entries(mutation.data?.data || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-grey-500">{sentenceCase(key)}</span>
                    <p className="text-grey-600 font-medium">
                      {value as unknown as string}
                    </p>
                  </div>
                  <ClipboardCopy copyText={value as unknown as string} />
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-primary-50 border border-dashed border-primary-400 p-4 space-y-4">
              <div className="flex items-center justify-start gap-2">
                <div className="w-6 h-6 rounded-full flex items-center bg-primary-100 justify-center">
                  <RotateCcwSquareIcon className="text-primary w-4 h-4" />
                </div>
                <p className="text-primary">
                  Local Payments only. For international payments, please refer
                  to the SWIFT details.
                </p>
              </div>
              <div className="flex items-center justify-start gap-2">
                <div className="w-6 h-6 rounded-full flex items-center bg-primary-100 justify-center">
                  <ShieldIcon className="text-primary w-4 h-4" />
                </div>
                <p className="text-primary">
                  Your money is safely stored in a licensed bank.
                </p>
              </div>
              <div className="flex items-center justify-start gap-2">
                <div className="w-6 h-6 rounded-full flex items-center bg-primary-100 justify-center">
                  <Clock4Icon className="text-primary w-4 h-4" />
                </div>
                <p className="text-primary">
                  Your transaction is processed instantly and typically reaches
                  the recipient within seconds. If not, it may take up more than
                  One business day
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    );
  }
);

const ClipboardCopy = ({ copyText }: { copyText: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <CopyToClipboard text={copyText} onCopy={handleCopy}>
      <div className="rounded-full self-end h-9 w-9 bg-primary-50 flex items-center justify-center cursor-pointer transition-all duration-200 ease-linear hover:bg-primary-100">
        {copied ? (
          <CheckCheckIcon className="w-4 h-4 text-primary" />
        ) : (
          <CopyIcon className="w-4 h-4 text-primary" />
        )}
      </div>
    </CopyToClipboard>
  );
};

export default AccountDetails;
