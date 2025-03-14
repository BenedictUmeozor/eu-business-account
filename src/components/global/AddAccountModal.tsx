import ENDPOINTS from "@/constants/endpoints";
import useAccountCurrencies from "@/hooks/use-account-currency";
import usePartnerCurrency from "@/hooks/use-partner-currency";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import {
  Button,
  Form,
  FormProps,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
} from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";

interface Payload {
  currency: string;
  account_purpose: string;
  expected_transaction_range: string;
}

interface FormValues extends Omit<Payload, "expected_transaction_range"> {
  min_range: string;
  max_range: string;
}

const AddAccountModal = forwardRef<{ openModal: () => void }>((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm<FormValues>();

  const { value, loading } = usePartnerCurrency();
  const { fetchCurrencies } = useAccountCurrencies();

  useImperativeHandle(ref, () => ({
    openModal: () => setOpen(true),
  }));

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const mutation = useSharedMutationAction<{ message: string }, Payload>({
    url: ENDPOINTS.REQUEST_ACCOUNT_CUURENCY,
    onSuccess: async data => {
      message.success(data.message);
      handleClose();
      await fetchCurrencies();
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    mutation.mutate({
      account_purpose: values.account_purpose,
      currency: values.currency,
      expected_transaction_range: `${values.min_range} - ${values.max_range}`,
    });
  };

  return (
    <Modal
      onCancel={handleClose}
      open={open}
      width={500}
      footer={null}
      title={
        <span className="text-xl font-semibold text-grey-600">Add Account</span>
      }>
      <Form
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
        className="py-6 px-2">
        <Form.Item
          name="currency"
          label={
            <span className="text-grey-500 font-medium">Select Currency</span>
          }
          rules={[{ required: true, message: "Please select a currency" }]}>
          <Select
            loading={loading}
            options={value.map(c => ({ label: c.name, value: c.currency }))}
            placeholder="Select Currency"
          />
        </Form.Item>
        <Form.Item
          name="account_purpose"
          label={
            <span className="text-grey-500 font-medium">
              Why do you need the wallet?
            </span>
          }
          rules={[{ required: true, message: "Please specify the purpose" }]}>
          <Input.TextArea placeholder="Write reason" rows={3} />
        </Form.Item>
        <Form.Item
          label={
            <span className="text-grey-500 font-medium">
              Monthly transaction range?
            </span>
          }>
          <div className="grid grid-cols-2 gap-3 w-full">
            <div>
              <Form.Item
                name="min_range"
                rules={[
                  { required: true, message: "Please enter a minimum range" },
                ]}>
                <InputNumber className="w-full" placeholder="Min" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                name="max_range"
                rules={[
                  { required: true, message: "Please enter a maximum range" },
                ]}>
                <InputNumber className="w-full" placeholder="Max" />
              </Form.Item>
            </div>
          </div>
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          shape="round"
          loading={mutation.isPending}
          className="w-full">
          Create Wallet
        </Button>
      </Form>
    </Modal>
  );
});

export default AddAccountModal;
