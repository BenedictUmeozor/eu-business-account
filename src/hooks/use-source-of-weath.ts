import ENDPOINTS from "@/constants/endpoints";
import useSharedQueryAction from "./use-shared-query-action";

export default function useSourceOfWealth() {
  const { data, isPending } = useSharedQueryAction<
    { Code: string; Description: string }[]
  >({
    url: ENDPOINTS.SOURCE_OF_WEALTH,
    key: ["source_of_wealth"],
    headers: {
      "Api-Subscription-Key": ENDPOINTS.API_SUBSCRIPTION_KEY,
    },
  });
  return {
    sourcesOfWealth: data,
    isPending,
  };
}
