import { Alert, Button, Checkbox, Form } from "antd";
import { ArrowRightIcon, TriangleAlertIcon } from "lucide-react";

const IndemnityAgreement = ({ onAccept }: { onAccept: () => void }) => {
  const onFinish = () => {
    onAccept();
  };

  return (
    <div className="space-y-4">
      <p className="text-grey-700 font-medium text-base">
        Before adding a new beneficiary, please read and acknowledge the
        following:
      </p>
      <div className="space-y-1">
        <p className="flex items-center gap-1 text-grey-700 font-medium text-base">
          <ArrowRightIcon className="h-4 w-4 text-grey-700" /> Fraud Awareness &
          Customer Responsibility
        </p>
        <ul className="list-disc space-y-1 pl-6 text-grey-600">
          <li>
            You confirm that you have independently verified the recipient’s
            details.
          </li>
          <li>
            You acknowledge that fraudsters may impersonate trusted entities or
            create a sense of urgency
          </li>
          <li>
            You agree never to share your HelloMe Money pin, OTP, or login
            credentials with anyone.
          </li>
          <li>
            You accept full responsibility for any payments made to this
            beneficiary.
          </li>
        </ul>
      </div>
      <Alert
        type="error"
        icon={<TriangleAlertIcon className="h-4 w-4 text-negative" />}
        showIcon
        className="text-grey-600"
        message="Warning: If you feel pressured to add this 
payee, stop and verify first!"
      />
      <div className="space-y-1">
        <p className="flex items-center gap-1 text-grey-700 font-medium text-base">
          <ArrowRightIcon className="h-4 w-4 text-grey-700" /> Agreement
        </p>
        <ul className="list-disc space-y-1 pl-6 text-grey-600">
          <li>
            You confirm that HelloMe Money is not responsible for payments made
            to fraudulent or incorrect payees.
          </li>
          <li>
            You understand that once a payment is processed, it cannot be
            reversed
          </li>
          <li>
            You acknowledge that HelloMe Money will not be liable for any losses
            arising for payments sent to unauthorized or unintended recipients.
          </li>
          <li>
            If you have any doubts about this payee, STOP and verify before
            proceeding!
          </li>
        </ul>
      </div>
      <Form onFinish={onFinish}>
        <Form.Item
          name="accept"
          valuePropName="checked"
          rules={[{ required: true, message: "Required" }]}>
          <Checkbox>
            <span className="text-sm text-grey-600">
              I accept the terms listed above and will like to proceed to add
              the payee
            </span>
          </Checkbox>
        </Form.Item>
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          block
          shape="round">
          Proceed
        </Button>
      </Form>
    </div>
  );
};

export default IndemnityAgreement;
