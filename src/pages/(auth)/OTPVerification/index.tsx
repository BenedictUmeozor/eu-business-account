import { Button, Form, FormProps, Input, Segmented } from "antd";
import { Link } from "react-router";

interface FormValues {
  otp: string;
}

const OTPVerification = () => {
  const [form] = Form.useForm<FormValues>();

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
          OTP Verification
        </h5>
        <p className="text-grey-600">
          We have sent a code to{" "}
          <span className="text-primary">benedictumeozor@gmail.com</span>
        </p>
      </header>
      <Form
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        labelCol={{ className: "text-sm text-grey-600" }}
        className="space-y-6">
        <Form.Item
          name="otp"
          label={
            <p className="text-sm text-grey-600">
              Kindly enter the six(6) digit code sent to you{" "}
            </p>
          }>
          <Input.OTP length={6} style={{ width: "100%" }} />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          shape="round"
          block>
          Verify
        </Button>
      </Form>
      <div className="flex items-center justify-between">
        <Button type="text" className="text-primary !text-sm font-medium">
          Resend OTP
        </Button>
        <span className="text-sm text-grey-500">00:00</span>
      </div>
      <p className="text-center font-medium text-grey-600">
        Already got an account?{" "}
        <Link
          to="#"
          className="text-primary-600 underline hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </section>
  );
};

export const Component = OTPVerification;

export default OTPVerification;
