import { useLocation, useNavigate, useParams } from "react-router";
import { Button, Form, FormProps, message, Result, Select } from "antd";

import ENDPOINTS from "@/constants/endpoints";
import countries from "@/data/codes.json";
import useRemitterPaymentMethods from "@/hooks/use-remitter-payment-methods";
import { getErrorMessage } from "@/utils";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import Beneficiary from "@/components/global/Beneficiary";
import { useEffect, useMemo } from "react";
import useRemitterDeliveryMethods from "@/hooks/use-remitter-delivery-methods";
import useRemitterSourceOfFunds from "@/hooks/use-remitter-source-of-funds";
import useRemitterTransferPurpose from "@/hooks/use-remitter-transfer-purpose";

interface FormValues {
  payment_method: string;
  delivery_method: string;
  transfer_purpose: string;
  source_of_funds: string;
}

interface TransferPayload {
  beneficiary_id: string;
  qoute_reference: string; // reference from Lock quote
  payment_method: string;
  payment_country_code: string; // alpha 2 country code of country payment is coming from
  delivery_method: string;
  source_of_funds: string;
  transfer_purpose: string;
  promo_code?: string; // promotion code optional
}

interface NextLocationState
  extends Omit<HM.ProcessRemitterResponse, "status" | "message"> {
  trans_ref: string;
}

interface LocationState extends HM.GeneratedQuote {
  promo_code: string;
}

const SendToInternationalBeneficiary = () => {
  const params = useParams() as { beneficiary: string };
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();
  const { state } = useLocation() as { state: LocationState };

  const { paymentMethods, paymentMethodsPending } = useRemitterPaymentMethods();
  const { deliveryMethods, deliveryMethodsPending } =
    useRemitterDeliveryMethods();
  const { sourceOfFunds, sourceOfFundsPending } = useRemitterSourceOfFunds();
  const { transferPurpose, transferPurposePending } =
    useRemitterTransferPurpose();

  const sourceCurrencySymbol = useMemo(() => {
    return countries.find(
      country => country.currencyCode === state.source.currency
    )?.currencySymbol;
  }, [state.source.currency]);

  const targetCurrencySymbol = useMemo(() => {
    return countries.find(
      country => country.currencyCode === state.target.currency
    )?.currencySymbol;
  }, [state.target.currency]);

  const benMutation = useSharedMutationAction<{ beneficiary: HM.Beneficiary }>({
    url: ENDPOINTS.FETCH_SINGLE_BENEFICIARY,

    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const mutation = useSharedMutationAction<
    HM.ProcessRemitterResponse,
    TransferPayload
  >({
    url: ENDPOINTS.PROCESS_REMITTANCE,
    onSuccess: data => {
      const stateData: NextLocationState = {
        payment_method: data.payment_method,
        transaction_reference: data.transaction_reference,
        trans_ref: state.reference,
      };
      navigate(
        "/dashboard/send-money/international-payments/single/hellome-money-payment",
        { state: stateData }
      );
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    mutation.mutateAsync({
      beneficiary_id: params.beneficiary,
      qoute_reference: state.reference,
      payment_method: values.payment_method,
      payment_country_code: state.country.source,
      delivery_method: values.delivery_method,
      source_of_funds: values.source_of_funds,
      transfer_purpose: values.transfer_purpose,
      promo_code: state.promo_code,
    });
  };

  useEffect(() => {
    if (!benMutation.data?.beneficiary) {
      benMutation.mutateAsync({ beneficiary_id: params.beneficiary });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [benMutation.data?.beneficiary]);

  useEffect(() => {
    if (!state) {
      navigate("/dashboard");
    }
  }, [state, navigate]);

  if (!benMutation.data?.beneficiary && !benMutation.isPending) {
    return (
      <div className="flex items-center justify-center py-16">
        <Result
          status="404"
          title="Beneficiary Not Found"
          subTitle="The beneficiary you're looking for doesn't exist or has been removed."
          extra={
            <Button
              type="primary"
              onClick={() => navigate(-1)}
              size="large"
              shape="round">
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center py-16
    ">
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <h3 className="text-xl text-grey-700 font-semibold">Payment Method</h3>
        <div className="border border-solid rounded-lg p-3 border-grey-200">
          <table className="w-full">
            <tbody>
              <tr className="[&:not(:last-child)]:mb-3">
                <th className="font-normal text-grey-500 text-base text-left w-1/2">
                  You send
                </th>
                <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                  {sourceCurrencySymbol}
                  {state?.source.amount}
                </td>
              </tr>
              <tr className="[&:not(:last-child)]:mb-3">
                <th className="font-normal text-grey-500 text-base text-left w-1/2">
                  Commission
                </th>
                <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                  {sourceCurrencySymbol}
                  {state.commission.amount}
                </td>
              </tr>
              <tr className="[&:not(:last-child)]:mb-3">
                <th className="font-normal text-grey-500 text-base text-left w-1/2">
                  Recipient gets
                </th>
                <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                  {targetCurrencySymbol}
                  {state.target.amount}
                </td>
              </tr>
              <tr className="[&:not(:last-child)]:mb-3">
                <th className="font-normal text-grey-500 text-base text-left w-1/2">
                  Payable Amount
                </th>
                <td className="font-nunito text-primary font-medium text-right w-1/2">
                  {sourceCurrencySymbol}
                  {state.source.amount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-grey-600 font-medium">
            Beneficiary Details
          </p>
          <Beneficiary beneficiary={benMutation.data?.beneficiary} />
        </div>

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
          labelCol={{ className: "text-sm text-grey-600 font-medium " }}>
          <Form.Item
            name="payment_method"
            label={
              <p className="text-sm text-grey-600 font-medium">
                Payment Method
              </p>
            }
            rules={[
              { required: true, message: "Please select payment method" },
            ]}>
            <Select
              placeholder="Select payment method"
              loading={paymentMethodsPending}
              options={paymentMethods?.map(v => ({
                label: v.name,
                value: v.code,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="delivery_method"
            label={
              <p className="text-sm text-grey-600 font-medium">
                Receipient Delivery Method
              </p>
            }
            rules={[
              { required: true, message: "Please select delivery method" },
            ]}>
            <Select
              placeholder="Select recipient delivery method"
              loading={deliveryMethodsPending}
              options={deliveryMethods?.map(v => ({
                label: v.name,
                value: v.code,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="transfer_purpose"
            label={
              <p className="text-sm text-grey-600 font-medium">
                Purpose of Transfer
              </p>
            }
            rules={[
              { required: true, message: "Please select transfer purpose" },
            ]}>
            <Select
              placeholder="Select transfer purpose"
              loading={transferPurposePending}
              options={transferPurpose?.map(v => ({
                label: v.name,
                value: v.code,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="source_of_funds"
            label={
              <p className="text-sm text-grey-600 font-medium">
                Source of Funds
              </p>
            }
            rules={[
              { required: true, message: "Please select source of funds" },
            ]}>
            <Select
              loading={sourceOfFundsPending}
              placeholder="Select source of funds"
              options={sourceOfFunds?.map(v => ({
                label: v.name,
                value: v.code,
              }))}
            />
          </Form.Item>
          <Form.Item className="flex items-center justify-center">
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              loading={mutation.isPending}
              size="large"
              className="w-48">
              Continue
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export const Component = SendToInternationalBeneficiary;

export default SendToInternationalBeneficiary;
