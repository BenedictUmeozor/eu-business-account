import { useNavigate, useParams } from "react-router";
import { BENEFICIARIES } from "../../constants";
import { Button, Form, FormProps, Result, Select } from "antd";
import { DotIcon } from "lucide-react";
import ENDPOINTS from "@/constants/endpoints";

interface FormValues {
  payment_method: string;
  delivery_method: string;
  transfer_purpose: string;
}

const SendToInternationalBeneficiary = () => {
  const params = useParams() as { beneficiary: string };
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    console.log(values);
    navigate("/dashboard/send-money/international-payments/single/summary");
  };

  const beneficiary = BENEFICIARIES.find(
    b => b.account_number === params.beneficiary
  );

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
    <div
      className="flex items-center justify-center py-16
    ">
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <h3 className="text-xl text-grey-700 font-semibold">Payment Method</h3>
        <div className="border border-solid rounded-lg p-3 border-grey-200">
          <table className="w-full">
            <tbody>
              <tr className="[&:not(:last-child)]:mb-3">
                <th className="font-normal text-grey-500 text-base text-left w-1/2">
                  You send
                </th>
                <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                  £4.00
                </td>
              </tr>
              <tr className="[&:not(:last-child)]:mb-3">
                <th className="font-normal text-grey-500 text-base text-left w-1/2">
                  Commission
                </th>
                <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                  £4.00
                </td>
              </tr>
              <tr className="[&:not(:last-child)]:mb-3">
                <th className="font-normal text-grey-500 text-base text-left w-1/2">
                  Recipient gets
                </th>
                <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                  ₦227,073
                </td>
              </tr>
              <tr className="[&:not(:last-child)]:mb-3">
                <th className="font-normal text-grey-500 text-base text-left w-1/2">
                  Payable Amount
                </th>
                <td className="font-nunito text-primary font-medium text-right w-1/2">
                  £1,000
                </td>
              </tr>
            </tbody>
          </table>
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

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          initialValues={{ delivery_method: "Account Deposit - Nigeria" }}
          onFinish={onFinish}
          labelCol={{ className: "text-sm text-grey-600 font-medium " }}>
          <Form.Item
            name="payment_method"
            label={
              <p className="text-sm text-grey-600 font-medium">
                Online Payment
              </p>
            }>
            <Select
              placeholder="Select payment method"
              options={["Online Payment"].map(v => ({ label: v, value: v }))}
            />
          </Form.Item>
          <Form.Item
            name="delivery_method"
            label={
              <p className="text-sm text-grey-600 font-medium">
                Receipient Delivery Method
              </p>
            }>
            <Select
              placeholder="Select recipient delivery method"
              options={["Account Deposit - Nigeria"].map(v => ({
                label: v,
                value: v,
              }))}
              disabled
            />
          </Form.Item>
          <Form.Item
            name="transfer_purpose"
            label={
              <p className="text-sm text-grey-600 font-medium">
                Purpose of Transfer
              </p>
            }>
            <Select
              placeholder="Select transfer purpose"
              options={["Select"].map(v => ({ label: v, value: v }))}
            />
          </Form.Item>
          <Form.Item className="flex items-center justify-center">
            <Button type="primary" htmlType="submit" shape="round" size="large" className="w-48">Continue</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export const Component = SendToInternationalBeneficiary;

export default SendToInternationalBeneficiary;
