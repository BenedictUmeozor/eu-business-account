/* eslint-disable react-hooks/exhaustive-deps */

import ENDPOINTS from "@/constants/endpoints";
import { useAppDispatch, useAppSelector } from ".";
import useSharedMutationAction from "./use-shared-mutation-action";
import { setBalances } from "@/lib/redux/slices/account";
import { useCallback, useMemo } from "react";

function useAccountBalances() {
  const onboardingStatus = useAppSelector(
    state => state.session.onboardingStatus
  );

  const balances = useAppSelector(state => state.accounts.balances);
  const dispatch = useAppDispatch();

  const mutation = useSharedMutationAction<{ details: HM.BalanceInfo }>({
    url: ENDPOINTS.GET_BALANCE,
    onSuccess: data => {
      dispatch(setBalances(data.details));
    },
  });

  const isPending = useMemo(() => {
    if (mutation.isPending) {
      if (balances) {
        return false;
      }
      return true;
    }
    return false;
  }, [balances, mutation.isPending]);

  const fetchBalance = useCallback(
    async (currency: string) => {
      if (onboardingStatus?.completed) {
        await mutation.mutateAsync({ currency });
      }
    },
    [onboardingStatus, mutation]
  );

  const getBalance = useCallback(async (currency: string) => {
    const balance = balances?.find(b => b.ccy === currency);
    if (!balance) {
      const bal = await mutation.mutateAsync({ currency });
      return bal.details;
    }
    return balance;
  }, []);

  return {
    isPending,
    fetchBalance,
    getBalance,
  };
}

export default useAccountBalances;
