import { Button, Form, FormProps, Input, Segmented, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import useMutationAction from "@/hooks/use-mutation-action";
import ENDPOINTS from "@/constants/endpoints";

interface FormValues {
  otp: string;
}

interface LocationState {
  email: string;
}

const OTPVerification = () => {
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();
  const location = useLocation();
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);

  const email = (location.state as LocationState)?.email;

  useEffect(() => {
    if (!email) {
      navigate("/get-started");
      return;
    }
  }, [email, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, isTimerActive]);

  const resendOtpMutation = useMutationAction<
    HM.QueryResponse,
    { email: string }
  >({
    url: ENDPOINTS.SEND_OTP,
    mutationKey: ["resend-otp"],
    onSuccess: data => {
      message.success(data.message);
      setTimeLeft(60);
      setIsTimerActive(true);
    },
    onError: error => {
      message.error(error?.message);
    },
  });

  const verifyOtpMutation = useMutationAction<
    HM.QueryResponse,
    { email: string; otp: string }
  >({
    url: ENDPOINTS.CONFIRM_OTP,
    mutationKey: ["verify-otp"],
    onSuccess: data => {
      message.success(data.message);
      navigate("/email-verified", {
        state: {
          email,
        },
      });
    },
    onError: error => {
      message.error(error?.message);
    },
  });

  const handleResendOtp = () => {
    if (!isTimerActive && email) {
      resendOtpMutation.mutate({ email });
    }
  };

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    if (email) {
      verifyOtpMutation.mutate({ email, otp: values.otp });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!email) return null;

  return (
    <section className="ml-auto space-y-6 rounded-xl bg-white p-6 shadow-lg lg:max-w-[466px]">
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
          We have sent a code to <span className="text-primary">{email}</span>
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
          }
          rules={[{ required: true, message: "Please enter the OTP code" }]}>
          <Input.OTP length={6} style={{ width: "100%" }} />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          shape="round"
          block
          loading={verifyOtpMutation.isPending}>
          Verify
        </Button>
      </Form>
      <div className="flex items-center justify-between">
        <Button
          type="text"
          className="!text-sm font-medium text-primary"
          onClick={handleResendOtp}
          loading={resendOtpMutation.isPending}
          disabled={isTimerActive || resendOtpMutation.isPending}>
          Resend OTP
        </Button>
        <span className="text-sm text-grey-500">{formatTime(timeLeft)}</span>
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
