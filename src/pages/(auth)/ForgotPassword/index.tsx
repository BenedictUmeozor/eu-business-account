import { Button, Form, Input, Segmented, message } from "antd";
import { useNavigate } from "react-router";
import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";

interface FormValues {
  email: string;
}

const ForgotPassword = () => {
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();

  const forgotPasswordMutation = useSharedMutationAction<any, FormValues>({
    url: ENDPOINTS.FORGOT_PASSWORD_LINK,
    mutationKey: ["forgot-password"],
    onSuccess: (response) => {
      message.success(response.message || "OTP sent successfully");
      navigate("/forgot-password/reset", { 
        state: { email: form.getFieldValue("email") } 
      });
    },
    onError: (error) => {
      message.error(getErrorMessage(error));
    },
  });

  const onFinish = (values: FormValues) => {
    forgotPasswordMutation.mutate(values);
  };

  return (
    <section className="ml-auto space-y-6 rounded-xl bg-white p-6 shadow-lg lg:max-w-[466px] pb-24">
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
          Forgot Password
        </h5>
        <p className="text-grey-600">
          Please enter the email you used to registered with to request a
          password reset.
        </p>
      </header>
      <Form
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        labelCol={{ className: "text-sm font-semibold text-grey-600" }}
        className="space-y-6">
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}>
          <Input className="w-full" placeholder="Enter Email" />
        </Form.Item>
        <div className="space-y-4">
          <Button
            type="primary"
            shape="round"
            htmlType="submit"
            className="w-full"
            size="large"
            loading={forgotPasswordMutation.isPending}>
            Send OTP
          </Button>
          <Button
            type="text"
            shape="round"
            htmlType="button"
            className="w-full text-primary"
            onClick={() => navigate("/login")}
            size="large">
            Go back
          </Button>
        </div>
      </Form>
    </section>
  );
};

export const Component = ForgotPassword;

export default ForgotPassword;
