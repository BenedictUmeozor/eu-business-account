import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Form,
  FormProps,
  Input,
  message,
  Radio,
  Select,
  Space,
  Tag,
} from "antd";
import { memo, useState, useEffect } from "react";
import HeaderTitle from "@/components/ui/HeaderTitle";
import clsx from "clsx";
import {
  BUSINESS_INDUSTRIES,
  CURRENCIES,
  PURPOSES_OF_ACCOUNT,
  TRANSACTIONS_VOLUMES,
} from "./constants";
import countries from "@/data/codes.json";
import useMutationAction from "@/hooks/use-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { getErrorMessage } from "@/utils";
import { useAppSelector } from "@/hooks";
import useBusinessDetails from "@/hooks/use-business-details";
import useCompanyTypes from "@/hooks/use-company-types";

interface FormValues {
  business_type: string;
  business_industry: string;
  account_purpose: string;
  website: string;
  monthly_turnover: string;
  expected_currency: string[];
  source_countries: string[];
  target_countries: string[];
  partners: string;
  partners_outgoing: string;
  economic_activity: string;
  business_license: number;
  balance_sheet_exceed: string;
  company_website: string;
  bearer_shares: string;
  tax_residence: string;
  vat_number: string;
  giin_number: string;
  is_financial_institution: number;
  security_market: string;
  regulatory_entity: string;
  core_revenue_source: string;
  fatca_tax_liability: string;
  sepa_incoming_count: string;
  sepa_incoming_value: string;
  uk_incoming_count: string;
  uk_incoming_value: string;
  cross_border_incoming_count: string;
  cross_border_incoming_value: string;
  sepa_outgoing_count: string;
  sepa_outgoing_value: string;
  uk_outgoing_count: string;
  uk_outgoing_value: string;
  cross_border_outgoing_count: string;
  cross_border_outgoing_value: string;
  source_funds: string;
  source_wealth: string;
  ubo_count: string;
  main_currency: string;
  is_licensed_by_regulatory_body: number;
}

const BusinessInformation = ({
  next,
  isReview,
}: {
  next: () => void;
  isReview?: boolean;
}) => {
  const [form] = Form.useForm<FormValues>();
  const session = useAppSelector(state => state.session);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [selectedSendCountries, setSelectedSendCountries] = useState<string[]>(
    []
  );
  const [selectedReceiveCountries, setSelectedReceiveCountries] = useState<
    string[]
  >([]);

  const handleSendCountries = (code: string) => {
    const filtered = selectedSendCountries.filter(c => c !== code);
    setSelectedSendCountries(filtered);
  };

  const handleReceiveCountries = (code: string) => {
    const filtered = selectedReceiveCountries.filter(c => c !== code);
    setSelectedReceiveCountries(filtered);
  };

  const handleCurrencies = (code: string) => {
    const filtered = selectedCurrencies.filter(c => c !== code);
    setSelectedCurrencies(filtered);
  };

  const { businessDetails, isLoading, refetch } = useBusinessDetails(
    session?.user?.email
  );
  const { companyTypes, loading } = useCompanyTypes();

  const mutation = useMutationAction<HM.QueryResponse>({
    url: ENDPOINTS.BUSINESS_DETAILS,
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
    const formattedValues = {
      ...values,
      expected_currency: selectedCurrencies.join(","),
      source_countries: selectedSendCountries.join(","),
      target_countries: selectedReceiveCountries.join(","),
      business_license: values.business_license === 1 ? "YES" : "NO",
      partners_outgoing: values.partners_outgoing || "",
      economic_activity: values.economic_activity || "",
    };

    mutation.mutate(formattedValues);
  };

  useEffect(() => {
    form.setFieldValue("expected_currency", selectedCurrencies);
    form.setFieldValue("source_countries", selectedSendCountries);
    form.setFieldValue("target_countries", selectedReceiveCountries);
  }, [
    selectedCurrencies,
    selectedSendCountries,
    selectedReceiveCountries,
    form,
  ]);

  useEffect(() => {
    if (businessDetails && !isLoading) {
      const expectedCurrencies = businessDetails.expected_currency
        ? businessDetails.expected_currency.split(",")
        : [];
      const sourceCountries = businessDetails.source_countries
        ? businessDetails.source_countries.split(",")
        : [];
      const targetCountries = businessDetails.target_countries
        ? businessDetails.target_countries.split(",")
        : [];

      // Update state for the currency and country tags
      setSelectedCurrencies(expectedCurrencies);
      setSelectedSendCountries(sourceCountries);
      setSelectedReceiveCountries(targetCountries);

      form.setFieldsValue({
        business_type: businessDetails.business_type,
        business_industry: businessDetails.business_industry,
        account_purpose: businessDetails.account_purpose,
        website: businessDetails.website,
        monthly_turnover: businessDetails.monthly_turnover,
        expected_currency: expectedCurrencies,
        source_countries: sourceCountries,
        target_countries: targetCountries,
        partners: businessDetails.partners,
        partners_outgoing: businessDetails.partners_outgoing,
        economic_activity: businessDetails.economic_activity,
        business_license: businessDetails.business_license === "YES" ? 1 : 0,
      });
    }
  }, [businessDetails, isLoading, form]);

  return (
    <div className={clsx("h-full w-full space-y-8", !isReview && "p-8")}>
      <header className="flex items-center justify-between">
        <HeaderTitle
          headerDescription="Tell us more about your business"
          headerTitle="Business Information"
        />
        {/* <div className="relative flex h-16 w-16 items-center justify-center rounded-full">
          <img
            src="/images/logo.png"
            alt=""
            className="h-full w-full object-contain"
          />
          <Button
            type="primary"
            shape="circle"
            className="absolute bottom-0 right-0 bg-primary-50 outline outline-white"
            size="small"
            icon={<PencilIcon className="h-3 w-3 text-primary" />}
          />
        </div> */}
      </header>
      <section>
        <Form
          layout="vertical"
          autoComplete="off"
          form={form}
          onFinish={onFinish}
          className="space-y-2"
          initialValues={{ dial_code: "+44", phone_number: "+44" }}
          labelCol={{ className: "text-sm text-grey-600 font-medium " }}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Type of Business"
              name="business_type"
              rules={[
                { required: true, message: "Please select type of business" },
              ]}>
              <Select
                className="w-full"
                placeholder="Select Type of Business"
                showSearch
                allowClear
                loading={loading}
                disabled={isReview}
                options={companyTypes?.map(v => ({
                  label: v.company_type,
                  value: v.code,
                }))}
              />
            </Form.Item>
            <Form.Item
              label="Business Industry"
              name="business_industry"
              rules={[
                { required: true, message: "Please select business industry" },
              ]}>
              <Select
                className="w-full"
                placeholder="Select Business Industry"
                showSearch
                allowClear
                options={BUSINESS_INDUSTRIES.map(v => ({ label: v, value: v }))}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Purpose of Account"
              name="account_purpose"
              rules={[
                { required: true, message: "Please select purpose of account" },
              ]}>
              <Select
                className="w-full"
                placeholder="Select Purpose of Account"
                showSearch
                allowClear
                options={PURPOSES_OF_ACCOUNT.map(v => ({ label: v, value: v }))}
              />
            </Form.Item>
            <Form.Item
              label="Economic Activity of the Company"
              name="economic_activity">
              <Input
                className="w-full"
                placeholder="Enter Economic Activity of the Company"
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Business website/Social media link"
              name="website"
              rules={[{ type: "url", message: "Please enter a valid URL" }]}>
              <Input className="w-full" placeholder="www.xyz.com" />
            </Form.Item>
            <Form.Item
              label="Expected Transaction Volume (Monthly)"
              name="monthly_turnover"
              rules={[
                {
                  required: true,
                  message: "Please select expected transaction volume",
                },
              ]}>
              <Select
                className="w-full"
                placeholder="Select Range"
                options={TRANSACTIONS_VOLUMES.map(v => ({
                  label: v,
                  value: v,
                }))}
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
            <Form.Item
              label="Expected currencies usage"
              name="expected_currency"
              rules={[
                {
                  required: true,
                  message: "Please select at least one currency",
                },
              ]}>
              <Select
                className="w-full"
                placeholder="Select currencies"
                maxCount={5}
                maxTagCount={0}
                mode="multiple"
                value={selectedCurrencies}
                onChange={value => {
                  setSelectedCurrencies(value);
                  form.setFieldValue("expected_currency", value);
                }}
                options={CURRENCIES.map(v => ({
                  label: `${v.code} - ${v.name}`,
                  value: v.code,
                }))}
              />
              <div className="mt-1 flex flex-wrap gap-y-1">
                {selectedCurrencies.map(v => (
                  <Tag
                    color="#ebf4ff"
                    className="text-primary rounded-3xl flex items-center font-medium p-1.5"
                    closable
                    onClose={() => handleCurrencies(v)}
                    closeIcon={<XMarkIcon className="text-primary w-4" />}>
                    {v}
                  </Tag>
                ))}
              </div>
            </Form.Item>
            <Form.Item
              label="Top 5 countries you send money to"
              name="source_countries">
              <Select
                className="w-full"
                placeholder="Select Countries"
                maxCount={5}
                maxTagCount={0}
                mode="multiple"
                value={selectedSendCountries}
                onChange={value => {
                  setSelectedSendCountries(value);
                  form.setFieldValue("source_countries", value);
                }}
                options={countries.map(v => ({
                  label: (
                    <Space>
                      <img
                        src={v.flag}
                        alt={v.countryName}
                        className="w-6 h-6 rounded-full"
                      />
                      {v.countryName}
                    </Space>
                  ),
                  value: v.countryCode,
                }))}
              />
              <div className="mt-1 flex flex-wrap gap-y-1">
                {selectedSendCountries?.map(code => {
                  const country = countries.find(c => c.countryCode === code)!;
                  return (
                    <Tag
                      color="#ebf4ff"
                      className="text-primary rounded-3xl flex items-center font-medium p-1.5"
                      closable
                      onClose={() => handleSendCountries(code)}
                      closeIcon={<XMarkIcon className="text-primary w-4" />}>
                      <Space>
                        <img
                          src={country.flag}
                          alt={country.countryCode}
                          className="h-3 w-3 rounded-full"
                        />
                        {country.countryCode}
                      </Space>
                    </Tag>
                  );
                })}
              </div>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
            <Form.Item
              label="Top 5 countries you receive money from"
              name="target_countries">
              <Select
                className="w-full"
                placeholder="Select Countries"
                maxCount={5}
                maxTagCount={0}
                mode="multiple"
                value={selectedReceiveCountries}
                onChange={value => {
                  setSelectedReceiveCountries(value);
                  form.setFieldValue("target_countries", value);
                }}
                options={countries.map(v => ({
                  label: (
                    <Space>
                      <img
                        src={v.flag}
                        alt={v.countryName}
                        className="w-6 h-6 rounded-full"
                      />
                      {v.countryName}
                    </Space>
                  ),
                  value: v.countryCode,
                }))}
              />
              <div className="mt-1 flex flex-wrap gap-y-1">
                {selectedReceiveCountries?.map(code => {
                  const country = countries.find(c => c.countryCode === code)!;
                  return (
                    <Tag
                      color="#ebf4ff"
                      className="text-primary rounded-3xl flex items-center font-medium p-1.5"
                      closable
                      onClose={() => handleReceiveCountries(code)}
                      closeIcon={<XMarkIcon className="text-primary w-4" />}>
                      <Space>
                        <img
                          src={country.flag}
                          alt={country.countryCode}
                          className="h-3 w-3 rounded-full"
                        />
                        {country.countryCode}
                      </Space>
                    </Tag>
                  );
                })}
              </div>
            </Form.Item>
            <Form.Item
              name="partners"
              label="Top 5 transacting partners - Incoming">
              <Input
                className="w-full"
                placeholder="Enter names and separate with commas"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              name="partners_outgoing"
              label="Top 5 transacting partners - Outgoing">
              <Input
                className="w-full"
                placeholder="Enter names and separate with commas"
              />
            </Form.Item>
            <Form.Item
              label="Does your company require a license to operate?"
              name="business_license"
              rules={[
                {
                  required: true,
                  message: "Please select if license is required",
                },
              ]}>
              <Radio.Group className="w-full">
                <div className="grid grid-cols-2 gap-2">
                  <Radio
                    value={1}
                    className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                    Yes
                  </Radio>
                  <Radio
                    value={0}
                    className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                    No
                  </Radio>
                </div>
              </Radio.Group>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Does you annual balance sheet exceed €2 million?"
              name="balance_sheet_exceed">
              <Input className="w-full" placeholder="Enter details" />
            </Form.Item>
            <Form.Item label="Company website" name="company_website">
              <Input className="w-full" placeholder="Enter details" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Does the company documents e.g (M&A's) allow for the issuance of bearer shares"
              name="bearer_shares">
              <Input className="w-full" placeholder="Enter details" />
            </Form.Item>
            <Form.Item label="Tax residence country" name="tax_residence">
              <Select
                className="w-full"
                placeholder="Select country"
                showSearch
                allowClear
                options={countries.map(v => ({
                  label: v.countryName,
                  value: v.countryCode,
                }))}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label="VAT Number" name="vat_number">
              <Input className="w-full" placeholder="Enter VAT Number" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Global Intermediary Identification Number (GIIN)"
              name="giin_number">
              <Input className="w-full" placeholder="Enter Details" />
            </Form.Item>
            <Form.Item
              label="Is the company licensed by a regulatory body (Where applicable)"
              name="is_licensed_by_regulatory_body">
              <Radio.Group className="w-full">
                <div className="grid grid-cols-2 gap-2">
                  <Radio
                    value={1}
                    className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                    Yes
                  </Radio>
                  <Radio
                    value={0}
                    className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                    No
                  </Radio>
                </div>
              </Radio.Group>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Is your business a financial institution"
              name="is_financial_institution">
              <Radio.Group className="w-full">
                <div className="grid grid-cols-2 gap-2">
                  <Radio
                    value={1}
                    className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                    Yes
                  </Radio>
                  <Radio
                    value={0}
                    className="flex items-center justify-between rounded-lg border border-solid border-grey-200 bg-grey-50 p-2">
                    No
                  </Radio>
                </div>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Established security market where corporation is traded regularly"
              name="security_market">
              <Input className="w-full" placeholder="Enter details" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Regulatory entity (regularly traded entity/corporation)"
              name="regulatory_entity">
              <Input className="w-full" placeholder="Enter details" />
            </Form.Item>
            <Form.Item
              label="Core source of company revenue"
              name="core_revenue_source">
              <Input className="w-full" placeholder="Enter details" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="FATCA - USA Tax liability US Indica (For US Businesses)"
              name="fatca_tax_liability">
              <Input className="w-full" placeholder="Enter details" />
            </Form.Item>
            <Form.Item
              label="Expected currencies usage"
              name="expected_currencies">
              <Select
                className="w-full"
                placeholder="Select currencies"
                mode="multiple"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Number of incoming SEPA Transactions"
              name="sepa_incoming_count">
              <Input className="w-full" placeholder="Enter details" />
            </Form.Item>
            <Form.Item
              label="Average incoming SEPA transactions (€)"
              name="sepa_incoming_value">
              <Select className="w-full" placeholder="Select" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Number of incoming UK Transactions"
              name="uk_incoming_count">
              <Input className="w-full" placeholder="Enter details" />
            </Form.Item>
            <Form.Item
              label="Average incoming UK transaction value (€)"
              name="uk_incoming_value">
              <Select className="w-full" placeholder="Select" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Number of incoming cross-border transactions"
              name="cross_border_incoming_count">
              <Input className="w-full" placeholder="Enter details" />
            </Form.Item>
            <Form.Item
              label="Average incoming cross-border transactions"
              name="cross_border_incoming_value">
              <Select className="w-full" placeholder="Select" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Number of outgoing SEPA Transaction"
              name="sepa_outgoing_count">
              <Input className="w-full" placeholder="Enter details" />
            </Form.Item>
            <Form.Item
              label="Average outgoing SEPA Transaction value (€)"
              name="sepa_outgoing_value">
              <Select className="w-full" placeholder="Select" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Number of outgoing UK Transaction"
              name="uk_outgoing_count">
              <Input className="w-full" placeholder="Enter details" />
            </Form.Item>
            <Form.Item
              label="Average outgoing UK Transaction value (€)"
              name="uk_outgoing_value">
              <Select className="w-full" placeholder="Select countries" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="Number of outgoing cross-border transactions"
              name="cross_border_outgoing_count">
              <Input className="w-full" placeholder="Enter details" />
            </Form.Item>
            <Form.Item
              label="Average outgoing cross-border transactions (€)"
              name="cross_border_outgoing_value">
              <Select className="w-full" placeholder="Select" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label="Source of funds" name="source_funds">
              <Input className="w-full" placeholder="Enter source of funds" />
            </Form.Item>
            <Form.Item label="Source of wealth" name="source_wealth">
              <Input className="w-full" placeholder="Enter source of wealth" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label="Number of UBOs" name="ubo_count">
              <Select className="w-full" placeholder="Select" />
            </Form.Item>
            <Form.Item label="Main currency" name="main_currency">
              <Select className="w-full" placeholder="Select currency" />
            </Form.Item>
          </div>
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            shape="round"
            loading={mutation.isPending}
            className="w-48 text-base">
            {isReview ? "Confirm" : "Save & Continue"}
          </Button>
        </Form>
      </section>
    </div>
  );
};

export default memo(BusinessInformation);
