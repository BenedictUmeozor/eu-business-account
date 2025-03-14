import { AccountContext } from "@/contexts/account";
import { useAppSelector } from "@/hooks";
import useAccountBalances from "@/hooks/use-account-balances";
import useAccountCurrencies from "@/hooks/use-account-currency";
import { ReactNode, useEffect } from "react";

const AccountsProvider = ({ children }: { children: ReactNode }) => {
  const balances = useAppSelector(state => state.accounts.balances);
  const currencies = useAppSelector(state => state.accounts.currencies);
  const onboardingStatus = useAppSelector(
    state => state.session.onboardingStatus
  );
  const { isPending: currencyLoading, fetchCurrencies } =
    useAccountCurrencies();
  const { isPending: balanceLoading, fetchBalance } = useAccountBalances();

  useEffect(() => {
    fetchCurrencies();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currencies?.length || !onboardingStatus?.completed) return;

    const currenciesToFetch = currencies.filter(
      currency => !balances?.some(balance => balance.ccy === currency)
    );

    if (currenciesToFetch.length > 0) {
      Promise.all(
        currenciesToFetch.map(currency => fetchBalance(currency))
      ).catch(error => console.error("Failed to fetch balances:", error));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencies, balances, onboardingStatus?.completed]);

  return (
    <AccountContext.Provider
      value={{
        currencyLoading,
        balanceLoading,
      }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountsProvider;
