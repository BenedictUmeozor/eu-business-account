import { Alert, Button, Divider, Space, Switch } from "antd";
import ENDPOINTS from "@/constants/endpoints";
import { DotIcon } from "lucide-react";
import PinModal, { PinRefObject } from "@/components/global/PinModal";
import { useRef } from "react";
import { BENEFICIARIES } from "../../constants";
import TransferSuccessModal, { TransferSuccessRefObject } from "../../LocalPayments/SinglePayments/TransferSuccessModal";
const OnlinePayment = () => {
  const beneficiary = BENEFICIARIES[0];

  const modalRef = useRef<PinRefObject>(null);
  const successRef = useRef<TransferSuccessRefObject>(null);

  const handleTransfer = () => {
    modalRef.current?.closeModal();
    successRef.current?.openModal();
  };

  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <h3 className="text-xl text-grey-700 font-semibold">
          Transfer Summary
        </h3>
        <div className="space-y-4">
          <div className="cutout p-4 shadow rounded-2xl bg-white">
            <table className="w-full">
              <tbody>
                <tr className="[&:not(:last-child)]:mb-2">
                  <th className="font-normal text-grey-500 text-base text-left w-1/2">
                    You send
                  </th>
                  <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                    £600
                  </td>
                </tr>
                <tr className="[&:not(:last-child)]:mb-2">
                  <th className="font-normal text-grey-500 text-base text-left w-1/2">
                    Commission
                  </th>
                  <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                    £0.00
                  </td>
                </tr>
                <tr className="[&:not(:last-child)]:mb-2">
                  <th className="font-normal text-grey-500 text-base text-left w-1/2">
                    Recepient gets
                  </th>
                  <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                    £600
                  </td>
                </tr>
                <tr className="[&:not(:last-child)]:mb-2">
                  <th className="font-normal text-grey-500 text-base text-left w-1/2">
                    Payable amount
                  </th>
                  <td className="font-nunito text-primary font-medium text-right w-1/2">
                    £600
                  </td>
                </tr>
              </tbody>
            </table>
            <Divider
              dashed
              variant="dashed"
              style={{ borderColor: "#D0D5DD" }}
            />
            <div className="space-y-1">
              <p className="text-sm text-grey-600 font-medium">
                Beneficiary Details
              </p>
              <div className="bg-primary-50/30 hover:bg-gray-50 px-3 py-3 rounded-xl cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center h-9 w-9 bg-primary-300 rounded-full uppercase text-white">
                    <span className="text-lg font-medium">
                      {(beneficiary?.first_name?.[0] ?? "") +
                        (beneficiary?.last_name?.[0] ?? "")}
                    </span>
                    <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-solid border-white absolute bottom-0 right-0">
                      <img
                        src={ENDPOINTS.FLAG_URL(beneficiary?.country ?? "gb")}
                        alt="flag"
                        className="w-full h-full rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-grey-600 font-medium">
                      {beneficiary?.first_name} {beneficiary?.last_name}
                    </p>
                    <p className="text-sm text-grey-500 flex items-center gap-0.5">
                      {beneficiary?.bank_name}
                      <DotIcon className="w-5 h-5 text-grey-500" />
                      {beneficiary?.account_number}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border border-solid border-grey-200 p-3 rounded-lg">
            <span className="text-sm text-grey-500">Payment reference</span>
            <span className="text-grey-700">HMR0910202400145</span>
          </div>

          <Alert
            message="NB: Payments must be made from an account in your name. Any payment received under a different name will be refunded, and a £5 administration fee will be deducted."
            showIcon
            type="info"
            className="text-primary"
          />
        </div>

        <Space>
          <Switch />{" "}
          <span className="text-grey-600">
            I understand, confirm to proceed
          </span>
        </Space>

        <div className="flex items-center justify-center">
          <Button
            className="w-48"
            size="large"
            type="primary"
            shape="round"
            onClick={() => modalRef.current?.openModal()}>
            Transfer
          </Button>
        </div>
      </div>
      <PinModal ref={modalRef} onSubmit={handleTransfer} />
      <TransferSuccessModal ref={successRef} />
    </div>
  );
};

export const Component = OnlinePayment;

export default OnlinePayment;
