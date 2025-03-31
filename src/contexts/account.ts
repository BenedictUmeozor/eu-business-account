import { createContext, useContext } from "react";

export interface AccountContextInterface {
  currencyLoading: boolean;
  accountsLoading: boolean;
}

export const AccountContext = createContext<AccountContextInterface>({
  currencyLoading: false,
  accountsLoading: false,
});

export const useAccountContext = () => {
  return useContext(AccountContext);
};
