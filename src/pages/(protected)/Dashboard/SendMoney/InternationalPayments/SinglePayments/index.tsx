import { ArrowDownIcon } from "lucide-react";
import { NumericFormat } from "react-number-format";
import countries from "@/data/codes.json";
import { Button, Input, Segmented, Select } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

const InternationalSinglePayments = () => {
  const [segment, setSegment] = useState(0);
  const [formAmount, setFormAmount] = useState("");
  const [formCurrency, setFormCurrency] = useState("GBP");
  const [toCurrency, setToCurrency] = useState("NGN");
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dashboard/send-money/international-payments/single/select-beneficiary");
  };

  return (
    <div
      className="flex items-center justify-center py-16
  ">
      <div className="bg-white w-full shadow rounded-2xl py-5 px-4 max-w-[520px] space-y-8">
        <h3 className="text-xl text-grey-700 font-semibold">Send Money</h3>
        <section className="space-y-6">
          <div className="h-64 relative p-3 bg-primary-50 rounded-xl flex flex-col gap-2">
            <div className="h-32 bg-secondary-400 rounded-lg py-3 px-4 flex items-center justify-center">
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between text-sm text-white">
                  <span>You send</span>
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
                      £1 = ₦2,270.73
                    </td>
                  </tr>
                  <tr className="[&:not(:last-child)]:mb-3">
                    <th className="font-normal text-grey-500 text-base text-left w-1/2">
                      Payable Amount
                    </th>
                    <td className="font-nunito text-grey-700 font-medium text-right w-1/2">
                      £1,000
                    </td>
                  </tr>
                  <tr className="[&:not(:last-child)]:mb-3">
                    <th className="font-normal text-grey-500 text-base text-left w-2/3">
                      Got a valid promo code?{" "}
                      <Link to="#" className="text-primary underline">
                        Enter here
                      </Link>
                    </th>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>
        </section>
        <div className="flex items-center justify-center">
          {" "}
          <Button
            type="primary"
            className="w-48 mx-auto"
            size="large"
            shape="round"
            disabled={!formAmount}
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
