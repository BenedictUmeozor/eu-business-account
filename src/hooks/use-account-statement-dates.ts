import { useMemo, useState } from "react";
import dayjs from "dayjs";

type DateRange = "custom" | "1month" | "3months" | "6months";

interface UseDateSelectionResult {
  selectedRange: DateRange;
  setSelectedRange: (range: DateRange) => void;
  startDate: dayjs.Dayjs | null;
  endDate: dayjs.Dayjs | null;
  isCustom: boolean;
}

export const useAccountStatementDates = (): UseDateSelectionResult => {
  const [selectedRange, setSelectedRange] = useState<DateRange>("custom");

  const { startDate, endDate, isCustom } = useMemo(() => {
    const today = dayjs();
    let start = null;
    const end = today;
    
    switch (selectedRange) {
      case "1month":
        start = today.subtract(1, "month");
        break;
      case "3months":
        start = today.subtract(3, "month");
        break;
      case "6months":
        start = today.subtract(6, "month");
        break;
      default:
        // Custom range
        break;
    }
    
    return {
      startDate: start,
      endDate: end,
      isCustom: selectedRange === "custom"
    };
  }, [selectedRange]);

  return {
    selectedRange,
    setSelectedRange,
    startDate,
    endDate,
    isCustom
  };
};