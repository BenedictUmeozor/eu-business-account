import ENDPOINTS from "@/constants/endpoints";
import { Button, Input, Result } from "antd";
import { NumericFormat } from "react-number-format";
import { useParams, useNavigate } from "react-router";
import { useMemo, useState } from "react";
import { BENEFICIARIES } from "../../../constants";
import { DotIcon } from "lucide-react";

const SendToBeneficiary = () => {
  const params = useParams() as { beneficiary: string };
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    sortCode: "",
  });

  const isFormValid = useMemo(
    () => formData.amount && formData.description && formData.sortCode,
    [formData]
  );

  const beneficiary = BENEFICIARIES.find(
    b => b.account_number === params.beneficiary
  );

  const onSubmit = () => {
    navigate("/dashboard/send-money/local-payments/single/summary");
  };

  if (!beneficiary) {
    return (
      <div className="flex items-center justify-center py-16">
        <Result
          status="404"
          title="Beneficiary Not Found"
          subTitle="The beneficiary you're looking for doesn't exist or has been removed."
          extra={
            <Button
              type="primary"
              onClick={() => navigate(-1)}
              size="large"
              shape="round">
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <h3 className="text-xl text-grey-700 font-semibold">Send Money</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between bg-secondary-400 rounded-lg py-3 px-4">
            <span className="font-nunito text-white text-sm font-medium">
              GBP Bal: £6,000,000
            </span>
            <div className="flex items-center justify-center gap-1 p-1 rounded-md bg-primary-500/40">
              <img
                src={ENDPOINTS.FLAG_URL("gb")}
                alt="flag"
                className="w-7 h-7 rounded-full"
              />
              <span className="text-white text-base font-medium">GBP</span>
            </div>
          </div>
          <NumericFormat
            customInput={Input}
            thousandSeparator={true}
            prefix="£"
            placeholder="Enter amount"
            className="w-full bg-primary-100 h-14"
            decimalScale={2}
            allowNegative={false}
            value={formData.amount}
            onValueChange={values => {
              setFormData(prev => ({ ...prev, amount: values.value }));
            }}
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-grey-600 font-medium">Description</p>
            <Input
              placeholder="Enter description"
              className="w-full"
              value={formData.description}
              onChange={e =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
            />
          </div>
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

        <Input
          className="w-full"
          placeholder="Sort Code"
          value={formData.sortCode}
          onChange={e =>
            setFormData(prev => ({ ...prev, sortCode: e.target.value }))
          }
        />

        <div className="flex items-center justify-center">
          <Button
            type="primary"
            size="large"
            shape="round"
            className="w-48"
            onClick={onSubmit}
            disabled={!isFormValid}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Component = SendToBeneficiary;

export default SendToBeneficiary;
