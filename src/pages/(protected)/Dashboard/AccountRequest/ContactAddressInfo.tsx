import { memo, useEffect } from "react";
import { Form, FormProps, Input, Select, Button } from "antd";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { useAppSelector } from "@/hooks";
import { formatPhoneNumber } from "@/utils";

interface FormValues {
  email: string;
  phone_code: string;
  phone_number: string;
  address_1: string;
  address_2: string;
  address_3: string;
  marital_status: string;
}

const MARITAL_STATUSES = ["Single", "Married", "Divorced"];

const ContactAddressInfo = ({
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
    const phoneNumber = formatPhoneNumber(
      values.phone_number,
      values.phone_code
    );
    if (!phoneNumber) {
      form.setFields([
        { name: "phone_number", errors: ["Invalid phone number"] },
      ]);
      return;
    }
    nextStep();
  };

  const setFieldsValue = ({
    dialCode,
    phoneNumber,
  }: {
    dialCode: string;
    phoneNumber: string;
  }) => {
    form.setFieldsValue({
      phone_code: dialCode,
      phone_number: phoneNumber,
    });
  };

  const setPhoneValue = (phoneNumber: string) => {
    form.setFieldsValue({ phone_number: phoneNumber });
  };

  useEffect(() => {
    form.setFieldsValue({
      email: session.user?.email,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <Form
      autoComplete="off"
      layout="vertical"
      form={form}
      onFinish={onFinish}
      initialValues={{
        phone_code: "+44",
        phone_number: "+44",
      }}>
      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">
            Email Address
          </span>
        }
        name="email"
        rules={[
          { required: true, message: "Please enter your email address" },
          { type: "email", message: "Please enter a valid email address" },
        ]}>
        <Input placeholder="Enter your email address" disabled />
      </Form.Item>

      <PhoneNumberInput
        dialCodeName="phone_code"
        name="phone_number"
        setFieldsValue={setFieldsValue}
        setPhoneValue={setPhoneValue}
        phoneNumberRules={[
          { required: true, message: "Please enter your phone number" },
        ]}
        label={
          <span className="text-grey-600 text-sm font-medium">
            Phone Number
          </span>
        }
      />

      <Form.Item
        label={
          <span className="text-grey-600 text-sm font-medium">
            Residential Address
          </span>
        }>
        <div className="space-y-2">
          <Form.Item
            name="address_1"
            rules={[{ required: true, message: "Please enter your address" }]}
            noStyle>
            <Input placeholder="Line 1" />
          </Form.Item>
          <Form.Item name="address_2" noStyle>
            <Input placeholder="Line 2" />
          </Form.Item>
          <Form.Item name="address_3" noStyle>
            <Input placeholder="Line 3" />
          </Form.Item>
        </div>
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

export default memo(ContactAddressInfo);
