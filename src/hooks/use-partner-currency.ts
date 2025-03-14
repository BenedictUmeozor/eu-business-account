import { useEffect, useMemo, useState } from "react";
import useSharedMutationAction from "./use-shared-mutation-action";
import ENDPOINTS from "@/constants/endpoints";
import { CURRENCIES } from "@/constants/currencies";

export default function usePartnerCurrency() {
  const [value, setValue] = useState<HM.PartnerCurrency[]>([]);

  const mutation = useSharedMutationAction<{
    sending_countries: { data: HM.PartnerCurrency[] };
  }>({
    url: ENDPOINTS.PARTNER_CURRENCY,
    onSuccess: data => {
      setValue(data.sending_countries.data);
    },
  });

  const currencies = useMemo(() => {
    return CURRENCIES.filter(country =>
      value.some(
        partnerCurrency => partnerCurrency.currency === country.currencyCode
      )
    );
  }, [value]);

  useEffect(() => {
    mutation.mutateAsync({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    currencies,
    loading: mutation.isPending,
    error: mutation.error,
    retry: mutation.mutateAsync,
    value,
  };
}
