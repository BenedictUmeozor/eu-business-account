import Loader from "@/components/app/Loader";
import ENDPOINTS from "@/constants/endpoints";
import { useAppSelector } from "@/hooks";
import useCheckOnboardingProgress from "@/hooks/use-check-onboarding-progress";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import { Input, message, Segmented, Form, Button } from "antd";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

const ConfirmPasscode = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const session = useAppSelector(state => state.session);
  const email = location.state?.email as string;

  const { checkProgress, isChecking } = useCheckOnboardingProgress(
    email,
    "/dashboard"
  );

  const mutation = useSharedMutationAction<HM.QueryResponse>({
    url: ENDPOINTS.PASSCODE_SIGNIN,
    onSuccess: data => {
      message.success(data.message);
      navigate("", { state: { from: "/login" }, replace: true });
      checkProgress.mutate({
        business_token: session.business?.business_token,
      });
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const onFinish = (values: { passcode: string }) => {
    mutation.mutate({ email, passcode: values.passcode });
  };

  useEffect(() => {
    if (!email || !session?.user) {
      navigate("/login", { replace: true });
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user, email]);

  return (
    <section className="ml-auto space-y-6 rounded-xl bg-white p-6 shadow-lg lg:max-w-[466px]">
      {isChecking && <Loader />}
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
          Confirm Passcode
        </h5>
        <p className="text-grey-600">Confirm your passcode to continue.</p>
      </header>
      <Form
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        labelCol={{ className: "text-sm text-grey-600" }}
        className="space-y-6">
        <Form.Item
          name="passcode"
          rules={[{ required: true, message: "Please input your passcode!" }]}
          className="flex items-center justify-center">
          <Input.OTP size="large" length={4} />
        </Form.Item>
        <Button
          type="primary"
          size="large"
          shape="round"
          block
          loading={mutation.isPending}
          htmlType="submit">
          Verify
        </Button>
      </Form>
    </section>
  );
};

export const Component = ConfirmPasscode;

export default ConfirmPasscode;
