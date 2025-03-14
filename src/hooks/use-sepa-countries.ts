import { useEffect, useState } from "react";
import useSharedMutationAction from "./use-shared-mutation-action";
import ENDPOINTS from "@/constants/endpoints";

export default function useSepaCountries() {
  const [countries, setCountries] = useState<HM.SepaCountry[]>([]);

  const mutation = useSharedMutationAction<{
    country: { data: HM.SepaCountry[] };
  }>({
    url: ENDPOINTS.SEPA_COUNTRIES,
    onSuccess: data => {
      setCountries(data.country.data);
    },
  });

  useEffect(() => {
    mutation.mutateAsync({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    countries,
    loading: mutation.isPending,
  };
}
