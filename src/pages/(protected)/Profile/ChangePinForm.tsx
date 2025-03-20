import { Form, Input, Button, Space } from "antd";

interface FormValues {
  old_pin: string;
  new_pin: string;
  confirm_pin: string;
}

const ChangePinForm = () => {
  const [form] = Form.useForm<FormValues>();

  const onFinish = async (values: FormValues) => {
    console.log(values);
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
            name="old_pin"
            label={<span className="text-grey-500 font-medium">Current PIN</span>}
            rules={[{ required: true, message: "Please enter your current PIN" }]}>
            <Input.Password placeholder="Enter current PIN" className="w-full" />
          </Form.Item>

          <Form.Item
            name="new_pin"
            label={<span className="text-grey-500 font-medium">New PIN</span>}
            rules={[{ required: true, message: "Please enter a new PIN" }]}>
            <Input.Password placeholder="Enter new PIN" className="w-full" />
          </Form.Item>

          <Form.Item
            name="confirm_pin"
            label={<span className="text-grey-500 font-medium">Confirm PIN</span>}
            dependencies={["new_pin"]}
            rules={[
              { required: true, message: "Please confirm your new PIN" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_pin") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two PINs do not match"));
                },
              }),
            ]}>
            <Input.Password placeholder="Confirm new PIN" className="w-full" />
          </Form.Item>

          <div className="flex justify-end mt-12">
            <Space>
              <Button
                type="primary"
                htmlType="button"
                size="large"
                shape="round"
                className="text-primary bg-primary-50">
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" size="large" shape="round">
                Save Changes
              </Button>
            </Space>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ChangePinForm;
