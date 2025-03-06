import { memo } from "react";
import { Moment } from "moment";
import { Form, FormProps, Input, DatePicker, Select, Button } from "antd";
import countries from "@/data/codes.json";

interface FormValues {
  document_type: string;
  issue_country: string;
  document_number: string;
  document_expiry_date: string | Moment;
  date_of_birth: string | Moment;
  country_of_birth: string;
  nationality: string;
  secondary_nationality: string;
}

const DOCUMENT_TYPES = ["Passport", "National ID Card", "Driver's License"];

const IDDetails = ({
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
            Document Type
          </span>
        }
        name="document_type"
        rules={[{ required: true, message: "Please select document type" }]}>
        <Select
          placeholder="Select"
          options={DOCUMENT_TYPES.map(v => ({ label: v, value: v }))}
        />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">
            Country of Issue
          </span>
        }
        name="issue_country"
        rules={[{ required: true, message: "Please select country of issue" }]}>
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

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">
            Document Number
          </span>
        }
        name="document_number"
        rules={[{ required: true, message: "Please enter document number" }]}>
        <Input placeholder="Enter document number" />
      </Form.Item>

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">
            Document Expiry Date
          </span>
        }
        name="document_expiry_date"
        rules={[
          { required: true, message: "Please select document expiry date" },
        ]}>
        <DatePicker style={{ width: "100%" }} placeholder="Enter date" />
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
            Country of Birth
          </span>
        }
        name="country_of_birth"
        rules={[{ required: true, message: "Please select country of birth" }]}>
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

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">Nationality</span>
        }
        name="nationality"
        rules={[{ required: true, message: "Please select your nationality" }]}>
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

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">
            Secondary Nationality (Optional)
          </span>
        }
        name="secondary_nationality">
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

export default memo(IDDetails);
