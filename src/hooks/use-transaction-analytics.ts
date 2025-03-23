/* eslint-disable react-hooks/exhaustive-deps */
import ENDPOINTS from "@/constants/endpoints";
import dayjs from "dayjs";
import useSharedMutationAction from "./use-shared-mutation-action";
import { useCallback, useEffect } from "react";

export default function useTransactionAnalytics(currency: HM.TransactionCurr) {
  const today = dayjs().format("YYYY-MM-DD");
  const last30Days = dayjs().subtract(30, "day").format("YYYY-MM-DD");

  const mutation = useSharedMutationAction<
    {
      transaction: { data: HM.Transaction[] };
      pagination: HM.Pagination;
    },
    HM.TransactionFilter
  >({
    url: ENDPOINTS.FILTER_TRANSACTIONS,
  });

  const fetchLast30DaysTrans = useCallback(async () => {
    await mutation.mutateAsync({
      category: "LocalPayment",
      currency,
      from: last30Days,
      to: today,
      page: 1,
      transaction_status: "CompletedWithErrors",
      row_per_page: 20,
    });
  }, [currency, last30Days, today]);

  useEffect(() => {
    fetchLast30DaysTrans();
  }, []);

  return {
    isPending: mutation.isPending,
    data: mutation.data?.transaction?.data,
  };
}
