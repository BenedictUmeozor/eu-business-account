import {
  Form,
  Input,
  DatePicker,
  Select,
  Radio,
  Button,
  FormProps,
  Checkbox,
} from "antd";
import { memo, useCallback } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import HeaderTitle from "@/components/ui/HeaderTitle";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import clsx from "clsx";

interface FormValues {
  first_name: string;
  last_name: string;
  phone_number: string;
  dial_code: string;
  date_of_birth: string;
  town: string;
  state: string;
  residential_address: string;
  postal_code: string;
  occupation: string;
  id_number: string;
  hold_stake: 1 | 0;
  role_in_business: string;
}

const PersonalInfo = ({
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
          headerDescription="Let’s know your personal details"
          headerTitle="Personal Information"
        />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full">
          <img
            src="/images/user.png"
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
          labelCol={{ className: "text-sm text-grey-600 font-medium " }}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label="First Name" name="first_name">
              <Input className="w-full" placeholder="e.g John" />
            </Form.Item>
            <Form.Item label="Last Name" name="last_name">
              <Input className="w-full" placeholder="e.g John" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PhoneNumberInput
              dialCodeName="dial_code"
              name="phone_number"
              setFieldsValue={setFieldsValue}
              setPhoneValue={setPhoneValue}
              label="Phone Number"
            />
            <Form.Item label="Date of Birth" name="date_of_birth">
              <DatePicker className="w-full" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label="Residential Address" name="residential_address">
              <Input className="w-full" placeholder="e.g 123 Main St" />
            </Form.Item>
            <Form.Item label=" Town/City" name="town">
              <Input className="w-full" placeholder="e.g 12345" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label="Region/State" name="state">
              <Select
                className="w-full"
                placeholder="Select State"
                showSearch
                options={[]}
              />
            </Form.Item>
            <Form.Item label="Postal Code" name="postal_code">
              <Input className="w-full" placeholder="Enter Postal Code" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label="Occupation" name="occupation">
              <Input className="w-full" placeholder="Enter Occupation" />
            </Form.Item>
            <Form.Item
              label="ID Number (BVN/NIN/Passport/Driver’s License)"
              name="id_number">
              <Input className="w-full" placeholder="Enter ID Number" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label="Role in Business" name="role_in_business">
              <Checkbox.Group className="w-full">
                <div className="flex items-center gap-1.5">
                  <Checkbox value="owner">Owner</Checkbox>
                  <Checkbox value="shareholder">Shareholder</Checkbox>
                  <Checkbox value="director">Director</Checkbox>
                </div>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item
              label="Do you hold over 25% stake of the business?"
              name="hold_stake">
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
          <div className="flex items-center justify-start">
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              className="text-base w-48"
              shape="round">
              {isReview ? "Confirm" : "Save & Continue"}
            </Button>
          </div>
        </Form>
      </section>
    </div>
  );
};
export default memo(PersonalInfo);
