import useBusinessDetails from "@/hooks/use-business-details";
import { Form, Input, Select, Spin } from "antd";
import moment, { Moment } from "moment";
import { useCallback, useEffect } from "react";
import { DatePicker } from "antd";
import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { useAutoAnimate } from "@formkit/auto-animate/react";

interface FormValues {
  business_name: string;
  business_type: string;
  incorporation_number: string;
  business_industry: string;
  business_structure: string;
  phone_code: string;
  phone_number: string;
  website: string;
  incorporation_date: Moment | string;
  postcode: string;
  town: string;
  region: string;
  business_address: string;
}

const Business = () => {
  const [form] = Form.useForm<FormValues>();
  const { businessDetails, isLoading } = useBusinessDetails();
  const [parent] = useAutoAnimate()

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

  useEffect(() => {
    if (!isLoading && businessDetails) {
      form.setFieldsValue({
        business_name: businessDetails.business_name,
        business_type: businessDetails.business_type,
        incorporation_number: businessDetails.incorporation_number,
        business_industry: businessDetails.business_industry,
        business_structure: businessDetails.business_structure,
        phone_code: businessDetails.phone_code || "+44",
        phone_number: businessDetails.phone_number || "",
        website: businessDetails.website,
        incorporation_date: moment(businessDetails.incorporation_date),
        postcode: businessDetails.postcode,
        town: businessDetails.town,
        region: businessDetails.region,
        business_address: businessDetails.business_address,
      });
    }
  }, [businessDetails, isLoading, form]);

  return (
    <div className="space-y-6" ref={parent}>
      <header className="space-y-1">
        <h3 className="text-lg font-semibold text-grey-700">
          Business Details
        </h3>
        <p className="text-grey-500">View your business information</p>
      </header>
      {isLoading ? (
        <div className="flex items-center justify-center h-36">
          <Spin />
        </div>
      ) : (
        <div className="max-w-3xl">
          <Form
            layout="horizontal"
            autoComplete="off"
            form={form}
            wrapperCol={{ span: 14 }}
            labelCol={{ span: 10 }}
            labelAlign="left">
            <Form.Item
              name="business_name"
              label={
                <span className="text-grey-500 font-medium">Business name</span>
              }>
              <Input placeholder="Business Name" className="w-full" disabled />
            </Form.Item>

            <Form.Item
              name="business_type"
              label={
                <span className="text-grey-500 font-medium">Business type</span>
              }>
              <Select
                placeholder="Select Business Type"
                className="w-full"
                disabled
              />
            </Form.Item>

            <Form.Item
              name="incorporation_number"
              label={
                <span className="text-grey-500 font-medium">
                  Incorporation number
                </span>
              }>
              <Input
                placeholder="Incorporation Number"
                className="w-full"
                disabled
              />
            </Form.Item>

            <Form.Item
              name="business_industry"
              label={
                <span className="text-grey-500 font-medium">Industry</span>
              }>
              <Input
                placeholder="Business Industry"
                className="w-full"
                disabled
              />
            </Form.Item>

            <Form.Item
              name="business_structure"
              label={
                <span className="text-grey-500 font-medium">
                  Business structure
                </span>
              }>
              <Select
                placeholder="Select Business Structure"
                className="w-full"
                disabled
              />
            </Form.Item>

            <PhoneNumberInput
              dialCodeName="phone_code"
              label={
                <span className="text-grey-500 font-medium">Phone number</span>
              }
              name="phone_number"
              setFieldsValue={setFieldsValue}
              setPhoneValue={setPhoneValue}
              disabled
            />

            <Form.Item
              name="website"
              label={
                <span className="text-grey-500 font-medium">Website</span>
              }>
              <Input placeholder="Website URL" className="w-full" disabled />
            </Form.Item>

            <Form.Item
              name="incorporation_date"
              label={
                <span className="text-grey-500 font-medium">
                  Incorporation date
                </span>
              }>
              <DatePicker className="w-full" disabled />
            </Form.Item>

            <Form.Item
              name="business_address"
              label={
                <span className="text-grey-500 font-medium">
                  Business address
                </span>
              }>
              <Input placeholder="Business Address" disabled />
            </Form.Item>

            <Form.Item
              name="town"
              label={
                <span className="text-grey-500 font-medium">Town/City</span>
              }>
              <Input placeholder="Town" className="w-full" disabled />
            </Form.Item>

            <Form.Item
              name="region"
              label={
                <span className="text-grey-500 font-medium">Region/State</span>
              }>
              <Input placeholder="Region" className="w-full" disabled />
            </Form.Item>

            <Form.Item
              name="postcode"
              label={
                <span className="text-grey-500 font-medium">Postcode</span>
              }>
              <Input placeholder="Postcode" className="w-full" disabled />
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
};

export default Business;
