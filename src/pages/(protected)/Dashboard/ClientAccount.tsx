import { memo, useEffect, useMemo, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Button, Tag } from "antd";
import CurrencyConversion from "./CurrencyConversion";
import MoreActions from "./MoreActions";
import {
  ArrowUpRightIcon,
  EllipsisVerticalIcon,
  InfoIcon,
  PlusIcon,
  RotateCwSquareIcon,
  SendIcon,
} from "lucide-react";
import { Link } from "react-router";
import ENDPOINTS from "@/constants/endpoints";
import { CURRENCIES } from "@/constants/currencies";
import useTransactionAnalytics from "@/hooks/use-transaction-analytics";
import Colors from "@/constants/colors";
import AccountDetails from "./ViewAccountDetails";

const DoughnutChart = ({ currency }: { currency: HM.TransactionCurr }) => {
  const { data, isPending, fetchData } = useTransactionAnalytics();
  const currencySymbol = useMemo(
    () => CURRENCIES.find(c => c.currencyCode === currency)?.currencySymbol,
    [currency]
  );

  const transactonData = useMemo(() => {
    if (!data || isPending) {
      return [
        { name: "Total money in", value: 0, color: Colors.positive },
        { name: "Total money out", value: 0, color: Colors.pending },
      ];
    }

    const moneyIn = data
      .filter(transaction => transaction.type.toUpperCase() === "CREDIT")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const moneyOut = data
      .filter(transaction => transaction.type.toUpperCase() === "DEBIT")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return [
      { name: "Total money in", value: moneyIn, color: Colors.positive },
      { name: "Total money out", value: moneyOut, color: Colors.pending },
    ];
  }, [data, isPending]);

  const hasNoTrans = useMemo(
    () => transactonData.every(val => val.value === 0),
    [transactonData]
  );

  useEffect(() => {
    fetchData(currency);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-grey-600 font-medium">Your Money Analytics</h3>
        <Button
          type="primary"
          className="bg-grey-50 text-grey-500"
          shape="round">
          Last 30 days
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative" style={{ width: 200, height: 200 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={!hasNoTrans ? transactonData : [{ value: 1 }]}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                paddingAngle={0}
                animationDuration={1000}
                animationBegin={0}
                cornerRadius={0}
                animationEasing="ease-out">
                {!hasNoTrans ? (
                  transactonData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="none"
                    />
                  ))
                ) : (
                  <Cell fill="#E5F1FF" stroke="none" />
                )}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[120px] h-[120px] rounded-full bg-white"></div>
          </div>
        </div>

        <div className="space-y-3">
          {transactonData?.map((entry, index) => (
            <div key={index} className="flex items-start gap-2">
              <div
                className="w-3 h-3 rounded-sm mt-1"
                style={{ backgroundColor: entry.color }}
              />
              <div className="space-y-0.5">
                <p className="text-sm text-grey-500">{entry.name}</p>
                <p className="font-medium">
                  {currencySymbol}
                  {entry.value.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ClientAccounts = ({ account }: { account: HM.AccountsBalances }) => {
  const fullInfo = useMemo(
    () => CURRENCIES.find(c => c.currencyCode === account.currency),
    [account.currency]
  );

  const conversionRef = useRef<HM.ModalRefObject>(null);
  const optionsRef = useRef<HM.ModalRefObject>(null);

  const detailsRef = useRef<HM.ModalRefObject>(null);

  return (
    <section className="grid grid-cols-[1.9fr_1.1fr] gap-4">
      <div className="p-6 shadow rounded-md flex flex-col gap-6 justify-between bg-white">
        <header className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-11 w-11 rounded-full overflow-hidden grid place-items-center">
              <img
                src={ENDPOINTS.FLAG_URL(
                  fullInfo?.countryCode?.toLowerCase() ?? ""
                )}
                alt="gb"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="font-medium text-grey-500">
              Total {account.currency} Balance
            </p>
            <p className="text-3xl text-grey-600 font-semibold font-nunito">
              {fullInfo?.currencySymbol}
              {account?.balance?.amount ?? "0.00"}
            </p>
          </div>
          <Tag
            className="bg-positive-50 !text-positive flex items-center gap-0.5 text-sm p-1 px-1.5 rounded-md"
            icon={<InfoIcon className="w-4 h-4 text-positive" />}>
            Active
          </Tag>
        </header>
        <div className="flex items-end justify-between">
          <Button
            type="primary"
            shape="round"
            className="bg-grey-50 text-grey"
            icon={<ArrowUpRightIcon className="w-4 h-4 text-grey" />}
            disabled={!fullInfo}
            onClick={() => detailsRef.current?.openModal()}
            iconPosition="end">
            View Account Details
          </Button>
          <div className="flex items-center gap-4">
            <Link
              to={`/dashboard/send-money?currency=${account.currency}`}
              state={{ currency: account.currency }}
              className="flex flex-col items-center justify-center gap-1 text-primary group">
              <div
                className="bg-primary-50 h-12 w-12 group-hover:bg-primary-100 transition-all duration-200 ease-linear rounded-full p-0 flex items-center justify-center cursor-pointer"
                role="button">
                <SendIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-base ">Send</span>
            </Link>
            <Link
              to="#"
              className="flex flex-col items-center justify-center gap-1 text-primary group">
              <div
                className="bg-primary-50 h-12 w-12 group-hover:bg-primary-100 transition-all duration-200 ease-linear rounded-full p-0 flex items-center justify-center cursor-pointer"
                role="button">
                <PlusIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-base ">Fund</span>
            </Link>
            <div
              role="button"
              onClick={() => conversionRef.current?.openModal()}
              className="flex flex-col items-center justify-center gap-1 text-primary group">
              <div
                className="bg-primary-50 h-12 w-12 group-hover:bg-primary-100 transition-all duration-200 ease-linear rounded-full p-0 flex items-center justify-center cursor-pointer"
                role="button">
                <RotateCwSquareIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-base ">Convert</span>
            </div>
            <div
              role="button"
              onClick={() => optionsRef.current?.openModal()}
              className="flex flex-col items-center justify-center gap-1 text-primary group">
              <div
                className="bg-primary-50 h-12 w-12 group-hover:bg-primary-100 transition-all duration-200 ease-linear rounded-full p-0 flex items-center justify-center cursor-pointer"
                role="button">
                <EllipsisVerticalIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-base ">More</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 shadow rounded-md bg-white">
        <DoughnutChart currency={account.currency as HM.TransactionCurr} />
      </div>
      <CurrencyConversion
        ref={conversionRef}
        currency={account.currency}
        balance={account?.balance?.amount}
        symbol={fullInfo?.currencySymbol}
      />
      <MoreActions ref={optionsRef} />
      <AccountDetails ref={detailsRef} currency={account.currency} />
    </section>
  );
};

export default memo(ClientAccounts);
