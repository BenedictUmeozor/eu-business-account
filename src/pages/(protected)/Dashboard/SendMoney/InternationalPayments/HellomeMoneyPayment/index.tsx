import { Alert, Button, Form, FormProps, Radio } from "antd";
import { useNavigate } from "react-router";

interface FormValues {
  account_holder: string;
}

const HellomeMoneyPayment = () => {
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    console.log(values);
    navigate(
      "/dashboard/send-money/international-payments/single/hellome-money-payment/complete"
    );
  };

  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <h3 className="text-xl text-grey-700 font-semibold">Select Account</h3>
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          autoComplete="off"
          className="space-y-6">
          <Form.Item
            name="account_holder"
            rules={[{ required: true, message: "Please select an option" }]}>
            <Radio.Group className="space-y-2 w-full">
              <div className="border border-solid border-grey-200 rounded-xl py-5 px-4">
                <Radio
                  value="YES"
                  className="flex items-center gap-2 text-base text-grey-700">
                  Yes, I am the account holder
                </Radio>
              </div>
              <div className="border border-solid border-grey-200 rounded-xl py-5 px-4">
                <Radio
                  value="NO"
                  className="flex items-center gap-2 text-base text-grey-700">
                  Yes, but it's a joint account
                </Radio>
              </div>
            </Radio.Group>
          </Form.Item>
          <Alert
            message="To get your guaranteed rate, we need to receive the amount 
with 30 minutes"
            showIcon
            type="info"
            className="text-primary"
          />
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="primary"
              htmlType="button"
              onClick={handleCancel}
              className="bg-primary-50 text-primary"
              size="large"
              shape="round">
              Cancel Transfer
            </Button>
            <Button type="primary" htmlType="submit" size="large" shape="round">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export const Component = HellomeMoneyPayment;

export default HellomeMoneyPayment;
