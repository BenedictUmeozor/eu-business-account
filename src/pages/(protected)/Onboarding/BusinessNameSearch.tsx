import HeaderTitle from "@/components/ui/HeaderTitle";
import ENDPOINTS from "@/constants/endpoints";
import useMutationAction from "@/hooks/use-mutation-action";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Button, DatePicker, Form, FormProps, Input, message } from "antd";
import clsx from "clsx";
import { Add } from "iconsax-react";
import { useState } from "react";
import moment, { Moment } from "moment";
import { formatPhoneNumber, getErrorMessage } from "@/utils";
import PhoneInput from "@/components/ui/PhoneInput";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface FormValues {
  business_name: string;
  incorporation_number: string;
  sic: string;
  phone_code: string;
  phone_number: string;
  incorporation_date: string | Moment;
  etag: string;
  business_address: string;
  town: string;
  region: string;
  postcode: string;
}

// 02081330

const BusinessNameSearch = ({ next }: { next: () => void }) => {
  const [foundSearch, setFoundSearch] = useState<boolean | null>(null);
  const searchForm = Form.useForm<{ value: string }>()[0];
  const [form] = Form.useForm<FormValues>();
  const searchValue = Form.useWatch("value", searchForm);
  const [parent] = useAutoAnimate();

  const mutation = useMutationAction<HM.CompanyDetails>({
    url: ENDPOINTS.SEARCH_COMPANY,
    method: "POST",
    mutationKey: ["search-company", searchValue],
    onSuccess: data => {
      if (data && !!data?.company_details.company_name) {
        setFoundSearch(true);
        form.setFieldsValue({
          business_name: data.company_details.company_name,
          incorporation_number: data.company_details.company_number,
          incorporation_date: moment(data.company_details.date_of_creation),
          business_address: data.company_details.address_line_1,
          town: data.company_details.locality,
          region: data.company_details.region,
          postcode: data.company_details.postcode,
          sic: data.company_details.sic_codes,
        });
      } else {
        setFoundSearch(false);
      }
    },
    onError: error => {
      message.error(getErrorMessage(error));
      setFoundSearch(false);
    },
  });

  const onFilter: FormProps<{ value: string }>["onFinish"] = ({ value }) => {
    setFoundSearch(null);
    mutation.mutate({ company_number: value });
  };

  const verifyMutation = useMutationAction<HM.QueryResponse>({
    url: ENDPOINTS.VERIFY_BUSINESS,
    mutationKey: ["verify-business"],
    onSuccess: data => {
      message.success(data?.message);
      next();
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    const phoneNumber = formatPhoneNumber(
      values.phone_number,
      values.phone_code
    ).trim();

    if (!phoneNumber) {
      form.setFields([
        { name: "phone_number", errors: ["Phone number is required"] },
      ]);
      return;
    }

    verifyMutation.mutate({
      ...values,
      phone_number: phoneNumber,
    });
  };

  return (
    <div className="h-full w-full space-y-8 p-8" ref={parent}>
      <HeaderTitle
        headerTitle="Business Verification"
        headerDescription="Verify your business name to get started"
      />
      <section>
        <Form
          layout="vertical"
          autoComplete="off"
          form={searchForm}
          onFinish={onFilter}
          initialValues={{ phone_code: "+44" }}
          className="space-y-0">
          <section className="-space-y-4">
            <div className="grid grid-cols-[0.77fr_0.23fr] items-center gap-x-2">
              <Form.Item
                name="value"
                label={
                  <p className="text-sm font-semibold text-grey-600">
                    Enter business registration number
                  </p>
                }>
                <Input
                  placeholder="Enter required details here"
                  className="w-full rounded-full"
                  suffix={
                    foundSearch ? (
                      <CheckCircleIcon className="h-5 w-5 text-positive" />
                    ) : foundSearch === false ? (
                      <XCircleIcon className="h-5 w-5 text-negative" />
                    ) : null
                  }
                />
              </Form.Item>
              <Button
                htmlType="submit"
                shape="round"
                type="primary"
                size="large"
                disabled={!searchValue}
                loading={mutation.isPending}
                className="h-11">
                Search
              </Button>
            </div>
            <p
              className={clsx(
                "text-sm font-medium",
                foundSearch
                  ? "text-positive"
                  : foundSearch === false
                    ? "text-negative"
                    : "text-grey-400"
              )}>
              {foundSearch
                ? "Business found!"
                : foundSearch === false
                  ? "Sorry! no business found. check if inputs are correct"
                  : "Details of the business will appear below if found"}
            </p>
          </section>
        </Form>
      </section>
      {foundSearch !== null && (
        <section className="space-y-8">
          <div className="flex items-center justify-between rounded-md bg-grey-50 p-3 px-4">
            <span className="text-lg font-medium text-grey-700">
              Business Details
            </span>
            {foundSearch ? (
              <span className="text-grey-500">Search result</span>
            ) : (
              <Button
                type="text"
                icon={<Add className="h-4 w-4 text-primary" />}
                iconPosition="end"
                className="text-primary !text-sm">
                Add manually
              </Button>
            )}
          </div>
          <Form
            form={form}
            layout="vertical"
            labelAlign="left"
            onFinish={onFinish}
            autoComplete="off"
            initialValues={{ phone_code: "+44", phone_number: "+44" }}
            className="space-y-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Form.Item
                label="Business Name"
                name="business_name"
                rules={[
                  { required: true, message: "Business name is required" },
                  {
                    min: 2,
                    message: "Business name must be at least 2 characters",
                  },
                ]}>
                <Input className="w-full" placeholder="Enter business name" />
              </Form.Item>
              <Form.Item
                label="Business Registration Number"
                name="incorporation_number"
                rules={[
                  {
                    required: true,
                    message: "Registration number is required",
                  },
                ]}>
                <Input
                  className="w-full"
                  placeholder="Enter business registration number"
                />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Form.Item
                label="Date of Incorporation"
                name="incorporation_date"
                rules={[
                  { required: true, message: "Incorporation date is required" },
                ]}>
                <DatePicker
                  className="w-full"
                  placeholder="Enter date of incorporation"
                />
              </Form.Item>
              <Form.Item
                label="SIC Code"
                name="sic"
                rules={[{ required: true, message: "SIC code is required" }]}>
                <Input className="w-full" placeholder="Enter SIC Code" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Form.Item
                label="Business Address"
                name="business_address"
                rules={[
                  { required: true, message: "Business address is required" },
                ]}>
                <Input
                  className="w-full"
                  placeholder="Enter Business Address"
                />
              </Form.Item>
              <Form.Item
                label="Town"
                name="town"
                rules={[{ required: true, message: "Town is required" }]}>
                <Input className="w-full" placeholder="Enter Town" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Form.Item
                label="Region"
                name="region"
                rules={[{ required: true, message: "Region is required" }]}>
                <Input className="w-full" placeholder="Enter Region" />
              </Form.Item>
              <Form.Item
                label="Postcode"
                name="postcode"
                rules={[{ required: true, message: "Postcode is required" }]}>
                <Input className="w-full" placeholder="Enter Postcode" />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PhoneInput
                label="Business Phone Number"
                phoneNumberName="phone_number"
                phoneCodeName="phone_code"
                form={form}
                phoneNumberRules={[
                  { required: true, message: "Phone Number is required" },
                ]}
              />
              <Form.Item name="etag" label="Etag">
                <Input className="w-full" placeholder="Enter Etag" />
              </Form.Item>
            </div>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={verifyMutation.isPending}
              className="w-48 text-base"
              shape="round">
              Save & Continue
            </Button>
          </Form>
        </section>
      )}
    </div>
  );
};
export default BusinessNameSearch;
