import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "./use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import { message } from "antd";
import { useCallback } from "react";

export default function useRemitterDestinations() {
  const mutation = useSharedMutationAction<{
    destinations: { data: HM.Country[] };
  }>({
    url: ENDPOINTS.REMITTER_DESTINATION,
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const getDestionationCurrencies = useCallback(async (currency: string) => {
    await mutation.mutateAsync({ sending_currency: currency });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    destinationCountriesPending: mutation.isPending,
    destinationCountries: mutation.data?.destinations.data || [],
    getDestionationCurrencies,
  };
}
