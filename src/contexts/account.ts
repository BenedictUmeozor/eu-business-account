import { createContext, useContext } from "react";

export interface AccountContextInterface {
  currencyLoading: boolean;
  balanceLoading: boolean;
  accountsLoading: boolean;
}

export const AccountContext = createContext<AccountContextInterface>({
  currencyLoading: false,
  balanceLoading: false,
  accountsLoading: false,
});

export const useAccountContext = () => {
  return useContext(AccountContext);
};
