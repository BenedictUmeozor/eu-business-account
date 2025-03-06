import { memo } from "react";
import { Form, FormProps, Input, Select, Button } from "antd";

interface FormValues {
  professional_status: string;
  industry: string;
  current_role: string;
  employer_name: string;
}

const OccupationForm = ({
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
          <span className="text-grey-600 text-sm font-medium">
            Professional status
          </span>
        }
        name="professional_status"
        rules={[
          { required: true, message: "Please select your professional status" },
        ]}>
        <Select
          placeholder="Select"
          options={["Select"].map(v => ({ label: v, value: v }))}
        />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">Industry</span>
        }
        name="industry"
        rules={[{ required: true, message: "Please select your industry" }]}>
        <Select
          placeholder="Select"
          options={["Select"].map(v => ({ label: v, value: v }))}
        />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">
            Current/Last role held
          </span>
        }
        name="current_role"
        rules={[
          { required: true, message: "Please enter your current/last role" },
        ]}>
        <Input placeholder="e.g Product Designer" />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">
            Name of employer
          </span>
        }
        name="employer_name"
        rules={[
          { required: true, message: "Please enter your employer name" },
        ]}>
        <Input placeholder="e.g Vox Capital LLC" />
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

export default memo(OccupationForm);
