import { Button, Space, Tag } from "antd";
import { FC } from "react";
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

interface ChartData {
  date: string;
  amount: number;
  change?: number;
}

const data: ChartData[] = [
  { date: "21 Jan", amount: 0, change: 1.3 },
  { date: "27 Jan", amount: 1000, change: 0.5 },
  { date: "3 Feb", amount: 1399, change: 2.1 },
  { date: "9 Feb", amount: 1200, change: 1.0 },
  { date: "15 Feb", amount: 2000, change: 3.5 },
];

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
          <span className="text-xl text-grey-600 font-semibold">£{amount}</span>
          {change && (
            <Tag className="rounded-lg bg-positive-50 text-positive-600">
              {change.toFixed(1)}%
            </Tag>
          )}
        </Space>
      </div>
    );
  }
  return null;
};

const AssetLineChart: FC = () => {
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md space-y-4">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h6 className="text-grey-400 text-sm font-medium">
            GBP TOTAL ASSETS
          </h6>
          <h5 className="text-2xl text-grey-700 font-bold">£340,550</h5>
        </div>
        <Space>
          <Button shape="round" className="text-grey-500 !text-sm font-medium">
            Last 7 Days
          </Button>
          <Button
            shape="round"
            type="primary"
            className="text-primary bg-primary-50 !text-sm font-medium">
            Last 30 Days
          </Button>
        </Space>
      </header>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1D4ED8" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#1D4ED8" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey="date" tick={{ fill: "#94A3B8" }} />
          <YAxis tick={{ fill: "#94A3B8" }} />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="amount"
            stroke="none"
            fill="url(#areaGradient)"
          />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="#1D4ED8"
            strokeWidth={2}
            dot={{ stroke: "#1D4ED8", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetLineChart;
