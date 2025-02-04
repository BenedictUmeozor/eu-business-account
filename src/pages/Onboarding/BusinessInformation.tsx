import { PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Form,
  FormProps,
  Input,
  Radio,
  Select,
  Space,
  Tag,
} from "antd";
import { memo, useState } from "react";
import HeaderTitle from "@/components/ui/HeaderTitle";
import clsx from "clsx";
import { CURRENCIES, TRANSACTIONS_VOLUMES } from "./constants";
import countries from "@/data/codes.json";

interface FormValues {
  business_type: string;
  business_industry: string;
  purpose: string;
  economic_activity: string;
  business_website: string;
  transaction_volume: string;
  currencies_usage: string;
  top_countries_send: string;
  top_countries_receive: string;
  top_partners_incoming: string;
  top_partners_outgoing: string;
  license: 1 | 0;
}

const BusinessInformation = ({
  next,
  isReview,
  setLicense,
}: {
  next: () => void;
  setLicense: (value: 1 | 0) => void;
  isReview?: boolean;
}) => {
  const [form] = Form.useForm<FormValues>();
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

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    if (!isReview) {
      setLicense(values.license);
    }
    next();
  };

  return (
    <div className={clsx("h-full w-full space-y-8", !isReview && "p-8")}>
      <header className="flex items-center justify-between">
        <HeaderTitle
          headerDescription="Tell us more about your business"
          headerTitle="Business Information"
        />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full">
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
        </div>
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
            <Form.Item label="Type of Business" name="business_name">
              <Select
                className="w-full"
                placeholder="Select Type of Business"
              />
            </Form.Item>
            <Form.Item label="Business Industry" name="business_industry">
              <Select
                className="w-full"
                placeholder="Select Business Industry"
              />
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label="Purpose of Account" name="purpose">
              <Select
                className="w-full"
                placeholder="Select Purpose of Account"
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
              name="business_website">
              <Input className="w-full" placeholder="www.xyz.com" />
            </Form.Item>
            <Form.Item
              label="Expected Transaction Volume (Monthly)"
              name="transaction_volume">
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
              name="currencies_usage">
              <Select
                className="w-full"
                placeholder="Select currencies"
                maxCount={5}
                maxTagCount={0}
                mode="multiple"
                value={selectedCurrencies}
                onChange={value => setSelectedCurrencies(value)}
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
              name="top_countries_send">
              <Select
                className="w-full"
                placeholder="Select Countries"
                maxCount={5}
                maxTagCount={0}
                mode="multiple"
                value={selectedSendCountries}
                onChange={value => setSelectedSendCountries(value)}
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
              name="top_countries_receive">
              <Select
                className="w-full"
                placeholder="Select Countries"
                maxCount={5}
                maxTagCount={0}
                mode="multiple"
                value={selectedReceiveCountries}
                onChange={value => setSelectedReceiveCountries(value)}
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
              name="top_partners_incoming"
              label="Top 5 transacting partners - Incoming">
              <Input
                className="w-full"
                placeholder="Enter names and separate with commas"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              name="top_partners_outgoing"
              label="Top 5 transacting partners - Outgoing">
              <Input
                className="w-full"
                placeholder="Enter names and separate with commas"
              />
            </Form.Item>
            <Form.Item
              label="Does your company require a license to operate?"
              name="license">
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
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            shape="round"
            className="w-48 text-base">
            {isReview ? "Confirm" : "Save & Continue"}
          </Button>
        </Form>
      </section>
    </div>
  );
};

export default memo(BusinessInformation);
