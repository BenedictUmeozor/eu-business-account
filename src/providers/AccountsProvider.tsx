import { AccountContext } from "@/contexts/account";
import { useAppSelector } from "@/hooks";
import useAccounts from "@/hooks/use-accounts";
import { ReactNode, useEffect } from "react";

const AccountsProvider = ({ children }: { children: ReactNode }) => {
  const accounts = useAppSelector(state => state.accounts.accounts);
  const { fetchAccounts, isPending: accountsLoading } = useAccounts();

  useEffect(() => {
    fetchAccounts();
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
      }}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountsProvider;
