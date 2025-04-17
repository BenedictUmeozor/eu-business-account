import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Button, Input } from "antd";
import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";

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
