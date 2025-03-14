import { Button, Form, Input, Segmented, message } from "antd";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";

interface FormValues {
  email: string;
  password: string;
  otp: string;
}

const ResetPassword = () => {
  const [form] = Form.useForm<FormValues>();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if email is present in location state, redirect if not
    const email = location.state?.email;
    if (!email) {
      message.error("Email not found. Please try again.");
      navigate("/forgot-password");
      return;
    }
    
    // Set email field from state
    form.setFieldsValue({ email });
  }, [location.state, navigate, form]);

  // Reset password mutation
  const resetPasswordMutation = useSharedMutationAction<any, FormValues>({
    url: ENDPOINTS.RESET_ACCOUNT_PASSWORD,
    mutationKey: ["reset-password"],
    onSuccess: (response) => {
      message.success(response.message || "Password reset successful");
      navigate("/login");
    },
    onError: (error) => {
      message.error(getErrorMessage(error));
    },
  });

  // Resend OTP mutation
  const resendOtpMutation = useSharedMutationAction<any, { email: string }>({
    url: ENDPOINTS.FORGOT_PASSWORD_LINK,
    mutationKey: ["resend-otp"],
    onSuccess: (response) => {
      message.success(response.message || "OTP sent successfully");
    },
    onError: (error) => {
      message.error(getErrorMessage(error));
    },
  });

  const onFinish = (values: FormValues) => {
    resetPasswordMutation.mutate(values);
  };

  const handleResendOtp = () => {
    const email = form.getFieldValue("email");
    if (!email) {
      message.error("Email is required");
      return;
    }
    
    resendOtpMutation.mutate({ email });
  };

  return (
    <section className="ml-auto space-y-6 rounded-xl bg-white p-6 shadow-lg lg:max-w-[466px] pb-6">
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
          Reset Password
        </h5>
        <p className="text-grey-600">
          Enter your new password and the OTP sent to your email to reset your password.
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
            { required: true, message: "Email is required" },
            { type: "email", message: "Please enter a valid email" },
          ]}>
          <Input className="w-full" placeholder="Your Email" disabled />
        </Form.Item>
        
        <Form.Item
          name="otp"
          label="OTP"
          rules={[{ required: true, message: "Please enter the OTP" }]}>
          <Input className="w-full" placeholder="Enter OTP" />
        </Form.Item>
        
        <Form.Item
          name="password"
          label="New Password"
          rules={[
            { required: true, message: "Please enter your new password" },
            { min: 8, message: "Password must be at least 8 characters" }
          ]}>
          <Input.Password className="w-full" placeholder="Enter New Password" />
        </Form.Item>

        <div className="flex items-center justify-end">
          <Button 
            type="link" 
            onClick={handleResendOtp}
            loading={resendOtpMutation.isPending}
            className="text-primary text-sm font-medium p-0">
            Resend OTP
          </Button>
        </div>

        <div className="space-y-4">
          <Button
            type="primary"
            shape="round"
            htmlType="submit"
            className="w-full"
            size="large"
            loading={resetPasswordMutation.isPending}>
            Reset Password
          </Button>
          <Button
            type="text"
            shape="round"
            htmlType="button"
            className="w-full text-primary"
            onClick={() => navigate("/login")}
            size="large">
            Back to Login
          </Button>
        </div>
      </Form>
    </section>
  );
};

export const Component = ResetPassword;

export default ResetPassword;
