import { TRANSACTIONS_TABLE_FILTER } from "@/constants/filter";
import { Button, DatePicker, Select } from "antd";
import { XIcon } from "lucide-react";

interface TransactionFilterProps {
  onClose: () => void;
}

const TransactionFilter = ({ onClose }: TransactionFilterProps) => {
  return (
    <div className="w-full flex items-center justify-between bg-white shadow-sm rounded-lg p-3">
      <div className="flex items-center gap-2">
        <Select
          placeholder="Last 7 days"
          options={TRANSACTIONS_TABLE_FILTER.days}
          className="w-36"
        />
        <DatePicker.RangePicker />
        <Select
          placeholder="Currency"
          options={TRANSACTIONS_TABLE_FILTER.currency}
          className="w-36"
        />
        <Select
          placeholder="Status"
          options={TRANSACTIONS_TABLE_FILTER.status}
          className="w-36"
        />
      </div>
      <Button
        type="primary"
        icon={<XIcon className="w-4 h-4 text-grey-100" />}
        className="bg-grey-400 text-grey-100"
        onClick={onClose}>
        Close
      </Button>
    </div>
  );
};

export default TransactionFilter;
