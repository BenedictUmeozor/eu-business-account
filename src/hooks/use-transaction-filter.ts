import { useCallback, useState } from "react";
import dayjs from "dayjs";

const useTransactionFilter = () => {
  const [dateRange, setDateRange] = useState<string>();
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [currency, setCurrency] = useState<HM.TransactionCurr | undefined>();
  const [status, setStatus] = useState<HM.TransactionStatus | undefined>();

  const handleDateRangeChange = useCallback((value: string) => {
    setDateRange(value);

    // Calculate dates based on selected range
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
    } else if (value === "custom") {
      // Let the user select custom dates
      setFromDate("");
      setToDate("");
    }
  }, []);

  // Set default date range on initial render
//   useEffect(() => {
//     handleDateRangeChange("last-7-days");
//   }, [handleDateRangeChange]);

  return {
    dateRange,
    fromDate,
    toDate,
    currency,
    status,
    setDateRange: handleDateRangeChange,
    setFromDate,
    setToDate,
    setCurrency,
    setStatus,
  };
};

export default useTransactionFilter;
