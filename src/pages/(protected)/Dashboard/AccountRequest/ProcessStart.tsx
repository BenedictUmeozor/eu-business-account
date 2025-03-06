import { Alert, Button, Checkbox, Form } from "antd";
import { memo } from "react";

const ProcessStart = ({ nextStep }: { nextStep: () => void }) => {
  const onFinish = () => {
    nextStep();
  };

  return (
    <div className="text-grey-600 space-y-4 text-base">
      <p>
        Ready to request your GBP Account Number? Please be prepared for a quick
        verification process to ensure the security of your information.
      </p>
      <p>During the request, you will need to provide the following:</p>
      <ul className="list-disc pl-4 space-y-4">
        <li>
          Valid Identification: Please have your ID (e.g Passport, Driver’s
          license) ready for verification.
        </li>
        <li>
          Proof of Address: A recent utility bill or bank statement showing your
          address may be required
        </li>
        <li>
          Additional Documentation: Depending on your account type, you may need
          to provide further documentation, such as liveliness video or a tax ID
          or proof of income
        </li>
      </ul>
      <Alert
        message="Ensure you have these documents on hand to make the process smooth and efficient!"
        type="info"
        className="text-primary text-base"
        showIcon
      />
      <Form onFinish={onFinish}>
        <Form.Item
          name="acceptTerms"
          valuePropName="checked"
          rules={[{ required: true, message: "This field is required" }]}>
          <Checkbox>
            <p className="text-grey-600 text-base">
              By clicking "Begin", I accept the{" "}
              <span className="text-primary underline">Terms</span> and{" "}
              <span className="text-primary underline">Conditions</span>{" "}
            </p>
          </Checkbox>
        </Form.Item>
        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[{ required: true, message: "This field is required" }]}>
          <Checkbox>
            <p className="text-grey-600 text-base">
              I agree to the processing of my personal data, as described in the
              Consent to Personal Data Processing
            </p>
          </Checkbox>
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          shape="round"
          size="large">
          Begin
        </Button>
      </Form>
    </div>
  );
};
export default memo(ProcessStart);
