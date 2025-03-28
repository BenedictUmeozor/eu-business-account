import { AccountContext } from "@/contexts/account";
import { useAppSelector } from "@/hooks";
import useAccountBalances from "@/hooks/use-account-balances";
import useAccountCurrencies from "@/hooks/use-account-currency";
import useAccounts from "@/hooks/use-accounts";
import { ReactNode, useEffect } from "react";

const AccountsProvider = ({ children }: { children: ReactNode }) => {
  const balances = useAppSelector(state => state.accounts.balances);
  const currencies = useAppSelector(state => state.accounts.currencies);
  const accounts = useAppSelector(state => state.accounts.accounts);
  const onboardingStatus = useAppSelector(
    state => state.session.onboardingStatus
  );
  const { isPending: currencyLoading, fetchCurrencies } =
    useAccountCurrencies();
  const { isPending: balanceLoading, fetchBalance } = useAccountBalances();
  const { fetchAccounts, isPending: accountsLoading } = useAccounts();

  useEffect(() => {
    fetchAccounts();
    fetchCurrencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!accounts) {
      fetchAccounts();
    }
  }, [accounts, fetchAccounts]);

  useEffect(() => {
    if (!currencies?.length || !onboardingStatus?.completed) return;

    const shouldFetchAll = !balances || balances.length === 0;

    const currenciesToFetch = shouldFetchAll
      ? currencies
      : currencies.filter(
          currency => !balances.some(balance => balance.ccy === currency)
        );

    if (currenciesToFetch.length > 0) {
      Promise.all(
        currenciesToFetch.map(currency => fetchBalance(currency))
      ).catch(error => console.error("Failed to fetch balances:", error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies, balances, onboardingStatus?.completed]);

  useEffect(() => {
    const handlePageRefresh = () => {
      if (currencies?.length && onboardingStatus?.completed) {
        currencies.forEach(currency => fetchBalance(currency));
      }
    };

    window.addEventListener("pageshow", event => {
      if (event.persisted) {
        fetchAccounts();
        handlePageRefresh();
      }
    });

    return () => {
      window.removeEventListener("pageshow", handlePageRefresh);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies, onboardingStatus?.completed]);

  return (
    <AccountContext.Provider
      value={{
        currencyLoading,
        balanceLoading,
        accountsLoading,
      }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountsProvider;
