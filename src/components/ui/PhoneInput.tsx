import { Form, Input, Select } from "antd";
import { Rule } from "antd/es/form";
import { memo, ReactNode, useMemo } from "react";
import codes from "@/data/codes.json";

interface Code {
  countryName: string;
  countryCode: string;
  callingCode: string;
  currencyCode: string;
  currencySymbol: string;
  flag: string;
}

interface PhoneInputProps {
  phoneCodeName: string;
  phoneNumberName: string;
  label: string | ReactNode;
  disabled?: boolean;
  phoneCodeRules?: Rule[];
  phoneNumberRules?: Rule[];
  countries?: Code[];
}

const PhoneInput = ({
  phoneCodeName = "phone_code",
  phoneNumberName = "phone_number",
  label,
  disabled = false,
  phoneCodeRules,
  phoneNumberRules,
  countries,
}: PhoneInputProps) => {
  const array = useMemo(() => {
    return countries || codes;
  }, [countries]);

  return (
    <Form.Item label={label} name={phoneNumberName} rules={phoneNumberRules}>
      <Input
        className="w-full"
        placeholder="+234 8000 303 004"
        type="tel"
        disabled={disabled}
        addonBefore={
          <Form.Item name={phoneCodeName} noStyle rules={phoneCodeRules}>
            <Select
              showSearch
              className="w-20"
              disabled={disabled}
              dropdownStyle={{ minWidth: "200px" }}
              virtual={false}
              options={array.map((c, index) => ({
                label: (
                  <div className="flex items-center gap-2">
                    <img
                      src={c.flag}
                      alt={c.countryCode}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                    <span>{c.countryCode}</span>
                  </div>
                ),
                value: c.callingCode,
                key: index,
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

export default memo(PhoneInput);
