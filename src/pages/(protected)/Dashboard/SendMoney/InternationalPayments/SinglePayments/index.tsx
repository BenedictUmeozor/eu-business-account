import { ArrowDownIcon, Loader2Icon } from "lucide-react";
import { NumericFormat } from "react-number-format";
import { Button, Input, Segmented, Select, message } from "antd";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAppSelector } from "@/hooks";
import useRemitterDestinations from "@/hooks/use-remitter-destinations";
import countries from "@/data/codes.json";
import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import useDelayTimer from "@/hooks/use-delay-timer";

interface GeneratedQuote {
  source_currency: string;
  target_currency: string;
  source_amount: number;
  target_amount: number;
  commission_type: "Commission" | "NoCommission";
  reference: string;
  rate: number;
  human_readable_rate: number;
  expiry: string;
  default_rate: number;
  mark_up: number;
  commission: number;
  commission_currency: string;
  source_country: string;
  target_country: string;
}

interface LocationState extends HM.GeneratedQuote {
  promo_code: string;
}

const InternationalSinglePayments = () => {
  const [searchParams] = useSearchParams();
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [formData, setFormData] = useState({
    commission_type: "Commission",
    source_currency: "",
    target_currency: "",
    target_country: "",
    source_country: "",
    amount: "",
  });

  const disabled = useMemo(
    () => Object.values(formData).some(value => value === ""),
    [formData]
  );

  const navigate = useNavigate();
  const accounts = useAppSelector(state => state.accounts.accounts);
  const {
    destinationCountries,
    destinationCountriesPending,
    getDestionationCurrencies,
  } = useRemitterDestinations();

  const getSourceCountry = useCallback((currency: string) => {
    if (currency === "EUR") {
      return "EU";
    }
    if (currency === "USD") {
      return "US";
    }
    if (currency === "GBP") {
      return "GB";
    }
    if (currency === "NGN") {
      return "NG";
    }
    if (currency === "DKK") {
      return "DK";
    }
    return countries.find(c => c.currencyCode === currency)?.countryCode || "";
  }, []);

  const sourceCountries = useMemo(() => {
    if (!accounts) return [];
    return accounts.map(account => ({
      currency: account.currency,
      iso: getSourceCountry(account.currency),
    }));
  }, [accounts, getSourceCountry]);

  const delay = useDelayTimer();

  const quoteMutation = useSharedMutationAction<HM.GeneratedQuote>({
    url: ENDPOINTS.GENERATE_QUOTE,
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const lockMutation = useSharedMutationAction<
    { reference: string },
    GeneratedQuote
  >({
    url: ENDPOINTS.LOCK_QUOTE,
    onSuccess: () => {
      if (quoteMutation.data) {
        navigate(
          "/dashboard/send-money/international-payments/single/select-beneficiary",
          {
            state: {
              ...quoteMutation.data,
              promo_code: promoCode,
            } as LocationState,
          }
        );
      }
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const currencySymbol = useMemo(() => {
    return (
      countries.find(c => c.currencyCode === searchParams.get("currency"))
        ?.currencySymbol || "£"
    );
  }, [searchParams]);

  const sourceCurrencySymbol = useMemo(() => {
    return (
      countries.find(c => c.currencyCode === formData.source_currency)
        ?.currencySymbol || "£"
    );
  }, [formData.source_currency]);

  const toCurrencySymbol = useMemo(() => {
    return (
      countries.find(c => c.currencyCode === formData.target_currency)
        ?.currencySymbol || "£"
    );
  }, [formData.target_currency]);

  const currentBalance = useMemo(() => {
    const balanceObj = accounts?.find(
      b => b.currency === formData.source_currency
    );
    return balanceObj?.balance?.amount || 0;
  }, [accounts, formData.source_currency]);

  const getDestinationCountry = useCallback(
    (currency: string) => {
      const country = destinationCountries.find(c => c.currency === currency);
      return country ? country.iso || "" : "";
    },
    [destinationCountries]
  );

  const handleClick = async () => {
    await lockMutation.mutateAsync({
      reference: quoteMutation.data?.reference || "",
      commission: quoteMutation.data?.commission.amount || 0,
      commission_currency: quoteMutation.data?.commission.currency || "",
      commission_type: formData.commission_type as
        | "Commission"
        | "NoCommission",
      default_rate: quoteMutation.data?.rates.default_rate || 0,
      expiry: quoteMutation.data?.expiry || "",
      human_readable_rate: quoteMutation.data?.rates.human_readable_rate || 0,
      mark_up: quoteMutation.data?.rates.mark_up || 0,
      rate: quoteMutation.data?.rates.rate || 0,
      source_amount: Number(formData.amount),
      source_currency: formData.source_currency,
      source_country: formData.source_country,
      target_amount: quoteMutation.data?.target.amount || 0,
      target_country: formData.target_country,
      target_currency: formData.target_currency,
    });
  };

  useEffect(() => {
    if (formData.source_currency) {
      getDestionationCurrencies(formData.source_currency);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.source_currency]);

  const runQuoteFunction = async () => {
    quoteMutation.reset();
    await delay(300);
    await quoteMutation.mutateAsync(formData);
  };

  const handleQuoteFn = async () => {
    if (Object.values(formData).every(val => Boolean(val))) {
      quoteMutation.reset();
      await quoteMutation.mutateAsync(formData);
    }
  };

  useEffect(() => {
    if (!formData.source_currency) {
      setFormData(prev => ({
        ...prev,
        source_currency: searchParams.get("currency") || "",
        source_country: getSourceCountry(searchParams.get("currency") || ""),
      }));
    }
  }, [searchParams, getSourceCountry, formData.source_currency]);

  useEffect(() => {
    if (
      Object.values(formData).every(val => Boolean(val)) &&
      Number(formData?.amount ?? 0) > 9
    ) {
      runQuoteFunction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

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
                    {formData.source_currency} Bal: {currencySymbol}
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
                      prefix={`${sourceCurrencySymbol} `}
                      placeholder="Enter amount"
                      className="bg-transparent border-0 !text-lg text-white font-nunito placeholder:text-gray-400"
                      value={formData.amount}
                      onValueChange={values =>
                        setFormData(prev => ({
                          ...prev,
                          amount: values.value,
                        }))
                      }
                    />
                  </div>
                  <div className="w-28">
                    <Select
                      className="!bg-[#0B3E81] antd-select-custom text-white rounded-lg"
                      style={{ backgroundColor: "#0B3E81", color: "white" }}
                      dropdownStyle={{
                        width: "100px",
                      }}
                      value={formData.source_currency}
                      onChange={value =>
                        setFormData(prev => ({
                          ...prev,
                          source_currency: value,
                          target_currency: "",
                          target_country: "",
                          source_country: getSourceCountry(value),
                        }))
                      }
                      options={sourceCountries.map(c => ({
                        label: (
                          <div className="flex items-center gap-2 bg-transparent">
                            <img
                              src={ENDPOINTS.FLAG_URL(c.iso?.toLowerCase())}
                              alt={c.currency}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                            <span
                              className={`${formData.source_country === c.iso ? "text-white" : "text-grey-700"}`}>
                              {c.currency}
                            </span>
                          </div>
                        ),
                        value: c.currency,
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
                    {quoteMutation.data?.target.amount ? (
                      `${toCurrencySymbol}${quoteMutation.data.target.amount.toLocaleString()}`
                    ) : quoteMutation.isPending ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      `N/A`
                    )}
                  </span>
                  <div className="w-28">
                    <Select
                      className="!bg-[#0B3E81] antd-select-custom text-white rounded-lg placeholder:!text-white"
                      style={{ backgroundColor: "#0B3E81", color: "white" }}
                      value={formData.target_currency}
                      virtual={false}
                      onChange={value =>
                        setFormData(prev => ({
                          ...prev,
                          target_currency: value,
                          target_country: getDestinationCountry(value),
                        }))
                      }
                      dropdownStyle={{
                        width: "150px",
                      }}
                      loading={destinationCountriesPending}
                      options={destinationCountries.map((c, index) => ({
                        key: index.toString(),
                        label: (
                          <div className="flex items-center gap-2 bg-transparent">
                            <img
                              src={ENDPOINTS.FLAG_URL(c.iso?.toLowerCase())}
                              alt={c.currency}
                              className="h-6 w-6 rounded-full object-cover"
                            />
                            <span
                              className={`${formData.target_country === c.iso ? "text-white" : "text-grey-700"}`}>
                              {c.currency}
                            </span>
                          </div>
                        ),
                        value: c.currency,
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              className="cursor-pointer flex items-center justify-center h-12 w-12 rounded-full z-10 border-[5px] border-solid border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary-400 transform hover:bg-secondary-500"
              role="button"
              onClick={handleQuoteFn}
              disabled={quoteMutation.isPending}>
              {quoteMutation.isPending ? (
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
                    value: "Commission",
                  },
                  {
                    label: "No fees",
                    value: "NoCommission",
                  },
                ]}
                onChange={value =>
                  setFormData(prev => ({ ...prev, commission_type: value }))
                }
                value={formData.commission_type}
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
                      {quoteMutation.data?.commission.amount
                        ? sourceCurrencySymbol
                        : ""}
                      {quoteMutation.data?.commission.amount || "N/A"}
                    </td>
                  </tr>
                  <tr className="[&:not(:last-child)]:mb-3">
                    <th className="font-normal text-grey-500 text-base text-left w-1/2">
                      Rate
                    </th>
                    <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                      {quoteMutation.data?.rates.human_readable_rate
                        ? toCurrencySymbol +
                          quoteMutation.data?.rates.human_readable_rate
                        : "N/A"}
                    </td>
                  </tr>
                  <tr className="[&:not(:last-child)]:mb-3">
                    <th className="font-normal text-grey-500 text-base text-left w-1/2">
                      Payable Amount
                    </th>
                    <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                      {quoteMutation.data?.payable.amount_payable
                        ? sourceCurrencySymbol +
                          quoteMutation.data?.payable.amount_payable
                        : "N/A"}
                    </td>
                  </tr>
                  <tr className="[&:not(:last-child)]:mb-3">
                    <th className="font-normal text-grey-500 text-base text-left w-2/3">
                      Got a valid promo code?{" "}
                      <Button
                        onClick={() => setShowPromoCode(true)}
                        type="text"
                        className="text-primary ">
                        Enter here
                      </Button>
                    </th>
                  </tr>
                </tbody>
              </table>
              {showPromoCode && (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Promo Code"
                    onChange={e => setPromoCode(e.target.value)}
                  />
                </div>
              )}
            </section>
          </div>
        </section>
        <div className="flex items-center justify-center">
          <Button
            type="primary"
            className="w-48 mx-auto"
            size="large"
            shape="round"
            loading={lockMutation.isPending}
            disabled={
              !formData.amount ||
              quoteMutation.isPending ||
              disabled ||
              !quoteMutation.data
            }
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
