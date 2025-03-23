/* eslint-disable react-hooks/exhaustive-deps */
import ENDPOINTS from "@/constants/endpoints";
import dayjs from "dayjs";
import useSharedMutationAction from "./use-shared-mutation-action";
import { useCallback, useState } from "react";

type TimeRange = '7d' | '30d';

export default function useTransactionAnalytics() {
  const today = dayjs().format("YYYY-MM-DD");
  const last7Days = dayjs().subtract(7, "day").format("YYYY-MM-DD");
  const last30Days = dayjs().subtract(30, "day").format("YYYY-MM-DD");
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const mutation = useSharedMutationAction<
    {
      transaction: { data: HM.Transaction[] };
      pagination: HM.Pagination;
    },
    HM.TransactionFilter
  >({
    url: ENDPOINTS.FILTER_TRANSACTIONS,
  });

  const fetchTransactions = useCallback(
    async (currency: HM.TransactionCurr, range?: TimeRange) => {
      const selectedRange = range || timeRange;
      setTimeRange(selectedRange);
      
      await mutation.mutateAsync({
        category: "ALL",
        currency,
        from: selectedRange === '7d' ? last7Days : last30Days,
        to: today,
        page: 1,
        transaction_status: "Completed",
        row_per_page: 20,
      });
    },
    [last7Days, last30Days, today, timeRange]
  );

  return {
    isPending: mutation.isPending,
    data: mutation.data?.transaction?.data,
    fetchData: fetchTransactions,
    timeRange,
    setTimeRange,
  };
}
