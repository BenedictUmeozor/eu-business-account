import { Button, Input, message, Select, Spin } from "antd";
import { ArrowDownIcon, Loader2Icon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { NumericFormat } from "react-number-format";
import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import useAccountBalances from "@/hooks/use-account-balances";
import usePartnerCurrency from "@/hooks/use-partner-currency";
import { useAppSelector } from "@/hooks";

interface ConversionFormProps {
  onClose: () => void;
}

const ConversionForm = ({ onClose }: ConversionFormProps) => {
  const [currencySymbol, setCurrencySymbol] = useState("£");
  const [toCurrencySymbol, setToCurrencySymbol] = useState("$");
  const [fromAmount, setFromAmount] = useState("");
  const [formCurrency, setFormCurrency] = useState("GBP");
  const [toCurrency, setToCurrency] = useState("USD");
  const [toAmount, setToAmount] = useState<number>();
  const [indication, setIndication] = useState("");
  const balances = useAppSelector(state => state.accounts.balances);

  const { fetchBalance } = useAccountBalances();
  const { currencies, loading } = usePartnerCurrency();

  const handleCloseForm = () => {
    onClose();
    setFromAmount("");
    setFormCurrency("GBP");
    setToCurrency("USD");
    setToAmount(undefined);
    setIndication("");
  };

  const handleFromCurrencyChange = (value: string) => {
    setFormCurrency(value);
    if (value === toCurrency) {
      const alternativeCurrency =
        currencies.find(c => c.currencyCode !== value)?.currencyCode || "USD";
      setToCurrency(alternativeCurrency);
    }
  };

  const handleToCurrencyChange = (value: string) => {
    setToCurrency(value);
    if (value === formCurrency) {
      const alternativeCurrency =
        currencies.find(c => c.currencyCode !== value)?.currencyCode || "GBP";
      setFormCurrency(alternativeCurrency);
    }
  };

  const rateMutation = useSharedMutationAction({
    url: ENDPOINTS.CONVERSION_INDICATIVE_RATE,
    method: "POST",
    invalidateQueries: ["conversions"],
    onSuccess: (data: HM.IndicativeRate) => {
      setIndication(data.indication);
      setToAmount(data.target_amount);
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const changeMutation = useSharedMutationAction<
    HM.ConversionRate,
    {
      source_currency: string;
      target_currency: string;
      amount: string;
    }
  >({
    url: ENDPOINTS.CONVERSION_RATE,
    method: "POST",
    invalidateQueries: ["conversions"],
    onSuccess: async (data, variables) => {
      message.success(data.message);
      handleCloseForm();
      await Promise.all([
        fetchBalance(variables.source_currency),
        fetchBalance(variables.target_currency),
      ]);
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const currentCurrencyBalance = useMemo(() => {
    return balances?.find(b => b.ccy === formCurrency)?.amount;
  }, [balances, formCurrency]);

  const handleConvert = async () => {
    if (fromAmount && formCurrency && toCurrency) {
      changeMutation.reset();

      await changeMutation.mutateAsync({
        amount: fromAmount,
        source_currency: formCurrency,
        target_currency: toCurrency,
      });
    } else {
      message.error("Please fill in all fields");
    }
  };

  const handleConversionRate = async () => {
    if (fromAmount && formCurrency && toCurrency) {
      rateMutation.reset();

      await rateMutation.mutateAsync({
        amount: fromAmount,
        source_currency: formCurrency,
        target_currency: toCurrency,
      });
    } else {
      message.error("Please fill in all fields");
    }
  };

  useEffect(() => {
    if (fromAmount && formCurrency && toCurrency) {
      rateMutation.reset();

      rateMutation.mutate({
        amount: fromAmount,
        source_currency: formCurrency,
        target_currency: toCurrency,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromAmount, formCurrency, toCurrency]);

  useEffect(() => {
    const selectedFromCountry = currencies.find(
      c => c.currencyCode === formCurrency
    );
    const selectedToCountry = currencies.find(
      c => c.currencyCode === toCurrency
    );

    if (selectedFromCountry) {
      setCurrencySymbol(selectedFromCountry.currencySymbol);
    }
    if (selectedToCountry) {
      setToCurrencySymbol(selectedToCountry.currencySymbol);
    }
  }, [formCurrency, toCurrency, currencies]);

  return (
    <div className="w-full bg-white shadow-sm rounded-lg p-5 mb-12 max-w-lg mx-auto">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-grey-600">
          Currency Conversion
        </h3>
      </div>

      <section className="space-y-4">
        <div className="h-64 relative p-3 bg-primary-50 rounded-xl flex flex-col gap-2">
          <div className="h-32 bg-primary rounded-lg py-3 px-4 flex items-center justify-center">
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-between text-sm text-white">
                <span>From</span>
                <span className="font-nunito font-medium">
                  {formCurrency} Bal: {currencySymbol}
                  {currentCurrencyBalance}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="w-36">
                  <NumericFormat
                    customInput={Input}
                    thousandSeparator={true}
                    decimalScale={2}
                    allowNegative={false}
                    prefix={`${currencySymbol} `}
                    placeholder="Enter amount"
                    className="bg-transparent border-0 !text-lg text-white font-nunito placeholder:text-gray-400"
                    value={fromAmount}
                    onValueChange={values => setFromAmount(values.value)}
                  />
                </div>
                <div className="w-28">
                  <Select
                    className="!bg-[#0B3E81] antd-select-custom page text-white rounded-lg"
                    style={{ backgroundColor: "#0B3E81", color: "white" }}
                    value={formCurrency}
                    onChange={handleFromCurrencyChange}
                    loading={loading}
                    options={currencies.map(c => ({
                      label: (
                        <div className="flex items-center gap-2 bg-transparent">
                          <img
                            src={c.flag}
                            alt={c.currencyCode}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <span
                            className={`${formCurrency === c.currencyCode ? "text-white" : "text-grey-700"}`}>
                            {c.currencyCode}
                          </span>
                        </div>
                      ),
                      value: c.currencyCode,
                      disabled: c.currencyCode === toCurrency,
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="h-32 bg-primary rounded-lg py-3 px-4 flex items-center justify-center">
            <div className="space-y-4 text-white w-full">
              <span className="text-sm">Recipient gets</span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium font-nunito">
                  {toAmount &&
                    `${toCurrencySymbol} ${toAmount.toLocaleString()}`}
                </span>
                <div className="w-28">
                  <Select
                    className="!bg-[#0B3E81] antd-select-custom page text-white rounded-lg"
                    style={{ backgroundColor: "#0B3E81", color: "white" }}
                    value={toCurrency}
                    onChange={handleToCurrencyChange}
                    loading={loading}
                    options={currencies.map(c => ({
                      label: (
                        <div className="flex items-center gap-2 bg-transparent">
                          <img
                            src={c.flag}
                            alt={c.currencyCode}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <span
                            className={`${toCurrency === c.currencyCode ? "text-white" : "text-grey-700"}`}>
                            {c.currencyCode}
                          </span>
                        </div>
                      ),
                      value: c.currencyCode,
                      disabled: c.currencyCode === formCurrency,
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            className="cursor-pointer flex items-center justify-center h-12 w-12 rounded-full z-10 border-[5px] border-solid border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary transform hover:bg-secondary-500"
            role="button"
            disabled={changeMutation.isPending}
            onClick={handleConversionRate}>
            {rateMutation.isPending ? (
              <Loader2Icon className="w-5 h-5 text-white animate-spin" />
            ) : (
              <ArrowDownIcon className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {rateMutation.isPending ? (
          <div className="flex items-center justify-center">
            <Spin />
          </div>
        ) : indication ? (
          <p className="text-center text-grey-500">{indication}</p>
        ) : null}
        <div className="h-14 rounded-[60px] bg-primary-100 flex items-center justify-between gap-4 px-4">
          <span className="text-grey-600">Conversion fees: 0.00</span>
          <Button
            size="large"
            type="primary"
            shape="round"
            className="w-48"
            disabled={!toAmount || rateMutation.isPending}
            loading={changeMutation.isPending}
            onClick={handleConvert}>
            Deposit
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ConversionForm;
