import useBusinessTransactionDetails from "@/hooks/use-business-transaction-details";
import { Button, Form, FormProps, Input, Select, message } from "antd";
import { useEffect } from "react";
import { useAppSelector } from "@/hooks";
import useMutationAction from "@/hooks/use-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { getErrorMessage } from "@/utils";
import Loader from "@/components/app/Loader";

interface FormValues {
  incoming_sepa_trans: string;
  average_incoming_sepa_trans: string;
  incoming_uk_trans: string;
  average_incoming_uk_trans: string;
  incoming_crossborder_trans: string;
  average_incoming_crossborder_trans: string;
  outgoing_sepa_trans: string;
  average_outgoing_sepa: string;
  outgoing_uk_trans: string;
  average_outgoing_uk_trans: string;
  outgoing_crossborder_trans: string;
  average_outgoing_crossborder_trans: string;
}

const transactionRanges = [
  { label: "€0 - €1,000", value: "0-1000" },
  { label: "€1,001 - €5,000", value: "1001-5000" },
  { label: "€5,001 - €10,000", value: "5001-10000" },
  { label: "€10,001 - €50,000", value: "10001-50000" },
  { label: "€50,001 - €100,000", value: "50001-100000" },
  { label: "€100,001+", value: "100001+" },
];

const SecondForm = ({ next }: { next: () => void }) => {
  const [form] = Form.useForm<FormValues>();
  const session = useAppSelector(state => state.session);

  const { businessTransactionDetails, isLoading, refetch } =
    useBusinessTransactionDetails(session?.user?.email);

  const mutation = useMutationAction<HM.QueryResponse>({
    url: ENDPOINTS.BUSINESS_TRANSACTION_DETAILS,
    method: "POST",
    onSuccess: data => {
      message.success(data?.message);
      next();
      refetch();
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    mutation.mutate(values);
  };

  useEffect(() => {
    if (businessTransactionDetails && !isLoading) {
      form.setFieldsValue({
        incoming_sepa_trans: businessTransactionDetails.incoming_sepa_trans,
        average_incoming_sepa_trans:
          businessTransactionDetails.average_incoming_sepa_trans,
        incoming_uk_trans: businessTransactionDetails.incoming_uk_trans,
        average_incoming_uk_trans:
          businessTransactionDetails.average_incoming_uk_trans,
        incoming_crossborder_trans:
          businessTransactionDetails.incoming_crossborder_trans,
        average_incoming_crossborder_trans:
          businessTransactionDetails.average_incoming_crossborder_trans,
        outgoing_sepa_trans: businessTransactionDetails.outgoing_sepa_trans,
        average_outgoing_sepa: businessTransactionDetails.average_outgoing_sepa,
        outgoing_uk_trans: businessTransactionDetails.outgoing_uk_trans,
        average_outgoing_uk_trans:
          businessTransactionDetails.average_outgoing_uk_trans,
        outgoing_crossborder_trans:
          businessTransactionDetails.outgoing_crossborder_trans,
        average_outgoing_crossborder_trans:
          businessTransactionDetails.average_outgoing_crossborder_trans,
      });
    }
  }, [businessTransactionDetails, isLoading, form]);

  return (
    <Form
      layout="vertical"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      className="space-y-2"
      labelCol={{ className: "text-sm text-grey-600 font-medium" }}>
      {isLoading && <Loader />}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Form.Item
          label="Number of incoming SEPA Transactions"
          name="incoming_sepa_trans"
          rules={[
            { required: true, message: "Please enter number of transactions" },
          ]}>
          <Input placeholder="Enter details" />
        </Form.Item>

        <Form.Item
          label="Average incoming SEPA transactions (€)"
          name="average_incoming_sepa_trans"
          rules={[
            {
              required: true,
              message: "Please select average transaction value",
            },
          ]}>
          <Select placeholder="Select" options={transactionRanges} />
        </Form.Item>

        <Form.Item
          label="Number of incoming UK Transactions"
          name="incoming_uk_trans"
          rules={[
            { required: true, message: "Please enter number of transactions" },
          ]}>
          <Input placeholder="Enter details" />
        </Form.Item>

        <Form.Item
          label="Average incoming UK transaction value (€)"
          name="average_incoming_uk_trans"
          rules={[
            {
              required: true,
              message: "Please select average transaction value",
            },
          ]}>
          <Select placeholder="Select" options={transactionRanges} />
        </Form.Item>

        <Form.Item
          label="Number of incoming cross-border transactions"
          name="incoming_crossborder_trans"
          rules={[
            { required: true, message: "Please enter number of transactions" },
          ]}>
          <Input placeholder="Enter details" />
        </Form.Item>

        <Form.Item
          label="Average incoming cross-border transactions (€)"
          name="average_incoming_crossborder_trans"
          rules={[
            {
              required: true,
              message: "Please select average transaction value",
            },
          ]}>
          <Select placeholder="Select" options={transactionRanges} />
        </Form.Item>

        <Form.Item
          label="Number of outgoing SEPA Transaction"
          name="outgoing_sepa_trans"
          rules={[
            { required: true, message: "Please enter number of transactions" },
          ]}>
          <Input placeholder="Enter details" />
        </Form.Item>

        <Form.Item
          label="Average outgoing SEPA Transaction value (€)"
          name="average_outgoing_sepa"
          rules={[
            {
              required: true,
              message: "Please select average transaction value",
            },
          ]}>
          <Select placeholder="Select" options={transactionRanges} />
        </Form.Item>

        <Form.Item
          label="Number of outgoing UK Transaction"
          name="outgoing_uk_trans"
          rules={[
            { required: true, message: "Please enter number of transactions" },
          ]}>
          <Input placeholder="Enter details" />
        </Form.Item>

        <Form.Item
          label="Average outgoing UK Transaction value (€)"
          name="average_outgoing_uk_trans"
          rules={[
            {
              required: true,
              message: "Please select average transaction value",
            },
          ]}>
          <Select placeholder="Select" options={transactionRanges} />
        </Form.Item>

        <Form.Item
          label="Number of outgoing cross-border transactions"
          name="outgoing_crossborder_trans"
          rules={[
            { required: true, message: "Please enter number of transactions" },
          ]}>
          <Input placeholder="Enter details" />
        </Form.Item>

        <Form.Item
          label="Average outgoing cross-border transactions (€)"
          name="average_outgoing_crossborder_trans"
          rules={[
            {
              required: true,
              message: "Please select average transaction value",
            },
          ]}>
          <Select placeholder="Select" options={transactionRanges} />
        </Form.Item>
      </div>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        shape="round"
        loading={mutation.isPending}
        className="w-48">
        Save & Continue
      </Button>
    </Form>
  );
};

export default SecondForm;
