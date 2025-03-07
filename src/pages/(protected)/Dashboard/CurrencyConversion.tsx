import { Button, Input, message, Modal, Select, Spin } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { NumericFormat } from "react-number-format";
import { ArrowDownIcon, Loader2Icon } from "lucide-react";
import ENDPOINTS from "@/constants/endpoints";
import useSharedMutationAction from "@/hooks/use-shared-mutation-action";
import { getErrorMessage } from "@/utils";
import { CURRENCIES } from "@/constants/currencies";

const CurrencyConversion = forwardRef<HM.ModalRefObject>((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState("£");
  const [toCurrencySymbol, setToCurrencySymbol] = useState("$");
  const [fromAmount, setFromAmount] = useState("");
  const [formCurrency, setFormCurrency] = useState("GBP");
  const [toCurrency, setToCurrency] = useState("USD");
  const [toAmount, setToAmount] = useState<number>();
  const [indication, setIndication] = useState("");

  useImperativeHandle(ref, () => ({
    openModal: () => setOpen(true),
  }));

  const handleCloseForm = () => {
    setOpen(false);
    setFromAmount("");
    setFormCurrency("GBP");
    setToCurrency("USD");
    setToAmount(undefined);
    setIndication("");
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

  const changeMutation = useSharedMutationAction({
    url: ENDPOINTS.CONVERSION_RATE,
    method: "POST",
    invalidateQueries: ["conversions"],
    onSuccess: (data: HM.ConversionRate) => {
      message.success(data.message);
      handleCloseForm();
    },
    onError: error => {
      message.error(getErrorMessage(error));
    },
  });

  const handleConvert = async () => {
    if (fromAmount && formCurrency && toCurrency) {
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
    const selectedFromCountry = CURRENCIES.find(
      c => c.currencyCode === formCurrency
    );
    const selectedToCountry = CURRENCIES.find(
      c => c.currencyCode === toCurrency
    );

    if (selectedFromCountry) {
      setCurrencySymbol(selectedFromCountry.currencySymbol);
    }
    if (selectedToCountry) {
      setToCurrencySymbol(selectedToCountry.currencySymbol);
    }
  }, [formCurrency, toCurrency]);

  return (
    <Modal
      onCancel={handleCloseForm}
      open={open}
      width={500}
      footer={null}
      title={
        <span className="text-xl font-semibold text-grey-600">
          Currency Conversion
        </span>
      }>
      <section className="space-y-4">
        <div className="h-64 relative p-3 bg-primary-50 rounded-xl flex flex-col gap-2">
          <div className="h-32 bg-secondary-400 rounded-lg py-3 px-4 flex items-center justify-center">
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-between text-sm text-white">
                <span>From</span>
                <span className="font-nunito font-medium">
                  GBP Bal: £6,000,000
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
                    className="!bg-[#0B3E81] antd-select-custom text-white rounded-lg"
                    style={{ backgroundColor: "#0B3E81", color: "white" }}
                    value={formCurrency}
                    onChange={value => setFormCurrency(value)}
                    options={CURRENCIES.map(c => ({
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
                  {toAmount &&
                    `${toCurrencySymbol} ${toAmount.toLocaleString()}`}
                </span>
                <div className="w-28">
                  <Select
                    className="!bg-[#0B3E81] antd-select-custom text-white rounded-lg"
                    style={{ backgroundColor: "#0B3E81", color: "white" }}
                    value={toCurrency}
                    onChange={value => setToCurrency(value)}
                    options={CURRENCIES.map(c => ({
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
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            className="cursor-pointer  flex items-center justify-center h-12 w-12 rounded-full z-10 border-[5px] border-solid border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary-400 transform hover:bg-secondary-500"
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
            loading={changeMutation.isPending}
            onClick={handleConvert}>
            Convert
          </Button>
        </div>
      </section>
    </Modal>
  );
});

export default CurrencyConversion;
