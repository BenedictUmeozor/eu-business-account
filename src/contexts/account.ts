import { createContext, useContext } from "react";

export interface AccountContextInterface {
  accountsLoading: boolean;
}

export const AccountContext = createContext<AccountContextInterface>({
  accountsLoading: false,
});

export const useAccountContext = () => {
  return useContext(AccountContext);
};
