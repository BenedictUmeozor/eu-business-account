/* eslint-disable react-hooks/exhaustive-deps */
import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "./use-shared-mutation-action";
import { message } from "antd";
import { getErrorMessage } from "@/utils";
import { useEffect } from "react";

export default function useRemitterSource() {
  const mutation = useSharedMutationAction<{
    sending_countries: { data: HM.Country[] };
  }>({
    url: ENDPOINTS.REMITTER_SOURCE,
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  useEffect(() => {
    mutation.mutateAsync({})
  }, [])

  return {
    sourceCountriesPending: mutation.isPending,
    sourceCountries: mutation.data?.sending_countries.data || [],
  };
}
