import { memo } from "react";
import { Form, FormProps, Input, Select, Button, Checkbox } from "antd";
import countries from "@/data/codes.json";

interface FormValues {
  primary_tax_id: string;
  primary_tax_residence: string;
  own_secondary_residency: boolean;
  secondary_tax_id: string;
  secondary_tax_residence: string;
  own_tertiary_residency: boolean;
  tertiary_tax_id: string;
  tertiary_tax_residence: string;
}

const TaxInformation = ({
  nextStep,
  prevStep,
}: {
  prevStep: () => void;
  nextStep: () => void;
}) => {
  const [form] = Form.useForm<FormValues>();
  const ownSecondary = Form.useWatch("own_secondary_residency", form);
  const ownTertiary = Form.useWatch("own_tertiary_residency", form);

  const onFinish: FormProps["onFinish"] = values => {
    console.log("Received values of form: ", values);
    nextStep();
  };

  return (
    <Form autoComplete="off" layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">
            Primary Tax ID number
          </span>
        }
        name="primary_tax_id"
        rules={[
          { required: true, message: "Please enter your primary tax ID" },
        ]}>
        <Input placeholder="e.g UK7000" />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">
            Primary Tax residence
          </span>
        }
        name="primary_tax_residence"
        rules={[
          {
            required: true,
            message: "Please select your primary tax residence",
          },
        ]}>
        <Select
          showSearch
          placeholder="Select country"
          options={countries.map(c => ({
            label: (
              <div className="flex items-center gap-2">
                <img
                  src={c.flag}
                  alt={c.countryCode}
                  className="h-6 w-6 rounded-full object-cover"
                />
                <span className="text-grey-700">{c.countryName}</span>
              </div>
            ),
            value: c.countryCode,
          }))}
        />
      </Form.Item>

      <Form.Item name="own_secondary_residency" valuePropName="checked">
        <Checkbox>
          <span className="text-grey-600 text-sm">
            Do you have a secondary tax residency
          </span>
        </Checkbox>
      </Form.Item>

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">
            Secondary Tax ID number
          </span>
        }
        name="secondary_tax_id"
        rules={[
          {
            required: ownSecondary,
            message: "Please enter your secondary tax ID"
          }
        ]}>
        <Input placeholder="e.g UK7000" disabled={!ownSecondary} />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">
            Secondary Tax residence
          </span>
        }
        name="secondary_tax_residence"
        rules={[
          {
            required: ownSecondary,
            message: "Please select your secondary tax residence"
          }
        ]}>
        <Select
          showSearch
          placeholder="Select country"
          disabled={!ownSecondary}
          options={countries.map(c => ({
            label: (
              <div className="flex items-center gap-2">
                <img
                  src={c.flag}
                  alt={c.countryCode}
                  className="h-6 w-6 rounded-full object-cover"
                />
                <span className="text-grey-700">{c.countryName}</span>
              </div>
            ),
            value: c.countryCode,
          }))}
        />
      </Form.Item>

      <Form.Item name="own_tertiary_residency" valuePropName="checked">
        <Checkbox>
          <span className="text-grey-600 text-sm">
            Do you have a tertiary tax residency
          </span>
        </Checkbox>
      </Form.Item>

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">
            Tertiary Tax ID number
          </span>
        }
        name="tertiary_tax_id"
        rules={[
          {
            required: ownTertiary,
            message: "Please enter your tertiary tax ID"
          }
        ]}>
        <Input placeholder="e.g UK7000" disabled={!ownTertiary} />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">
            Tertiary Tax residence
          </span>
        }
        name="tertiary_tax_residence"
        rules={[
          {
            required: ownTertiary,
            message: "Please select your tertiary tax residence"
          }
        ]}>
        <Select
          showSearch
          placeholder="Select country"
          disabled={!ownTertiary}
          options={countries.map(c => ({
            label: (
              <div className="flex items-center gap-2">
                <img
                  src={c.flag}
                  alt={c.countryCode}
                  className="h-6 w-6 rounded-full object-cover"
                />
                <span className="text-grey-700">{c.countryName}</span>
              </div>
            ),
            value: c.countryCode,
          }))}
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

export default memo(TaxInformation);
