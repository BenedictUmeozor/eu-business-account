import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "./use-shared-mutation-action";
import { useAppDispatch, useAppSelector } from ".";
import { setCurrencies } from "@/lib/redux/slices/account";
import { useCallback, useMemo } from "react";

function useAccountCurrencies() {
  const accountCurrencies = useAppSelector(state => state.accounts.currencies);
  const onboardingStatus = useAppSelector(
    state => state.session.onboardingStatus
  );
  const dispatch = useAppDispatch();

  const mutation = useSharedMutationAction<HM.AccountCurrency>({
    url: ENDPOINTS.GET_ACCOUNT_CURRENCIES,
    onSuccess: data => {
      const currencies = data.details.currencies.flat();

      dispatch(setCurrencies(currencies));
    },
  });

  const isPending = useMemo(() => {
    if (mutation.isPending) {
      if (accountCurrencies) {
        return false;
      }
      return true;
    }
    return false;
  }, [accountCurrencies, mutation.isPending]);

  const fetchCurrencies = useCallback(async () => {
    if (onboardingStatus?.completed) {
      await mutation.mutateAsync({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingStatus?.completed]);

  return {
    fetchCurrencies,
    isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

export default useAccountCurrencies;
