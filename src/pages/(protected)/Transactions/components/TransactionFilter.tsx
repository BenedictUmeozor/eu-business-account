import { TRANSACTIONS_TABLE_FILTER } from "@/constants/filter";
import { Button, DatePicker, Select } from "antd";
import { XIcon } from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";

interface TransactionFilterProps {
  onClose: () => void;
  setFromDate: (date: string) => void;
  setToDate: (date: string) => void;
  setCurrency: (currency: HM.TransactionCurr | undefined) => void;
  setStatus: (status: HM.TransactionStatus | undefined) => void;
  fromDate?: string;
  toDate?: string;
  currency?: HM.TransactionCurr;
  status?: HM.TransactionStatus;
  resetMutation?: () => void;
}

const TransactionFilter = ({
  onClose,
  setFromDate,
  setToDate,
  setCurrency,
  setStatus,
  fromDate,
  toDate,
  currency,
  status,
  resetMutation,
}: TransactionFilterProps) => {
  const [dateRange, setDateRange] = useState<string>();

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);

    if (value !== "custom") {
      const today = dayjs();

      if (value === "last-7-days") {
        setFromDate(today.subtract(7, "day").format("YYYY-MM-DD"));
        setToDate(today.format("YYYY-MM-DD"));
      } else if (value === "last-30-days") {
        setFromDate(today.subtract(30, "day").format("YYYY-MM-DD"));
        setToDate(today.format("YYYY-MM-DD"));
      } else if (value === "last-60-days") {
        setFromDate(today.subtract(60, "day").format("YYYY-MM-DD"));
        setToDate(today.format("YYYY-MM-DD"));
      }
    }
  };

  const handleDateRangePickerChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setFromDate(dates[0].format("YYYY-MM-DD"));
      setToDate(dates[1].format("YYYY-MM-DD"));
    } else {
      setFromDate("");
      setToDate("");
    }
  };

  const clearFilters = () => {
    setDateRange(undefined);
    setFromDate("");
    setToDate("");
    setCurrency(undefined);
    setStatus(undefined);
    if (resetMutation) resetMutation();
  };

  const closeFilter = () => {
    if (resetMutation) resetMutation();
    onClose();
    clearFilters();
  };

  const hasActiveFilters = fromDate || toDate || currency || status;

  return (
    <div className="w-full flex items-center justify-between bg-white shadow-sm rounded-lg p-3">
      <div className="flex items-center gap-2">
        <Select
          placeholder="Last 7 days"
          value={dateRange}
          onChange={handleDateRangeChange}
          options={TRANSACTIONS_TABLE_FILTER.days}
          className="w-36"
        />
        <DatePicker.RangePicker
          disabled={dateRange !== "custom"}
          value={fromDate && toDate ? [dayjs(fromDate), dayjs(toDate)] : null}
          onChange={handleDateRangePickerChange}
        />
        <Select
          placeholder="Currency"
          value={currency}
          onChange={value => setCurrency(value)}
          options={TRANSACTIONS_TABLE_FILTER.currency}
          className="w-36"
          allowClear
        />
        <Select
          placeholder="Status"
          value={status}
          onChange={value => setStatus(value)}
          options={TRANSACTIONS_TABLE_FILTER.status}
          className="w-36"
          allowClear
        />
      </div>
      <div className="flex items-center gap-2">
        {hasActiveFilters && (
          <Button onClick={clearFilters}>Clear Filters</Button>
        )}
        <Button
          type="primary"
          icon={<XIcon className="w-4 h-4 text-grey-100" />}
          className="bg-grey-400 text-grey-100"
          onClick={closeFilter}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default TransactionFilter;
