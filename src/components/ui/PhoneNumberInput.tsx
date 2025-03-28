import { memo, ReactNode, useEffect, useMemo, useState } from "react";
import { Input, Select, Form } from "antd";
import type { Rule } from "rc-field-form/lib/interface";
import codes from "@/data/codes.json";
import { Currency } from "@/constants/currencies";

interface PhoneNumberInputProps {
  name: string;
  label: string | ReactNode;
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
  dialCodeRules?: Rule[];
  phoneNumberRules?: Rule[];
  array?: Currency[];
  currency?: string;
}

const PhoneNumberInput = ({
  dialCodeName,
  label,
  name,
  setFieldsValue,
  setPhoneValue,
  disabled = false,
  dialCodeRules,
  phoneNumberRules,
  array,
  currency,
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

  const countries = useMemo(() => {
    if (array) {
      return array;
    }
    return codes;
  }, [array]);

  useEffect(() => {
    if (currency && array) {
      const currencyItem = array.find(c => c.currencyCode === currency);
      if (currencyItem) {
        const country = countries.find(
          c => c.countryCode === currencyItem.countryCode
        );
        if (country && country.callingCode) {
          handleCodeChange(country.callingCode);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, countries, array]);

  return (
    <Form.Item label={label} name={name} rules={phoneNumberRules}>
      <Input
        className="w-full"
        placeholder="+234 8000 303 004"
        type="tel"
        disabled={disabled}
        value={phoneNumber}
        onChange={handlePhoneChange}
        addonBefore={
          <Form.Item name={dialCodeName} noStyle rules={dialCodeRules}>
            <Select
              showSearch
              className="w-20"
              disabled={disabled}
              dropdownStyle={{ minWidth: "200px" }}
              onChange={handleCodeChange}
              value={dialCode}
              virtual={false}
              options={countries.map((c, index) => ({
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

export default memo(PhoneNumberInput);
