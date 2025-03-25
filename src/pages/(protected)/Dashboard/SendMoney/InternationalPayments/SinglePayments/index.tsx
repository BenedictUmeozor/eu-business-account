import { ArrowDownIcon, Loader2Icon } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { Button, Input, Segmented, Select, message } from "antd";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import usePartnerCurrency from "@/hooks/use-partner-currency";
import { useAppSelector } from "@/hooks";

const InternationalSinglePayments = () => {
  const [searchParams] = useSearchParams();

  const [segment, setSegment] = useState(0);
  const [formAmount, setFormAmount] = useState("");
  const [toCurrency, setToCurrency] = useState<string>("GBP");
  const [toAmount, setToAmount] = useState<number>();
  const [indication, setIndication] = useState("");
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState<string>("");
  const [toCurrencySymbol, setToCurrencySymbol] = useState<string>("");

  const navigate = useNavigate();
  const balances = useAppSelector(state => state.accounts.balances);
  const { currencies, loading } = usePartnerCurrency();

  const currentBalance = useMemo(() => {
    const balanceObj = balances?.find(
      b => b.ccy === searchParams.get("currency")
    );
    return balanceObj?.amount || 0;
  }, [balances, searchParams]);

  const handleClick = () => {
    navigate(
      "/dashboard/send-money/international-payments/single/select-beneficiary"
    );
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

  const handleConversionRate = async () => {
    rateMutation.reset();

    if (formAmount && searchParams.get("currency") && toCurrency) {
      await rateMutation.mutateAsync({
        amount: formAmount,
        source_currency: searchParams.get("currency"),
        target_currency: toCurrency,
      });
    } else {
      message.error("Please fill in all fields");
    }
  };

  const togglePromoInput = () => {
    setShowPromoInput(!showPromoInput);
  };

  const applyPromoCode = () => {
    if (promoCode) {
      message.success(`Promo code "${promoCode}" applied successfully!`);
      setShowPromoInput(false);
    } else {
      message.error("Please enter a valid promo code");
    }
  };

  useEffect(() => {
    if (
      formAmount &&
      searchParams.get("currency") &&
      toCurrency &&
      Number(formAmount) > 4
    ) {
      rateMutation.reset();
      rateMutation.mutate({
        amount: formAmount,
        source_currency: searchParams.get("currency"),
        target_currency: toCurrency,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formAmount, searchParams, toCurrency]);

  useEffect(() => {
    const selectedFromCountry = currencies.find(
      c => c.currencyCode === searchParams.get("currency")
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
  }, [searchParams, toCurrency, currencies]);

  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <h3 className="text-xl text-grey-700 font-semibold">Send Money</h3>
        <section className="space-y-6">
          <div className="h-64 relative p-3 bg-primary-50 rounded-xl flex flex-col gap-2">
            <div className="h-32 bg-secondary-400 rounded-lg py-3 px-4 flex items-center justify-center">
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between text-sm text-white">
                  <span>You send</span>
                  <span className="font-nunito font-medium">
                    {searchParams.get("currency")} Bal: {currencySymbol}
                    {currentBalance.toLocaleString()}
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
                      value={formAmount}
                      onValueChange={values => setFormAmount(values.value)}
                    />
                  </div>
                  <div className="w-28">
                    <Select
                      className="!bg-[#0B3E81] antd-select-custom text-white rounded-lg"
                      style={{ backgroundColor: "#0B3E81", color: "white" }}
                      value={searchParams.get("currency")}
                      disabled
                      options={currencies.map(c => ({
                        label: (
                          <div className="flex items-center gap-2 bg-transparent">
                            <img
                              src={c.flag}
                              alt={c.currencyCode}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                            <span
                              className={`${searchParams.get("currency") === c.currencyCode ? "text-white" : "text-grey-700"}`}>
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
            <div className="h-32 bg-secondary-400 rounded-lg py-3 px-4 flex items-center justify-center">
              <div className="space-y-4 text-white w-full">
                <span className="text-sm">Recipient gets</span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium font-nunito">
                    {toAmount
                      ? `${toCurrencySymbol}${toAmount.toLocaleString()}`
                      : rateMutation.isPending
                        ? "Calculating..."
                        : `${toCurrencySymbol}0.00`}
                  </span>
                  <div className="w-28">
                    <Select
                      className="!bg-[#0B3E81] antd-select-custom text-white rounded-lg placeholder:!text-white"
                      style={{ backgroundColor: "#0B3E81", color: "white" }}
                      value={toCurrency}
                      onChange={value => setToCurrency(value)}
                      loading={loading}
                      placeholder="Select One"
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
                        disabled:
                          c.currencyCode === searchParams.get("currency"),
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              className="cursor-pointer flex items-center justify-center h-12 w-12 rounded-full z-10 border-[5px] border-solid border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary-400 transform hover:bg-secondary-500"
              role="button"
              disabled={rateMutation.isPending}
              onClick={handleConversionRate}>
              {rateMutation.isPending ? (
                <Loader2Icon className="w-5 h-5 text-white animate-spin" />
              ) : (
                <ArrowDownIcon className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <Segmented
                options={[
                  {
                    label: "Commission fees",
                    value: 0,
                  },
                  {
                    label: "No fees",
                    value: 1,
                  },
                ]}
                onChange={value => setSegment(value)}
                value={segment}
                className="w-full rounded-lg border border-solid border-grey-200 bg-white p-1 [&_.ant-segmented-item-selected]:bg-primary-50 [&_.ant-segmented-item-selected]:text-primary [&_.ant-segmented-item:hover]:bg-primary-50 [&_.ant-segmented-item:hover]:text-primary [&_.ant-segmented-item]:grid [&_.ant-segmented-item]:h-10 [&_.ant-segmented-item]:place-items-center [&_.ant-segmented-item]:text-primary"
                block
              />
            </div>
            <section className="px-4">
              <table className="w-full">
                <tbody>
                  <tr className="[&:not(:last-child)]:mb-3">
                    <th className="font-normal text-grey-500 text-base text-left w-1/2">
                      Commission fee
                    </th>
                    <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                      £4.00
                    </td>
                  </tr>
                  <tr className="[&:not(:last-child)]:mb-3">
                    <th className="font-normal text-grey-500 text-base text-left w-1/2">
                      Rate
                    </th>
                    <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                      {indication || `N/A`}
                    </td>
                  </tr>
                  <tr className="[&:not(:last-child)]:mb-3">
                    <th className="font-normal text-grey-500 text-base text-left w-1/2">
                      Payable Amount
                    </th>
                    <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                      {formAmount
                        ? `${currencySymbol}${parseFloat(formAmount).toLocaleString()}`
                        : `${currencySymbol}0`}
                    </td>
                  </tr>
                  {showPromoInput ? (
                    <tr className="[&:not(:last-child)]:mb-3">
                      <td colSpan={2}>
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Enter promo code"
                            value={promoCode}
                            onChange={e => setPromoCode(e.target.value)}
                            className="flex-grow"
                          />
                          <Button
                            type="primary"
                            size="middle"
                            onClick={applyPromoCode}
                            disabled={!promoCode}>
                            Apply
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr className="[&:not(:last-child)]:mb-3">
                      <th className="font-normal text-grey-500 text-base text-left w-2/3">
                        Got a valid promo code?{" "}
                        <button
                          onClick={togglePromoInput}
                          className="text-primary underline bg-transparent border-none p-0 cursor-pointer">
                          Enter here
                        </button>
                      </th>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          </div>
        </section>
        <div className="flex items-center justify-center">
          <Button
            type="primary"
            className="w-48 mx-auto"
            size="large"
            shape="round"
            disabled={!formAmount || rateMutation.isPending}
            onClick={handleClick}
            block>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Component = InternationalSinglePayments;

export default InternationalSinglePayments;
