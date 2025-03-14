import HM_NSP from "@/constants/namespace";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearSession } from "./session";

const accountState = sessionStorage.getItem(HM_NSP.ACCOUNT);
const balanceState = sessionStorage.getItem(HM_NSP.ACCOUNT_BALANCES);
const currencyState = sessionStorage.getItem(HM_NSP.ACCOUNT_CURRENCIES);

interface AccountState {
  accounts: HM.AccountDetails | null;
  balances: HM.BalanceInfo[] | null;
  currencies: string[] | null;
}

const initialState: AccountState = {
  accounts: accountState ? JSON.parse(accountState) : null,
  balances: balanceState ? JSON.parse(balanceState) : null,
  currencies: currencyState ? JSON.parse(currencyState) : null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccounts: (state, action: PayloadAction<HM.AccountDetails>) => {
      state.accounts = action.payload;
      sessionStorage.setItem(HM_NSP.ACCOUNT, JSON.stringify(action.payload));
    },
    setBalances: (state, action: PayloadAction<HM.BalanceInfo>) => {
      if (!state.balances) {
        state.balances = [action.payload];
      } else {
        const existingIndex = state.balances.findIndex(
          balance => balance.ccy === action.payload.ccy
        );

        if (existingIndex !== -1) {
          state.balances[existingIndex] = action.payload;
        } else {
          state.balances.push(action.payload);
        }
      }

      sessionStorage.setItem(
        HM_NSP.ACCOUNT_BALANCES,
        JSON.stringify(state.balances)
      );
    },
    setCurrencies: (state, action: PayloadAction<string[]>) => {
      state.currencies = action.payload;
      sessionStorage.setItem(
        HM_NSP.ACCOUNT_CURRENCIES,
        JSON.stringify(action.payload)
      );
    },
    clearAccount: state => {
      state.accounts = null;
      state.balances = null;
      state.currencies = null;
      sessionStorage.removeItem(HM_NSP.ACCOUNT_CURRENCIES);
      sessionStorage.removeItem(HM_NSP.ACCOUNT);
      sessionStorage.removeItem(HM_NSP.ACCOUNT_BALANCES);
    },
  },
  extraReducers: builder => {
    builder.addCase(clearSession, state => {
      state.accounts = null;
      state.balances = null;
      state.currencies = null;
      sessionStorage.removeItem(HM_NSP.ACCOUNT_CURRENCIES);
      sessionStorage.removeItem(HM_NSP.ACCOUNT);
      sessionStorage.removeItem(HM_NSP.ACCOUNT_BALANCES);
    });
  },
});

export const { setAccounts, setBalances, clearAccount, setCurrencies } =
  accountSlice.actions;
export default accountSlice.reducer;
