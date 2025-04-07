import { Button, Form, FormProps, Input, message, Select, Spin } from "antd";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { useCallback, useEffect, useMemo, useState } from "react";
import nations from "@/data/codes.json";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { formatPhoneNumber, getErrorMessage } from "@/utils";
import useNgBanks from "@/hooks/use-ng-banks";
import useResolveBankDetails from "@/hooks/use-resolve-bank-details";
import useSepaCountries from "@/hooks/use-sepa-countries";

interface FormValues {
  first_name: string;
  last_name: string;
  beneficiary_name?: string;
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
  routing_number?: string;
}

const IndividualForm = ({
  setOpen,
  currency,
  action,
  isRemitter = false,
  targetCountry,
}: {
  setOpen: () => void;
  currency?: string;
  action?: () => Promise<void>;
  isRemitter?: boolean;
  targetCountry?: string;
}) => {
  const [benName, setBenName] = useState<string>();
  const [form] = Form.useForm<FormValues>();
  const bankId = Form.useWatch("bank_name", form);
  const acc_no = Form.useWatch("account_number", form);

  const { banks, loading: bankLoading } = useNgBanks();
  const {
    data,
    loading: detailsLoading,
    resolveBankDetails,
  } = useResolveBankDetails();

  const mainCurrency = useMemo(() => {
    return nations.find(c => c.currencyCode === currency);
  }, [currency]);

  const { countries, loading: sepaLoading } = useSepaCountries();

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
      category: isRemitter ? "Remitter" : "Banking",
      currency,
      bank_country: values.ben_country,
      phone_number: formatPhoneNumber(values.phone_number, values.phone_code),
    });
  };

  useEffect(() => {
    if (targetCountry) {
      const country = nations.find(c => c.countryCode === targetCountry);
      if (country) {
        form.setFieldsValue({
          ben_country: country.countryCode,
          phone_code: country.callingCode,
        });
      }
      return;
    }

    if (currency === "USD") {
      form.setFieldsValue({ 
        ben_country: "US",
        phone_code: "+1" 
      });
      return;
    }
    if (currency === "GBP") {
      form.setFieldsValue({ 
        ben_country: "GB",
        phone_code: "+44" 
      });
      return;
    }
    if (currency === "CAD") {
      form.setFieldsValue({ 
        ben_country: "CA",
        phone_code: "+1" 
      });
      return;
    }
    if (currency === "AED") {
      form.setFieldsValue({ 
        ben_country: "AE",
        phone_code: "+971" 
      });
      return;
    }
    if (currency === "EUR") {
      form.setFieldsValue({ ben_country: "" });
      return;
    }
    const c = nations.find(
      countryItem => countryItem.currencyCode === currency
    );
    if (c && currency !== "EUR") {
      form.setFieldsValue({ 
        ben_country: c.countryCode,
        phone_code: c.callingCode
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, open]);

  useEffect(() => {
    if (
      currency === "NGN" &&
      bankId &&
      acc_no?.length === 10 &&
      !detailsLoading &&
      banks.length > 0 &&
      !data
    ) {
      const bankCode = banks.find(b => b.id === Number(bankId))!.code;
      resolveBankDetails(acc_no, bankCode);
    }

    if (!detailsLoading && data) {
      if (!data.beneficiary_name) {
        form.setFields([
          {
            name: "account_number",
            errors: [data?.message],
          },
        ]);
        return;
      }
      form.setFieldValue("beneficiary_name", data.beneficiary_name);
      setBenName(data.beneficiary_name);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, acc_no, bankId, banks, data, detailsLoading]);

  return (
    <Form
      layout="vertical"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      className="space-y-6"
      initialValues={{
        phone_code: mainCurrency?.callingCode,
        ben_country: mainCurrency?.countryCode,
      }}>
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
          loading={sepaLoading && currency === "EUR"}
          options={
            currency !== "EUR"
              ? nations.map(c => ({
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
                }))
              : countries.map(c => ({
                  label: (
                    <div className="flex items-center gap-2">
                      <img
                        src={ENDPOINTS.FLAG_URL(c.iso.toLowerCase())}
                        alt={c.iso}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <span className="text-grey-700">
                        {c.country} ({c.iso})
                      </span>
                    </div>
                  ),
                  value: c.iso,
                }))
          }
          disabled={currency !== "EUR" || isRemitter}
          showSearch
          virtual={false}
          allowClear
        />
      </Form.Item>
      <section className="space-y-4">
        <p className="text-center text-sm text-grey-500 font-medium">
          Beneficiary Account Details
        </p>

        {currency !== "NGN" ? (
          <>
            <Form.Item
              name="first_name"
              label={
                <span className="text-sm text-grey-500 font-medium">
                  First Name
                </span>
              }
              rules={[{ required: true, message: "First name is required" }]}>
              <Input placeholder="e.g John" className="w-full" />
            </Form.Item>
            <Form.Item
              name="last_name"
              label={
                <span className="text-sm text-grey-500 font-medium">
                  Last Name
                </span>
              }
              rules={[{ required: true, message: "Last name is required" }]}>
              <Input placeholder="e.g Doe" className="w-full" />
            </Form.Item>
          </>
        ) : (
          // <Form.Item
          //   name="beneficiary_name"
          //   label={
          //     <span className="text-sm text-grey-500 font-medium">
          //       Beneficiary Name
          //     </span>
          //   }
          //   rules={[
          //     { required: true, message: "Beneficiary name is required" },
          //   ]}>
          //   <Input placeholder="Enter full name" className="w-full" />
          // </Form.Item>
          <></>
        )}

        {(currency === "EUR" ||
          currency === "USD" ||
          currency === "CAD" ||
          currency === "AED") && (
          <Form.Item
            name="bic"
            label={
              <span className="text-sm text-grey-500 font-medium">
                {currency === "EUR" ? "BIC" : "BIC/SWIFT"}
              </span>
            }
            rules={[
              {
                required: true,
                message: `${currency === "EUR" ? "BIC" : "BIC/SWIFT"} code is required`,
              },
            ]}>
            <Input
              placeholder={`Enter ${currency === "EUR" ? "BIC" : "BIC/SWIFT"} code`}
              className="w-full"
            />
          </Form.Item>
        )}

        {(currency === "EUR" ||
          currency === "USD" ||
          currency === "CAD" ||
          currency === "AED") && (
          <Form.Item
            name="iban"
            label={
              <span className="text-sm text-grey-500 font-medium">IBAN</span>
            }
            rules={[
              { required: currency === "EUR", message: "IBAN is required" },
            ]}>
            <Input placeholder="Enter IBAN" className="w-full" />
          </Form.Item>
        )}

        {currency === "GBP" && (
          <>
            <Form.Item
              name="account_number"
              label={
                <span className="text-sm text-grey-500 font-medium">
                  Account Number
                </span>
              }
              rules={[
                { required: true, message: "Account number is required" },
              ]}>
              <Input placeholder="Enter Account Number" className="w-full" />
            </Form.Item>
            <Form.Item
              name="sort_code"
              label={
                <span className="text-sm text-grey-500 font-medium">
                  Sort Code
                </span>
              }
              rules={[{ required: true, message: "Sort code is required" }]}>
              <Input placeholder="Enter Sort Code" className="w-full" />
            </Form.Item>
          </>
        )}

        {currency === "NGN" && (
          <>
            <Form.Item
              name="account_number"
              label={
                <span className="text-sm text-grey-500 font-medium">
                  Account Number
                </span>
              }
              rules={[
                { required: true, message: "Account number is required" },
              ]}>
              <Input placeholder="Enter Account Number" className="w-full" />
            </Form.Item>
            <Form.Item
              name="bank_name"
              label={
                <span className="text-sm text-grey-500 font-medium">
                  Bank Name
                </span>
              }
              rules={[{ required: true, message: "Bank name is required" }]}>
              <Select
                placeholder="Select Bank"
                className="w-full"
                loading={bankLoading}
                options={banks.map(b => ({ label: b.name, value: b.id }))}
                showSearch
                allowClear
              />
              {detailsLoading && <Spin size="small" />}
              {benName && !detailsLoading && (
                <span className="text-grey">{benName}</span>
              )}
            </Form.Item>
          </>
        )}

        {currency === "USD" && (
          <Form.Item
            name="routing_number"
            label={
              <span className="text-sm text-grey-500 font-medium">
                Routing Number
              </span>
            }>
            <Input placeholder="Enter Routing Number" className="w-full" />
          </Form.Item>
        )}

        {currency === "USD" ||
          currency === "CAD" ||
          (currency === "AED" && (
            <>
              <Form.Item
                name="bank_name"
                label={
                  <span className="text-sm text-grey-500 font-medium">
                    Bank Name
                  </span>
                }
                rules={[{ required: true, message: "Bank name is required" }]}>
                <Input placeholder="Enter Bank" className="w-full" />
              </Form.Item>
              <Form.Item
                name="ben_city"
                label={
                  <span className="text-sm text-grey-500 font-medium">
                    City
                  </span>
                }
                rules={[{ required: true, message: "City is required" }]}>
                <Input placeholder="Enter City" className="w-full" />
              </Form.Item>
              <Form.Item
                name="ben_address"
                label={
                  <span className="text-sm text-grey-500 font-medium">
                    Address
                  </span>
                }
                rules={[{ required: true, message: "Address is required" }]}>
                <Input placeholder="Enter Address" className="w-full" />
              </Form.Item>
            </>
          ))}

        <PhoneNumberInput
          dialCodeName="phone_code"
          label="Mobile Number"
          name="phone_number"
          setFieldsValue={setFieldsValue}
          setPhoneValue={setPhoneValue}
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
