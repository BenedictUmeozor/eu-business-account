import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { Button, Form, FormProps, Input, Segmented, message } from "antd";
import { Link, useNavigate } from "react-router";
import { setBusiness, setUser } from "@/lib/redux/slices/session";
import { useAppDispatch } from "@/hooks";

interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const mutation = useSharedMutationAction<HM.LoginResponse, FormValues>({
    url: ENDPOINTS.LOGIN_USER,
    mutationKey: ["login"],
    onSuccess: response => {
      dispatch(setBusiness(response.business_data));
      dispatch(setUser(response.data));
      message.success(response.message);
      navigate("/dashboard");
    },
    onError: error => {
      message.error(error?.message || "Login failed");
    },
  });

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    mutation.mutate(values);
  };

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
          Welcome Back!
        </h5>
        <p className="text-grey-600">Enter your login details </p>
      </header>
      <Form
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
        labelCol={{ className: "text-sm font-semibold text-grey-600" }}
        className="space-y-6">
        <section className="space-y-4">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}>
            <Input className="w-full" placeholder="Enter Email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}>
            <Input.Password className="w-full" placeholder="Enter Password" />
          </Form.Item>
          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-primary text-sm font-medium hover:underline">
              Forgot Password?
            </Link>
          </div>
        </section>
        <Button
          className="w-full"
          shape="round"
          type="primary"
          htmlType="submit"
          size="large"
          loading={mutation.isPending}>
          Get Started
        </Button>
        <p className="text-center font-medium text-grey-600">
          New user?{" "}
          <Link
            to="/get-started"
            className="text-primary-600 underline hover:text-primary-700">
            Sign up
          </Link>
        </p>
      </Form>
    </section>
  );
};

export const Component = Login;

export default Login;
