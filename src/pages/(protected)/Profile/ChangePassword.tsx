import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import { Form, Input, Button, Space, message } from "antd";

interface FormValues {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

const ChangePassword = () => {
  const [form] = Form.useForm<FormValues>();

  const mutation = useSharedMutationAction<
    any,
    { old_password: string; new_password: string }
  >({
    url: ENDPOINTS.CHANGE_PASSWORD,
    onSuccess: data => {
      message.success(data?.message || "Password changed successfully");
      form.resetFields();
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const onFinish = async (values: FormValues) => {
    mutation.mutate({
      new_password: values.new_password,
      old_password: values.old_password,
    });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h3 className="text-lg font-semibold text-grey-700">Change Password</h3>
        <p className="text-grey-500">
          Update your password to keep your account secure
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
            name="old_password"
            label={
              <span className="text-grey-500 font-medium">
                Current Password
              </span>
            }
            rules={[
              { required: true, message: "Please enter your current password" },
            ]}>
            <Input.Password
              placeholder="Enter current password"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="new_password"
            label={
              <span className="text-grey-500 font-medium">New Password</span>
            }
            rules={[
              { required: true, message: "Please enter a new password" },
              { min: 8, message: "Password must be at least 8 characters" },
              {
                pattern: /[A-Z]/,
                message: "Password must have at least one uppercase letter",
              },
              {
                pattern: /[a-z]/,
                message: "Password must have at least one lowercase letter",
              },
              {
                pattern: /[!@#$%^&*(),.?":{}|<>]/,
                message: "Password must have at least one special character",
              },
            ]}>
            <Input.Password
              placeholder="Enter new password"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            name="confirm_password"
            label={
              <span className="text-grey-500 font-medium">
                Confirm Password
              </span>
            }
            dependencies={["new_password"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match")
                  );
                },
              }),
            ]}>
            <Input.Password
              placeholder="Confirm new password"
              className="w-full"
            />
          </Form.Item>

          <div className="flex justify-end mt-12">
            <Space>
              <Button
                type="primary"
                htmlType="button"
                size="large"
                shape="round"
                onClick={() => form.resetFields()}
                disabled={mutation.isPending}
                className="text-primary bg-primary-50">
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={mutation.isPending}
                size="large"
                shape="round">
                Save Changes
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
