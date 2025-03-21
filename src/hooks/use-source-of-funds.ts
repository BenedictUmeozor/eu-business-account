import ENDPOINTS from "@/constants/endpoints";
import useSharedQueryAction from "./use-shared-query-action";

export default function useSourceOfFunds() {
  const { data, isPending } = useSharedQueryAction<
    { Code: string; Description: string }[]
  >({
    url: ENDPOINTS.SOURCE_OF_FUNDS,
    key: ["source_of_funds"],
    headers: {
      "Api-Subscription-Key": ENDPOINTS.API_SUBSCRIPTION_KEY,
    },
  });
  return {
    sourcesOfFunds: data,
    isPending,
  };
}
