import ENDPOINTS from "@/constants/endpoints";
import useSharedQueryAction from "./use-shared-query-action";

export default function useRemitterSourceOfFunds() {
  const { data, isPending } = useSharedQueryAction<{
    source_of_income: { data: { name: string; code: string }[] };
  }>({
    url: ENDPOINTS.REMITTER_SOURCE_OF_FUNDS,
  });

  return {
    sourceOfFundsPending: isPending,
    sourceOfFunds: data?.source_of_income.data || [],
  };
}
