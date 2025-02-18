import { Button, Form, FormProps, Input, Radio, Segmented, Select } from "antd";
import { useCallback, useState } from "react";
import countries from "@/data/codes.json";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { Link } from "react-router";

interface FormValues {
  fname: string;
  lname: string;
  phone_code: string;
  phone_number: string;
  business_structure: string;
  is_business_registered: string;
  email: string;
  country: string;
  password: string;
}

const GetStarted = () => {
  const [country, setCountry] = useState("United Kingdom");
  const [form] = Form.useForm<FormValues>();

  const handleCountryChange = (value: string) => {
    setCountry(value);
    form.setFieldsValue({ country: value });
  };

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

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    console.log(values);
  };

  return (
    <section className="space-y-6 rounded-xl bg-white p-6 shadow-lg lg:max-w-[466px] ml-auto">
      <Segmented
        options={[
          { label: "Personal", value: "Personal", disabled: true },
          "Business",
        ]}
        value="Business"
        className="w-full rounded-lg border border-solid border-grey-200 bg-white p-1 [&_.ant-segmented-item-disabled]:cursor-not-allowed [&_.ant-segmented-item-disabled]:opacity-50 [&_.ant-segmented-item-selected]:bg-primary-50 [&_.ant-segmented-item-selected]:text-primary [&_.ant-segmented-item:hover]:bg-primary-50 [&_.ant-segmented-item:hover]:text-primary [&_.ant-segmented-item]:grid [&_.ant-segmented-item]:h-10 [&_.ant-segmented-item]:place-items-center [&_.ant-segmented-item]:text-primary"
        block
      />
      <header className="space-y-2">
        <h5 className="font-cabinet text-2xl font-bold text-grey-700">
          Create an account
        </h5>
        <p className="text-grey-600">Fill the form to get started now</p>
      </header>
      <Form
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          phone_code: "+44",
          phone_number: "+44",
          country: "United Kingdom",
        }}
        layout="vertical"
        labelCol={{ className: "text-sm font-semibold text-grey-600" }}
        className="space-y-6">
        <section className="space-y-4">
          <Form.Item
            name="country"
            label={
              <p className="text-sm font-semibold text-grey-600">Country</p>
            }>
            <Select
              showSearch
              className="w-full"
              onChange={handleCountryChange}
              value={country}
              dropdownStyle={{ minWidth: "200px" }}
              options={countries.map(c => ({
                label: (
                  <div className="flex items-center gap-2">
                    <img
                      src={c.flag}
                      alt={c.countryName}
                      className="h-4 w-6 object-cover"
                    />
                    <span>{c.countryName}</span>
                  </div>
                ),
                value: c.countryName,
              }))}
            />
          </Form.Item>
          <Form.Item
            label={
              <p className="text-sm font-semibold text-grey-600">
                Business Name
              </p>
            }>
            <Input className="w-full" placeholder="Enter your business name" />
          </Form.Item>
          <Form.Item
            label={
              <p className="text-sm font-semibold text-grey-600">First Name</p>
            }
            name="fname">
            <Input className="w-full" placeholder="Enter your first name" />
          </Form.Item>
          <Form.Item
            label={
              <p className="text-sm font-semibold text-grey-600">Last Name</p>
            }
            name="lname">
            <Input className="w-full" placeholder="Enter your last name" />
          </Form.Item>
          <Form.Item
            label={
              <p className="text-sm font-semibold text-grey-600">
                Email Address
              </p>
            }
            name="email">
            <Input
              className="w-full"
              type="email"
              placeholder="Enter your email address"
            />
          </Form.Item>
          <Form.Item
            label={
              <p className="text-sm font-semibold text-grey-600">
                Create Password
              </p>
            }
            name="password">
            <Input.Password className="w-full" placeholder="Create Password" />
          </Form.Item>
          <Form.Item
            name="business_structure"
            label={
              <p className="text-sm font-semibold text-grey-600">
                Business Type
              </p>
            }
            rules={[
              {
                required: true,
                message: "Please select a business type",
              },
            ]}>
            <Radio.Group className="w-full">
              <div className="grid grid-cols-2 gap-2">
                <Radio
                  value={"sole-trader"}
                  className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                  Sole Trader
                </Radio>
                <Radio
                  value={"corporate"}
                  className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                  Corporate
                </Radio>
              </div>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="is_business_registered"
            label={
              <p className="text-sm font-semibold text-grey-600">
                Please confirm, this is a registered business
              </p>
            }>
            <Radio.Group className="w-full">
              <div className="grid grid-cols-2 gap-2">
                <Radio
                  value={"YES"}
                  className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                  Yes
                </Radio>
                <Radio
                  value={"NO"}
                  className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                  No
                </Radio>
              </div>
            </Radio.Group>
          </Form.Item>
          <PhoneNumberInput
            dialCodeName="phone_code"
            name="phone_number"
            setFieldsValue={setFieldsValue}
            setPhoneValue={setPhoneValue}
            label={
              (
                <p className="text-sm font-semibold text-grey-600">
                  Business Phone Number
                </p>
              ) as unknown as string
            }
          />
        </section>
        <Button
          className="w-full"
          shape="round"
          type="primary"
          htmlType="submit"
          size="large">
          Get Started
        </Button>
        <p className="text-center font-medium text-grey-600">
          Already got an account?{" "}
          <Link
            to="#"
            className="text-primary-600 underline hover:text-primary-700">
            Sign in
          </Link>
        </p>
      </Form>
    </section>
  );
};

export const Component = GetStarted;

export default GetStarted;
