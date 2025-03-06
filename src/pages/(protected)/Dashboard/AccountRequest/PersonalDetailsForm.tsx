import { memo, useEffect } from "react";
import { Moment } from "moment";
import { Form, FormProps, Input, DatePicker, Select, Button } from "antd";
import { useAppSelector } from "@/hooks";

interface FormValues {
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string | Moment;
  marital_status: string;
}

const MARITAL_STATUSES = ["Single", "Married", "Divorced"];

const PersonalDetailsForm = ({
  nextStep,
  prevStep,
}: {
  prevStep: () => void;
  nextStep: () => void;
}) => {
  const [form] = Form.useForm<FormValues>();
  const session = useAppSelector(state => state.session);

  const onFinish: FormProps["onFinish"] = values => {
    console.log("Received values of form: ", values);
    nextStep();
  };

  useEffect(() => {
    form.setFieldsValue({
      first_name: session.user?.fname,
      last_name: session.user?.lname,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <Form autoComplete="off" layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">First Name</span>
        }
        name="first_name"
        rules={[{ required: true, message: "Please enter your first name" }]}>
        <Input placeholder="Michelle" disabled />
      </Form.Item>

      <Form.Item label="Middle name (Optional)" name="middle_name">
        <Input placeholder="Enter middle name" />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">Last Name</span>
        }
        name="last_name"
        rules={[{ required: true, message: "Please enter your last name" }]}>
        <Input placeholder="Mezie" disabled />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">
            Date of Birth
          </span>
        }
        name="date_of_birth"
        rules={[
          { required: true, message: "Please select your date of birth" },
        ]}>
        <DatePicker style={{ width: "100%" }} placeholder="Enter date" />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">
            Marital Status
          </span>
        }
        name="marital_status"
        rules={[
          { required: true, message: "Please select your marital status" },
        ]}>
        <Select
          placeholder="Select"
          options={MARITAL_STATUSES.map(v => ({ label: v, value: v }))}
        />
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
export default memo(PersonalDetailsForm);
