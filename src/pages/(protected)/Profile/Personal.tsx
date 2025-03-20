import PhoneNumberInput from "@/components/ui/PhoneNumberInput";
import { useAppSelector } from "@/hooks";
import usePersonalDetails from "@/hooks/use-personal-details";
import { Form, Input, Select } from "antd";
import { useCallback, useEffect } from "react";
import countries from "@/data/codes.json";

interface FormValues {
  first_name: string;
  middle_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  phone_code: string;
  country: string;
  gender: string;
  occupation: string;
  address: string;
}

const Personal = () => {
  const [form] = Form.useForm<FormValues>();
  const session = useAppSelector(state => state.session);
  const { personalDetails, isLoading } = usePersonalDetails();

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
    if (!isLoading && personalDetails) {
      form.setFieldsValue({
        first_name: personalDetails.fname,
        middle_name: personalDetails.oname,
        last_name: personalDetails.lname,
        email_address: session.user?.email,
        phone_number: "",
        phone_code: "+44",
        country: "GB",
        gender: personalDetails.gender === "M" ? "Male" : "Female",
        occupation: personalDetails.occupation,
        address: personalDetails.address,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalDetails, isLoading]);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h3 className="text-lg font-semibold text-grey-700">
          Personal Details
        </h3>
        <p className="text-grey-500">
          Lorem ipsum dolor text will appear here for now
        </p>
      </header>
      <div className="max-w-3xl">
        <Form
          layout="horizontal"
          autoComplete="off"
          form={form}
          wrapperCol={{ span: 14 }}
          labelCol={{ span: 10 }}
          labelAlign="left">
          <Form.Item
            name="first_name"
            label={
              <span className="text-grey-500 font-medium">First name</span>
            }>
            <Input placeholder="First Name" className="w-full" disabled />
          </Form.Item>

          <Form.Item
            name="middle_name"
            label={
              <span className="text-grey-500 font-medium">Middle name</span>
            }>
            <Input placeholder="Middle Name" className="w-full" disabled />
          </Form.Item>

          <Form.Item
            name="last_name"
            label={
              <span className="text-grey-500 font-medium">Last name</span>
            }>
            <Input placeholder="Last Name" className="w-full" disabled />
          </Form.Item>

          <Form.Item
            name="email_address"
            label={
              <span className="text-grey-500 font-medium">Email address</span>
            }>
            <Input placeholder="Email Address" className="w-full" disabled />
          </Form.Item>

          <PhoneNumberInput
            dialCodeName="phone_code"
            label={
              <span className="text-grey-500 font-medium">Phone Number</span>
            }
            name="phone_number"
            setFieldsValue={setFieldsValue}
            setPhoneValue={setPhoneValue}
            disabled
          />

          <Form.Item
            name="country"
            label={<span className="text-grey-500 font-medium">Country</span>}>
            <Select
              showSearch
              className="w-full"
              disabled
              dropdownStyle={{ minWidth: "200px" }}
              options={countries.map(c => ({
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
            />
          </Form.Item>

          <Form.Item
            name="gender"
            label={<span className="text-grey-500 font-medium">Gender</span>}>
            <Select
              placeholder="Select Gender"
              disabled
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="occupation"
            label={
              <span className="text-grey-500 font-medium">Occupation</span>
            }>
            <Input placeholder="Occupation" className="w-full" disabled />
          </Form.Item>

          <Form.Item
            name="address"
            label={<span className="text-grey-500 font-medium">Address</span>}>
            <Input placeholder="Address" disabled />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Personal;
