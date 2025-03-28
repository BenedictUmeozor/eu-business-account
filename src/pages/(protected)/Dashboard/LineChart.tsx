import { CURRENCIES } from "@/constants/currencies";
import { useAppSelector } from "@/hooks";
import useTransactionAnalytics from "@/hooks/use-transaction-analytics";
import { Button, Empty, Select, Space, Spin, Tag } from "antd";
import clsx from "clsx";
import dayjs from "dayjs";
import { FC, useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";

const CustomTooltip: FC<{ active?: boolean; payload?: any[] }> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const { date, amount, change } = payload[0].payload;
    return (
      <div className="bg-white p-2 shadow-md rounded-lg border space-y-1">
        <p className="font-nunito text-sm text-grey-500">{date}</p>
        <Space>
          <span className="text-xl text-grey-600 font-semibold">
            {Math.abs(amount).toFixed(2)}
          </span>
          {change !== undefined && (
            <Tag
              className={clsx("rounded-lg", {
                "bg-positive-50 text-positive-600": change >= 0,
                "bg-negative-50 text-negative-600": change < 0,
              })}>
              {change >= 0 ? "+" : ""}
              {change.toFixed(1)}%
            </Tag>
          )}
        </Space>
      </div>
    );
  }
  return null;
};

const AssetLineChart = () => {
  const currencies = useAppSelector(state => state.accounts.currencies);
  const [selected, setSelected] = useState<string>();
  const { data, fetchData, timeRange, setTimeRange, isPending } =
    useTransactionAnalytics();

  const accounts = useAppSelector(state => state.accounts.accounts);

  const fullInfo = useMemo(
    () => CURRENCIES.find(c => c.currencyCode === selected),
    [selected]
  );

  const account = useMemo(() => {
    return accounts?.find(b => b.currency === selected);
  }, [accounts, selected]);

  const chartData = useMemo(() => {
    if (!data?.length) return [];

    const allTransactions = [...data].sort(
      (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()
    );

    const earliestTransaction = allTransactions[0];
    const startBalanceAfter = earliestTransaction.balance_after || 0;

    const dateGroups: Record<string, any[]> = {};

    if (timeRange === "7d") {
      for (let i = 0; i < 7; i++) {
        const date = dayjs()
          .subtract(6 - i, "day")
          .format("DD MMM");
        dateGroups[date] = [];
      }
    } else {
      for (let i = 0; i < 8; i++) {
        const startDay = dayjs().subtract(30, "day");
        const groupLabel = startDay.add(i * 4, "day").format("DD MMM");
        dateGroups[groupLabel] = [];
      }
    }

    data.forEach(transaction => {
      const transactionDate = dayjs(transaction.date);

      if (timeRange === "7d") {
        const dateKey = transactionDate.format("DD MMM");
        if (dateGroups[dateKey]) {
          dateGroups[dateKey].push(transaction);
        } else {
          const nearestDate = Object.keys(dateGroups).reduce(
            (nearest, current) => {
              const currentDiff = Math.abs(
                dayjs(current, "DD MMM").diff(transactionDate, "day")
              );
              const nearestDiff = Math.abs(
                dayjs(nearest, "DD MMM").diff(transactionDate, "day")
              );
              return currentDiff < nearestDiff ? current : nearest;
            },
            Object.keys(dateGroups)[0]
          );

          dateGroups[nearestDate].push(transaction);
        }
      } else {
        const startDay = dayjs().subtract(30, "day");
        const daysDiff = transactionDate.diff(startDay, "day");

        if (daysDiff >= 0 && daysDiff <= 30) {
          const groupIndex = Math.min(Math.floor(daysDiff / 4), 7);
          const groupLabel = startDay
            .add(groupIndex * 4, "day")
            .format("DD MMM");

          if (dateGroups[groupLabel]) {
            dateGroups[groupLabel].push(transaction);
          }
        }
      }
    });

    const result = Object.entries(dateGroups).map(([date, transactions]) => {
      let currentBalance = 0;

      if (transactions.length > 0) {
        const sortedTransactions = [...transactions].sort(
          (a, b) => dayjs(b.date).unix() - dayjs(a.date).unix()
        );
        currentBalance = sortedTransactions[0].balance_after || 0;
      } else {
        const datesWithTransactions = Object.entries(dateGroups)
          .filter(([, trans]) => trans.length > 0)
          .map(([d]) => d);

        if (datesWithTransactions.length > 0) {
          const previousDates = datesWithTransactions
            .filter(
              d => dayjs(d, "DD MMM").unix() < dayjs(date, "DD MMM").unix()
            )
            .sort(
              (a, b) => dayjs(b, "DD MMM").unix() - dayjs(a, "DD MMM").unix()
            );

          if (previousDates.length > 0) {
            const latestPrevDate = previousDates[0];
            const prevTransactions = dateGroups[latestPrevDate];
            const sortedPrevTrans = [...prevTransactions].sort(
              (a, b) => dayjs(b.date).unix() - dayjs(a.date).unix()
            );
            currentBalance = sortedPrevTrans[0].balance_after || 0;
          } else {
            const laterDates = datesWithTransactions
              .filter(
                d => dayjs(d, "DD MMM").unix() > dayjs(date, "DD MMM").unix()
              )
              .sort(
                (a, b) => dayjs(a, "DD MMM").unix() - dayjs(b, "DD MMM").unix()
              );

            if (laterDates.length > 0) {
              const earliestLaterDate = laterDates[0];
              const laterTransactions = dateGroups[earliestLaterDate];
              const sortedLaterTrans = [...laterTransactions].sort(
                (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()
              );
              currentBalance = sortedLaterTrans[0].balance_before || 0;
            }
          }
        }
      }

      const change =
        startBalanceAfter !== 0
          ? ((currentBalance - startBalanceAfter) /
              Math.abs(startBalanceAfter)) *
            100
          : 0;

      return {
        date,
        amount: currentBalance,
        change,
      };
    });

    const today = dayjs().format("DD MMM");
    const currentDateItem = result.find(item => item.date === today);

    if (currentDateItem && account?.balance?.amount) {
      currentDateItem.amount = account.balance.amount;
      currentDateItem.change =
        startBalanceAfter !== 0
          ? ((account.balance.amount - startBalanceAfter) /
              Math.abs(startBalanceAfter)) *
            100
          : 0;
    }

    return result.sort(
      (a, b) => dayjs(a.date, "DD MMM").unix() - dayjs(b.date, "DD MMM").unix()
    );
  }, [data, timeRange, account?.balance?.amount]);

  useEffect(() => {
    if (!selected && currencies?.length) {
      setSelected(currencies[0]);
    }
  }, [currencies, selected]);

  useEffect(() => {
    if (selected) {
      fetchData(selected as HM.TransactionCurr, timeRange);
    }
  }, [selected, timeRange, fetchData]);

  const renderChart = () => {
    if (!data?.length) {
      return (
        <div className="h-[300px] flex items-center justify-center">
          <Empty
            description="No transaction data available"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </div>
      );
    }

    const amounts = chartData.map(item => item.amount);
    const minAmount = Math.min(...amounts);
    const maxAmount = Math.max(...amounts);

    const yDomain = [minAmount < 0 ? minAmount * 1.1 : 0, maxAmount * 1.1];

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="date"
            tick={{ fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />

          <YAxis
            tick={{ fill: "#94A3B8" }}
            tickFormatter={value =>
              `${fullInfo?.currencySymbol}${Math.abs(value).toFixed(0)}`
            }
            axisLine={false}
            tickLine={false}
            domain={yDomain}
            orientation="left"
            reversed={false}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: "#94A3B8", strokeDasharray: "3 3" }}
          />

          <Area
            type="monotone"
            dataKey="amount"
            stroke="none"
            fill="url(#areaGradient)"
            fillOpacity={1}
          />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="#1D4ED8"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 6,
              stroke: "#1D4ED8",
              strokeWidth: 2,
              fill: "white",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md space-y-4">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h6 className="text-grey-400 text-sm font-medium">
            {selected} TOTAL ASSETS
          </h6>
          <div className="flex items-center gap-2">
            <h5 className="text-2xl text-grey-700 font-bold">
              {fullInfo?.currencySymbol}
              {account?.balance?.amount || "0.00"}
            </h5>
            <Select
              value={selected}
              size="small"
              onChange={setSelected}
              options={currencies?.map(v => ({ label: v, value: v }))}
            />
          </div>
        </div>

        <Space>
          <Button
            shape="round"
            type={timeRange === "7d" ? "primary" : "default"}
            onClick={() => setTimeRange("7d")}
            className={
              timeRange === "7d"
                ? "text-primary bg-primary-50"
                : "text-grey-500"
            }>
            Last 7 days
          </Button>
          <Button
            shape="round"
            type={timeRange === "30d" ? "primary" : "default"}
            onClick={() => setTimeRange("30d")}
            className={
              timeRange === "30d"
                ? "text-primary bg-primary-50"
                : "text-grey-500"
            }>
            Last 30 Days
          </Button>
        </Space>
      </header>

      <div className="relative">
        {isPending && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <Spin />
          </div>
        )}
        {renderChart()}
      </div>
    </div>
  );
};

export default AssetLineChart;
