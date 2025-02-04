import { memo, useState } from "react";
import { Input, Select, Form } from "antd";
import codes from "@/data/codes.json";

interface PhoneNumberInputProps {
  name: string;
  label: string;
  dialCodeName: string;
  setPhoneValue: (value: string) => void;
  setFieldsValue: ({
    dialCode,
    phoneNumber,
  }: {
    dialCode: string;
    phoneNumber: string;
  }) => void;
  disabled?: boolean;
}

const PhoneNumberInput = ({
  dialCodeName,
  label,
  name,
  setFieldsValue,
  setPhoneValue,
  disabled = false,
}: PhoneNumberInputProps) => {
  const [phoneNumber, setPhoneNumber] = useState("+44");
  const [dialCode, setDialCode] = useState("+44");

  const handleCodeChange = (value: string) => {
    const newPhoneNumber = phoneNumber.replace(dialCode, value);
    setDialCode(value);
    setPhoneNumber(newPhoneNumber);
    setFieldsValue({
      dialCode: value,
      phoneNumber: newPhoneNumber,
    });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPhoneNumber(newValue);
    setPhoneValue(newValue);
  };

  return (
    <Form.Item label={label} name={name}>
      <Input
        className="w-full"
        placeholder="+234 8000 303 004"
        type="tel"
        disabled={disabled}
        value={phoneNumber}
        onChange={handlePhoneChange}
        addonBefore={
          <Form.Item name={dialCodeName} noStyle>
            <Select
              showSearch
              className="w-20"
              disabled={disabled}
              dropdownStyle={{ minWidth: "200px" }}
              onChange={handleCodeChange}
              value={dialCode}
              options={codes.map(c => ({
                label: (
                  <div className="flex items-center gap-2">
                    <img
                      src={c.flag}
                      alt={c.countryCode}
                      className="h-4 w-6 object-cover"
                    />
                    <span>{c.countryCode}</span>
                  </div>
                ),
                value: c.callingCode,
              }))}
              filterOption={(input, option) =>
                (option?.value as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
        }
      />
    </Form.Item>
  );
};

export default memo(PhoneNumberInput);
