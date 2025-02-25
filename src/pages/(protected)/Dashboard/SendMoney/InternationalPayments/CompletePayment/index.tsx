import { Alert, Button } from "antd";
import { CopyIcon } from "lucide-react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useNavigate } from "react-router";

const CompletePayment = () => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleConfirm = () => {
    navigate(
      "/dashboard/send-money/international-payments/single/transaction-progress"
    );
  };

  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <header className="space-y-1">
          <h3 className="text-xl text-grey-700 font-semibold">
            Complete Payment
          </h3>
          <p className="text-grey-500">
            Proceed to your mobile banking app and make payment using the
            account details below
          </p>
        </header>
        <Alert
          message="Use these exact details to make payments to HelloMe Money. Once payment has been made click “Payment made”"
          showIcon
          type="info"
          className="text-primary"
        />
        <section className="space-y-2">
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <span className="text-sm text-grey-500">Account name</span>
              <p className="font-medium text-grey-700">Hellomemoney(Company)</p>
            </div>
            <CopyToClipboard text="Hellome... 4044209090">
              <Button
                type="text"
                icon={<CopyIcon className="w-4 h-4 text-grey-500" />}
              />
            </CopyToClipboard>
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <span className="text-sm text-grey-500">Account number</span>
              <p className="font-medium text-grey-700">2024202420</p>
            </div>
            <CopyToClipboard text="Hellome... 4044209090">
              <Button
                type="text"
                icon={<CopyIcon className="w-4 h-4 text-grey-500" />}
              />
            </CopyToClipboard>
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <span className="text-sm text-grey-500">Transfer amount</span>
              <p className="font-medium text-grey-700">€1004</p>
            </div>
            <CopyToClipboard text="Hellome... 4044209090">
              <Button
                type="text"
                icon={<CopyIcon className="w-4 h-4 text-grey-500" />}
              />
            </CopyToClipboard>
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <span className="text-sm text-grey-500">Sort code</span>
              <p className="font-medium text-grey-700">6900000</p>
            </div>
            <CopyToClipboard text="Hellome... 4044209090">
              <Button
                type="text"
                icon={<CopyIcon className="w-4 h-4 text-grey-500" />}
              />
            </CopyToClipboard>
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <span className="text-sm text-grey-500">Reference number</span>
              <p className="font-medium text-grey-700">6R354244768123</p>
            </div>
            <CopyToClipboard text="Hellome... 4044209090">
              <Button
                type="text"
                icon={<CopyIcon className="w-4 h-4 text-grey-500" />}
              />
            </CopyToClipboard>
          </div>
        </section>
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="primary"
            onClick={handleCancel}
            className="bg-primary-50 text-primary"
            size="large"
            shape="round">
            Cancel Transfer
          </Button>
          <Button
            type="primary"
            size="large"
            shape="round"
            onClick={handleConfirm}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Component = CompletePayment;

export default CompletePayment;
