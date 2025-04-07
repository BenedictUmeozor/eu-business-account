import ENDPOINTS from "@/constants/endpoints";
import { useAppSelector } from "@/hooks";
import useBusinessDetails from "@/hooks/use-business-details";
import useCompanyTypes from "@/hooks/use-company-types";
import useMutationAction from "@/hooks/use-mutation-action";
import { getErrorMessage } from "@/utils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Form,
  FormProps,
  Input,
  InputNumber,
  message,
  Radio,
  Select,
  Space,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import {
  BUSINESS_INDUSTRIES,
  CURRENCIES,
  PURPOSES_OF_ACCOUNT,
  TRANSACTIONS_VOLUMES,
} from "../constants";
import countries from "@/data/codes.json";
import useSourceOfFunds from "@/hooks/use-source-of-funds";
import useSourceOfWealth from "@/hooks/use-source-of-weath";
import Loader from "@/components/app/Loader";

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
  annual_balance_sheet_exceed_2m: number;
  product_services_sold: string;
  is_publicly_listed: number;
  allows_for_issuance_share: number;
  tax_residence_country: string;
  vat_number: string;
  is_financial_institution: number;
  giin: string;
  established_security_market: string;
  is_company_licensed_by_regulatory: number;
  regulatory_entity: string;
  core_source_of_revenue: string;
  fatca: string;
  source_of_funds: string;
  source_of_wealth: string;
  number_of_ubo: string;
  main_currency: string;
}

const FirstForm = ({
  next,
  isReview,
}: {
  next: () => void;
  isReview: boolean;
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
  const { isPending: fundsPending, sourcesOfFunds } = useSourceOfFunds();
  const { isPending: wealthPending, sourcesOfWealth } = useSourceOfWealth();

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
      annual_balance_sheet_exceed_2m:
        values.annual_balance_sheet_exceed_2m === 1 ? "YES" : "NO",
      is_publicly_listed: values.is_publicly_listed === 1 ? "YES" : "NO",
      allows_for_issuance_share:
        values.allows_for_issuance_share === 1 ? "YES" : "NO",
      is_financial_institution:
        values.is_financial_institution === 1 ? "YES" : "NO",
      is_company_licensed_by_regulatory:
        values.is_company_licensed_by_regulatory === 1 ? "YES" : "NO",
      partners_outgoing: values.partners_outgoing || "",
      economic_activity: values.economic_activity || "",
      product_services_sold: values.product_services_sold || "",
      vat_number: values.vat_number || "",
      giin: values.giin || "",
      established_security_market: values.established_security_market || "",
      regulatory_entity: values.regulatory_entity || "",
      core_source_of_revenue: values.core_source_of_revenue || "",
      fatca: values.fatca || "",
      number_of_ubo: values.number_of_ubo?.toString() || "",
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
        business_license: businessDetails.business_license
          ? businessDetails.business_license === "YES"
            ? 1
            : 0
          : undefined,
        annual_balance_sheet_exceed_2m:
          businessDetails.annual_balance_sheet_exceed_2m
            ? businessDetails.annual_balance_sheet_exceed_2m === "YES"
              ? 1
              : 0
            : undefined,
        product_services_sold: businessDetails.product_services_sold,
        is_publicly_listed: businessDetails.is_publicly_listed
          ? businessDetails.is_publicly_listed === "YES"
            ? 1
            : 0
          : undefined,
        allows_for_issuance_share: businessDetails.allows_for_issuance_share
          ? businessDetails.allows_for_issuance_share === "YES"
            ? 1
            : 0
          : undefined,
        tax_residence_country: businessDetails.tax_residence_country,
        vat_number: businessDetails.vat_number,
        is_financial_institution: businessDetails.is_financial_institution
          ? businessDetails.is_financial_institution === "YES"
            ? 1
            : 0
          : undefined,
        giin: businessDetails.giin,
        established_security_market:
          businessDetails.established_security_market,
        is_company_licensed_by_regulatory:
          businessDetails.is_company_licensed_by_regulatory
            ? businessDetails.is_company_licensed_by_regulatory === "YES"
              ? 1
              : 0
            : undefined,
        regulatory_entity: businessDetails.regulatory_entity,
        core_source_of_revenue: businessDetails.core_source_of_revenue,
        fatca: businessDetails.fatca,
        source_of_funds: businessDetails.source_of_funds,
        source_of_wealth: businessDetails.source_of_wealth,
        number_of_ubo: businessDetails.number_of_ubo,
        main_currency: businessDetails.main_currency,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessDetails, isLoading]);

  return (
    <Form
      layout="vertical"
      autoComplete="off"
      form={form}
      onFinish={onFinish}
      className="space-y-2"
      labelCol={{ className: "text-sm text-grey-600 font-medium " }}>
      {isLoading && <Loader />}
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
          rules={[
            { required: true, message: "Please enter website" },
            { type: "url", message: "Please enter a valid URL" },
          ]}>
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
                    src={v?.flag}
                    alt={v?.countryName}
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
                      src={country?.flag}
                      alt={country?.countryCode}
                      className="h-3 w-3 rounded-full"
                    />
                    {country?.countryCode}
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
                    src={v?.flag}
                    alt={v?.countryName}
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
                      src={country?.flag}
                      alt={country?.countryCode}
                      className="h-3 w-3 rounded-full"
                    />
                    {country?.countryCode}
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
          name="annual_balance_sheet_exceed_2m"
          rules={[
            {
              required: true,
              message: "Please select one",
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
        <Form.Item
          label="Describe services/Product sold"
          name="product_services_sold"
          rules={[
            {
              required: true,
              message: "Please describe services/products sold",
            },
          ]}>
          <Input className="w-full" placeholder="Enter details" />
        </Form.Item>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Form.Item
          label="Is your company publicly listed"
          name="is_publicly_listed"
          rules={[
            {
              required: true,
              message: "Please select if publicly listed",
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
        <Form.Item
          label="Does the company documents e.g (M&A’s) allow for the issuance of bearer shares"
          name="allows_for_issuance_share"
          rules={[
            {
              required: true,
              message: "Please select if bearer shares are allowed",
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
          label="VAT Number"
          name="vat_number"
          rules={[{ required: true, message: "Please enter VAT number" }]}>
          <Input className="w-full" placeholder="Enter VAT Number" />
        </Form.Item>
        <Form.Item
          label="Tax residence country"
          name="tax_residence_country"
          rules={[
            { required: true, message: "Please select tax residence country" },
          ]}>
          <Select
            className="w-full"
            placeholder="Select country"
            showSearch
            allowClear
            filterOption={(input, option) => {
              return (
                (option?.label as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase()) || false
              );
            }}
            options={countries.map(v => ({
              label: v.countryName,
              value: v.countryCode,
            }))}
          />
        </Form.Item>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Form.Item
          label="Is your business a financial institution"
          name="is_financial_institution"
          rules={[
            {
              required: true,
              message: "Please select one",
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
        <Form.Item
          label="Global Intermediary Identification Number (GIIN)"
          name="giin"
          rules={[{ required: true, message: "Please enter GIIN" }]}>
          <Input className="w-full" placeholder="Enter Details" />
        </Form.Item>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Form.Item
          label="Established security market where corporation is 
 traded regularly "
          name="established_security_market"
          rules={[
            {
              required: true,
              message: "Please enter established security market",
            },
          ]}>
          <Input className="w-full" placeholder="Enter Details" />
        </Form.Item>
        <Form.Item
          label="Is the company licensed by a regulatory body (Where applicable)"
          name="is_company_licensed_by_regulatory"
          rules={[
            {
              required: true,
              message: "Please provide the established security market",
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
          label="Regulatory entity (regularly traded entity/corporation)"
          name="regulatory_entity"
          rules={[
            { required: true, message: "Please enter regulatory entity" },
          ]}>
          <Input className="w-full" placeholder="Enter details" />
        </Form.Item>
        <Form.Item
          label="Core source of company revenue"
          name="core_source_of_revenue"
          rules={[
            { required: true, message: "Please enter core source of revenue" },
          ]}>
          <Input className="w-full" placeholder="Enter details" />
        </Form.Item>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Form.Item
          label="FATCA - USA Tax liability US Indica (For US Businesses)"
          name="fatca"
          rules={[
            { required: true, message: "Please enter FATCA information" },
          ]}>
          <Input className="w-full" placeholder="Enter details" />
        </Form.Item>
        <Form.Item
          label="Source of funds"
          name="source_of_funds"
          rules={[
            { required: true, message: "Please select source of funds" },
          ]}>
          <Select
            className="w-full"
            placeholder="Select"
            loading={fundsPending}
            options={sourcesOfFunds?.map(v => ({
              label: v.Description,
              value: v.Code,
            }))}
          />
        </Form.Item>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Form.Item
          label="Source of wealth"
          name="source_of_wealth"
          rules={[
            { required: true, message: "Please select source of wealth" },
          ]}>
          <Select
            className="w-full"
            placeholder="Select"
            loading={wealthPending}
            options={sourcesOfWealth?.map(v => ({
              label: v.Description,
              value: v.Code,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Number of UBOs"
          name="number_of_ubo"
          rules={[{ required: true, message: "Please enter number of UBOs" }]}>
          <InputNumber className="w-full" placeholder="Enter details" />
        </Form.Item>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Form.Item
          label="Main Currency"
          name="main_currency"
          rules={[{ required: true, message: "Please select main currency" }]}>
          <Select
            className="w-full"
            placeholder="Select"
            options={CURRENCIES.map(v => ({
              label: `${v.code} - ${v.name}`,
              value: v.code,
            }))}
          />
        </Form.Item>
      </div>
      <Button
        htmlType="submit"
        loading={mutation.isPending}
        type="primary"
        size="large"
        shape="round"
        className="w-48">
        Next
      </Button>
    </Form>
  );
};

export default FirstForm;
