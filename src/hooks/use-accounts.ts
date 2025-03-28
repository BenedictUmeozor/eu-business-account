import ENDPOINTS from "@/constants/endpoints";
import { useAppDispatch, useAppSelector } from ".";
import { setAccounts } from "@/lib/redux/slices/account";
import useSharedMutationAction from "./use-shared-mutation-action";
import { useCallback, useMemo } from "react";

function useAccounts() {
  const dispatch = useAppDispatch();
  const accounts = useAppSelector(state => state.accounts.accounts);
  const onboardingStatus = useAppSelector(
    state => state.session.onboardingStatus
  );

  const mutation = useSharedMutationAction<{
    details: { currencies: HM.AccountsBalances[] };
  }>({
    url: ENDPOINTS.GET_ALL_ACCOUNT_CURRENCIES,
    onSuccess: data => {
      dispatch(setAccounts(data.details.currencies));
    },
    // onError: error => {
    //   message.error(getErrorMessage(error));
    // },
  });

  const isPending = useMemo(() => {
    if (mutation.isPending) {
      if (accounts) {
        return false;
      }
      return true;
    }
    return false;
  }, [accounts, mutation.isPending]);

  const fetchAccounts = useCallback(async () => {
    if (onboardingStatus?.completed) {
      await mutation.mutateAsync({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingStatus?.completed]);

  return {
    fetchAccounts,
    isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

export default useAccounts;
