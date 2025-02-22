import { Button, Form, FormProps, Input, Select } from "antd";
import countries from "@/data/codes.json";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { useCallback, useRef } from "react";
import PinModal, { PinRefObject } from "@/components/global/PinModal";

interface FormValues {
  country: string;
  first_name: string;
  last_name: string;
  account_number: string;
  sort_code: string;
  phone_number: string;
  phone_code: string;
  email: string;
}

const IndividualForm = ({ setOpen }: { setOpen: () => void }) => {
  const [form] = Form.useForm<FormValues>();

  const modalRef = useRef<PinRefObject>(null);

  const setFieldsValue = useCallback(
    ({ dialCode, phoneNumber }: { dialCode: string; phoneNumber: string }) => {
      form.setFieldsValue({ phone_code: dialCode, phone_number: phoneNumber });
    },
    [form]
  );

  const setPhoneValue = useCallback(
    (phoneNumber: string) => {
      form.setFieldsValue({ phone_number: phoneNumber });
    },
    [form]
  );

  const onFinish: FormProps["onFinish"] = values => {
    modalRef.current?.openModal();
    console.log(values);
  };

  const handleFinish = () => {
    modalRef.current?.closeModal();
    form.resetFields();
    setOpen();
  };

  return (
    <Form
      layout="vertical"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      className="space-y-6"
      initialValues={{ phone_code: "+44", country: "GB" }}>
      <Form.Item
        name="country"
        label={
          <span className="text-sm text-grey-500 font-medium">
            Recipient Country
          </span>
        }>
        <Select
          className="w-full"
          placeholder="Select Country"
          options={countries.map(c => ({
            label: (
              <div className="flex items-center gap-2">
                <img
                  src={c.flag}
                  alt={c.countryCode}
                  className="h-6 w-6 rounded-full object-cover"
                />
                <span className="text-grey-700">
                  {c.countryName} ({c.currencyCode})
                </span>
              </div>
            ),
            value: c.countryCode,
          }))}
          showSearch
          allowClear
        />
      </Form.Item>
      <section className="space-y-4">
        <p className="text-center text-sm text-grey-500 font-medium">
          Beneficiary Account Details
        </p>
        <Form.Item
          name="first_name"
          label={
            <span className="text-sm text-grey-500 font-medium">
              First Name and Middle Name
            </span>
          }>
          <Input placeholder="e.g John Doe" className="w-full" />
        </Form.Item>
        <Form.Item
          name="last_name"
          label={
            <span className="text-sm text-grey-500 font-medium">Last Name</span>
          }>
          <Input placeholder="e.g Doe" className="w-full" />
        </Form.Item>
        <Form.Item
          name="account_number"
          label={
            <span className="text-sm text-grey-500 font-medium">
              Account Number
            </span>
          }>
          <Input placeholder="Enter Account Number" className="w-full" />
        </Form.Item>
        <Form.Item
          name="sort_code"
          label={
            <span className="text-sm text-grey-500 font-medium">Sort Code</span>
          }>
          <Input placeholder="Enter Sort Code" className="w-full" />
        </Form.Item>
        <PhoneNumberInput
          dialCodeName="phone_code"
          label="Mobile Number"
          name="phone_number"
          setFieldsValue={setFieldsValue}
          setPhoneValue={setPhoneValue}
          phoneNumberRules={[
            { required: true, message: "Phone Number is required" },
          ]}
        />
        <Form.Item
          name="email"
          label={
            <span className="text-sm text-grey-500 font-medium">Email</span>
          }>
          <Input
            type="email"
            placeholder="Enter your email"
            className="w-full"
          />
        </Form.Item>
      </section>
      <Button type="primary" htmlType="submit" size="large" shape="round" block>
        Add Beneficiary
      </Button>
      <PinModal
        ref={modalRef}
        title="Enter PassCode"
        onSubmit={handleFinish}
      />
    </Form>
  );
};
export default IndividualForm;
