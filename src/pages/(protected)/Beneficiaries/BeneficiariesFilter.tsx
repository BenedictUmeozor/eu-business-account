import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Button, Input, Select } from "antd";
import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import countries from "@/data/codes.json";
import { BENEFICIARIES_TABLE_FILTER } from "@/constants/filter";

const BeneficiariesFilter = () => {
  const [open, setOpen] = useState(false);
  const [parent] = useAutoAnimate();

  return (
    <div className="mb-6 space-y-2" ref={parent}>
      {open && (
        <div className="flex items-center justify-between bg-white shadow-sm rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Input
              className="max-lg:w-full w-64 h-12"
              placeholder="Search name"
              suffix={
                <Button
                  type="primary"
                  shape="circle"
                  icon={<SearchIcon className="w-4 h-4 text-white" />}
                />
              }
            />
            <Select
              className="w-32"
              placeholder="Select Type"
              options={BENEFICIARIES_TABLE_FILTER.type}
            />
            <Select
              className="w-56"
              placeholder="Select Country"
              dropdownStyle={{ minWidth: "200px" }}
              virtual={false}
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
              filterOption={(input, option) => {
                const country = countries.find(
                  c => c.countryCode === option?.value
                );
                return (
                  country?.countryName
                    .toLowerCase()
                    .includes(input.toLowerCase()) || false
                );
              }}
            />
            <Select
              className="w-28"
              placeholder="Select Currency"
              options={BENEFICIARIES_TABLE_FILTER.currency}
            />
          </div>
          <Button
            type="primary"
            icon={<XIcon className="w-4 h-4 text-grey-100" />}
            onClick={() => setOpen(false)}
            className="bg-grey-400 text-grey-100">
            Close
          </Button>
        </div>
      )}
      <div className="flex items-center justify-between bg-white shadow-sm rounded-lg p-3">
        <h4 className="text-grey-500 font-medium text-base">
          Beneficiaries list
        </h4>
        <Button
          type="primary"
          className="bg-gray-50 text-grey-500"
          onClick={() => setOpen(prev => !prev)}
          icon={<SearchIcon className="w-4 h-4 text-grey-500" />}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default BeneficiariesFilter;
