import HeaderTitle from "@/components/ui/HeaderTitle";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import ENDPOINTS from "@/constants/endpoints";
import useMutationAction from "@/hooks/use-mutation-action";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Button, DatePicker, Form, FormProps, Input, Select } from "antd";
import clsx from "clsx";
import { Add } from "iconsax-react";
import { useCallback, useState } from "react";
import moment, { Moment } from "moment";

interface FormValues {
  business_name: string;
  business_reg_number: string;
  date_of_incorporation: Moment | string;
  listing_number: string;
  registered_business_address: string;
  city: string;
  state: string;
  postal_code: string;
  economic_activity: string;
  phone_number: string;
  dial_code: string;
}

const BusinessNameSearch = ({ next }: { next: () => void }) => {
  const [disabled, setDisabled] = useState(true);
  const [foundSearch, setFoundSearch] = useState<boolean | null>(null);
  const searchForm = Form.useForm<{ value: string }>()[0];
  const [form] = Form.useForm<FormValues>();
  const searchValue = Form.useWatch("value", searchForm);

  const setFieldsValue = useCallback(
    ({ dialCode, phoneNumber }: { dialCode: string; phoneNumber: string }) => {
      form.setFieldsValue({ dial_code: dialCode, phone_number: phoneNumber });
    },
    [form]
  );

  const setPhoneValue = useCallback(
    (phoneNumber: string) => {
      form.setFieldsValue({ phone_number: phoneNumber });
    },
    [form]
  );

  const mutation = useMutationAction<HM.CompanyDetails>({
    url: ENDPOINTS.SEARCH_COMPANY,
    method: "POST",
    mutationKey: ["search-company", searchValue],
    onSuccess: data => {
      if (data && !Object.values(data.company_details).includes(null)) {
        setFoundSearch(true);
        form.setFieldsValue({
          business_name: data.company_details.company_name,
          business_reg_number: data.company_details.company_number,
          date_of_incorporation: moment(data.company_details.date_of_creation),
          registered_business_address: `${data.company_details.address_line_1}, ${data.company_details.address_line_2}`,
          city: data.company_details.locality,
          state: data.company_details.region,
          postal_code: data.company_details.postcode,
          economic_activity: data.company_details.sic_codes,
        });
      } else {
        setFoundSearch(false);
      }
    },
    onError: () => {
      setFoundSearch(false);
    },
  });

  const onFilter: FormProps<{ value: string }>["onFinish"] = ({ value }) => {
    setDisabled(true);
    setFoundSearch(null);
    mutation.mutate({ company_number: value });
  };

  const onFinish: FormProps<FormValues>["onFinish"] = values => {
    console.log(values);
    next();
  };

  return (
    <div className="h-full w-full space-y-8 p-8">
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
                className="text-primary !text-sm"
                onClick={() => setDisabled(false)}>
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
            initialValues={{ dial_code: "+44", phone_number: "+44" }}
            className="space-y-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Form.Item label="Business Name" name="business_name">
                <Input
                  className="w-full"
                  placeholder="Enter business name"
                  disabled={disabled}
                />
              </Form.Item>
              <Form.Item
                label="Business Registration Number"
                name="business_reg_number">
                <Input
                  className="w-full"
                  placeholder="Enter business registration number"
                  disabled={disabled}
                />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Form.Item
                label="Date of Incorporation"
                name="date_of_incorporation">
                <DatePicker
                  className="w-full"
                  placeholder="Enter date of incorporation"
                  disabled={disabled}
                />
              </Form.Item>
              <Form.Item label="Listing Number" name="listing_number">
                <Input
                  className="w-full"
                  placeholder="Enter Listing Number"
                  disabled={disabled}
                />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Form.Item
                label="Registered Business Address"
                name="registered_business_address">
                <Input
                  className="w-full"
                  placeholder="Enter Registered Business Address"
                  disabled={disabled}
                />
              </Form.Item>
              <Form.Item label="Town/City" name="city">
                <Input
                  className="w-full"
                  placeholder="Enter Town/City"
                  disabled={disabled}
                />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Form.Item label="Region/State" name="state">
                <Select
                  className="w-full"
                  placeholder="Select Town"
                  disabled={disabled}
                />
              </Form.Item>
              <Form.Item label="Postal Code" name="postal_code">
                <Input
                  className="w-full"
                  placeholder="Enter Postal Code"
                  disabled={disabled}
                />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Form.Item
                label="Economic Activity of the Company"
                name="economic_activity">
                <Input
                  className="w-full"
                  placeholder="Enter Economic Activity of the Company"
                  disabled={disabled}
                />
              </Form.Item>
              <PhoneNumberInput
                dialCodeName="dial_code"
                label="Business Phone Number"
                name="phone_number"
                setFieldsValue={setFieldsValue}
                setPhoneValue={setPhoneValue}
                disabled={disabled}
              />
            </div>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-48 text-base"
              shape="round"
              disabled={disabled && !foundSearch}>
              Save & Continue
            </Button>
          </Form>
        </section>
      )}
    </div>
  );
};
export default BusinessNameSearch;
