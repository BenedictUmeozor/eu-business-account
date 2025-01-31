import { PencilIcon } from "@heroicons/react/24/outline";
import { Button, DatePicker, Form, FormProps, Input, Select } from "antd";
import { memo, useCallback } from "react";
import HeaderTitle from "@/components/ui/HeaderTitle";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import clsx from "clsx";

interface FormValues {
  business_name: string;
  business_reg_number: string;
  date_of_incorporation: string;
  listing_number: string;
  registered_business_address: string;
  business_sector: string;
  annual_business_profit: string;
  economic_activity: string;
  business_website: string;
  phone_number: string;
  dial_code: string;
}

const BusinessInformation = ({
  next,
  isReview,
}: {
  next: () => void;
  isReview?: boolean;
}) => {
  const [form] = Form.useForm<FormValues>();

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    console.log(values);
    next();
  };

  const setFieldsValue = useCallback(
    ({ dialCode, phoneNumber }: { dialCode: string; phoneNumber: string }) => {
      form.setFieldsValue({ dial_code: dialCode, phone_number: phoneNumber });
    },
    [form]
  );

  const setPhoneValue = useCallback(
    (phoneNumber: string) => {
      form.setFieldsValue({ phone_number: phoneNumber });
    },
    [form]
  );

  return (
    <div className={clsx("h-full w-full space-y-8", !isReview && "p-8")}>
      <header className="flex items-center justify-between">
        <HeaderTitle
          headerDescription="Tell us more about your business"
          headerTitle="Business Information"
        />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full">
          <img
            src="/images/logo.png"
            alt=""
            className="h-full w-full object-contain"
          />
          <Button
            type="primary"
            shape="circle"
            className="absolute bottom-0 right-0 bg-primary-50 outline outline-white"
            size="small"
            icon={<PencilIcon className="h-3 w-3 text-primary" />}
          />
        </div>
      </header>
      <section>
        <Form
          layout="vertical"
          autoComplete="off"
          form={form}
          onFinish={onFinish}
          className="space-y-4"
          initialValues={{ dial_code: "+44", phone_number: "+44" }}
          labelCol={{ className: "text-sm text-grey-600 font-medium " }}
        >
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label="Business Name" name="business_name">
              <Input className="w-full" placeholder="Enter business name" />
            </Form.Item>
            <Form.Item
              label="Business Registration Number"
              name="business_reg_number"
            >
              <Input
                className="w-full"
                placeholder="Enter business registration number"
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Date of Incorporation"
              name="date_of_incorporation"
            >
              <DatePicker
                className="w-full"
                placeholder="Enter date of incorporation"
              />
            </Form.Item>
            <Form.Item label="Listing Number" name="listing_number">
              <Input className="w-full" placeholder="Enter Listing Number" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Registered Business Address"
              name="registered_business_address"
            >
              <Input
                className="w-full"
                placeholder="Enter Registered Business Address"
              />
            </Form.Item>
            <Form.Item label="Business Sector" name="business_sector">
              <Select
                className="w-full"
                placeholder="Enter Business Sector"
                options={["IT/Technology", "Finance/Accounting", "Other"].map(
                  v => ({ label: v, value: v })
                )}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Annual Business Profit"
              name="annual_business_profit"
            >
              <Input
                className="w-full"
                placeholder="Enter Annual Business Profit"
              />
            </Form.Item>
            <Form.Item
              label="Economic Activity of the Company"
              name="economic_activity"
            >
              <Input
                className="w-full"
                placeholder="Enter Economic Activity of the Company"
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label="Business Website" name="business_website">
              <Input
                className="w-full"
                type="url"
                placeholder="https://www.xyz.com"
              />
            </Form.Item>
            <PhoneNumberInput
              dialCodeName="dial_code"
              name="phone_number"
              setFieldsValue={setFieldsValue}
              setPhoneValue={setPhoneValue}
              label="Phone Number"
            />
          </div>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            shape="round"
            className="w-48 text-base"
          >
            {isReview ? "Confirm" : "Next"}
          </Button>
        </Form>
      </section>
    </div>
  );
};
export default memo(BusinessInformation);
