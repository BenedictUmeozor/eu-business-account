import { Button, Input, message, Select, Spin } from "antd";
import { ArrowDownIcon, Loader2Icon } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { NumericFormat } from "react-number-format";
import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import usePartnerCurrency from "@/hooks/use-partner-currency";
import { useAppSelector } from "@/hooks";
import useAccounts from "@/hooks/use-accounts";

interface ConversionFormProps {
  onClose: () => void;
}

const ConversionForm = ({ onClose }: ConversionFormProps) => {
  const [formData, setFormData] = useState({
    currencySymbol: "",
    toCurrencySymbol: "",
    fromAmount: "",
    fromCurrency: "GBP",
    toCurrency: "USD",
    toAmount: undefined as number | undefined,
  });
  const [indication, setIndication] = useState("");
  const accounts = useAppSelector(state => state.accounts.accounts);

  const { fetchAccounts } = useAccounts();
  const { currencies, loading } = usePartnerCurrency();

  const handleCloseForm = () => {
    onClose();
    setFormData({
      currencySymbol: "",
      toCurrencySymbol: "",
      fromAmount: "",
      fromCurrency: "GBP",
      toCurrency: "USD",
      toAmount: undefined,
    });
    setIndication("");
  };

  const handleFromCurrencyChange = (value: string) => {
    setFormData(prev => ({ ...prev, fromCurrency: value }));
    if (value === formData.toCurrency) {
      const alternativeCurrency =
        currencies.find(c => c.currencyCode !== value)?.currencyCode || "USD";
      setFormData(prev => ({ ...prev, toCurrency: alternativeCurrency }));
    }
  };

  const handleToCurrencyChange = (value: string) => {
    setFormData(prev => ({ ...prev, toCurrency: value }));
    if (value === formData.fromCurrency) {
      const alternativeCurrency =
        currencies.find(c => c.currencyCode !== value)?.currencyCode || "GBP";
      setFormData(prev => ({ ...prev, fromCurrency: alternativeCurrency }));
    }
  };

  const rateMutation = useSharedMutationAction({
    url: ENDPOINTS.CONVERSION_INDICATIVE_RATE,
    method: "POST",
    invalidateQueries: ["conversions"],
    onSuccess: (data: HM.IndicativeRate) => {
      setIndication(data.indication);
      setFormData(prev => ({ ...prev, toAmount: data.target_amount }));
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
    onSuccess: async data => {
      message.success(data.message);
      handleCloseForm();
      await fetchAccounts();
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const currentCurrencyBalance = useMemo(() => {
    return (
      accounts?.find(b => b.currency === formData.fromCurrency)?.balance
        ?.amount || 0
    );
  }, [accounts, formData.fromCurrency]);

  const handleConvert = useCallback(async () => {
    if (formData.fromAmount && formData.fromCurrency && formData.toCurrency) {
      changeMutation.reset();

      await changeMutation.mutateAsync({
        amount: formData.fromAmount,
        source_currency: formData.fromCurrency,
        target_currency: formData.toCurrency,
      });
    } else {
      message.error("Please fill in all fields");
    }
  }, [
    formData.fromAmount,
    formData.fromCurrency,
    formData.toCurrency,
    changeMutation,
  ]);

  const handleConversionRate = async () => {
    rateMutation.reset();

    if (formData.fromAmount && formData.fromCurrency && formData.toCurrency) {
      await rateMutation.mutateAsync({
        amount: formData.fromAmount,
        source_currency: formData.fromCurrency,
        target_currency: formData.toCurrency,
      });
    } else {
      message.error("Please fill in all fields");
    }
  };

  useEffect(() => {
    if (
      formData.fromAmount &&
      formData.fromCurrency &&
      formData.toCurrency &&
      Number(formData.fromAmount) > 4
    ) {
      rateMutation.reset();

      rateMutation.mutate({
        amount: formData.fromAmount,
        source_currency: formData.fromCurrency,
        target_currency: formData.toCurrency,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.fromAmount, formData.fromCurrency, formData.toCurrency]);

  useEffect(() => {
    const selectedFromCountry = currencies.find(
      c => c.currencyCode === formData.fromCurrency
    );
    const selectedToCountry = currencies.find(
      c => c.currencyCode === formData.toCurrency
    );

    if (selectedFromCountry) {
      setFormData(prev => ({
        ...prev,
        currencySymbol: selectedFromCountry.currencySymbol,
      }));
    }
    if (selectedToCountry) {
      setFormData(prev => ({
        ...prev,
        toCurrencySymbol: selectedToCountry.currencySymbol,
      }));
    }
  }, [formData.fromCurrency, formData.toCurrency, currencies]);

  useEffect(() => {
    handleToCurrencyChange("USD");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full bg-white shadow-sm rounded-lg p-5 mb-12 max-w-lg mx-auto">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-grey-600">
          Currency Conversion
        </h3>
      </div>

      <section className="space-y-4">
        <div className="h-64 relative p-3 bg-primary-50 rounded-xl flex flex-col gap-2">
          <div className="h-32 bg-secondary-400 rounded-lg py-3 px-4 flex items-center justify-center">
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-between text-sm text-white">
                <span>From</span>
                <span className="font-nunito font-medium">
                  {formData.fromCurrency} Bal: {formData.currencySymbol}
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
                    prefix={`${formData.currencySymbol} `}
                    placeholder="Enter amount"
                    className="bg-transparent border-0 !text-lg text-white font-nunito placeholder:text-gray-400"
                    value={formData.fromAmount}
                    onValueChange={values =>
                      setFormData(prev => ({
                        ...prev,
                        fromAmount: values.value,
                      }))
                    }
                  />
                </div>
                <div className="w-28">
                  <Select
                    className="!bg-[#0B3E81] antd-select-custom text-white rounded-lg"
                    style={{ backgroundColor: "#0B3E81", color: "white" }}
                    value={formData.fromCurrency}
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
                            className={`${formData.fromCurrency === c.currencyCode ? "text-white" : "text-grey-700"}`}>
                            {c.currencyCode}
                          </span>
                        </div>
                      ),
                      value: c.currencyCode,
                      disabled: c.currencyCode === formData.toCurrency,
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="h-32 bg-secondary-400 rounded-lg py-3 px-4 flex items-center justify-center">
            <div className="space-y-4 text-white w-full">
              <span className="text-sm">Recipient gets</span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium font-nunito">
                  {formData.toAmount &&
                    `${formData.toCurrencySymbol} ${formData.toAmount.toLocaleString()}`}
                </span>
                <div className="w-28">
                  <Select
                    className="!bg-[#0B3E81] antd-select-custom text-white rounded-lg"
                    style={{ backgroundColor: "#0B3E81", color: "white" }}
                    value={formData.toCurrency}
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
                            className={`${formData.toCurrency === c.currencyCode ? "text-white" : "text-grey-700"}`}>
                            {c.currencyCode}
                          </span>
                        </div>
                      ),
                      value: c.currencyCode,
                      disabled: c.currencyCode === formData.fromCurrency,
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            className="cursor-pointer flex items-center justify-center h-12 w-12 rounded-full z-10 border-[5px] border-solid border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary-400 transform hover:bg-secondary-500"
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
            disabled={!formData.toAmount || rateMutation.isPending}
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
