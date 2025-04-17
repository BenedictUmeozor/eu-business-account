import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Button, Input } from "antd";
import { Loader2Icon, SearchIcon, XIcon } from "lucide-react";
import { memo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const BeneficiariesFilter = ({
  setSearchTerm,
  loading,
}: {
  setSearchTerm: (term: string) => void;
  loading: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [parent] = useAutoAnimate();

  const debounced = useDebouncedCallback((value: string) => {
    setSearchTerm(value);
  }, 1000);

  return (
    <div className="mb-6 space-y-2" ref={parent}>
      {open && (
        <div className="flex items-center justify-between bg-white shadow-sm rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Input
              className="max-lg:w-full w-64 h-12"
              placeholder="Search name"
              onChange={e => debounced(e.target.value)}
              suffix={
                <Button
                  type="primary"
                  shape="circle"
                  icon={
                    loading ? (
                      <Loader2Icon className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <SearchIcon className="w-4 h-4 text-white" />
                    )
                  }
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

export default memo(BeneficiariesFilter);
