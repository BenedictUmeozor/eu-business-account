import { AccountContext } from "@/contexts/account";
import { useAppSelector } from "@/hooks";
import useAccountCurrencies from "@/hooks/use-account-currency";
import useAccounts from "@/hooks/use-accounts";
import { ReactNode, useEffect } from "react";

const AccountsProvider = ({ children }: { children: ReactNode }) => {
  const accounts = useAppSelector(state => state.accounts.accounts);
  const { isPending: currencyLoading, fetchCurrencies } =
    useAccountCurrencies();
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

  return (
    <AccountContext.Provider
      value={{
        accountsLoading,
        currencyLoading,
      }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountsProvider;
