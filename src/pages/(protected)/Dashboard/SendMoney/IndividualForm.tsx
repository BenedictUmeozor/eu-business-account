import { Button, Form, FormProps, Input, message, Select } from "antd";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { useCallback, useEffect } from "react";
import { CURRENCIES } from "@/constants/currencies";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { formatPhoneNumber, getErrorMessage } from "@/utils";
import { US_BANKS } from "@/constants";

interface FormValues {
  first_name: string;
  last_name: string;
  account_number: string;
  sort_code: string;
  receiver_email: string;
  phone_number: string;
  phone_code: string;
  ben_country: string;
  ben_city?: string;
  ben_address?: string;
  iban?: string;
  bank_name?: string;
  bic?: string;
}

const IndividualForm = ({
  setOpen,
  currency,
  action,
}: {
  setOpen: () => void;
  currency?: string;
  action?: () => Promise<void>;
}) => {
  const [form] = Form.useForm<FormValues>();

  // const modalRef = useRef<PinRefObject>(null);

  const mutation = useSharedMutationAction<any>({
    url: ENDPOINTS.SAVE_BENEFICIARY,
    onSuccess: async data => {
      message.success(data?.message);
      setOpen();
      form.resetFields();
      if (action) {
        await action();
      }
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const setFieldsValue = useCallback(
    ({ dialCode, phoneNumber }: { dialCode: string; phoneNumber: string }) => {
      form.setFieldsValue({ phone_code: dialCode, phone_number: phoneNumber });
    },
    [form]
  );

  const setPhoneValue = useCallback(
    (phoneNumber: string) => {
      form.setFieldsValue({ phone_number: phoneNumber });
    },
    [form]
  );

  const onFinish: FormProps["onFinish"] = values => {
    mutation.mutate({
      ...values,
      type: "Personal",
      category: "Banking",
      currency,
      bank_country: values.ben_country,
      phone_number: formatPhoneNumber(values.phone_number, values.phone_code),
    });
  };

  // const handleFinish = () => {
  //   modalRef.current?.closeModal();
  //   form.resetFields();
  //   setOpen();
  // };

  useEffect(() => {
    const c = CURRENCIES.find(
      currencyItem => currencyItem.currencyCode === currency
    );
    if (c) {
      form.setFieldsValue({ ben_country: c.countryCode });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, open]);

  return (
    <Form
      layout="vertical"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      className="space-y-6"
      initialValues={{ phone_code: "+44", ben_country: "GB" }}>
      <Form.Item
        name="ben_country"
        label={
          <span className="text-sm text-grey-500 font-medium">
            Recipient Country
          </span>
        }>
        <Select
          className="w-full"
          placeholder="Select Country"
          options={CURRENCIES.map(c => ({
            label: (
              <div className="flex items-center gap-2">
                <img
                  src={c.flag}
                  alt={c.countryCode}
                  className="h-6 w-6 rounded-full object-cover"
                />
                <span className="text-grey-700">
                  {c.countryName} ({c.currencyCode})
                </span>
              </div>
            ),
            value: c.countryCode,
          }))}
          showSearch
          allowClear
        />
      </Form.Item>
      <section className="space-y-4">
        <p className="text-center text-sm text-grey-500 font-medium">
          Beneficiary Account Details
        </p>
        <Form.Item
          name="first_name"
          label={
            <span className="text-sm text-grey-500 font-medium">
              First Name
            </span>
          }>
          <Input placeholder="e.g John Doe" className="w-full" />
        </Form.Item>
        <Form.Item
          name="last_name"
          label={
            <span className="text-sm text-grey-500 font-medium">Last Name</span>
          }>
          <Input placeholder="e.g Doe" className="w-full" />
        </Form.Item>
        {(currency === "EUR" || currency === "USD") && (
          <Form.Item
            name="bic"
            label={
              <span className="text-sm text-grey-500 font-medium">BIC/SWIFT Code</span>
            }
            rules={[{ required: true, message: "BIC/SWIFT code is required" }]}>
            <Input placeholder="Enter BIC/SWIFT code" className="w-full" />
          </Form.Item>
        )}
        <Form.Item
          name="iban"
          label={
            <span className="text-sm text-grey-500 font-medium">IBAN</span>
          }
          rules={[{ required: currency === "EUR", message: "IBAN is required for EUR transfers" }]}>
          <Input placeholder="Enter IBAN" className="w-full" />
        </Form.Item>
        {currency !== "EUR" && (
          <>
            <Form.Item
              name="account_number"
              label={
                <span className="text-sm text-grey-500 font-medium">
                  Account Number
                </span>
              }>
              <Input placeholder="Enter Account Number" className="w-full" />
            </Form.Item>
            <Form.Item
              name="sort_code"
              label={
                <span className="text-sm text-grey-500 font-medium">Sort Code</span>
              }>
              <Input placeholder="Enter Sort Code" className="w-full" />
            </Form.Item>
          </>
        )}
        {currency === "USD" && (
          <>
            <Form.Item
              name="bank_name"
              label={
                <span className="text-sm text-grey-500 font-medium">Bank Name</span>
              }
              rules={[{ required: true, message: "Bank name is required" }]}>
              <Select
                placeholder="Select Bank"
                className="w-full"
                options={US_BANKS}
                showSearch
                optionFilterProp="label"
              />
            </Form.Item>
            <Form.Item
              name="ben_city"
              label={
                <span className="text-sm text-grey-500 font-medium">City</span>
              }
              rules={[{ required: true, message: "City is required" }]}>
              <Input placeholder="Enter City" className="w-full" />
            </Form.Item>
            <Form.Item
              name="ben_address"
              label={
                <span className="text-sm text-grey-500 font-medium">Address</span>
              }
              rules={[{ required: true, message: "Address is required" }]}>
              <Input placeholder="Enter Address" className="w-full" />
            </Form.Item>
          </>
        )}
        <PhoneNumberInput
          dialCodeName="phone_code"
          label="Mobile Number"
          name="phone_number"
          setFieldsValue={setFieldsValue}
          setPhoneValue={setPhoneValue}
          array={CURRENCIES}
          phoneNumberRules={[
            { required: true, message: "Phone Number is required" },
          ]}
          currency={currency}
        />
        <Form.Item
          name="receiver_email"
          label={
            <span className="text-sm text-grey-500 font-medium">Email</span>
          }>
          <Input
            type="email"
            placeholder="Enter your email"
            className="w-full"
          />
        </Form.Item>
      </section>
      <Button
        type="primary"
        htmlType="submit"
        size="large"
        shape="round"
        block
        loading={mutation.isPending}>
        Add Beneficiary
      </Button>
    </Form>
  );
};
export default IndividualForm;
