import { memo } from "react";
import { Form, FormProps, Input, Button } from "antd";
import { NumericFormat } from "react-number-format";

interface FormValues {
  source_of_income: string;
  net_monthly_income: string;
  estimated_global_worth: string;
  source_of_wealth: string;
}

const FinancialInformation = ({
  nextStep,
  prevStep,
}: {
  prevStep: () => void;
  nextStep: () => void;
}) => {
  const [form] = Form.useForm<FormValues>();

  const onFinish: FormProps["onFinish"] = values => {
    console.log("Received values of form: ", values);
    nextStep();
  };

  return (
    <Form autoComplete="off" layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">Source of income</span>
        }
        name="source_of_income"
        rules={[{ required: true, message: "Please enter your source of income" }]}>
        <Input placeholder="Enter details" />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">Net monthly income</span>
        }
        name="net_monthly_income"
        rules={[{ required: true, message: "Please enter your net monthly income" }]}>
        <NumericFormat
          customInput={Input}
          thousandSeparator={true}
          decimalScale={2}
          allowNegative={false}
          prefix="£"
          placeholder="0.00"
          className="w-full"
        />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">Estimated global worth</span>
        }
        name="estimated_global_worth"
        rules={[{ required: true, message: "Please enter your estimated global worth" }]}>
        <NumericFormat
          customInput={Input}
          thousandSeparator={true}
          decimalScale={2}
          allowNegative={false}
          prefix="£"
          placeholder="0.00"
          className="w-full"
        />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">Source of wealth</span>
        }
        name="source_of_wealth"
        rules={[{ required: true, message: "Please enter your source of wealth" }]}>
        <Input placeholder="Enter details" />
      </Form.Item>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="primary"
          className="bg-primary-50 text-primary"
          onClick={prevStep}
          htmlType="button"
          size="large"
          shape="round">
          Back
        </Button>
        <Button type="primary" htmlType="submit" size="large" shape="round">
          Next
        </Button>
      </div>
    </Form>
  );
};
export default memo(FinancialInformation);
