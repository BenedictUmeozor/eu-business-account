import HeaderTitle from "@/components/ui/HeaderTitle";
import ENDPOINTS from "@/constants/endpoints";
import { useAppSelector } from "@/hooks";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import { Button, Form, Input, message } from "antd";

const AuthorizationPin = ({ next }: { next: () => void }) => {
  const [form] = Form.useForm<{ passcode: string }>();
  const session = useAppSelector(state => state.session);

  const mutation = useSharedMutationAction<any>({
    url: ENDPOINTS.SETUP_PASSCODE,
    onSuccess: data => {
      message.success(data?.message);
      next();
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const onFinish = async (values: { passcode: string }) => {
    await mutation.mutateAsync({
      email: session.user?.email,
      passcode: values.passcode,
    });
  };

  return (
    <div className="h-full w-full space-y-8 p-8">
      <HeaderTitle
        headerDescription="Set up your 4-digit authorization pin"
        headerTitle="Authorization Pin"
      />
      <Form
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        labelCol={{ className: "text-sm text-grey-600" }}
        className="space-y-3 max-w-xs">
        <Form.Item
          name="passcode"
          label={
            <p className="text-grey-600">Kindly enter your preferred pin</p>
          }
          rules={[{ required: true, message: "Please enter your passcode" }]}>
          <Input.OTP length={4} style={{ width: "100%" }} />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          shape="round"
          loading={mutation.isPending}
          className="w-48">
          Next
        </Button>
      </Form>
    </div>
  );
};

export default AuthorizationPin;
