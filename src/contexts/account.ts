import { createContext, useContext } from "react";

export interface AccountContextInterface {
  currencyLoading: boolean;
  balanceLoading: boolean;
}

export const AccountContext = createContext<AccountContextInterface>({
  currencyLoading: false,
  balanceLoading: false,
});

export const useAccountContext = () => {
  return useContext(AccountContext);
};
