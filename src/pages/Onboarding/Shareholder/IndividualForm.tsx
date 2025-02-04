import Upload from "@/components/ui/Upload";
import { Button, Divider, Form, FormProps, Input, Radio, Select } from "antd";
import { useState } from "react";
import { Shareholder } from "./AddShareholders";

interface FormValues {
  first_name: string;
  last_name: string;
  email_address: string;
  role: string;
  residential_address: string;
  state: string;
  add_as_shareholder: 1 | 0;
  appoint_as_authorized_signatory: 1 | 0;
  preferred_means_of_identification: string;
}

const IndividualForm = ({
  handleAddShareholder,
}: {
  handleAddShareholder: (shareholder: Shareholder) => void;
}) => {
  const [form] = Form.useForm<FormValues>();
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    const obj = {
      ...values,
      front_image: frontImage,
      back_image: backImage,
    } as unknown as Shareholder;
    handleAddShareholder(obj);
  };

  return (
    <Form
      layout="vertical"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      className="space-y-2"
      labelCol={{ className: "text-sm text-grey-500 font-medium " }}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Form.Item
          label="First Name"
          name="first_name"
          rules={[{ required: true, message: "This field is required" }]}>
          <Input className="w-full" placeholder="Enter First Name" />
        </Form.Item>
        <Form.Item
          label="Last Name"
          name="last_name"
          rules={[{ required: true, message: "This field is required" }]}>
          <Input className="w-full" placeholder="Enter Last Name" />
        </Form.Item>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Form.Item
          label="Email Address"
          name="email_address"
          rules={[{ required: true, message: "This field is required" }]}>
          <Input
            type="email"
            className="w-full"
            placeholder="Enter Email Address"
          />
        </Form.Item>
        <Form.Item label="Role" name="role">
          <Input className="w-full" placeholder="Enter Role" />
        </Form.Item>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Form.Item label="Residential Address" name="residential_address">
          <Input
            type="email"
            className="w-full"
            placeholder="Enter Residential Address"
          />
        </Form.Item>
        <Form.Item label="Region/State" name="state">
          <Select className="w-full" placeholder="Select State" />
        </Form.Item>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Form.Item
          label="Add as a shareholder (owns over 25% of the business)?"
          name="add_as_shareholder">
          <Radio.Group className="w-full">
            <div className="grid grid-cols-2 gap-2">
              <Radio
                value={1}
                className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                Yes
              </Radio>
              <Radio
                value={0}
                className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                No
              </Radio>
            </div>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Appoint as authorized signatory?"
          name="appoint_as_authorized_signatory">
          <Radio.Group className="w-full">
            <div className="grid grid-cols-2 gap-2">
              <Radio
                value={1}
                className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                Yes
              </Radio>
              <Radio
                value={0}
                className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                No
              </Radio>
            </div>
          </Radio.Group>
        </Form.Item>
      </div>
      <Divider>
        <span className="font-medium text-gray-500">ID Card Upload</span>
      </Divider>
      <Form.Item
        name="preferred_means_of_identification"
        label="Preferred Means of Identification">
        <Radio.Group className="w-full">
          <div className="grid grid-cols-3 gap-2">
            <Radio
              value={"NIN"}
              className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
              NIN
            </Radio>
            <Radio
              value={"Passport"}
              className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
              Passport
            </Radio>
            <Radio
              value={"Drivers License"}
              className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
              Drivers License
            </Radio>
          </div>
        </Radio.Group>
      </Form.Item>
      <Upload
        file={frontImage}
        image="/images/preview.png"
        label="Upload your Passport/Drivers license (Front)"
        setFile={setFrontImage}
        key={1}
      />
      <Upload
        file={backImage}
        image="/images/back.png"
        label="Upload your Passport/Drivers license (Back)"
        setFile={setBackImage}
        key={2}
      />

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        shape="round"
        className="w-48">
        Save & Continue
      </Button>
    </Form>
  );
};
export default IndividualForm;
