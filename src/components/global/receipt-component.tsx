import { CURRENCIES } from "@/constants/currencies";
import { useDownloadReceipt } from "@/hooks/use-download-receipt";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "antd";
import { XCircleIcon, AlertCircleIcon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router";
import useStatusStyle from "@/hooks/use-status-style";

type ReceiptComponentProps = {
  receipt: HM.SingleReceipt;
  path?: string;
}

const ReceiptComponent = ({ receipt: data, path }: ReceiptComponentProps) => {
  const navigate = useNavigate();
  const { downloadReceipt, isPdfLoading, isImageLoading, receiptRef } = useDownloadReceipt();
  const { getStatusStyle } = useStatusStyle();
  const currency = CURRENCIES.find(c => c.currencyCode === data.currency);

  const handleDownloadPdf = async () => {
    await downloadReceipt("pdf");
  };

  const handleDownloadImage = async () => {
    await downloadReceipt("image");
  };

  const getStatusIcon = () => {
    const status = data?.transaction_status?.toLowerCase() || "";
    const statusClass = getStatusStyle(status);
    
    if (status === "completed" || status === "success") {
      return <CheckCircleIcon className={`w-4 h-4 ${statusClass.split(' ')[0]}`} />;
    } else if (status === "pending") {
      return <ClockIcon className={`w-4 h-4 ${statusClass.split(' ')[0]}`} />;
    } else if (status === "declined" || status === "failed") {
      return <XCircleIcon className={`w-4 h-4 ${statusClass.split(' ')[0]}`} />;
    } else if (status === "completedwitherrors") {
      return <AlertCircleIcon className={`w-4 h-4 ${statusClass.split(' ')[0]}`} />;
    } else {
      return <CheckCircleIcon className={`w-4 h-4 ${statusClass.split(' ')[0]}`} />;
    }
  };

  const getStatusText = () => {
    const status = data?.transaction_status?.toLowerCase() || "";
    const statusClass = getStatusStyle(status);
    const textColorClass = statusClass.split(' ')[0];

    if (status === "completed" || status === "success") {
      return (
        <span className={`${textColorClass} font-medium`}>Successful</span>
      );
    } else if (status === "pending") {
      return <span className={`${textColorClass} font-medium`}>Pending</span>;
    } else if (status === "declined" || status === "failed") {
      return <span className={`${textColorClass} font-medium`}>Failed</span>;
    } else if (status === "completedwitherrors") {
      return (
        <span className={`${textColorClass} font-medium`}>
          Completed with errors
        </span>
      );
    } else {
      return (
        <span className={`${textColorClass} font-medium`}>Successful</span>
      );
    }
  };

  return (
    <section className="space-y-8">
      <div
        ref={receiptRef}
        className="relative bg-white w-full mx-auto rounded-xl shadow overflow-hidden"
      >
        <img
          src="/images/half-logo.png"
          alt=""
          className="w-44 absolute top-0 right-0"
        />
        <div className="p-6 space-y-6">
          <header className="flex items-center justify-between">
            <a
              href="https://hellomemoney.com/"
              className="flex items-center gap-2 max-lg:justify-center"
            >
              <img
                src="/images/hellome.png"
                alt="Hellomemoney"
                className="h-6 w-6"
              />
              <p className="font-cabinet text-base font-extrabold text-secondary no-underline">
                HelloMe Money
              </p>
            </a>
            <span className="text-[#667085] text-lg">Receipt</span>
          </header>
          <div className="text-center space-y-1">
            <p className="text-positive-600 font-semibold font-nunito text-3xl">
              {`${currency?.currencySymbol}${data?.amount_sent.value}`}
            </p>
            <div className="flex items-center justify-center gap-1">
              {getStatusIcon()}
              {getStatusText()}
            </div>
            <span className="text-grey-600 text-sm">
              {data?.date.posting}
            </span>
          </div>
          <div>
            <div className="border-0 border-dashed border-t border-grey-200 border-b py-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-grey-500">Recipient Name</span>
                <span className="font-medium text-grey-700 font-nunito">
                  {data?.beneficiary.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-grey-500">Payment Reference</span>
                <span className="font-medium text-grey-700 font-nunito">
                  {data?.reference || data?.narration || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-grey-500">Payment Method</span>
                <span className="font-medium text-grey-700 font-nunito">
                  Bank Transfer
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-grey-500">Delivery Method</span>
                <span className="font-medium text-grey-700 font-nunito">
                  Account Deposit
                </span>
              </div>
            </div>
            <div className="border-0 border-solid border-grey-200 py-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-grey-500">Payment Time</span>
                <span className="font-medium text-grey-700 font-nunito">
                  {data?.date.posting}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-grey-500">Account Number</span>
                <span className="font-medium text-grey-700 font-nunito">
                  {data?.beneficiary.account_number}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-grey-500">Balance Before</span>
                <span className="font-medium text-grey-700 font-nunito">
                  {`${currency?.currencySymbol}${data?.balance.balance_before}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-grey-500">Balance After</span>
                <span className="font-medium text-grey-700 font-nunito">
                  {data?.balance.balance_after
                    ? `${currency?.currencySymbol}${data?.balance.balance_after}`
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-grey-500">Recipient's Bank</span>
                <span className="font-medium text-grey-700 font-nunito">
                  {data?.bank.bank_name ||
                    data?.bank.bank_country ||
                    "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-primary-50 p-6 grid grid-cols-[1.75fr_1.25fr] gap-4 relative overflow-hidden z-[1]">
          <div className="bg-primary-100 h-52 w-52 rounded-full absolute z-[-1] top-[-80%] -right-4" />
          <div className="space-y-2">
            <h3 className="text-secondary-400 text-lg font-semibold">
              Simplified global banking designed for everyone
            </h3>
            <div className="flex items-center gap-1">
              <img
                src="/images/googleplay.png"
                alt="google play"
                className="w-24 cursor-pointer"
              />
              <img
                src="/images/applestore.png"
                alt="apple store"
                className="w-24 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <img
              src="/images/scan.png"
              alt="scan"
              className="w-20 aspect-square z-10"
            />
            <p className="text-center text-xs text-secondary-400">
              Scan to download
            </p>
          </div>
        </div>
        <div className="bg-primary py-3 space-y-2 text-white px-2">
          <p className="text-xs font-nunito text-center">
            Need support? you can reach us here
          </p>
          <div className="flex items-center gap-4 justify-center text-sm">
            <span className="text-sm">+44 7309 765313</span>
            <div className="flex items-center gap-1">
              <img
                src="/images/whatsapp.png"
                alt=""
                className="w-4 h-4"
              />
              <span>+44 2080 504026</span>
            </div>
          </div>
          <p className="text-xs font-nunito text-center">
            support@hellomemoney.com
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6 justify-center">
        <Button
          type="primary"
          size="large"
          className="bg-primary-50 text-primary"
          loading={isPdfLoading}
          onClick={handleDownloadPdf}
        >
          Download PDF
        </Button>
        <Button
          type="primary"
          size="large"
          loading={isImageLoading}
          onClick={handleDownloadImage}
        >
          Download Image
        </Button>
        {path && (
          <Button size="large" onClick={() => navigate(path)}>
            Dashboard
          </Button>
        )}
      </div>
    </section>
  );
};

export default ReceiptComponent;