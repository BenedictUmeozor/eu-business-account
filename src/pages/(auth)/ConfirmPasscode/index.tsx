import ENDPOINTS from "@/constants/endpoints";
import { useAppDispatch, useAppSelector } from "@/hooks";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { setSignIn, setUser } from "@/lib/redux/slices/session";
import { getErrorMessage } from "@/utils";
import { Input, message, Segmented, Form, Button } from "antd";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

const ConfirmPasscode = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const session = useAppSelector(state => state.session);
  const email = location.state?.email as string;

  const mutation = useSharedMutationAction<HM.LoginResponse>({
    url: ENDPOINTS.PASSCODE_SIGNIN,
    onSuccess: response => {
      message.success("Successful");
      dispatch(
        setUser({
          user_token: session.user?.user_token ?? "",
          fname: session.user?.fname ?? "",
          lname: session.user?.lname ?? "",
          email: session.user?.email ?? "",
          country: session.user?.country ?? "",
          account_type: session.user?.account_type ?? "",
          is_existing: session.user?.is_existing,
          existing_onboarding_status: session.user?.existing_onboarding_status,
          jwt: response.data.jwt,
        })
      );
      dispatch(setSignIn());
      navigate("/dashboard", { state: { from: "/login" }, replace: true });
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
