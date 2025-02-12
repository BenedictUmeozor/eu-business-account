import {
  Form,
  Input,
  DatePicker,
  Select,
  Radio,
  Button,
  FormProps,
  Checkbox,
  InputNumber,
  Alert,
  Divider,
} from "antd";
import { memo, useCallback, useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import HeaderTitle from "@/components/ui/HeaderTitle";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import clsx from "clsx";
import { Shareholder, useOnboardingContext } from "@/contexts/onboarding";

interface FormValues {
  first_name: string;
  last_name: string;
  phone_number: string;
  middle_name: string;
  dial_code: string;
  date_of_birth: string;
  town: string;
  state: string;
  residential_address: string;
  postal_code: string;
  occupation: string;
  stake_percentage: number;
  appoint_as_authorized_signatory: 1 | 0;
}

const ROLES = ["UBO", "Director", "Shareholder"];

const PersonalInfo = ({
  next,
  isReview,
}: {
  next: () => void;
  isReview?: boolean;
}) => {
  const [form] = Form.useForm<FormValues>();
  const [roleInBusiness, setRoleInBusiness] = useState<string[]>([]);
  const [holdOver25Stake, setHoldOver25Stake] = useState<boolean | null>(null);

  const { setStakePercentage, setShareholders, shareholders } =
    useOnboardingContext();

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    if (holdOver25Stake) {
      const shareholder = {
        first_name: values.first_name,
        last_name: values.last_name,
        residential_address: values.residential_address,
        authorized_signatory: values.appoint_as_authorized_signatory,
      } as Shareholder;
      setShareholders([...shareholders, shareholder]);
    }
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

  const handleHoldStakeChange = (value: boolean) => {
    setHoldOver25Stake(value);
    if (value && !roleInBusiness.includes("shareholder")) {
      setRoleInBusiness([...roleInBusiness, "shareholder"]);
    }
  };

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
      <Alert
        type="info"
        message="Kindly fill out the names as displayed on your government issued ID Card"
        showIcon
        closable
      />
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
            <Form.Item label="Middle Name (Optional)" name="middle_name">
              <Input className="w-full" placeholder="e.g Jane" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label="Last Name" name="last_name">
              <Input className="w-full" placeholder="e.g Doe" />
            </Form.Item>
            <PhoneNumberInput
              dialCodeName="dial_code"
              name="phone_number"
              setFieldsValue={setFieldsValue}
              setPhoneValue={setPhoneValue}
              label="Phone Number"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label="Date of Birth" name="date_of_birth">
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item label="Residential Address" name="residential_address">
              <Input className="w-full" placeholder="e.g 123 Main St" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label=" Town/City" name="town">
              <Input className="w-full" placeholder="e.g 12345" />
            </Form.Item>
            <Form.Item label="Region/State" name="state">
              <Select
                className="w-full"
                placeholder="Select State"
                showSearch
                options={[]}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label="Postal Code" name="postal_code">
              <Input className="w-full" placeholder="Enter Postal Code" />
            </Form.Item>
            <Form.Item label="Occupation" name="occupation">
              <Input className="w-full" placeholder="Enter Occupation" />
            </Form.Item>
          </div>
          <Divider>
            <span className="text-grey-500 font-medium">
              Role in the Business
            </span>
          </Divider>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label="Do you hold over 25% stake of the business?">
              <Radio.Group
                className="w-full"
                onChange={e => handleHoldStakeChange(e.target.value)}>
                <div className="grid grid-cols-2 gap-2">
                  <Radio
                    value={true}
                    className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                    Yes
                  </Radio>
                  <Radio
                    value={false}
                    className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                    No
                  </Radio>
                </div>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Role in Business">
              <Checkbox.Group
                className="w-full flex items-center gap-1.5"
                value={roleInBusiness}
                onChange={checkedValues =>
                  setRoleInBusiness(checkedValues as string[])
                }>
                {ROLES.map(role => (
                  <Checkbox key={role} value={role.toLowerCase()}>
                    {role}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Enter your percentage(%) stake"
              name="stake_percentage"
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                {
                  required: !!holdOver25Stake,
                  message: "Please enter your stake percentage",
                  validator: async (_, value) => {
                    if (value === null || value === undefined) {
                      return Promise.resolve();
                    }

                    const numValue = Number(value);
                    if (isNaN(numValue)) {
                      return Promise.reject(
                        "Stake percentage must be a number"
                      );
                    }
                    if (numValue > 100) {
                      return Promise.reject(
                        "Stake percentage cannot be more than 100"
                      );
                    }
                    if (numValue < 0) {
                      return Promise.reject(
                        "Stake percentage cannot be less than 0"
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}>
              <InputNumber
                className="w-full"
                placeholder="Enter Percentage"
                onChange={value => {
                  const numValue = Number(value);
                  if (!isNaN(numValue)) {
                    const clampedValue = Math.min(Math.max(numValue, 0), 100);
                    setStakePercentage(clampedValue);
                    form.validateFields(["stake_percentage"]);
                  }
                }}
              />
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
