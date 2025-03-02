import { Button, Input, Modal, Select } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import countries from "@/data/codes.json";
import { NumericFormat } from "react-number-format";
import { ArrowDownIcon } from "lucide-react";

const CurrencyConversion = forwardRef<HM.ModalRefObject>((_props, ref) => {
  const [open, setOpen] = useState(false);
  const [formAmount, setFormAmount] = useState("");
  const [formCurrency, setFormCurrency] = useState("GBP");
  const [toCurrency, setToCurrency] = useState("NGN");

  useImperativeHandle(ref, () => ({
    openModal: () => setOpen(true),
  }));

  return (
    <Modal
      onCancel={() => setOpen(false)}
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
                    prefix="£"
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
                    value={formCurrency}
                    onChange={value => setFormCurrency(value)}
                    options={countries.map(c => ({
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
                  ₦227,073
                </span>
                <div className="w-28">
                  <Select
                    className="!bg-[#0B3E81] antd-select-custom text-white rounded-lg"
                    style={{ backgroundColor: "#0B3E81", color: "white" }}
                    value={toCurrency}
                    onChange={value => setToCurrency(value)}
                    options={countries.map(c => ({
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
          <div
            className="cursor-pointer flex items-center justify-center h-12 w-12 rounded-full z-10 border-[5px] border-solid border-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-secondary-400 transform hover:bg-secondary-500"
            role="button">
            <ArrowDownIcon className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="h-14 rounded-[60px] bg-primary-100 flex items-center justify-between gap-4 px-4">
          <span className="text-grey-600">Conversion fees: 0.00</span>
          <Button size="large" type="primary" shape="round" className="w-48">Convert</Button>
        </div>
      </section>
    </Modal>
  );
});

export default CurrencyConversion;
