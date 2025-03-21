import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import { Form, Input, Button, Space, Divider, message } from "antd";

interface FormValues {
  old_passcode: string;
  new_passcode: string;
  confirm_passcode: string;
}

const ChangePinForm = ({ reset }: { reset: () => void }) => {
  const [form] = Form.useForm<FormValues>();

  const mutation = useSharedMutationAction<
    any,
    { old_passcode: string; new_passcode: string }
  >({
    url: ENDPOINTS.CHANGE_PIN,
    onSuccess: data => {
      message.success(data?.message || "Pin changed successfully");
      form.resetFields();
      reset();
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const onFinish = async (values: FormValues) => {
    mutation.mutate({
      new_passcode: values.new_passcode,
      old_passcode: values.old_passcode,
    });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h3 className="text-lg font-semibold text-grey-700">Change Pin</h3>
        <p className="text-grey-500">
          Update your PIN for enhanced account security
        </p>
      </header>
      <div className="max-w-3xl">
        <Form
          layout="horizontal"
          form={form}
          onFinish={onFinish}
          wrapperCol={{ span: 14 }}
          labelCol={{ span: 10 }}
          labelAlign="left">
          <Form.Item
            name="old_passcode"
            label={
              <span className="text-grey-500 font-medium">Current PIN</span>
            }
            rules={[
              { required: true, message: "Please enter your current PIN" },
            ]}>
            <Input.Password
              placeholder="Enter current PIN"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="new_passcode"
            label={<span className="text-grey-500 font-medium">New PIN</span>}
            rules={[{ required: true, message: "Please enter a new PIN" }]}>
            <Input.Password placeholder="Enter new PIN" className="w-full" />
          </Form.Item>

          <Form.Item
            name="confirm_passcode"
            label={
              <span className="text-grey-500 font-medium">Confirm PIN</span>
            }
            dependencies={["new_passcode"]}
            rules={[
              { required: true, message: "Please confirm your new PIN" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_passcode") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two PINs do not match"));
                },
              }),
            ]}>
            <Input.Password placeholder="Confirm new PIN" className="w-full" />
          </Form.Item>
        </Form>
      </div>
      <Divider />
      <div className="flex justify-end mt-12">
        <Space>
          <Button
            type="primary"
            onClick={() => form.resetFields()}
            size="large"
            disabled={mutation.isPending}
            shape="round"
            className="text-primary bg-primary-50">
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={mutation.isPending}
            size="large"
            shape="round">
            Save Changes
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default ChangePinForm;
