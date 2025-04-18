import { Form, Input, Select } from "antd";
import { FormInstance, Rule } from "antd/es/form";
import { memo, ReactNode, useMemo } from "react";
import sepaCodes from "@/data/sepa-countries.json";
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
  disableSelect?: boolean;
  form?: FormInstance;
  isEuro?: boolean;
}

const PhoneInput = ({
  phoneCodeName = "phone_code",
  phoneNumberName = "phone_number",
  label,
  disabled = false,
  phoneCodeRules,
  phoneNumberRules,
  countries,
  disableSelect = false,
  form,
  isEuro,
}: PhoneInputProps) => {
  const handleCodeChange = () => {
    if (form) {
      const phoneCode = form?.getFieldValue(phoneCodeName);

      if (phoneCode) {
        form?.setFieldsValue({
          [phoneNumberName]: `${phoneCode}`,
        });
      }
    }
  };

  const array = useMemo(() => {
    if (isEuro) {
      return sepaCodes;
    }
    return countries || codes;
  }, [countries, isEuro]);

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
              onChange={handleCodeChange}
              disabled={disabled || disableSelect}
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
                    <span>{c.countryCode} ({c.callingCode})</span>
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
